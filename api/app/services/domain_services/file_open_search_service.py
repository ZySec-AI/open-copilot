import os
from datetime import datetime
from typing import Optional

import nltk
from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorDatabase
from nltk.tokenize import sent_tokenize
from opensearchpy import OpenSearch

from app.core.config import config
from app.database import get_db
from app.models.pydantics.expert_schema import AppModel
from app.services.ai_services.text_embedding_service import TextEmbeddingService
from app.services.ai_services.llm_service import LLMService
from app.utils.open_search_parser import parse_response


class FileOpenSearchService:
    def __init__(
            self, host=os.environ['OPENSEARCH_HOST'],
            port=os.environ['OPENSEARCH_PORT'],
            auth=(
                    os.environ['OPENSEARCH_USERNAME'],
                    os.environ['OPENSEARCH_PASSWORD']
            )
    ):
        self.client = OpenSearch(
            hosts=[{'host': host, 'port': port}],
            http_auth=auth,
            http_compress=True,
            use_ssl=True,
            verify_certs=False,
            ssl_assert_hostname=False,
            ssl_show_warn=False
        )
        self.index_name = config.file_index_name

    def create_index_if_not_exists(self):
        if not self.client.indices.exists(index=self.index_name):
            index_body = {
                "settings": {
                    "index": {
                        "number_of_shards": 1,
                        "number_of_replicas": 1
                    }
                }
            }
            self.client.indices.create(index=self.index_name, body=index_body, ignore=400)

    @staticmethod
    async def get_file_data_from_db(file_id):
        db_gen = get_db()
        database = await db_gen.__anext__()
        collection = database.files
        return await collection.find_one({'_id': file_id})

    @staticmethod
    def download_nltk_resources():
        try:
            nltk.data.find('tokenizers/punkt')
        except LookupError:
            nltk.download('punkt')

    async def process_file_chunks(self, file_id, use_chunk_size=False):
        self.download_nltk_resources()  # Ensure NLTK resources are available
        file_dict = await self.get_file_data_from_db(ObjectId(file_id))
        file_path = file_dict['path']

        # Read the entire file into memory (adjust if file size is a concern)
        with open(file_path, "r") as file:
            content = file.read()

        # Split the content into sentences or paragraphs
        if use_chunk_size:
            chunk_number = 1
            chunk_size = 1024
            while True:
                chunk = file.read(chunk_size)
                if not chunk:
                    break
                self.client.index(index=self.index_name, body={
                    "file_name": file_dict['filename'],
                    "hash": file_dict['sha256_hash'],
                    "chunk": chunk,
                    "file_id": file_id,
                    "chunk_number": chunk_number,
                    "time": datetime.utcnow().isoformat()
                })
                chunk_number += 1
        else:
            chunks = sent_tokenize(content)

            # Index each chunk as a separate document
            for chunk_number, chunk in enumerate(chunks, start=1):
                if chunk.strip():  # Ensure the chunk has content
                    self.client.index(index=self.index_name, body={
                        "file_name": file_dict['filename'],
                        "hash": file_dict['sha256_hash'],
                        "chunk": chunk,
                        "file_id": file_id,
                        "chunk_number": chunk_number,
                        "time": datetime.utcnow().isoformat()
                    })

    def get_file_chunks(self, file_id):
        search_body = {
            "query": {
                "match": {
                    "file_id": file_id
                }
            }
        }
        if not self.client.indices.exists(index=self.index_name):
            return []
        response = self.client.search(index=self.index_name, body=search_body)
        return parse_response(response)

    # async def search_from_file(self, file_id, query, database: AsyncIOMotorDatabase, user_id: str):
    #     file_path = await self.get_file_path(file_id, database)
    #     lang_chain_service = LangChainService(database)
    #     await lang_chain_service.index_documents(file_path, file_id)
    #     list_of_results = await lang_chain_service.search(file_id, query)
    #     llm_service = LiteLLMService('gpt-3.5-turbo')
    #     messages = [
    #         {
    #             'role': 'system',
    #             'content': await self.get_system_prompt(database)
    #         },
    #         {
    #             'role': 'user',
    #             'content': query
    #         }
    #     ]
    #     result = await llm_service.retrieve_openai_response(
    #         messages, False, user_id, list_of_results)
    #     return result

    async def search_from_files(
            self, application, query,
            database: AsyncIOMotorDatabase,
            user_id: str, app_model: AppModel = None
    ):
        if application.get('expert_name') == 'My Files' and app_model.files:
            files = app_model.files
        else:
            files = application['files']
        lang_chain_service = TextEmbeddingService(database)
        if '*' not in files:
            for file in files:
                file_path = await self.get_file_path(file, database)
                await lang_chain_service.index_files(file_path, file)
        list_of_results = await lang_chain_service.search_files(files, query)
        llm_service = LLMService(config.default_model)
        messages = [
            {
                'role': 'system',
                'content': await self.get_system_prompt(database, application.get('id'))
            },
            {
                'role': 'user',
                'content': query
            }
        ]
        result = await llm_service.retrieve_openai_response(
            messages, False, user_id, list_of_results)
        return result

    @staticmethod
    async def get_system_prompt(database: AsyncIOMotorDatabase, expert_id: Optional[str]):
        collections = database.experts
        if not expert_id:
            app = await collections.find_one({'expert_name': 'My Files'})
        else:
            app = await collections.find_one({'_id': ObjectId(expert_id)})
        if not app:
            raise ValueError('Application not found.')
        return app['system_prompt']

    @staticmethod
    async def get_file_path(file_id: str, database: AsyncIOMotorDatabase):
        collection = database.files
        file = await collection.find_one({'_id': ObjectId(file_id)})
        if not file:
            raise ValueError('File not found.')
        return file['path']
