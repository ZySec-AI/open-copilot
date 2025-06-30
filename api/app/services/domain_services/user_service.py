from typing import List

from bson import ObjectId

from app.models.pydantics.user_schema import ResponseUser, UpdateUser, CreateUser
from app.utils.jwt_auth import JWTManager
from app.utils.password_manager import PasswordManager


class UserService:

    def __init__(self, db) -> None:
        self.collection = db.users

    async def create_user(self, user_data: CreateUser, authorize) -> ResponseUser:
        user = user_data.model_dump()
        if await self.collection.find_one({'email': user['email']}):
            raise ValueError('Email already exists')
        if user.get('roles'):
            user['roles'] = [role.lower() for role in user['roles']]
        user['password'] = PasswordManager.hash_password(user['password'])
        result = await self.collection.insert_one(user)
        return JWTManager.create_tokens(str(result.inserted_id), authorize)

    async def retrieve_users(self, user_id: str, page: int, limit: int) -> List[ResponseUser]:
        user = await self.collection.find_one({'_id': ObjectId(user_id)})
        if 'admin' not in user['roles']:
            raise ValueError('Unauthorized')

        # Calculate the number of documents to skip
        skip = (page - 1) * limit

        # Retrieve a limited number of users starting from the skip value
        data = self.collection.find().sort('full_name', -1).skip(skip).limit(limit)
        users = []
        async for user in data:
            user['id'] = str(user.pop('_id'))
            users.append(ResponseUser(**user))
        return users

    async def delete_user_via_admin(self, user_id: str, my_user_id) -> None:
        user = await self.collection.find_one({'_id': ObjectId(my_user_id)})
        if 'admin' not in user['roles']:
            raise ValueError('Unauthorized')
        await self.collection.delete_one({'_id': ObjectId(user_id)})

    async def update_user_via_admin(self, user_id: str, user_data: UpdateUser, my_user_id) -> ResponseUser:
        user = await self.collection.find_one({'_id': ObjectId(my_user_id)})
        if 'admin' not in user['roles']:
            raise ValueError('Unauthorized')
        return await self.update_user(user_id, user_data)

    async def retrieve_user(self, user_id: str) -> ResponseUser:
        user = await self.collection.find_one({'_id': ObjectId(user_id)})
        if user:
            user['id'] = str(user.pop('_id'))
            return ResponseUser(**user)
        raise ValueError('User not found')

    async def update_user(self, user_id: str, user_data: UpdateUser) -> ResponseUser:
        user_data_dict = user_data.model_dump()
        if user_data_dict.get('roles'):
            user_data_dict['roles'] = [role.lower() for role in user_data_dict['roles']]
        else:
            user_data_dict.pop('roles', None)
        if not user_data_dict.get('full_name'):
            user_data_dict.pop('full_name', None)
        if not user_data_dict.get('email'):
            user_data_dict.pop('email', None)

        await self.collection.update_one({'_id': ObjectId(user_id)}, {'$set': user_data_dict})
        user = await self.collection.find_one({'_id': ObjectId(user_id)})
        user['id'] = str(user.pop('_id'))
        return ResponseUser(**user)

    async def delete_user(self, user_id: str) -> None:
        await self.collection.delete_one({'_id': ObjectId(user_id)})

    async def reset_password(self, user_id: str, old_password: str, new_password: str) -> dict[str, str]:
        user = await self.collection.find_one({'_id': ObjectId(user_id)})
        if not PasswordManager.verify_password(old_password, user['password']):
            raise ValueError('Invalid password')
        await self.collection.update_one(
            {'_id': ObjectId(user_id)}, {'$set': {'password': PasswordManager.hash_password(new_password)}}
        )
        return {'detail': 'Password reset successful'}
