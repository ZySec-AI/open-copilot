from typing import List

from fastapi import APIRouter, Request, HTTPException, Depends, Query, BackgroundTasks
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.api.dependencies import validate_credentials, obtain_from_api_key
from app.core.logging import LoggerConfig
from app.database import get_db
from app.models.pydantics.content_item_schema import RequestContentItem, ResponseContentItem
from app.services.domain_services.content_item_service import ContentItemService
from app.utils.app_enums import ContentItemType

content_item_router = APIRouter(prefix='/content_items')

logger = LoggerConfig(__name__).get_logger()


@content_item_router.get("", status_code=200, response_model=List[ResponseContentItem], tags=['Content Item'])
async def retrieve_content_items(
        request: Request,
        content_type: ContentItemType = None,
        page: int = Query(1, ge=1),
        limit: int = Query(10, ge=1),
        database: AsyncIOMotorDatabase = Depends(get_db),
        credentials: dict = Depends(validate_credentials)
):
    try:
        logger.info(f'{request.url.path} - Retrieve Content Item called')

        service = ContentItemService(database)

        return await service.retrieve_content_items(content_type, page, limit)
    except HTTPException as e:
        logger.info(f'{request.url.path} - {e}')
        raise e
    except Exception as e:
        logger.error(f'{request.url.path} - {str(e)}')


@content_item_router.post("", status_code=201, response_model=ResponseContentItem, tags=['Content Item'])
async def create_content_item(
        request: Request,
        content_item: RequestContentItem,
        background_tasks: BackgroundTasks,
        database: AsyncIOMotorDatabase = Depends(get_db),
        credentials: dict = Depends(validate_credentials)
):
    try:
        logger.info(f'{request.url.path} - Create Content Item called')
        service = ContentItemService(database)

        return await service.create_content_item(content_item, credentials['user_id'], background_tasks)
    except HTTPException as e:
        logger.info(f'{request.url.path} - {e}')
        raise e
    except Exception as e:
        logger.error(f'{request.url.path} - {str(e)}')


@content_item_router.post("/ingest", status_code=201, response_model=ResponseContentItem, tags=['Content Item'])
async def create_content_item_with_api_key(
        request: Request,
        content_item: RequestContentItem,
        background_tasks: BackgroundTasks,
        database: AsyncIOMotorDatabase = Depends(get_db),
        credentials: dict = Depends(obtain_from_api_key)
):
    try:
        logger.info(f'{request.url.path} - Create Content Item called')
        service = ContentItemService(database)

        return await service.create_content_item(content_item, credentials['user_id'], background_tasks)
    except HTTPException as e:
        logger.info(f'{request.url.path} - {e}')
        raise e
    except Exception as e:
        logger.error(f'{request.url.path} - {str(e)}')


@content_item_router.get(
    "/filter/{category_id}", status_code=200,
    response_model=List[ResponseContentItem], tags=['Content Item']
)
async def retrieve_content_items_by_category(
        request: Request,
        category_id: str,
        content_type: ContentItemType = None,
        page: int = Query(1, ge=1),
        limit: int = Query(10, ge=1),
        database: AsyncIOMotorDatabase = Depends(get_db),
        credentials: dict = Depends(validate_credentials)
):
    try:
        logger.info(f'{request.url.path} - Retrieve Content Item called')

        service = ContentItemService(database)

        return await service.retrieve_content_items_by_category(content_type, category_id, page, limit)
    except HTTPException as e:
        logger.info(f'{request.url.path} - {e}')
        raise e
    except Exception as e:
        logger.error(f'{request.url.path} - {str(e)}')


@content_item_router.get(
    "/{content_item_id}", status_code=200, response_model=ResponseContentItem, tags=['Content Item']
)
async def retrieve_content_item(
        request: Request,
        content_item_id: str,
        database: AsyncIOMotorDatabase = Depends(get_db),
        credentials: dict = Depends(validate_credentials)
):
    try:
        logger.info(f'{request.url.path} - Retrieve Content Item called')
        service = ContentItemService(database)
        return await service.retrieve_content_item(content_item_id)
    except HTTPException as e:
        logger.info(f'{request.url.path} - {e}')
        raise e
    except Exception as e:
        logger.error(f'{request.url.path} - {str(e)}')


@content_item_router.put(
    "/{content_item_id}", status_code=200, response_model=ResponseContentItem, tags=['Content Item']
)
async def update_content_item(
        request: Request,
        content_item_id: str,
        content_item: RequestContentItem,
        background_tasks: BackgroundTasks,
        database: AsyncIOMotorDatabase = Depends(get_db),
        credentials: dict = Depends(validate_credentials)
):
    try:
        logger.info(f'{request.url.path} - Update Content Item called')
        service = ContentItemService(database)
        return await service.update_content_item(
            content_item_id, content_item,
            credentials['user_id'], background_tasks
        )
    except HTTPException as e:
        logger.info(f'{request.url.path} - {e}')
        raise e
    except Exception as e:
        logger.error(f'{request.url.path} - {str(e)}')


@content_item_router.delete(
    "/{content_item_id}", status_code=204, tags=['Content Item']
)
async def delete_content_item(
        request: Request,
        content_item_id: str,
        background_tasks: BackgroundTasks,
        database: AsyncIOMotorDatabase = Depends(get_db),
        credentials: dict = Depends(validate_credentials),
):
    try:
        logger.info(f'{request.url.path} - Delete Content Item called')

        service = ContentItemService(database)

        await service.delete_content_item(content_item_id, background_tasks)
    except HTTPException as e:
        logger.info(f'{request.url.path} - {e}')
        raise e
    except Exception as e:
        logger.error(f'{request.url.path} - {str(e)}')
