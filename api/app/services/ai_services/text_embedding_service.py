import os
from datetime import datetime

from bson import ObjectId
from langchain_community.document_loaders import TextLoader, PyPDFLoader, UnstructuredWordDocumentLoader
from langchain_community.embeddings import SentenceTransformerEmbeddings
from langchain_community.vectorstores import OpenSearchVectorSearch
from langchain_core.documents import Document
from langchain_text_splitters import CharacterTextSplitter
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.core.config import config
from app.database import get_db
from app.models.mongodb.file_info_model import EmbeddedStatus


class TextEmbeddingService:
    """
    Service class for performing semantic search with LangChain on documents.
    """

    def __init__(self, database: AsyncIOMotorDatabase,
                 host=os.environ['OPENSEARCH_HOST'],
                 port=os.environ['OPENSEARCH_PORT'],
                 auth=(os.environ['OPENSEARCH_USERNAME'],
                       os.environ['OPENSEARCH_PASSWORD'])
                 ):
        """
        Initializes the LangChainService with records and a search chain.
        """
        self.embeddings = SentenceTransformerEmbeddings(model_name=config.langchain_model)
        self.host = host
        self.port = port
        self.auth = auth
        self.vector_store = OpenSearchVectorSearch(
            index_name=config.file_index_name,
            embedding_function=self.embeddings,
            opensearch_url=f"https://{host}:{port}",
            use_ssl=True,
            verify_certs=False,
            http_auth=auth,
        )
        self.database = database

    @staticmethod
    def _load_document(file_path, file_type):
        """
        Loads a document based on the file type.
        """
        if file_type == '.txt':
            loader = TextLoader(file_path)
        elif file_type == ".pdf":
            loader = PyPDFLoader(file_path)
        elif file_type in ['.docx', '.doc']:
            loader = UnstructuredWordDocumentLoader(file_path)
        else:
            raise ValueError(f"Unsupported file type: {file_type}")

        return loader.load()

    @staticmethod
    def _split_documents(documents):
        """
        Splits documents into chunks.
        """
        text_splitter = CharacterTextSplitter(
            chunk_size=config.chunk_size,
            chunk_overlap=config.chunk_overlap
        )
        return text_splitter.split_documents(documents)

    async def index_files(self, file_path, file_id):
        """
        Indexes documents for semantic search by converting each record into a document,
        generating embeddings, and storing them in a vector store.
        """
        file = await self._get_file(file_id)
        is_index_exist = self.vector_store.client.indices.exists(index=config.file_index_name)
        if is_index_exist:
            documents = self.get_documents_by_hash(file['sha256_hash'])
            if documents:
                await self.update_embeddings(file_id, self.database)
                return
        docs = self._load_document(file_path, file.get('file_ext'))
        docs = self._split_documents(docs)
        updated_docs = self._update_file_metadata(docs, file)

        if is_index_exist:
            self.vector_store.add_documents(updated_docs)
        else:
            self.vector_store = OpenSearchVectorSearch.from_documents(
                updated_docs,
                self.embeddings,
                opensearch_url=f"https://{self.host}:{self.port}",
                index_name=config.file_index_name,
                use_ssl=True,
                verify_certs=False,
                http_auth=self.auth,
            )
        await self.update_embeddings(file_id, self.database)

    def get_documents_by_hash(self, hash_value):
        """
        Retrieves all documents matching a specific hash.
        """

        body = {'query': {'match': {'metadata.hash': hash_value}}}
        response = self.vector_store.client.search(body=body)

        if 'hits' in response and 'hits' in response['hits']:
            hits = response['hits']['hits']
            return [hit['_source'] for hit in hits] if hits else []

    async def search_files(self, files, query_text):
        """
        Searches files based on query text.
        """
        try:
            if '*' not in files:
                file_hashes = [await self._get_file_hash(file) for file in files]
                boolean_filter = {'terms': {'metadata.hash': file_hashes}}
            else:
                boolean_filter = None
            if not self.vector_store.client.indices.exists(index=config.file_index_name):
                return []

            search_results = self.vector_store.similarity_search(
                query_text, boolean_filter=boolean_filter, k=config.k
            )
            return [page.page_content for page in search_results]
        except Exception as e:
            raise ValueError(f"Error in searching: {str(e)}")

    async def search_by_category(self, category, query_text):
        """
        Searches documents based on category.
        """
        try:
            if category == '*':
                boolean_filter = None
            else:
                boolean_filter = {'term': {'metadata.categories': category}}
            search_results = self.vector_store.similarity_search(
                query_text, boolean_filter=boolean_filter, k=config.k
            )
            matched_list = [page.page_content for page in search_results]
            print(matched_list)
            return matched_list
        except Exception as e:
            raise ValueError(f"Error in searching: {str(e)}")

    async def search_content_item(self, query_text):
        """
        Searches content items based on query text.
        """
        try:
            boolean_filter = {
                "should": [
                    {"match": {"metadata.type": "playbooks"}},
                    {"match": {"metadata.type": "news"}}
                ]
            }
            search_results = self.vector_store.similarity_search(
                query_text, boolean_filter=boolean_filter, k=config.k
            )
            return [page.page_content for page in search_results]
        except Exception as e:
            raise ValueError(f"Error in searching: {str(e)}")

    async def index_content_item(self, content_item_id):
        """
        Indexes a content item for semantic search.
        """
        documents = self.get_content_item_documents(content_item_id)
        if documents:
            return
        content_item = await self._get_content_item(content_item_id)
        doc = {'page_content': content_item['content'], 'metadata': {}}
        updated_doc = self._update_content_item_metadata(content_item, doc)
        self.vector_store.add_documents([updated_doc])

    async def delete_content_item(self, content_item_id):
        """
        Deletes a content item from the vector store.
        """
        documents = self.get_content_item_documents(content_item_id)
        if documents:
            self.vector_store.delete(ids=[doc['_id'] for doc in documents])

    @staticmethod
    async def load_database():
        db_gen = get_db()
        db = await db_gen.__anext__()
        return db

    async def _get_file(self, file_id):
        """
        Retrieves a file document from the database.
        """
        try:
            return await self.database.files.find_one({'_id': ObjectId(file_id)})
        except Exception as e:
            raise ValueError(f"Error retrieving file: {str(e)}")

    async def _get_file_hash(self, file_id):
        """
        Retrieves a file hash for a given file ID.
        """
        file = await self._get_file(file_id)
        return file['sha256_hash']

    async def _get_content_item(self, content_item_id):
        """
        Retrieves a content item document from the database.
        """
        try:
            return await self.database.content_items.find_one({'_id': ObjectId(content_item_id)})
        except Exception as e:
            raise ValueError(f"Error retrieving content item: {str(e)}")

    def get_content_item_documents(self, content_item_id):
        """
        Retrieves documents for a given content item ID.
        """
        if not self.vector_store.client.indices.exists(index=config.file_index_name):
            return None

        body = {'query': {'match': {'metadata.content_item_id': content_item_id}}}
        response = self.vector_store.client.search(body=body)

        if 'hits' in response and 'hits' in response['hits']:
            hits = response['hits']['hits']
            return hits if hits else []

    @staticmethod
    def _update_file_metadata(docs, file):
        """
        Updates metadata for a list of documents.
        """
        updated_docs = []
        for index, doc in enumerate(docs):
            doc.metadata.update({
                'file_name': file['filename'],
                'hash': file['sha256_hash'],
                'file_id': str(file['_id']),
                'user_id': file['uploaded_by_user_id'],
                'type': 'files',
                'categories': file['categories'],
                'time': datetime.utcnow().isoformat(),
                'chunk_number': index + 1
            })
            updated_docs.append(doc)
        return updated_docs

    @staticmethod
    def _update_content_item_metadata(content_item, document):
        """
        Updates metadata for a content item document.
        """
        document['metadata'].update({
            'content_item_id': str(content_item['_id']),
            'time': datetime.utcnow().isoformat(),
            'type': content_item['content_type'],
            'categories': [content_item['category']],
            'name': content_item['name']
        })
        return Document(**document)

    @staticmethod
    async def update_embeddings(file_id, db):
        embedding_status = EmbeddedStatus()
        embedding_status.status = True
        await db.files.update_one(
            {'_id': ObjectId(file_id)},
                {'$set': {'embedded_status': [embedding_status.model_dump()]}})
