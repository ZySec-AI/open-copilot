import secrets

from bson import ObjectId


class APIKeyService:
    def __init__(self, database):
        self.database = database

    async def create_api_key(self, user_id: str):
        collection = self.database.users
        api_key = secrets.token_hex(16)
        await collection.update_one(
            {'_id': ObjectId(user_id)},
            {'$push': {'api_keys': api_key}}
        )
        return api_key

    async def delete_api_key(self, user_id: str, api_key: str):
        collection = self.database.users
        await collection.update_one(
            {'_id': ObjectId(user_id)},
            {'$pull': {'api_keys': api_key}}
        )

    async def get_api_keys(self, user_id: str):
        collection = self.database.users
        user = await collection.find_one({'_id': ObjectId(user_id)})
        return user.get('api_keys', [])
