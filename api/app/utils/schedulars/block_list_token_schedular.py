from datetime import datetime

from app.core.logging import LoggerConfig
from app.database import get_db

logger = LoggerConfig('block_list_token_scheduler.py').get_logger()


class TaskScheduler:

    @staticmethod
    async def run_task():

        try:
            logger.info('Checking for expired tokens...')
            db_gen = get_db()
            db = await db_gen.__anext__()
            oldest_allowed_time = datetime.now()
            collection = db.block_list_tokens
            await collection.delete_many({"expires": {"$lte": oldest_allowed_time}})
        except Exception as e:
            logger.error(f'Error in removing expired tokens: {e}')


scheduler = TaskScheduler()
