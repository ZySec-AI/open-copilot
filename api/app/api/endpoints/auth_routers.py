from typing import Annotated

from fastapi import APIRouter, Request, Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials
from another_fastapi_jwt_auth import AuthJWT

from app.api.dependencies import oauth2_bearer
from app.core.logging import LoggerConfig
from app.database import get_db
from app.models.pydantics import Detail
from app.models.pydantics.auth_schema import AuthUser, Token, ResponseToken
from app.services.domain_services.auth_service import AuthService

auth_router = APIRouter(prefix='/auth')
logger = LoggerConfig('auth_router.py').get_logger()


@auth_router.post('/login', status_code=200, response_model=ResponseToken, tags=['Auth'])
async def login(
        request: Request, user: AuthUser,
        database=Depends(get_db), authorize: AuthJWT = Depends()):
    try:
        logger.info(f'{request.url.path} - Login')
        service = AuthService(database)
        return await service.login(**user.model_dump(), authorize=authorize)
    except HTTPException as e:
        logger.info(f'{request.url.path} - {e}')
        raise e
    except Exception as e:
        logger.error(f'{request.url.path} - {e}')
        raise HTTPException(status_code=400, detail=str(e))


@auth_router.post('/logout', status_code=200, response_model=Detail, tags=['Auth'])
async def logout(
        request: Request,
        http: Annotated[HTTPAuthorizationCredentials, Depends(oauth2_bearer)],
        token: Token,
        authorize: AuthJWT = Depends(),
):
    try:
        logger.info(f'{request.url.path} - Logout')
        return await AuthService.logout(http.credentials, token.token, authorize)
    except HTTPException as e:
        logger.info(f'{request.url.path} - {e}')
        raise e
    except Exception as e:
        logger.error(f'{request.url.path} - {e}')
        raise HTTPException(status_code=400, detail=str(e))


@auth_router.post('/refresh_token', status_code=200, response_model=Token, tags=['Auth'])
async def refresh(
        request: Request, token: Token,
        authorize: AuthJWT = Depends(),
        db=Depends(get_db)
):
    try:
        logger.info(f'{request.url.path} - Refresh')
        if not token.token_type.startswith('refresh'):
            raise HTTPException(status_code=400, detail='Refresh token is missing')
        auth_service = AuthService(db)
        if await auth_service.is_refresh_expired(token.token):
            raise HTTPException(status_code=400, detail='Refresh token is expired')
        return await auth_service.refresh(token.token, authorize=authorize)
    except HTTPException as e:
        logger.info(f'{request.url.path} - {e}')
        raise e
    except Exception as e:
        logger.error(f'{request.url.path} - {e}')
        raise HTTPException(status_code=400, detail=str(e))


@auth_router.post('/validate_token', status_code=200, tags=['Auth'])
async def validate(
        request: Request, token: Token,
        authorize: AuthJWT = Depends()
):
    try:
        logger.info(f'{request.url.path} - Validate')
        return await AuthService.validate(token.token, authorize=authorize)
    except HTTPException as e:
        logger.info(f'{request.url.path} - {e}')
        raise e
    except Exception as e:
        logger.error(f'{request.url.path} - {e}')
        raise HTTPException(status_code=400, detail=str(e))
