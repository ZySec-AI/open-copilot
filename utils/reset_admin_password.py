import os
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import dotenv
from passlib.context import CryptContext

from utils.default_jsons import default_jsons

app_context = CryptContext(schemes=["sha256_crypt", "md5_crypt", "des_crypt"], deprecated="auto")
dotenv.load_dotenv()

DB_URL = os.environ.get('DB_URL')


async def reset_admin_password():
    client = AsyncIOMotorClient(DB_URL)
    db = client[os.environ['DB_NAME']]
    user = default_jsons.user()
    result = await db.users.update_one(
        {'email': user['email']},
        {'set': {'password': user['password']}}
    )
    if result.modified_count > 0:
        print(f"Password for admin user {user['username']} reset successfully")
    else:
        print(f"Admin user {user['username']} not found")
    client.close()
