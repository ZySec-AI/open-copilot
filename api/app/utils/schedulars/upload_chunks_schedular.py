import asyncio

from app.core.logging import LoggerConfig
from app.database import get_db
from app.services.ai_services.text_embedding_service import TextEmbeddingService

logger = LoggerConfig('block_list_token_scheduler.py').get_logger()


def start_uploading_file_chunks(file_path: str, file_id: str):
    logger.info('Starting uploading file chunks...')

    # service = FileOpenSearchService()
    #
    # await service.process_file_chunks(file_id)
    db_gen = get_db()
    db = asyncio.run(db_gen.__anext__())
    langchain_service = TextEmbeddingService(db)
    asyncio.run(langchain_service.index_files(file_path, file_id))
    logger.info('File chunks uploaded successfully')
