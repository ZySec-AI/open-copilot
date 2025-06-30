from fastapi import APIRouter, Request
from app.core.logging import LoggerConfig
from app.core.config import config

logger = LoggerConfig(__name__).get_logger()

config_router = APIRouter(prefix='/configs', tags=['Configs'])


@config_router.get('', )
async def get_configs(request: Request):
    return {
        'enable_internet': config.enable_internet,
        'enable_cyber_news': config.enable_cyber_news,
        'enable_fetch_content': config.enable_fetch_content,
        'mode': config.mode,
        'private_base_url': config.private_base_url,
        'private_secret_key': config.private_secret_key,
        'private_open_ai_key': config.private_open_ai_key,
        'private_model': config.private_model
    }


@config_router.post('', )
async def update_configs(request: Request, data: dict):
    enable_internet = data.get('enable_internet', None)
    enable_cyber_news = data.get('enable_cyber_news', None)
    enable_fetch_content = data.get('enable_fetch_content', None)
    private_base_url = data.get('private_base_url', None)
    private_secret_key = data.get('private_secret_key', None)
    private_open_ai_key = data.get('private_open_ai_key', None)
    private_model = data.get('private_model', None)
    mode = data.get('mode', None)
    if enable_internet is not None:
        config.set('ENABLE_INTERNET', enable_internet)
    if enable_cyber_news is not None:
        config.set('ENABLE_CYBER_NEWS', enable_cyber_news)
    if enable_fetch_content is not None:
        config.set('ENABLE_FETCH_CONTENT', enable_fetch_content)
    if mode is not None:
        config.set('MODE', mode)
    if private_base_url is not None:
        config.set('PRIVATE_BASE_URL', private_base_url)
    if private_secret_key is not None:
        config.set('PRIVATE_SECRET_KEY', private_secret_key)
    if private_open_ai_key is not None:
        config.set('PRIVATE_OPENAI_KEY', private_open_ai_key)
    if private_model is not None:
        config.set('PRIVATE_MODEL', private_model)
    return {
        'enable_internet': config.enable_internet,
        'enable_cyber_news': config.enable_cyber_news,
        'enable_fetch_content': config.enable_fetch_content,
        'mode': config.mode,
        'private_base_url': config.private_base_url,
        'private_secret_key': config.private_secret_key,
        'private_open_ai_key': config.private_open_ai_key,
        'private_model': config.private_model
    }
