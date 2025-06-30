import asyncio

from app.core.logging import LoggerConfig
from app.database import get_db
from app.services.ai_services.text_embedding_service import TextEmbeddingService
from app.services.domain_services.graph_service import GraphService

logger = LoggerConfig(__name__).get_logger()


def start_uploading_content_item(content_item_id: str, content: str):
    logger.info('Starting uploading content_item description...')
    db_gen = get_db()
    db = asyncio.run(db_gen.__anext__())
    langchain_service = TextEmbeddingService(db)
    asyncio.run(langchain_service.index_content_item(content_item_id))
    try:
        graph_service = GraphService()
        graph_service.make_nodes(content)
    except Exception as e:
        logger.error(f'Error in making nodes: {e}')
    logger.info('Content Item uploaded successfully')


def start_deleting_content_item(content_item_id: str, is_update: bool = False, content: str = None):
    logger.info('Starting deleting content_item description...')
    db_gen = get_db()
    db = asyncio.run(db_gen.__anext__())
    langchain_service = TextEmbeddingService(db)
    asyncio.run(langchain_service.delete_content_item(content_item_id))
    logger.info('Content Item deleted successfully')
    if is_update:
        start_uploading_content_item(content_item_id, content)
