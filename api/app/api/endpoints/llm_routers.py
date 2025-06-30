from typing import Optional

from fastapi import APIRouter, Request, HTTPException, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.api.dependencies import validate_credentials, obtain_from_api_key
from app.core.config import config
from app.core.logging import LoggerConfig
from app.database import get_db
from app.models.pydantics.expert_schema import AppModel
from app.models.pydantics.message_schema import ResponseMessage
from app.services.ai_services.llm_service import LLMService
from app.services.domain_services.expert_service import ExpertService

logger = LoggerConfig(__name__).get_logger()

llm_router = APIRouter()


@llm_router.get("/lite_llm", status_code=200, tags=['LiteLLM'])
async def retrieve_llm_response(
        request: Request,
        prompt: str,
):
    try:
        logger.info(f'{request.url.path} - Retrieve LiteLLM called')

        service = LLMService(config.default_model)
        return service.load_model(prompt)
    except HTTPException as e:
        logger.info(f'{request.url.path} - {e}')
        raise e
    except Exception as e:
        logger.error(f'{request.url.path} - {str(e)}')
        raise HTTPException(status_code=400, detail=str(e))


@llm_router.post("/prompt_chat", response_model=Optional[ResponseMessage], status_code=200, tags=['LiteLLM'])
async def prompt_chat(
        request: Request,
        app_model: AppModel,
        database: AsyncIOMotorDatabase = Depends(get_db),
        credentials: dict = Depends(validate_credentials)
):
    try:
        logger.info(f'{request.url.path} - Retrieve OpenAI called')

        expert_service = ExpertService(database)
        return await expert_service.generate_response(app_model, credentials['user_id'])
    except HTTPException as e:
        logger.info(f'{request.url.path} - {e}')
        raise e
    except Exception as e:
        logger.error(f'{request.url.path} - {str(e)}')
        raise HTTPException(status_code=400, detail=str(e))


@llm_router.post("/prompt_expert_service", response_model=Optional[ResponseMessage], status_code=200, tags=['LiteLLM'])
async def prompt_expert_service(
        request: Request,
        app_model: AppModel,
        database: AsyncIOMotorDatabase = Depends(get_db),
        credentials: dict = Depends(obtain_from_api_key)
):
    try:
        logger.info(f'{request.url.path} - Retrieve OpenAI called')

        expert_service = ExpertService(database)
        return await expert_service.generate_response_from_external_source(app_model, credentials['user_id'])
    except HTTPException as e:
        logger.info(f'{request.url.path} - {e}')
        raise e
    except Exception as e:
        logger.error(f'{request.url.path} - {str(e)}')
        raise HTTPException(status_code=400, detail=str(e))
