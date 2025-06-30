import os
from datetime import timedelta

from fastapi import HTTPException
from another_fastapi_jwt_auth import AuthJWT
from pydantic import BaseModel


# Configuration class for AuthJWT
class Settings(BaseModel):
    authjwt_secret_key: str = os.getenv('SECRET_KEY')
    authjwt_algorithm: str = os.getenv('ALGORITHM', 'HS256')
    # auth_access_token_expires: timedelta = timedelta(days=config.access_token_expire)
    authjwt_access_token_expires: timedelta = timedelta(days=1)
    authjwt_refresh_token_expires: timedelta = timedelta(days=100)
    # auth_refresh_token_expires: timedelta = timedelta(days=config.refresh_token_expire)


@AuthJWT.load_config
def get_config():
    return Settings()


class JWTManager:

    @staticmethod
    def create_tokens(subject: str, authorize: AuthJWT):
        access_token = authorize.create_access_token(subject=subject)
        refresh_token = authorize.create_refresh_token(subject=subject)
        return {'access_token': access_token, 'refresh_token': refresh_token, 'token_type': 'bearer'}

    @staticmethod
    def refresh_access_token(refresh_token: str, authorize: AuthJWT):
        try:
            subject = authorize.get_raw_jwt(refresh_token)['sub']
            new_access_token = authorize.create_access_token(subject=subject)
            return {'token': new_access_token, 'token_type': 'access'}
        except HTTPException as e:
            # Since exceptions are handled by fastapi_jwt_auth, this is to demonstrate how you might catch and rethrow
            # or log specific exceptions if needed.
            raise e

    @staticmethod
    def decode_token(token: str, authorize: AuthJWT):
        try:
            data = authorize.get_raw_jwt(token)
            if data.keys() >= {'sub'}:
                return {'detail': 'Valid token.'}
        except HTTPException as e:
            raise e

    @staticmethod
    def is_token_expired(token: str, authorize: AuthJWT) -> bool:
        try:
            authorize.jwt_required(token=token)
            return False
        except HTTPException as e:
            if e.status_code == 401:
                return True
            raise e

    @staticmethod
    def get_token_expiry(token: str, authorize: AuthJWT):
        try:
            return authorize.get_raw_jwt(token)['exp']
        except HTTPException as e:
            raise e
