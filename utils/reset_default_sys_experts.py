import asyncio
import os

import dotenv
from motor.motor_asyncio import AsyncIOMotorClient

from default_jsons import default_jsons

dotenv.load_dotenv()

DB_URL = os.environ.get('DB_URL')


async def reset_default_sys_experts():
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
        await db.experts.replace_one(
            {'_id': expert['_id']},
            expert,
            upsert=True  # creates the document if it doesn't exist
        )
        print(f"Expert {expert['expert_name']} updated or created successfully.")

    client.close()


asyncio.run(reset_default_sys_experts())
