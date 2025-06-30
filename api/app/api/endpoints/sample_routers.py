import time
import asyncio

from fastapi import APIRouter, BackgroundTasks

from app.core.logging import LoggerConfig

sample_router = APIRouter()

logger = LoggerConfig('sample_router.py').get_logger()


@sample_router.get("/sample", status_code=200, tags=['Sample'])
async def sample():
    logger.info('Hello World')
    return {'message': 'Hello World'}


# @sample_router.post('/create_applications', status_code=201, tags=['Sample'])
# async def create_applications(
#         applications: List[Application],
#         db: AsyncIOMotorDatabase = Depends(get_db)
# ):
#     applications_collection = db.applications
#     for application in applications:
#         await applications_collection.insert_one(application.dict())
#     applications = await applications_collection.find().to_list(1000)
#     for application in applications:
#         application['id'] = str(application['_id'])
#     return applications
#
#
async def wait_for():
    time.sleep(5)


def delay_5_seconds():
    asyncio.run(wait_for())

    print('5 seconds delay')


@sample_router.get("/delay", status_code=200, tags=['Sample'])
async def delay(background_tasks: BackgroundTasks):
    background_tasks.add_task(delay_5_seconds)
    return {'message': '5 seconds delay'}
