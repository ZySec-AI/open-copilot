from typing import List

from fastapi import APIRouter, Request, HTTPException, Depends, Query
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.core.logging import LoggerConfig
from app.database import get_db
from app.models.pydantics.chat_schema import RequestChat, ResponseChat
from app.services.domain_services.chat_service import ChatService
from app.api.dependencies import validate_credentials

logger = LoggerConfig(__name__).get_logger()

chat_router = APIRouter(prefix='/chats')


@chat_router.get("", status_code=200, response_model=List[ResponseChat], tags=['Chat'])
async def retrieve_chats(
        request: Request,
        expert_id: str,
        page: int = Query(1, ge=1),
        limit: int = Query(10, ge=1),
        credentials: dict = Depends(validate_credentials),
        database: AsyncIOMotorDatabase = Depends(get_db),
):
    try:
        logger.info(f'{request.url.path} - Retrieve Chat called')
        service = ChatService(database)
        return await service.get_chats(expert_id, credentials['user_id'], page, limit)
    except HTTPException as e:
        logger.info(f'{request.url.path} - {e}')
        raise e
    except Exception as e:
        logger.error(f'{request.url.path} - {str(e)}')
        raise HTTPException(status_code=400, detail=str(e))


@chat_router.put("/{chat_id}/add_expert", status_code=200, tags=['Chat'])
async def add_expert_to_chat(
        request: Request,
        chat_id: str,
        expert_id: str,
        database: AsyncIOMotorDatabase = Depends(get_db),
        credentials: dict = Depends(validate_credentials)
):
    try:
        logger.info(f'{request.url.path} - Add Expert to Chat called')
        service = ChatService(database)
        return await service.add_expert_to_chat(chat_id, expert_id, credentials['user_id'])
    except HTTPException as e:
        logger.info(f'{request.url.path} - {e}')
        raise e
    except Exception as e:
        logger.error(f'{request.url.path} - {str(e)}')
        raise HTTPException(status_code=400, detail=str(e))


@chat_router.put('/{chat_id}/remove_expert', status_code=200, tags=['Chat'])
async def remove_expert_from_chat(
        request: Request,
        chat_id: str,
        expert_id: str,
        database: AsyncIOMotorDatabase = Depends(get_db),
        credentials: dict = Depends(validate_credentials)
):
    try:
        logger.info(f'{request.url.path} - Remove Expert from Chat called')
        service = ChatService(database)
        return await service.remove_expert_from_chat(chat_id, expert_id, credentials['user_id'])
    except HTTPException as e:
        logger.info(f'{request.url.path} - {e}')
        raise e
    except Exception as e:
        logger.error(f'{request.url.path} - {str(e)}')
        raise HTTPException(status_code=400, detail=str(e))


@chat_router.put("/{chat_id}", status_code=200, tags=['Chat'])
async def update_chat(
        request: Request,
        chat_id: str,
        chat: RequestChat,
        database: AsyncIOMotorDatabase = Depends(get_db),
        credentials: dict = Depends(validate_credentials)
):
    try:
        logger.info(f'{request.url.path} - Update Chat called')
        service = ChatService(database)
        return await service.update_chat(chat_id, credentials['user_id'], chat)
    except HTTPException as e:
        logger.info(f'{request.url.path} - {e}')
        raise e
    except Exception as e:
        logger.error(f'{request.url.path} - {str(e)}')
        raise HTTPException(status_code=400, detail=str(e))


@chat_router.delete("/{chat_id}", status_code=200, tags=['Chat'])
async def delete_chat(
        request: Request,
        chat_id: str,
        database: AsyncIOMotorDatabase = Depends(get_db),
        credentials: dict = Depends(validate_credentials)
):
    try:
        logger.info(f'{request.url.path} - Delete Chat called')
        service = ChatService(database)
        return service.delete_chat(chat_id, credentials['user_id'])
    except HTTPException as e:
        logger.info(f'{request.url.path} - {e}')
        raise e
    except Exception as e:
        logger.error(f'{request.url.path} - {str(e)}')
        raise HTTPException(status_code=400, detail=str(e))
