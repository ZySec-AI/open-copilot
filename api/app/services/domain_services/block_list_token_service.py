from app.models.mongodb.block_list_token_model import BlockListToken


class BlockListTokenService:
    def __init__(self, db) -> None:
        self.collection = db.block_list_tokens

    async def is_token_block_listed(self, token):
        block_list_token = await self.collection.find_one({"token": token})
        return block_list_token

    async def add_token_to_block_list(self, token, expires):
        block_list_token = BlockListToken(token=token, expires=expires)
        self.collection.insert_one(block_list_token.model_dump())
        return {'message': 'Token added to block list.'}
