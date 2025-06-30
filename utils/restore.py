import os
import json
import argparse
from pymongo import MongoClient
from bson import ObjectId
from datetime import datetime
import dotenv

# Load environment variables from .env file
dotenv.load_dotenv()

# Get MongoDB URL and DB name from environment variables
DB_URL = os.environ.get('DB_URL')
DB_NAME = os.environ.get('DB_NAME')


def restore(backup_dir):
    # Connect to the MongoDB client
    client = MongoClient(DB_URL)
    db = client[DB_NAME]

    # Iterate over all JSON files in the backup directory
    for filename in os.listdir(backup_dir):
        if filename.endswith('.json'):
            collection_name = filename.split('.json')[0]
            collection = db[collection_name]

            # Drop the existing collection to avoid duplicate entries
            collection.drop()

            # Read the JSON file
            with open(os.path.join(backup_dir, filename), 'r') as f:
                documents = json.load(f)

                # Deserialize ObjectId and datetime fields
                for doc in documents:
                    if '_id' in doc:
                        doc['_id'] = ObjectId(doc['_id'])
                    for key, value in doc.items():
                        if isinstance(value, str) and value.endswith('Z') and 'T' in value:
                            try:
                                doc[key] = datetime.fromisoformat(value.replace('Z', '+00:00'))
                            except ValueError:
                                pass  # Not a datetime string, continue

                # Insert documents into the collection
                if documents:
                    collection.insert_many(documents)
                    print(f"Restored {len(documents)} documents to collection {collection_name}")
                else:
                    print(f"No documents to restore in collection {collection_name}")

    print(f"Restore completed successfully from {backup_dir}")


# Setup argument parser
parser = argparse.ArgumentParser(description='Restore MongoDB from JSON backup files.')
parser.add_argument('backup_dir', type=str, help='Path to the backup directory')
args = parser.parse_args()

# Run the restore function with the provided backup directory
restore(args.backup_dir)
