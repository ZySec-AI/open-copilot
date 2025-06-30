from typing import List

from fastapi import APIRouter, Depends, UploadFile, File, Form, Request, HTTPException, BackgroundTasks, Query
from motor.motor_asyncio import AsyncIOMotorDatabase
from starlette.responses import StreamingResponse

from app.api.dependencies import validate_credentials
from app.core.logging import LoggerConfig
from app.database import get_db
from app.models.pydantics.file_info_schema import ResponseFileInfo, FileUploadInfo
from app.services.domain_services.file_info_service import FileInfoService
from app.services.domain_services.file_open_search_service import FileOpenSearchService

logger = LoggerConfig(__name__).get_logger()
file_info_router = APIRouter(prefix='/files')


@file_info_router.get('/file_chunks', tags=['File Info'])
async def get_file_chunks(
        request: Request,
        file_id: str,
        credentials: dict = Depends(validate_credentials)
):
    try:
        logger.info(f'{request.url.path} - Getting file chunks for file: {file_id}')
        service = FileOpenSearchService()
        return service.get_file_chunks(file_id)
    except HTTPException as e:
        logger.error(f'/{file_id} endpoint failed with error: {e}')
        raise e
    except Exception as e:
        logger.error(f'/{file_id} endpoint failed with error: {e}')
        raise HTTPException(status_code=500, detail='Internal server error')


@file_info_router.get('/search_on_file_chunks', tags=['File Info'])
async def search_on_file_chunks(
        request: Request,
        file_id: str,
        query: str,
        database: AsyncIOMotorDatabase = Depends(get_db),
        credentials: dict = Depends(validate_credentials)
):
    try:
        logger.info(f'{request.url.path} - Searching on file chunks for file: {file_id}')
        service = FileOpenSearchService()
        return await service.search_from_files([file_id], query, database, credentials['user_id'])
    except HTTPException as e:
        logger.error(f'/{file_id} endpoint failed with error: {e}')
        raise e
    except Exception as e:
        logger.error(f'/{file_id} endpoint failed with error: {e}')
        raise HTTPException(status_code=500, detail='Internal server error')


@file_info_router.post('/upload', status_code=201, response_model=ResponseFileInfo, tags=['File Info'])
async def upload_file(
        request: Request,
        background_tasks: BackgroundTasks,
        description: str = Form(None),
        categories: List[str] = Form(None),
        tags: List[str] = Form(None),
        folder_id: str = Form(None),
        file: UploadFile = File(...),
        database: AsyncIOMotorDatabase = Depends(get_db),
        credentials: dict = Depends(validate_credentials),

):
    try:
        logger.info(f'{request.url.path} - Uploading file: {file.filename}')
        service = FileInfoService(database)
        categories = categories[0].split(',') if categories[0] else []
        tags = tags[0].split(',') if tags[0] else []
        return await service.upload_file(
            description, categories,
            tags, folder_id, file,
            credentials['user_id'], background_tasks
        )
    except HTTPException as e:
        logger.info(f'{request.url.path} - {e}')
        raise e
    except Exception as e:
        logger.error(f'/upload endpoint failed with error: {e}')


@file_info_router.post('/{file_id}', response_model=ResponseFileInfo, tags=['File Info'])
async def update_file_metadata(
        request: Request,
        file_id: str,
        file_info: FileUploadInfo,
        database: AsyncIOMotorDatabase = Depends(get_db),
        credentials: dict = Depends(validate_credentials)
):
    try:
        logger.info(f'{request.url.path} - Getting file: {file_id}')
        service = FileInfoService(database)
        return await service.update_file_metadata(file_id, file_info)
    except HTTPException as e:
        logger.error(f'/{file_id} endpoint failed with error: {e}')
        raise e
    except Exception as e:
        logger.error(f'/{file_id} endpoint failed with error: {e}')
        raise HTTPException(status_code=500, detail='Internal server error')


@file_info_router.get('/', response_model=List[ResponseFileInfo], tags=['File Info'])
async def retrieve_all_files(
        request: Request,
        folder_id: str = None,
        page: int = Query(1, ge=1),
        limit: int = Query(10, ge=1),
        database: AsyncIOMotorDatabase = Depends(get_db),
        credentials: dict = Depends(validate_credentials)
):
    try:
        logger.info(f'{request.url.path} - Getting all files in folder: {folder_id}')
        service = FileInfoService(database)
        return await service.get_all_files(folder_id, credentials['user_id'], page, limit)
    except HTTPException as e:
        logger.info(f'{request.url.path} - {e}')
        raise e
    except Exception as e:
        logger.error(f'/ endpoint failed with error: {e}')


@file_info_router.post(
    '/move_folder', status_code=200, response_model=ResponseFileInfo, tags=['File Info']
)
async def move_file_from_folder(
        request: Request,
        file_id: str,
        folder_id: str,
        database: AsyncIOMotorDatabase = Depends(get_db),
        credentials: dict = Depends(validate_credentials)
):
    try:
        logger.info(f'{request.url.path} - Moving file: {file_id} to folder: {folder_id}')
        service = FileInfoService(database)
        return await service.move_file_from_folder(file_id, folder_id, credentials['user_id'])
    except HTTPException as e:
        logger.error(f'/move_folder endpoint failed with error: {e}')
        raise e
    except Exception as e:
        logger.error(f'/move_folder endpoint failed with error: {e}')
        raise HTTPException(status_code=500, detail='Internal server error')


@file_info_router.delete('/{file_id}', response_model=ResponseFileInfo, tags=['File Info'])
async def delete_file(
        request: Request,
        file_id: str,
        database: AsyncIOMotorDatabase = Depends(get_db),
        credentials: dict = Depends(validate_credentials)
):
    try:
        logger.info(f'{request.url.path} - Deleting file: {file_id}')
        service = FileInfoService(database)
        return await service.delete_file(file_id)
    except HTTPException as e:
        logger.error(f'/{file_id} endpoint failed with error: {e}')
        raise e
    except Exception as e:
        logger.error(f'/{file_id} endpoint failed with error: {e}')
        raise HTTPException(status_code=500, detail='Internal server error')


@file_info_router.get('/{file_id}', response_model=ResponseFileInfo, tags=['File Info'])
async def download_file(
        request: Request,
        file_id: str,
        database: AsyncIOMotorDatabase = Depends(get_db),
        credentials: dict = Depends(validate_credentials)
):
    try:
        logger.info(f'{request.url.path} - Downloading file: {file_id}')
        service = FileInfoService(database)
        filename, path = await service.retrieve_file_path(file_id)
        file_like = open(path, mode="rb")
        return StreamingResponse(
            file_like, media_type='application/octet-stream',
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )
    except HTTPException as e:
        logger.error(f'/{file_id} endpoint failed with error: {e}')
        raise e
    except Exception as e:
        logger.error(f'/{file_id} endpoint failed with error: {e}')
        raise HTTPException(status_code=500, detail='Internal server error')


@file_info_router.post('/{file_id}/expert', status_code=201, tags=['File Info'])
async def export_file(
        request: Request,
        file_id: str,
        database: AsyncIOMotorDatabase = Depends(get_db),
        credentials: dict = Depends(validate_credentials)
):
    try:
        logger.info(f'{request.url.path} - Exporting file: {file_id}')
        service = FileInfoService(database)
        return await service.export_file(file_id, credentials['user_id'])
    except HTTPException as e:
        logger.error(f'/{file_id}/export endpoint failed with error: {e}')
        raise e
    except Exception as e:
        logger.error(f'/{file_id}/export endpoint failed with error: {e}')
        raise HTTPException(status_code=500, detail='Internal server error')
