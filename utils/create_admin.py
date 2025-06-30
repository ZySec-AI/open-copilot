import asyncio
import os

import dotenv
from motor.motor_asyncio import AsyncIOMotorClient
from passlib.context import CryptContext

from default_jsons import default_jsons

app_context = CryptContext(schemes=["sha256_crypt", "md5_crypt", "des_crypt"], deprecated="auto")

dotenv.load_dotenv()

DB_URL = os.environ.get('DB_URL')


async def create_admin():
    client = AsyncIOMotorClient(DB_URL)
    db = client[os.environ['DB_NAME']]
    user = default_jsons.user()
    user['password'] = app_context.hash(user['password'])
    existing_user = await db.users.find_one({'email': user['email']})
    if existing_user:
        print(f"Admin user {user['email']} already exists")
        client.close()
        return
    await db.users.insert_one(user)
    print(f"Admin user {user['password']} created successfully")
    client.close()


asyncio.run(create_admin())
