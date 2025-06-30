from datetime import datetime
from typing import List

import bleach
from bson import ObjectId
from fastapi import HTTPException
from fastapi.background import BackgroundTasks

from app.core.config import config
from app.models.mongodb.content_item_model import ContentItem
from app.models.pydantics.content_item_schema import ResponseContentItem, RequestContentItem
from app.services.ai_services.llm_service import LLMService
from app.services.domain_services.category_service import CategoryService
from app.utils.app_enums import ContentItemType
from app.utils.schedulars.upload_content_item_schedular import start_uploading_content_item, start_deleting_content_item


class ContentItemService:
    def __init__(self, database):
        self.database = database
        self.collection = database.content_items
        self.category_service = CategoryService(database)

    async def fill_user_info(self, user_id):
        if not user_id:
            return None
        user = await self.database.users.find_one({'_id': ObjectId(user_id)})
        if not user:
            return None
        return {
            'id': str(user['_id']),
            'email': user['email'],
            'full_name': user['full_name']
        }

    async def fill_category_info(self, category_id):
        if not category_id:
            return None
        collection = self.database.categories
        category = await collection.find_one({'_id': ObjectId(category_id)})
        if not category:
            return None
        return {
            'id': str(category['_id']),
            'name': category['name'],
            'description': category['description']
        }

    async def create_content_item(
            self, content_item_data: RequestContentItem,
            user_id: str, background_tasks: BackgroundTasks
    ) -> ResponseContentItem:
        if not content_item_data.category:
            raise HTTPException(status_code=400, detail='Category is required')
        if content_item_data.content_type in [ContentItemType.PLAY_BOOK.value, ContentItemType.NEWS.value, None]:
            raise HTTPException(status_code=400, detail='Content type is required')

        categories = await self.category_service.retrieve_or_create_categories([content_item_data.category])
        content_item_data.category = categories[0].id
        if content_item_data.content:
            content_item_data.content = bleach.clean(content_item_data.content)
        if not content_item_data.description:
            content_item_data.description = self.update_description(content_item_data.content)
        content_item_data.content_type = (
            content_item_data.content_type.value) if content_item_data.content_type else None
        content_item = ContentItem(**content_item_data.model_dump())
        content_item.created_by = user_id

        result = await self.collection.insert_one(content_item.model_dump())
        if content_item_data.content:
            background_tasks.add_task(start_uploading_content_item, str(result.inserted_id), content_item_data.content)
        return await self.retrieve_content_item(str(result.inserted_id))

    async def retrieve_content_items(
            self, content_type: ContentItemType,
            page: int, limit: int
    ) -> List[ResponseContentItem]:
        skip = (page - 1) * limit
        content_items = await self.collection.find({
            'content_type': content_type.value if content_type else None
        }).sort('created_at', -1).skip(skip).limit(limit).to_list(None)
        result = []
        for pb in content_items:
            content_item_info = {**pb, 'id': str(pb.pop('_id', None)),
                                 'created_by': await self.fill_user_info(pb.get('created_by')),
                                 'updated_by': await self.fill_user_info(pb.get('updated_by')),
                                 'category': await self.fill_category_info(pb.get('category'))}
            result.append(ResponseContentItem(**content_item_info))
        return result

    async def retrieve_content_items_by_category(
            self, content_type: ContentItemType,
            category_id: str, page: int, limit: int
    ) -> List[ResponseContentItem]:
        skip = (page - 1) * limit
        try:
            content_items = await self.collection.find({
                'category': category_id,
                'content_type': content_type.value if content_type else None
            }).sort('created_at', -1).skip(skip).limit(limit).to_list(None)
            result = []
            for pb in content_items:
                content_item_info = {**pb, 'id': str(pb.pop('_id', None)),
                                     'created_by': await self.fill_user_info(pb.get('created_by')),
                                     'updated_by': await self.fill_user_info(pb.get('updated_by')),
                                     'category': await self.fill_category_info(pb.get('category'))}
                result.append(ResponseContentItem(**content_item_info))
            return result
        except Exception as e:
            raise HTTPException(status_code=400, detail=str(e))

    async def retrieve_content_item(self, content_item_id: str) -> ResponseContentItem:
        content_item = await self._find_content_item(content_item_id)
        return ResponseContentItem(**{
            **content_item,
            'id': str(content_item.pop('_id')),
            'created_by': await self.fill_user_info(content_item.get('created_by')),
            'updated_by': await self.fill_user_info(content_item.get('updated_by')),
            'category': await self.fill_category_info(content_item.get('category'))
        })

    async def update_content_item(
            self, content_item_id: str,
            content_item_data: RequestContentItem,
            user_id: str, background_tasks: BackgroundTasks
    ) -> ResponseContentItem:
        content_item = await self._find_content_item(content_item_id)
        update_data = content_item_data.model_dump(exclude_unset=True)
        if update_data.get('content'):
            update_data['content'] = bleach.clean(update_data['content'])
        update_data['updated_at'] = datetime.now()
        update_data['updated_by'] = user_id
        if update_data.get('content_type'):
            update_data['content_type'] = (
                content_item_data.content_type.value
            ) if content_item_data.content_type else None

        if 'category' in update_data:
            categories = await self.category_service.retrieve_or_create_categories([update_data['category']])
            update_data['category'] = categories[0].id

        if not (content_item.get('description') or update_data.get('description')):
            update_data['description'] = self.update_description(update_data.get('content'))

        await self.collection.update_one({'_id': ObjectId(content_item_id)}, {'$set': update_data})
        if update_data.get('content') and update_data.get('content') != content_item.get('content'):
            background_tasks.add_task(start_deleting_content_item, content_item_id, True, None)
        return await self.retrieve_content_item(content_item_id)

    async def delete_content_item(self, content_item_id: str, background_tasks: BackgroundTasks):
        await self._find_content_item(content_item_id)
        await self.collection.delete_one({'_id': ObjectId(content_item_id)})
        background_tasks.add_task(start_deleting_content_item, content_item_id, False, None)
        return None

    async def _find_content_item(self, content_item_id: str):
        if not ObjectId.is_valid(content_item_id):
            raise HTTPException(status_code=400, detail='Invalid content_item id')
        content_item = await self.collection.find_one({'_id': ObjectId(content_item_id)})
        if not content_item:
            raise HTTPException(status_code=404, detail='Content Item not found')
        return content_item

    @staticmethod
    def update_description(content):
        if not content:
            return
        split_text_list = content.split()
        if content and len(split_text_list) > 100:
            prompt = ('Please provide sub-heading strictly in one line from'
                      'this data {}'.format(split_text_list[:100]))
            service = LLMService(config.default_model)

            return service.load_model(prompt)
        else:
            return
