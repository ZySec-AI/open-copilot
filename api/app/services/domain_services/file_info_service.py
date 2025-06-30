import hashlib
import os
from datetime import datetime
from typing import List

from bson import ObjectId
from fastapi import File, HTTPException, BackgroundTasks

from app.models.mongodb.expert_model import Expert
from app.models.mongodb.file_info_model import FileInfo
from app.models.pydantics.file_info_schema import ResponseFileInfo, FileUploadInfo
from app.services.domain_services.category_service import CategoryService
from app.services.domain_services.folder_service import FolderService
from app.utils import get_base_user
from app.utils.schedulars.upload_chunks_schedular import start_uploading_file_chunks


class LocalStorageService:
    def __init__(self, base_folder: str = 'app/assets/files'):
        self.base_folder = base_folder

    async def save_file(self, file_name: str, contents: bytes) -> str:
        full_path = os.path.join(self.base_folder, file_name)
        os.makedirs(os.path.dirname(full_path), exist_ok=True)
        with open(full_path, 'wb') as f:
            f.write(contents)
        return full_path

    def get_file_base_path(self) -> str:
        return os.path.join(self.base_folder)


class FileInfoService:
    MAX_FILE_SIZE = 8 * 1024 * 1024  # 8 MB

    def __init__(self, database):
        self.database = database
        self.collection = database.files
        self.user_collection = database.users
        self.storage_service = LocalStorageService()
        self.folder_service = FolderService(database)
        self.category_service = CategoryService(database)

    async def retrieve_categories(self, categories: List[str]):
        return [
            category.id
            for category in await self.category_service.retrieve_or_create_categories(categories)
        ]

    async def upload_file(
            self, description: str, categories: List[str],
            tags: List[str], folder_id: str, file: File,
            user_id: str, background_tasks: BackgroundTasks
    ):
        if file.size > self.MAX_FILE_SIZE:
            raise HTTPException(status_code=413, detail='File size exceeds limit of 8 MB.')
        contents = await file.read()
        sha256_hash = hashlib.sha256(contents+bytes.fromhex(user_id)).hexdigest()

        if folder_id:
            # Verify folder existence
            await self.folder_service.check_folder_exists(folder_id, user_id)

        if not categories:
            categories = await self.retrieve_categories(['Other'])
        else:
            categories = await self.retrieve_categories(categories)

        # Check if sha256_hash already exists
        existing_file = await self.collection.find_one({'sha256_hash': sha256_hash})
        if not existing_file:
            # Save the file
            file_path = self.storage_service.get_file_base_path()
        else:
            file_path = existing_file['path']

        file_info = {
            'filename': file.filename,
            'description': description,
            'uploaded_first_time': datetime.utcnow(),
            'uploaded_by_user_id': user_id,
            'sha256_hash': sha256_hash,
            'path': file_path,
            'file_size': file.size,
            'file_ext': os.path.splitext(file.filename)[1],
            'folder': folder_id,
            'tags': tags,
            'categories': categories
        }
        file_info = FileInfo(**file_info)
        inserter = await self.collection.insert_one(file_info.model_dump())
        obj_id = inserter.inserted_id
        if not existing_file:
            file_path = f'{file_path}/{str(obj_id)}'
            await self.storage_service.save_file(str(obj_id), contents)
            await self.collection.update_one({'_id': obj_id}, {'$set': {'path': file_path}})

        background_tasks.add_task(start_uploading_file_chunks, file_path, str(obj_id))

        return await self.get_file_info(inserter.inserted_id)

    async def update_file_metadata(self, file_id: str, file_info: FileUploadInfo):
        file = await self.collection.find_one({'_id': ObjectId(file_id)})
        if not file:
            raise HTTPException(status_code=404, detail='File not found.')
        categories = await self.retrieve_categories(file_info.categories)
        new_file_dict = file_info.model_dump()
        new_file_dict['categories'] = categories
        await self.collection.update_one({'_id': ObjectId(file_id)}, {'$set': new_file_dict})
        return await self.get_file_info(ObjectId(file_id))

    async def retrieve_file_path(self, file_id: str, user_id: str):
        file = await self.collection.find_one({'_id': ObjectId(file_id)})
        if not file:
            raise HTTPException(status_code=404, detail='File not found.')
        if file['uploaded_by_user_id'] != user_id:
            raise HTTPException(status_code=403, detail='Forbidden')
        return file['filename'], file['path']

    async def move_file_from_folder(self, file_id: str, folder_id: str, user_id: str):
        file = await self.collection.find_one({'_id': ObjectId(file_id)})
        if not file:
            raise HTTPException(status_code=404, detail='File not found.')
        folder_obj = await self.folder_service.check_folder_exists(folder_id, user_id)
        await self.collection.update_one({'_id': ObjectId(file_id)}, {'$set': {'folder': folder_obj.id}})
        return await self.get_file_info(ObjectId(file_id))

    async def delete_file(self, file_id: str, user_id: str):
        file = await self.collection.find_one({'_id': ObjectId(file_id)})
        if not file:
            raise HTTPException(status_code=404, detail='File not found.')
        if file['uploaded_by_user_id'] != user_id:
            raise HTTPException(status_code=403, detail='Forbidden')
        await self.collection.update_one({'_id': ObjectId(file_id)}, {'$set': {'deleted': True}})
        # TODO
        return await self.get_file_info(ObjectId(file_id))

    async def get_file_info(self, file_id: ObjectId):
        file = await self.collection.find_one({'_id': file_id})
        if not file:
            raise HTTPException(status_code=404, detail='File not found.')
        if file.get('folder'):
            folder_obj = await self.folder_service.check_folder_exists(file['folder'], file['uploaded_by_user_id'])
            file['folder'] = folder_obj
        else:
            file['folder'] = None
        categories_obj = await self.category_service.retrieve_or_create_categories(file['categories'])
        file['id'] = str(file.pop('_id'))
        file['uploaded_by'] = await get_base_user(file['uploaded_by_user_id'], self.user_collection)

        file['categories'] = categories_obj
        return ResponseFileInfo(**file)

    async def get_all_files(self, folder_id: str, user_id: str, page: int, limit: int) -> list:
        skip = (page - 1) * limit
        if folder_id:
            files = self.collection.find(
                {'uploaded_by_user_id': user_id, 'folder': folder_id, 'deleted': False}
            ).skip(skip).limit(limit)
        else:
            files = self.collection.find(
                {'uploaded_by_user_id': user_id, 'folder': None, 'deleted': False}
            ).skip(skip).limit(limit)
        files_list = []
        async for file in files:
            files_list.append(await self.get_file_info(file['_id']))
        return files_list

    async def export_file(self, file_id: str, user_id: str):
        expert_collection = self.database.experts
        file = await self.collection.find_one({'_id': ObjectId(file_id)})
        if not file:
            raise HTTPException(status_code=404, detail='File not found.')
        if file['uploaded_by_user_id'] != user_id:
            raise HTTPException(status_code=403, detail='Forbidden')

        if await expert_collection.find_one({"files": {"$eq": [file_id]}}):
            raise HTTPException(status_code=400, detail='File already exported.')

        file_expert_data = {
            'expert_name': file['filename'].split('.')[0].capitalize(),
            'type': 'file',
            'files': [file_id],
            'description': file['description'],
        }

        file_expert = Expert(**file_expert_data)
        inserter = await expert_collection.insert_one(file_expert.model_dump())
        expert = await expert_collection.find_one({'_id': inserter.inserted_id})
        expert['id'] = str(expert.pop('_id'))
        return expert
