from fastapi import APIRouter, HTTPException, Depends, Request, Query

from typing import List

from app.api.dependencies import validate_credentials
from app.core.logging import LoggerConfig
from app.database import get_db
from app.models.pydantics.message_schema import ResponseMessage
from app.services.domain_services.message_service import MessageService

logger = LoggerConfig(__name__).get_logger()
message_router = APIRouter(prefix='/messages')


@message_router.get('/', status_code=200, response_model=List[ResponseMessage], tags=['Messages'])
async def get_messages(
        request: Request,
        chat_id: str,
        page: int = Query(1, ge=1),
        limit: int = Query(10, ge=1),
        database=Depends(get_db),
        credentials: dict = Depends(validate_credentials)
):
    try:
        logger.info(f'{request.url.path} Get all messages called.')
        service = MessageService(database)
        return await service.get_messages(chat_id, credentials['user_id'], page, limit)
    except HTTPException as e:
        logger.error(str(e))
        raise e
    except Exception as e:
        logger.error(str(e))
        raise HTTPException(status_code=400, detail=str(e))


@message_router.get('/{message_id}', status_code=200, response_model=ResponseMessage, tags=['Messages'])
async def get_message(
        request: Request,
        message_id: str,
        database=Depends(get_db),
        credentials: dict = Depends(validate_credentials)
):
    try:
        logger.info(f'{request.url.path} Get message called.')
        service = MessageService(database)
        return await service.get_message(message_id)
    except HTTPException as e:
        logger.error(str(e))
        raise e
    except Exception as e:
        logger.error(str(e))
        raise HTTPException(status_code=400, detail=str(e))


@message_router.delete('/{message_id}', status_code=204, tags=['Messages'])
async def delete_message(
        request: Request,
        message_id: str,
        database=Depends(get_db),
        credentials: dict = Depends(validate_credentials)
):
    try:
        logger.info(f'{request.url.path} Delete message called.')
        service = MessageService(database)
        await service.delete_message(message_id, credentials['user_id'])
    except HTTPException as e:
        logger.error(str(e))
        raise e
    except Exception as e:
        logger.error(str(e))
        raise HTTPException(status_code=400, detail=str(e))
