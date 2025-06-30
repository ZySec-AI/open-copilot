from bson import ObjectId


async def get_base_user(user_id, user_collection):
    user_data = await user_collection.find_one({'_id': ObjectId(user_id)})
    if not user_data:
        return {
            'id': user_id,
            'full_name': None,
            'email': None,
        }
    return {
        'id': str(user_data['_id']),
        'full_name': user_data.get('full_name', None),
        'email': user_data.get('email', None),
    }
