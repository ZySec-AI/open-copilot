from typing import List

from bson import ObjectId
from fastapi import HTTPException

from app.models.mongodb.folder_model import Folder
from app.models.pydantics.folder_schema import RequestFolder, ResponseFolder
from app.utils import get_base_user


class FolderService:
    def __init__(self, database):
        self.collection = database.folders
        self.user_collection = database.users

    async def check_folder_exists(self, folder_id: str, user_id: str):
        folder = await self.collection.find_one({"_id": ObjectId(folder_id)})
        if folder and folder.get('created_by') != user_id:
            raise HTTPException(detail='User don\'t have permission to access this', status_code=404)
        if not folder:
            raise HTTPException(detail=f"Folder with id {folder_id} does not exist", status_code=404)
        folder['id'] = str(folder.pop('_id'))
        folder['created_by'] = await get_base_user(folder['created_by'], self.user_collection)
        return ResponseFolder(**folder)

    async def create_folder(self, folder: RequestFolder, user_id: str):
        folder_dict = folder.model_dump()
        folder_dict.update({"created_by": user_id})
        parent_folder = folder_dict.get("parent_folder")
        if parent_folder:
            parent_folder_obj = await self.check_folder_exists(folder_dict.get("parent_folder"), user_id)
            if not parent_folder_obj:
                raise HTTPException(
                    detail=f"Parent folder with id {folder.parent_folder} does not exist", status_code=404
                )
            parent_folder = parent_folder_obj.id
        else:
            parent_folder = None

        folder_dict.update({"parent_folder": parent_folder})
        if await self.collection.find_one({"name": folder.name, "parent_folder": parent_folder, "user_id": user_id}):
            raise HTTPException(detail=f"Folder with name {folder.name} already exists", status_code=403)
        folder = Folder(**folder_dict)
        inserted = await self.collection.insert_one(folder.model_dump())
        folder_dict = await self.collection.find_one({"_id": inserted.inserted_id})
        folder_dict['id'] = str(folder_dict.pop('_id'))
        folder_dict['created_by'] = await get_base_user(folder_dict['created_by'], self.user_collection)
        return ResponseFolder(**folder_dict)

    async def get_folders(self, user_id: str) -> List[ResponseFolder]:
        # Fetch all folders at once
        folders = await self.collection.find({'created_by': user_id}).sort("name").to_list(None)
        # Convert ObjectId to string for all folders
        for folder in folders:
            folder['id'] = str(folder.pop('_id'))
        # Build the folder hierarchy in memory
        folders_list = await self.build_folder_hierarchy(folders)
        return folders_list

    async def build_folder_hierarchy(self, folders: List[dict]) -> List[ResponseFolder]:
        # Create a lookup dictionary for folders by their IDs
        folder_dict = {folder['id']: folder for folder in folders}
        # Initialize children list for each folder
        for folder in folders:
            folder['children'] = []
        # Build the hierarchy by assigning children to their parents
        root_folders = []
        for folder in folders:
            parent_id = folder.get('parent_folder')
            if parent_id:
                parent = folder_dict.get(parent_id)
                if parent:
                    parent['children'].append(folder)
            else:
                root_folders.append(folder)

        # Convert folders to ResponseFolder instances and fetch user information
        async def convert_to_response_folder(folder: dict) -> ResponseFolder:
            if isinstance(folder['created_by'], str):
                folder['created_by'] = await get_base_user(folder['created_by'], self.user_collection)
            folder['children'] = [await convert_to_response_folder(child) for child in folder['children']]
            return ResponseFolder(**folder)

        return [await convert_to_response_folder(folder) for folder in root_folders]

    async def delete_folder(self, folder_id: str, user_id: str) -> None:
        folder = await self.check_folder_exists(folder_id, user_id)
        if not folder:
            raise HTTPException(detail=f"Folder with id {folder_id} does not exist", status_code=404)
        await self.collection.delete_one({"_id": ObjectId(folder_id)})
