from bson import ObjectId
from pymongo import DESCENDING

from app.models.mongodb.chat_model import Chat
from app.models.pydantics.chat_schema import RequestChat, ResponseChat


class ChatService:
    def __init__(self, database):
        self.database = database
        self.collection = database.chats

    async def get_chats(self, expert_id: str, user_id: str, page: int, limit: int):
        skip = (page - 1) * limit
        chats = self.collection.find(
            {'expert_ids': {'$in': [expert_id]}, 'created_by': user_id}
        ).sort('updated_at', DESCENDING).skip(skip).limit(limit)
        chats_list = []
        async for chat in chats:
            chat['id'] = str(chat.pop('_id'))
            chats_list.append(ResponseChat(**chat))
        return chats_list

    async def get_chat(self, chat_id: str):
        chat = await self.collection.find_one({'_id': ObjectId(chat_id)})
        chat['id'] = str(chat.pop('_id'))
        return ResponseChat(**chat)

    async def create_chat(self, chat_dict: dict):
        chat = Chat(**chat_dict)
        inserted = await self.collection.insert_one(chat.model_dump())
        return await self.get_chat(inserted.inserted_id)

    async def update_chat(self, chat_id: str, user_id: str, chat: RequestChat):
        if not await self.collection.find_one({'_id': ObjectId(chat_id), 'created_by': user_id}):
            raise ValueError('Chat not found.')
        await self.collection.update_one(
            {'_id': ObjectId(chat_id)},
            {'$set': {'chat_name': chat.chat_name}}
        )
        return await self.get_chat(chat_id)

    async def add_expert_to_chat(self, chat_id: str, expert_id: str, user_id: str):
        chat = await self.collection.find_one({'_id': ObjectId(chat_id), 'created_by': user_id})
        if not chat:
            raise ValueError('Chat not found.')
        if expert_id in chat['expert_ids']:
            raise ValueError('Expert already in chat.')
        chat['expert_ids'].append(expert_id)
        await self.collection.update_one(
            {'_id': ObjectId(chat_id)},
            {'$set': {'expert_ids': chat['expert_ids']}}
        )
        return await self.get_chat(chat_id)

    async def remove_expert_from_chat(self, chat_id: str, expert_id: str, user_id: str):
        chat = await self.collection.find_one({'_id': ObjectId(chat_id), 'created_by': user_id})
        if not chat:
            raise ValueError('Chat not found.')
        if expert_id not in chat['expert_ids']:
            raise ValueError('Expert not in chat.')
        chat['expert_ids'].remove(expert_id)
        await self.collection.update_one(
            {'_id': ObjectId(chat_id)},
            {'$set': {'expert_ids': chat['expert_ids']}}
        )
        return await self.get_chat(chat_id)

    def delete_chat(self, chat_id: str, user_id: str):
        if not self.collection.find_one({'_id': ObjectId(chat_id), 'created_by': user_id}):
            raise ValueError('Chat not found.')
        self.collection.delete_one({'_id': ObjectId(chat_id)})
