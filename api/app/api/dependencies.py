from typing import Annotated

from fastapi import Depends, HTTPException, Header
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from another_fastapi_jwt_auth import AuthJWT

from app.database import get_db

oauth2_bearer = HTTPBearer()


async def validate_credentials(
        http: Annotated[HTTPAuthorizationCredentials, Depends(oauth2_bearer)],
        authorize: AuthJWT = Depends(),
        database=Depends(get_db)
):
    collection = database.block_list_tokens
    if not http or not http.credentials:
        raise HTTPException(status_code=500, detail='Access token is needed.')
    if await collection.find_one({'token': http.credentials}):
        raise HTTPException(status_code=401, detail='Invalid access token.')
    try:
        data = authorize.get_raw_jwt(http.credentials)
        return {'user_id': data['sub']}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


async def obtain_from_api_key(
        api_key: str = Header(),
        database=Depends(get_db)
):
    collection = database.users
    user = await collection.find_one({"api_keys": {"$in": [api_key]}})
    return {'user_id': str(user['_id'])}
