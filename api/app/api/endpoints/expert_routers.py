from typing import List, Optional

from fastapi import APIRouter, Depends, Query, UploadFile, File, Form, HTTPException
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.api.dependencies import validate_credentials
from app.core.logging import LoggerConfig
from app.database import get_db
from app.models.pydantics import Detail
from app.models.pydantics.expert_schema import ResponseExpert
from app.services.domain_services.expert_service import ExpertService
from app.utils.app_enums import ExpertType

expert_router = APIRouter(prefix='/experts')
logger = LoggerConfig(__name__).get_logger()


@expert_router.get('', response_model=List[ResponseExpert], status_code=200, tags=['Experts'])
async def get_experts(
        db: AsyncIOMotorDatabase = Depends(get_db),
        credentials: dict = Depends(validate_credentials),
):
    service = ExpertService(db)
    try:
        return await service.get_experts()
    except HTTPException as e:
        logger.error(f"Error in get_experts: {e.detail}")
        raise e
    except Exception as e:
        logger.error(f"Unexpected error in get_experts: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")


@expert_router.get('/suggested', response_model=List[ResponseExpert], status_code=200, tags=['Experts'])
async def get_suggested_experts(
        matched: str = Query(...),
        db: AsyncIOMotorDatabase = Depends(get_db),
        credentials: dict = Depends(validate_credentials),
):
    service = ExpertService(db)
    try:
        return await service.get_suggested_experts(matched)
    except HTTPException as e:
        logger.error(f"Error in get_suggested_experts: {e.detail}")
        raise e
    except Exception as e:
        logger.error(f"Unexpected error in get_suggested_experts: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")


@expert_router.post('', response_model=ResponseExpert, status_code=201, tags=['Experts'])
async def create_expert(
        expert_name: str = Form(...),
        expert_type: ExpertType = Form(ExpertType.APP),
        category: Optional[str] = Form(None),
        description: Optional[str] = Form(None),
        system_prompt: Optional[str] = Form(None),
        enable_history: Optional[bool] = Form(False),
        internet_required: Optional[bool] = Form(False),
        avatar: Optional[UploadFile] = File(None),
        start_questions: Optional[List[str]] = Form(None),
        allowed_apps: Optional[List[str]] = Form(None),
        model: Optional[str] = Form(None),
        db: AsyncIOMotorDatabase = Depends(get_db),
        credentials: dict = Depends(validate_credentials),
):
    service = ExpertService(db)

    expert_data = {
        "expert_name": expert_name,
        "type": expert_type.value,
        "categories": [category],
        "description": description,
        "system_prompt": system_prompt,
        "enable_history": enable_history,
        "internet_required": internet_required,
        "start_questions": start_questions,
        "allowed_apps": allowed_apps,
        "model": model,
    }
    try:
        return await service.create_expert(expert_data, avatar, credentials['user_id'])
    except HTTPException as e:
        logger.error(f"Error in create_expert: {e.detail}")
        raise e
    except Exception as e:
        logger.error(f"Unexpected error in create_expert: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")


@expert_router.get('/{expert_id}', response_model=ResponseExpert, status_code=200, tags=['Experts'])
async def get_expert(
        expert_id: str,
        db: AsyncIOMotorDatabase = Depends(get_db),
        credentials: dict = Depends(validate_credentials),
):
    service = ExpertService(db)
    try:
        return await service.get_expert(expert_id)
    except HTTPException as e:
        logger.error(f"Error in get_expert: {e.detail}")
        raise e
    except Exception as e:
        logger.error(f"Unexpected error in get_expert: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")


@expert_router.put('/{expert_id}', response_model=ResponseExpert, status_code=200, tags=['Experts'])
async def update_expert(
        expert_id: str,
        expert_name: str = Form(...),
        expert_type: ExpertType = Form(None),
        category: Optional[str] = Form(None),
        description: Optional[str] = Form(None),
        system_prompt: Optional[str] = Form(None),
        enable_history: Optional[bool] = Form(False),
        internet_required: Optional[bool] = Form(False),
        avatar: Optional[UploadFile] = File(None),
        start_questions: Optional[List[str]] = Form(None),
        allowed_apps: Optional[List[str]] = Form(None),
        model: Optional[str] = Form(None),
        db: AsyncIOMotorDatabase = Depends(get_db),
        credentials: dict = Depends(validate_credentials),
):
    service = ExpertService(db)

    expert_data = {
        'expert_name': expert_name,
        'type': expert_type.value if expert_type else None,
        'categories': [category],
        'description': description,
        'system_prompt': system_prompt,
        'enable_history': enable_history,
        'internet_required': internet_required,
        'start_questions': start_questions,
        'allowed_apps': allowed_apps,
        'model': model
    }

    # Remove None values from expert_data
    expert_data = {k: v for k, v in expert_data.items() if v is not None}

    try:
        return await service.update_expert(expert_id, expert_data, avatar, credentials['user_id'])
    except HTTPException as e:
        logger.error(f"Error in update_expert: {e.detail}")
        raise e
    except Exception as e:
        logger.error(f"Unexpected error in update_expert: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")


@expert_router.put('/{expert_id}/status', response_model=Detail, status_code=200, tags=['Experts'])
async def set_expert_status(
        expert_id: str,
        is_active: bool = Query(True),
        db: AsyncIOMotorDatabase = Depends(get_db),
        credentials: dict = Depends(validate_credentials),
):
    service = ExpertService(db)
    try:
        return await service.set_expert_status(expert_id, is_active)
    except HTTPException as e:
        logger.error(f"Error in set_expert_status: {e.detail}")
        raise e
    except Exception as e:
        logger.error(f"Unexpected error in set_expert_status: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")


@expert_router.delete('/{expert_id}', status_code=204, tags=['Experts'])
async def delete_expert(
        expert_id: str,
        db: AsyncIOMotorDatabase = Depends(get_db),
        credentials: dict = Depends(validate_credentials),
):
    service = ExpertService(db)
    try:
        return await service.delete_expert(expert_id)
    except HTTPException as e:
        logger.error(f"Error in delete_expert: {e.detail}")
        raise e
    except Exception as e:
        logger.error(f"Unexpected error in delete_expert: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
