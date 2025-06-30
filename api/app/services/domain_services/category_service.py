from typing import List

from bson import ObjectId

from app.models.mongodb.category_model import Category
from app.models.pydantics.category_schema import ResponseCategory


class CategoryService:
    def __init__(self, database):
        self.collection = database.categories

    async def retrieve_or_create_categories(self, categories: List[str]) -> List[ResponseCategory]:
        """
        Retrieve or create categories from a list of category names.
        :param categories: List of category names.
        :return: List of category objects.
        """
        if not categories:
            return []
        category_objects = []
        for category in categories:
            if ObjectId.is_valid(category):
                category_dict = await self.collection.find_one({"_id": ObjectId(category)})
                if not category_dict:
                    # raise HTTPException(status_code=404, detail=f'Category with id {category} not found')
                    category_dict = {
                        'id': category,
                        'name': None
                    }
                    category_objects.append(ResponseCategory(**category_dict))
                else:
                    category_dict['id'] = str(category_dict.pop('_id'))
                    category_objects.append(ResponseCategory(**category_dict))
            else:
                category_dict = await self.collection.find_one({"name": category})
                if category_dict:
                    category_dict['id'] = str(category_dict.pop('_id'))
                    category_objects.append(ResponseCategory(**category_dict))
                else:
                    category = Category(name=category)
                    inserted = await self.collection.insert_one(category.model_dump())
                    category = await self.collection.find_one({"_id": inserted.inserted_id})
                    category['id'] = str(category.pop('_id'))
                    category_objects.append(ResponseCategory(**category))
        return category_objects

    async def create_category(self, category: Category):
        category_dict = await self.collection.find_one({"name": category.name})
        if category_dict:
            raise Exception(f'Category with name {category_dict["name"]} already exists')
        inserted = await self.collection.insert_one(category.model_dump())
        category = await self.collection.find_one({"_id": inserted.inserted_id})
        category['id'] = str(category.pop('_id'))
        return ResponseCategory(**category)

    async def get_categories(self, page: int, limit: int):
        skip = (page - 1) * limit

        categories = self.collection.find({'can_visible': True}).skip(skip).limit(limit)
        categories_list = []
        async for category in categories:
            category['id'] = str(category.pop('_id'))
            categories_list.append(ResponseCategory(**category))
        return categories_list

    async def get_invisible_categories(self):
        categories = self.collection.find({'can_visible': False})
        categories_list = []
        async for category in categories:
            category['id'] = str(category.pop('_id'))
            categories_list.append(ResponseCategory(**category))
        return categories_list

    async def update_category(self, category_id: str, category: Category):
        category_dict = category.model_dump(exclude_unset=True)
        await self.collection.update_one({'_id': ObjectId(category_id)}, {'$set': category_dict})
        category = await self.collection.find_one({'_id': ObjectId(category_id)})
        category['id'] = str(category.pop('_id'))
        return ResponseCategory(**category)

    async def delete_category(self, category_id: str):
        await self.collection.delete_one({'_id': ObjectId(category_id)})
