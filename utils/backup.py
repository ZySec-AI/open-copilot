import os
import json
from datetime import datetime
from pymongo import MongoClient
import dotenv

# Load environment variables from .env file
dotenv.load_dotenv()

# Get MongoDB URL from environment variables
DB_URL = os.environ.get('DB_URL')
DB_NAME = os.environ.get('DB_NAME')


def backup():
    # Create a backup directory with a timestamp
    backup_dir = f'./backup_{datetime.now().strftime("%Y%m%d%H%M%S")}'
    os.makedirs(backup_dir, exist_ok=True)

    # Connect to the MongoDB client
    client = MongoClient(DB_URL)
    db = client[DB_NAME]

    # Iterate over all collections in the database
    for collection_name in db.list_collection_names():
        collection = db[collection_name]
        documents = list(collection.find())

        # Serialize ObjectId and datetime fields to strings
        for doc in documents:
            if '_id' in doc:
                doc['_id'] = str(doc['_id'])
            for key, value in doc.items():
                if isinstance(value, datetime):
                    doc[key] = value.isoformat()

        # Write each collection to a JSON file
        with open(f'{backup_dir}/{collection_name}.json', 'w') as f:
            json.dump(documents, f, indent=4)

    print(f"Backup completed successfully to {backup_dir}")


# Run the backup function
backup()
