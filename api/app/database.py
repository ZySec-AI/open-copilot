import os

from motor import motor_asyncio
from app.core.config import config
import dotenv
from neo4j import GraphDatabase, Session

dotenv.load_dotenv()

DB_URL = os.environ.get('DB_URL')


async def get_db() -> motor_asyncio.AsyncIOMotorDatabase:
    client = motor_asyncio.AsyncIOMotorClient(DB_URL)

    database = client[config.db_name]
    try:
        yield database
    finally:
        client.close()


NEO4J_URI = os.environ.get('NEO4J_URI')
NEO4J_USERNAME = os.environ.get('NEO4J_USERNAME')
NEO4J_PASSWORD = os.environ.get('NEO4J_PASSWORD')


async def graph_db() -> Session:
    driver = GraphDatabase.driver(NEO4J_URI, auth=(NEO4J_USERNAME, NEO4J_PASSWORD))
    try:
        yield driver.session()
    finally:
        driver.close()
