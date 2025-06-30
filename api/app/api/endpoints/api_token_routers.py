from fastapi import APIRouter, Depends, HTTPException

from app.core.logging import LoggerConfig
from app.api.dependencies import validate_credentials
from app.database import get_db
from app.services.domain_services.api_key_service import APIKeyService

logger = LoggerConfig(__name__).get_logger()
api_token_router = APIRouter()


@api_token_router.post("/create_api_token", status_code=201, tags=['API Token'])
async def create_token(
        credentials: dict = Depends(validate_credentials),
        database=Depends(get_db)
):
    try:
        logger.info(f"Creating token for user {credentials['user_id']}")
        service = APIKeyService(database)
        return await service.create_api_key(credentials['user_id'])
    except HTTPException as e:
        logger.error(f"Error creating token: {e}")
        raise e
    except Exception as e:
        logger.error(f"Error creating token: {e}")
        raise HTTPException(status_code=400, detail=str(e))


@api_token_router.delete("/delete_api_token", status_code=204, tags=['API Token'])
async def delete_token(
        credentials: dict = Depends(validate_credentials),
        api_key: str = None,
        database=Depends(get_db)
):
    try:
        logger.info(f"Deleting token for user {credentials['user_id']}")
        service = APIKeyService(database)
        await service.delete_api_key(credentials['user_id'], api_key)
    except HTTPException as e:
        logger.error(f"Error deleting token: {e}")
        raise e
    except Exception as e:
        logger.error(f"Error deleting token: {e}")
        raise HTTPException(status_code=400, detail=str(e))


@api_token_router.get("/get_api_tokens", tags=['API Token'])
async def get_tokens(
        credentials: dict = Depends(validate_credentials),
        database=Depends(get_db)
):
    try:
        logger.info(f"Getting tokens for user {credentials['user_id']}")
        service = APIKeyService(database)
        return await service.get_api_keys(credentials['user_id'])
    except HTTPException as e:
        logger.error(f"Error getting tokens: {e}")
        raise e
    except Exception as e:
        logger.error(f"Error getting tokens: {e}")
        raise HTTPException(status_code=400, detail=str(e))
