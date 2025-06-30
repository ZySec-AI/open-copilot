import asyncio
import os

import dotenv
from motor.motor_asyncio import AsyncIOMotorClient

from default_jsons import default_jsons

dotenv.load_dotenv()

DB_URL = os.environ.get('DB_URL')


async def create_default_sys_experts():
    experts = [
        default_jsons.security_co_pilot(),
        default_jsons.incident_handler(),
        default_jsons.security_analyst(),
        default_jsons.my_playbooks(),
        default_jsons.privacy_expert(),
    ]

    client = AsyncIOMotorClient(DB_URL)
    db = client[os.environ['DB_NAME']]

    for expert in experts:
        existing_expert = await db.experts.find_one({"_id": expert["_id"]})
        if existing_expert:
            print(f"Expert {expert['expert_name']} already exists.")
        else:
            await db.experts.insert_one(expert)
            print(f"Expert {expert['expert_name']} created successfully.")

    client.close()


asyncio.run(create_default_sys_experts())

