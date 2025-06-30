from datetime import datetime

from fastapi import HTTPException
from another_fastapi_jwt_auth import AuthJWT

from app.database import get_db
from app.services.domain_services.block_list_token_service import BlockListTokenService
from app.utils.jwt_auth import JWTManager
from app.utils.password_manager import PasswordManager


class AuthService:

    def __init__(self, db):
        self.database = db
        self.collection = db.users

    async def __retrieve_user(self, email) -> dict:
        user = await self.collection.find_one({'email': email})
        if not user:
            raise ValueError('Invalid Email.')
        return user

    async def login(self, email, password, authorize) -> dict:
        user = await self.__retrieve_user(email)
        if not PasswordManager.verify_password(password, user['password']):
            raise ValueError('Invalid password.')
        await self.collection.update_one({'email': email}, {'$set': {'last_login': datetime.now()}})

        return JWTManager.create_tokens(str(user['_id']), authorize)

    async def is_refresh_expired(self, refresh_token) -> bool:
        return await self.database.block_list_tokens.find_one({'token': refresh_token})

    @staticmethod
    async def add_token(collection, token: str, authorize: AuthJWT):
        expiry = JWTManager.get_token_expiry(token, authorize)
        await collection.insert_one({'token': token, 'expiry': expiry})

    @staticmethod
    async def logout(access_token, refresh_token, authorize) -> dict:
        db_gen = get_db()
        database = await db_gen.__anext__()
        block_list_service = BlockListTokenService(database)

        if not await block_list_service.is_token_block_listed(access_token):
            await AuthService.add_token(database.block_list_tokens, access_token, authorize)
            await AuthService.add_token(database.block_list_tokens, refresh_token, authorize)
            return {'detail': 'Successfully logged out'}
        raise HTTPException(status_code=400, detail='User is already logged-out')

    @staticmethod
    async def refresh(refresh_token, authorize) -> dict:
        return JWTManager.refresh_access_token(refresh_token, authorize=authorize)

    @staticmethod
    async def validate(token, authorize) -> dict:
        return JWTManager.decode_token(token, authorize)
