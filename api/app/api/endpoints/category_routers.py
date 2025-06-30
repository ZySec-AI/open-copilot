from typing import List

from fastapi import APIRouter, Depends, Request, HTTPException, Query

from app.api.dependencies import validate_credentials
from app.core.logging import LoggerConfig
from app.database import get_db
from app.models.mongodb.category_model import Category
from app.models.pydantics.category_schema import ResponseCategory
from app.services.domain_services.category_service import CategoryService

logger = LoggerConfig(__name__).get_logger()
category_router = APIRouter(prefix='/categories')


@category_router.post('/', status_code=201, response_model=ResponseCategory, tags=['Category'])
async def create_category(
        request: Request,
        category: Category,
        database=Depends(get_db),
        credentials: dict = Depends(validate_credentials)
):
    try:
        logger.info(f'{request.url.path} - Creating category: {category.name}')
        service = CategoryService(database)
        return await service.create_category(category)
    except HTTPException as e:
        logger.info(f'{request.url.path} - {e}')
        raise e
    except Exception as e:
        logger.error(f'/ endpoint failed with error: {e}')
        raise HTTPException(status_code=400, detail=str(e))


@category_router.get('/', response_model=List[ResponseCategory], tags=['Category'])
async def get_categories(
        request: Request,
        database=Depends(get_db),
        page: int = Query(1, ge=1),
        limit: int = Query(10, ge=1),
        credentials: dict = Depends(validate_credentials)
):
    try:
        logger.info(f'{request.url.path} - Getting folders')
        service = CategoryService(database)
        return await service.get_categories(page, limit)
    except HTTPException as e:
        logger.info(f'{request.url.path} - {e}')
        raise e
    except Exception as e:
        logger.error(f'/ endpoint failed with error: {e}')
        raise HTTPException(status_code=400, detail=str(e))


@category_router.get('/invisible_list', response_model=List[ResponseCategory], tags=['Category'])
async def get_invisible_categories(
        request: Request,
        database=Depends(get_db)
):
    try:
        logger.info(f'{request.url.path} - Getting folders')
        service = CategoryService(database)
        return await service.get_invisible_categories()
    except HTTPException as e:
        logger.info(f'{request.url.path} - {e}')
        raise e
    except Exception as e:
        logger.error(f'/ endpoint failed with error: {e}')
        raise HTTPException(status_code=400, detail=str(e))


@category_router.put('/{category_id}', response_model=ResponseCategory, tags=['Category'])
async def update_category(
        request: Request,
        category_id: str,
        category: Category,
        database=Depends(get_db),
        credentials: dict = Depends(validate_credentials)
):
    try:
        logger.info(f'{request.url.path} - Updating category: {category.name}')
        service = CategoryService(database)
        return await service.update_category(category_id, category)
    except HTTPException as e:
        logger.info(f'{request.url.path} - {e}')
        raise e
    except Exception as e:
        logger.error(f'/ endpoint failed with error: {e}')
        raise HTTPException(status_code=400, detail=str(e))


@category_router.delete('/{category_id}', status_code=204, tags=['Category'])
async def delete_category(
        request: Request,
        category_id: str,
        database=Depends(get_db),
        credentials: dict = Depends(validate_credentials)
):
    try:
        logger.info(f'{request.url.path} - Deleting category: {category_id}')
        service = CategoryService(database)
        await service.delete_category(category_id)
    except HTTPException as e:
        logger.info(f'{request.url.path} - {e}')
        raise e
    except Exception as e:
        logger.error(f'/ endpoint failed with error: {e}')
        raise HTTPException(status_code=400, detail=str(e))
