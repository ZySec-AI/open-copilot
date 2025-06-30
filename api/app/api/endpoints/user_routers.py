from typing import List

from fastapi import APIRouter, Request, Depends, HTTPException, Query, Form
from another_fastapi_jwt_auth import AuthJWT

from app.api.dependencies import validate_credentials
from app.core.logging import LoggerConfig
from app.database import get_db
from app.models.pydantics.auth_schema import ResponseToken
from app.models.pydantics.user_schema import UpdateUser, ResponseUser, CreateUser
from app.services.domain_services.user_service import UserService

user_router = APIRouter(prefix='/users')

logger = LoggerConfig('user_router.py').get_logger()


@user_router.post('/', status_code=201, response_model=ResponseToken, tags=['Users'])
async def create_user(
        request: Request,
        user: CreateUser,
        database=Depends(get_db),
        authorize: AuthJWT = Depends()
):
    try:
        logger.info(f'{request.url.path} - Create User')
        service = UserService(database)
        return await service.create_user(user, authorize)
    except HTTPException as e:
        logger.info(f'{request.url.path} - {e}')
        raise e
    except Exception as e:
        logger.error(f'{request.url.path} - {e}')
        raise HTTPException(status_code=400, detail=str(e))


@user_router.get("/", status_code=200, response_model=List[ResponseUser], tags=['Users'])
async def retrieve_users(
        request: Request,
        page: int = Query(1, ge=1),  # Page number, must be greater than or equal to 1
        limit: int = Query(10, ge=1),  # Page size, must be greater than or equal to 1
        database=Depends(get_db),
        credentials=Depends(validate_credentials)
):
    try:
        logger.info(f'{request.url.path} - Retrieve Users - page {page} limit {limit}')
        service = UserService(database)
        return await service.retrieve_users(credentials['user_id'], page, limit)
    except HTTPException as e:
        logger.info(f'{request.url.path} - {e}')
        raise e
    except Exception as e:
        logger.error(f'{request.url.path} - {e}')
        raise HTTPException(status_code=400, detail=str(e))


@user_router.delete('/{user_id}', status_code=204, tags=['Users'])
async def delete_user_via_admin(
        request: Request,
        user_id: str,
        database=Depends(get_db),
        credentials=Depends(validate_credentials)
):
    try:
        logger.info(f'{request.url.path} - Delete Users')
        service = UserService(database)
        return await service.delete_user_via_admin(user_id, credentials['user_id'])
    except HTTPException as e:
        logger.info(f'{request.url.path} - {e}')
        raise e
    except Exception as e:
        logger.error(f'{request.url.path} - {e}')
        raise HTTPException(status_code=400, detail=str(e))


@user_router.put('/{user_id}', status_code=200, response_model=ResponseUser, tags=['Users'])
async def update_user_via_admin(
        request: Request,
        user_id: str,
        user: UpdateUser,
        database=Depends(get_db),
        credentials=Depends(validate_credentials)
):
    try:
        logger.info(f'{request.url.path} - Update User')
        service = UserService(database)
        return await service.update_user_via_admin(user_id, user, credentials['user_id'])
    except HTTPException as e:
        logger.info(f'{request.url.path} - {e}')
        raise e
    except Exception as e:
        logger.error(f'{request.url.path} - {e}')
        raise HTTPException(status_code=400, detail=str(e))


@user_router.get("/me", status_code=200, response_model=ResponseUser, tags=['Users'])
async def retrieve_user(
        request: Request,
        database=Depends(get_db),
        credentials=Depends(validate_credentials)
):
    try:
        logger.info(f'{request.url.path} - Retrieve User')
        service = UserService(database)
        return await service.retrieve_user(credentials['user_id'])
    except HTTPException as e:
        logger.info(f'{request.url.path} - {e}')
        raise e
    except Exception as e:
        logger.error(f'{request.url.path} - {e}')
        raise HTTPException(status_code=400, detail=str(e))


@user_router.put('/me', status_code=200, response_model=ResponseUser, tags=['Users'])
async def update_user(
        request: Request,
        user: UpdateUser,
        database=Depends(get_db),
        credentials=Depends(validate_credentials)
):
    try:
        logger.info(f'{request.url.path} - Update User')
        service = UserService(database)
        return await service.update_user(credentials['user_id'], user)
    except HTTPException as e:
        logger.info(f'{request.url.path} - {e}')
        raise e
    except Exception as e:
        logger.error(f'{request.url.path} - {e}')
        raise HTTPException(status_code=400, detail=str(e))


@user_router.delete('/me', status_code=204, tags=['Users'])
async def delete_user(
        request: Request,
        database=Depends(get_db),
        credentials=Depends(validate_credentials)
):
    try:
        logger.info(f'{request.url.path} - Delete User')
        service = UserService(database)
        return await service.delete_user(credentials['user_id'])
    except HTTPException as e:
        logger.info(f'{request.url.path} - {e}')
        raise e
    except Exception as e:
        logger.error(f'{request.url.path} - {e}')
        raise HTTPException(status_code=400, detail=str(e))


@user_router.post('/me/reset_password', status_code=200, tags=['Users'])
async def reset_password(
        request: Request,
        old_password: str = Form(...),
        new_password: str = Form(...),
        database=Depends(get_db),
        credentials=Depends(validate_credentials)
):
    try:
        logger.info(f'{request.url.path} - Reset Password')
        service = UserService(database)
        return await service.reset_password(credentials['user_id'], old_password, new_password)
    except HTTPException as e:
        logger.info(f'{request.url.path} - {e}')
        raise e
    except Exception as e:
        logger.error(f'{request.url.path} - {e}')
        raise HTTPException(status_code=400, detail=str(e))
