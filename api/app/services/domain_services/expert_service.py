import os
import shutil
from typing import List, Optional

from bson import ObjectId
from fastapi import HTTPException, UploadFile
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.core.config import config
from app.models.mongodb.chat_model import Chat
from app.models.mongodb.expert_model import Expert
from app.models.mongodb.message_model import Message
from app.models.pydantics import Detail
from app.models.pydantics.expert_schema import AppModel, Message as PromptMessage, ResponseExpert
from app.models.pydantics.message_schema import ResponseMessage
from app.services.ai_services.text_embedding_service import TextEmbeddingService
from app.services.ai_services.llm_service import LLMService
from app.services.domain_services.file_open_search_service import FileOpenSearchService
from app.utils import get_base_user


class ExpertService:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.database = db
        self.collection = db.experts
        self.chat_collection = db.chats
        self.messages_collection = db.messages
        self.files_collection = db.files
        self.llm_service = LLMService(config.default_model)
        self.file_open_search_service = FileOpenSearchService()

    async def to_list_response(self, experts: List[dict]) -> List[ResponseExpert]:
        response_experts = []
        for expert in experts:
            created_by = expert.get('created_by')
            if created_by:
                expert['created_by'] = await get_base_user(created_by, self.database.users)
            response_experts.append(ResponseExpert(**expert))
        return response_experts

    async def to_response(self, expert: dict) -> ResponseExpert:
        created_by = expert.get('created_by')
        if created_by:
            expert['created_by'] = await get_base_user(created_by, self.database.users)
        return ResponseExpert(**expert)

    async def get_experts(self) -> List[ResponseExpert]:
        cursor = self.collection.find()
        experts = [await self._replace_id(app) async for app in cursor]
        return await self.to_list_response(experts)

    async def get_suggested_experts(self, matched: str) -> List[ResponseExpert]:
        cursor = self.collection.find({
            'expert_name': {
                '$regex': f'^{matched}',
                '$options': 'i'
            }
        })
        experts = [await self._replace_id(app) async for app in cursor]
        return await self.to_list_response(experts)

    async def get_experts_from_ids(self, expert_ids: List[str]) -> List[dict]:
        experts = []
        for expert_id in expert_ids:
            expert = await self.collection.find_one({'_id': ObjectId(expert_id)})
            experts.append(await self._replace_id(expert))
        return experts

    @staticmethod
    def save_uploaded_file(upload_file: UploadFile, filename: str, destination: str = 'app/assets/images') -> str:
        """
        Save an uploaded file to the specified destination. If the destination directory
        does not exist, it will be created.

        :param upload_file: The uploaded file from FastAPI
        :param filename: The name of the file
        :param destination: The destination directory where the file will be saved
        :return: The path to the saved file
        """
        # Create the directory if it does not exist
        os.makedirs(destination, exist_ok=True)

        # Determine the file path
        file_path = os.path.join(destination, filename)

        # Save the file
        with open(file_path, "wb+") as file:
            shutil.copyfileobj(upload_file.file, file)

        return file_path.replace("\\", "/")

    async def create_expert(self, expert_dict: dict, avatar: UploadFile, user_id: str) -> ResponseExpert:
        expert_dict.update({'created_by': user_id})
        is_expert_exists = await self.collection.find_one({'expert_name': expert_dict['expert_name']})
        if is_expert_exists:
            raise HTTPException(status_code=400, detail='Expert already exists.')

        expert = Expert(**expert_dict)
        inserted = await self.collection.insert_one(expert.model_dump())
        if avatar:
            expert_dict['avatar'] = self.save_uploaded_file(avatar, str(inserted.inserted_id))
            await self.collection.update_one({'_id': inserted.inserted_id}, {'$set': expert_dict})
        expert_dict = await self.collection.find_one({'_id': inserted.inserted_id})
        return await self.to_response(await self._replace_id(expert_dict))

    async def get_expert(self, expert_id: str) -> ResponseExpert:
        expert = await self.collection.find_one({'_id': ObjectId(expert_id)})
        if not expert:
            raise HTTPException(status_code=404, detail='Expert not found.')
        return await self.to_response(await self._replace_id(expert))

    async def update_expert(self, expert_id: str, expert_dict: dict, avatar: UploadFile,
                            user_id: str) -> ResponseExpert:
        old_expert = await self.get_expert(expert_id)
        if old_expert.created_by.id != user_id:
            raise HTTPException(status_code=403, detail='Forbidden')
        if avatar:
            expert_dict['avatar'] = self.save_uploaded_file(avatar, expert_id)
        await self.collection.update_one({'_id': ObjectId(expert_id)}, {'$set': expert_dict})
        return await self.get_expert(expert_id)

    async def delete_expert(self, expert_id: str) -> None:
        expert = await self.get_expert(expert_id)
        if not expert:
            raise HTTPException(status_code=404, detail='Expert not found.')
        await self.collection.delete_one({'_id': ObjectId(expert_id)})

    async def set_expert_status(self, expert_id: str, is_active: bool) -> Detail:
        await self.get_expert(expert_id)
        await self.collection.update_one({'_id': ObjectId(expert_id)}, {'$set': {'is_active': is_active}})
        if is_active:
            return Detail(detail='Expert activated.')
        return Detail(detail='Expert inactivated.')

    async def generate_response_from_external_source(self, app_model: AppModel, user_id: str) -> ResponseMessage:
        if app_model.expert_id:
            chat = await self.get_static_chat(app_model.expert_id, user_id)
            app_model.chat_id = chat['id']
            return await self.generate_response(app_model, user_id)
        expert = await self.get_static_expert()
        if expert:
            expert = await self._replace_id(expert)
            expert_id = expert['id']
            chat = await self.get_static_chat(expert_id, user_id)
            app_model.chat_id = chat['id']
            return await self.process_experts([expert], app_model, user_id, chat)
        else:
            raise HTTPException(status_code=400, detail=' Add expert named "Security Expert" to the database.')

    async def generate_response(self, app_model: AppModel, user_id: str) -> ResponseMessage:

        chat = await self.get_chat(app_model.chat_id)
        if chat and app_model.expert_id and app_model.expert_id not in chat['expert_ids']:
            raise HTTPException(status_code=400, detail='expert and chat do not match.')
        expert_ids = chat['expert_ids'] if chat else [app_model.expert_id]
        expert_ids_from_prompt, app_model.messages[0].content = await self.get_experts_from_prompt_and_update_prompt(
            app_model.messages[0].content
        )
        if chat:
            for expert_id in expert_ids_from_prompt:
                if expert_id not in expert_ids:
                    expert_ids.append(expert_id)
            await self.save_expert_ids_to_chat(chat['id'], expert_ids)

            # replace the expert_ids in the prompt.
            if expert_ids_from_prompt:
                expert_ids = expert_ids_from_prompt
        else:
            expert_ids.extend(expert_ids_from_prompt)

        experts = await self.get_experts_from_ids(expert_ids)
        return await self.process_experts(experts, app_model, user_id, chat)

    async def get_chat(self, chat_id: str) -> Optional[dict]:
        if not chat_id:
            return None
        chat = await self.chat_collection.find_one({'_id': ObjectId(chat_id)})
        if not chat:
            raise HTTPException(status_code=404, detail='Chat not found.')
        return await self._replace_id(chat)

    async def process_experts(self, experts: List[dict], app_model: AppModel, user_id: str,
                              chat: Optional[dict]) -> ResponseMessage:
        total_result = []
        for expert in experts:
            result = await self.handle_expert_type(expert, app_model, user_id)
            if result and result is not None:
                result['id'] += f'_{expert["id"]}'
                total_result.append(result)
        
        # If we're in streaming mode, all results will be None, so return None for streaming
        if app_model.stream:
            return None
            
        return await self.create_message(user_id, chat, app_model.messages[0].content,
                                         total_result, experts, app_model) if total_result else None

    async def handle_expert_type(self, expert: dict, app_model: AppModel, user_id: str) -> dict:
        if expert['type'] == 'app':
            return await self.process_app(app_model, user_id, expert)
        elif expert['type'] == 'file':
            return await self.process_file(app_model, user_id, expert)
        elif expert['type'] == 'category':
            return await self.process_category(app_model, user_id, expert)
        else:
            raise HTTPException(status_code=400, detail='Invalid expert type.')

    async def process_app(
            self, app_model: AppModel, user_id: str,
            expert: dict, retrieval_messages: list = None
    ) -> dict:
        message = PromptMessage(content=expert['system_prompt'], role='system')
        copied_msgs = app_model.messages[:]
        copied_msgs.insert(0, message)
        if app_model.chat_id and config.is_history_enabled and expert['type'] == 'app':
            history = await self.latest_messages(app_model.chat_id, user_id, expert["id"])
            history.append(copied_msgs.pop())
            copied_msgs.extend(history)
        prompt = self.get_static_prompt(expert)
        return await self.llm_service.retrieve_openai_response(
            copied_msgs, app_model.stream, user_id, retrieval_messages, prompt
        )

    async def process_file(self, app_model: AppModel, user_id: str, expert: dict) -> dict:
        return await self.file_open_search_service.search_from_files(expert,
                                                                     app_model.messages[-1].content,
                                                                     self.database, user_id, app_model)

    async def process_category(self, app_model: AppModel, user_id: str, expert: dict) -> dict:
        lang_chain_service = TextEmbeddingService(self.database)
        category_id = app_model.category_id if app_model.category_id else self.return_category(expert['categories'])
        retrieval_messages = await lang_chain_service.search_by_category(
            category_id, app_model.messages[-1].content
        )
        return await self.process_app(app_model, user_id, expert, retrieval_messages)

    async def create_message(
            self, user_id: str, chat: Optional[dict],
            user_prompt: str, system_result: list,
            experts: List[dict], app_model: AppModel
    ) -> ResponseMessage:
        if chat:
            if chat['chat_name'] != await self.get_chat_name(experts, system_result, app_model)\
                    and chat['chat_name'] != 'API Service Call':
                await self.chat_collection.update_one(
                    {'_id': ObjectId(chat['id'])},
                    {'$set': {'chat_name': await self.get_chat_name(experts, system_result, app_model)}}
                )
                chat = await self._replace_id(await self.chat_collection.find_one({'_id': ObjectId(chat['id'])}))
        else:
            chat = await self.create_chat(
                experts, user_id, await self.get_chat_name(experts, system_result, app_model)
            )
        chat_id = chat['id']
        message_dict = dict(chat_id=chat_id, user_prompt=user_prompt, response=system_result, created_by=user_id)
        message = Message(**message_dict)
        inserted = await self.messages_collection.insert_one(message.model_dump())
        message = await self._replace_id(await self.messages_collection.find_one({'_id': inserted.inserted_id}))
        message['created_by'] = await get_base_user(message['created_by'], self.database.users)
        message['chat_name'] = chat['chat_name']
        return ResponseMessage(**message)

    @staticmethod
    async def _replace_id(document: dict) -> dict:
        document['id'] = str(document.pop('_id'))
        return document

    async def create_chat(self, experts, user_id, title):
        chat = Chat(**{
            'chat_name': title, 'expert_ids': [expert['id'] for expert in experts], 'created_by': user_id
        })
        inserted = await self.chat_collection.insert_one(chat.model_dump())
        chat = await self._replace_id(await self.chat_collection.find_one({'_id': inserted.inserted_id}))
        return chat

    async def latest_messages(self, chat_id, user_id, expert_id):
        messages = self.messages_collection.find(
            {'chat_id': chat_id, 'created_by': user_id}
        ).sort('created_at', -1).limit(config.history_messages_count)
        prompts = []
        async for message in messages:
            if self.get_system_response(message['response'], expert_id):
                prompts.append(PromptMessage(role='user', content=message['user_prompt']))
                prompts.append(
                    PromptMessage(
                        role='assistant', content=self.get_system_response(message['response'], expert_id)
                    )
                )
        return prompts

    @staticmethod
    def get_system_response(response_list, expert_id, ):
        for response in response_list:
            if expert_id in response['id']:
                return response['choices'][0]['message']['content']
        return None

    async def get_chat_name(self, experts, system_result, app_model):
        initial_expert = experts[0]
        if initial_expert['type'] == 'app' and len(experts) > 1:
            return 'Group Chat: ' + ', '.join([app['expert_name'] for app in experts])
        if initial_expert['type'] == 'app' or initial_expert['type'] == 'category':
            return system_result[0]['choices'][0]['message']['content'].split('.')[0]
        else:
            if initial_expert.get('expert_name') == 'My Files' and app_model.files:
                files = app_model.files
            else:
                files = initial_expert['files']
            return await self.get_file_names_check_for_expert_names(files, experts)

    async def get_file_names_check_for_expert_names(self, files, experts):
        file_names = []
        for file in files:
            if file == '*':
                return 'Chatting with all files.'
            file = await self.files_collection.find_one({'_id': ObjectId(file)})
            file_names.append(file['filename'])
        is_expert_found = False
        for expert in experts:
            if expert['type'] == 'app' or expert['type'] == 'category':
                is_expert_found = True
                file_names.append(expert['expert_name'])

        if is_expert_found:
            return 'Group Chat: ' + ', '.join(file_names)
        else:
            return 'Chatting with files: ' + ', '.join(file_names)

    async def get_experts_from_prompt_and_update_prompt(self, prompt: str) -> tuple:
        experts = []
        updated_prompt_parts = []

        for word in prompt.split():
            if word.startswith('@'):
                expert_if = word[1:]
                if await self.is_valid_expert(expert_if):
                    experts.append(word[1:])
            else:
                updated_prompt_parts.append(word)

        updated_prompt = ' '.join(updated_prompt_parts)
        return experts, updated_prompt

    async def save_expert_ids_to_chat(self, chat_id, expert_ids):
        await self.chat_collection.update_one(
            {'_id': ObjectId(chat_id)},
            {'$set': {'expert_ids': expert_ids}}
        )

    async def is_valid_expert(self, expert_id: str) -> bool:
        try:
            expert = await self.collection.find_one({'_id': ObjectId(expert_id)})
        except Exception as e:
            raise HTTPException(status_code=400, detail=f'Invalid id. {str(e)}')
        return bool(expert)

    @staticmethod
    def return_category(categories):
        if '*' in categories:
            return '*'
        elif len(categories) == 1:
            return categories[0]
        else:
            raise HTTPException(status_code=400, detail='Not allowed, something wrong in expert.')

    @staticmethod
    def get_static_prompt(expert: dict) -> str:
        if expert['expert_name'] == 'Security Expert':
            return expert['system_prompt']
        return ''

    async def get_static_expert(self):
        return await self.collection.find_one({'expert_name': 'Security Expert'})

    async def get_static_chat(self, expert_id: str, user_id):
        chat = await self.chat_collection.find_one(
            {
                'chat_name': 'API Service Call',
                'expert_ids': {'$in': [expert_id]}
            }
        )
        if chat:
            chat = await self._replace_id(chat)
            return chat
        else:
            expert = await self.get_static_expert()
            expert = await self._replace_id(expert)
            return await self.create_chat([expert], user_id, 'API Service Call')
