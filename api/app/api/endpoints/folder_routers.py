from typing import List

from fastapi import APIRouter, Depends, Request, HTTPException

from app.api.dependencies import validate_credentials
from app.core.logging import LoggerConfig
from app.database import get_db
from app.models.pydantics.folder_schema import RequestFolder, ResponseFolder
from app.services.domain_services.folder_service import FolderService

logger = LoggerConfig(__name__).get_logger()
folder_router = APIRouter(prefix='/folders')


@folder_router.post('/', status_code=201, response_model=ResponseFolder, tags=['Folder'])
async def create_folder(
        request: Request,
        folder: RequestFolder,
        database=Depends(get_db),
        credentials: dict = Depends(validate_credentials)
):
    try:
        logger.info(f'{request.url.path} - Creating folder: {folder.name}')
        service = FolderService(database)
        return await service.create_folder(folder, credentials['user_id'])
    except HTTPException as e:
        logger.info(f'{request.url.path} - {e}')
        raise e
    except Exception as e:
        logger.error(f'/ endpoint failed with error: {e}')


@folder_router.get('/', response_model=List[ResponseFolder], tags=['Folder'])
async def get_folders(
        request: Request,
        database=Depends(get_db),
        credentials: dict = Depends(validate_credentials)
):
    try:
        logger.info(f'{request.url.path} - Getting folders')
        service = FolderService(database)
        return await service.get_folders(credentials['user_id'])
    except HTTPException as e:
        logger.info(f'{request.url.path} - {e}')
        raise e
    except Exception as e:
        logger.error(f'/ endpoint failed with error: {e}')


@folder_router.delete('/{folder_id}', status_code=204, tags=['Folder'])
async def delete_folder(
        request: Request,
        folder_id: str,
        database=Depends(get_db),
        credentials: dict = Depends(validate_credentials)
):
    try:
        logger.info(f'{request.url.path} - Deleting folder: {folder_id}')
        service = FolderService(database)
        return await service.delete_folder(folder_id, credentials['user_id'])
    except HTTPException as e:
        logger.info(f'{request.url.path} - {e}')
        raise e
    except Exception as e:
        logger.error(f'/ endpoint failed with error: {e}')
