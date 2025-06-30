from typing import List

from bson import ObjectId
from fastapi import HTTPException
from pymongo import DESCENDING

from app.models.mongodb.message_model import Message
from app.models.pydantics.message_schema import ResponseMessage
from app.utils import get_base_user


class MessageService:
    def __init__(self, database):
        self.collection = database.messages
        self.user_collection = database.users

    async def get_messages(self, chat_id, user_id, page, limit) -> List[ResponseMessage]:
        skip = (page - 1) * limit
        try:
            messages = self.collection.find(
                {'chat_id': chat_id, 'created_by': user_id}
            ).sort('created_at', DESCENDING).skip(skip).limit(limit)

            messages_list = []
            async for message in messages:
                message['id'] = str(message.pop('_id'))
                message['created_by'] = await get_base_user(message['created_by'], self.user_collection)
                messages_list.append(ResponseMessage(**message))
            return messages_list
        except Exception as e:
            raise e

    async def get_message(self, message_id) -> ResponseMessage:
        if not ObjectId.is_valid(message_id):
            raise HTTPException(status_code=400, detail='Invalid ID.')
        elif not await self.collection.find_one({'_id': ObjectId(message_id)}):
            raise HTTPException(status_code=404, detail='Message not found.')
        message = await self.collection.find_one({'_id': ObjectId(message_id)})
        message['id'] = str(message.pop('_id'))
        message['created_by'] = await get_base_user(message['created_by'], self.user_collection)
        return ResponseMessage(**message)

    async def create_message(self, message: Message):
        insert_message = self.collection.insert_one(message.model_dump())
        message = await self.get_message(insert_message.inserted_id)
        return message

    async def update_message(self, message_id, message_data):
        await self.collection.update_one({'_id': ObjectId(message_id)}, {'$set': message_data})
        return await self.get_message(message_id)

    async def delete_message(self, message_id, user_id):
        message = await self.get_message(message_id)
        if message.created_by.id != user_id:
            raise HTTPException(status_code=403, detail='Forbidden')
        await self.collection.delete_one({'_id': ObjectId(message_id)})
