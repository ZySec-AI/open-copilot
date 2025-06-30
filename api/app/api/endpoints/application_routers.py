from typing import List

from fastapi import APIRouter, Request, Depends

from app.api.dependencies import validate_credentials
from app.core.logging import LoggerConfig
from app.database import get_db
from app.models.pydantics.application_schema import Application
from app.services.domain_services.application_service import ApplicationService

logger = LoggerConfig(__name__).get_logger()

application_router = APIRouter()


@application_router.get("/applications", response_model=List[Application], status_code=200, tags=['Applications'])
async def retrieve_application(
        request: Request,
        database=Depends(get_db),
        credentials: dict = Depends(validate_credentials)
):
    try:
        logger.info(f'{request.url.path} - Retrieve Applications')
        service = ApplicationService(database)
        return await service.retrieve_application()
    except Exception as e:
        logger.error(str(e))


@application_router.get("/tags", response_model=List[str], status_code=200, tags=['Applications'])
async def retrieve_tags(
        request: Request,
        database=Depends(get_db),
        credentials: dict = Depends(validate_credentials)
):
    try:
        logger.info(f'{request.url.path} - Retrieve Tags')
        sample_tags = [
            "authentication",
            "authorization",
            "encryption",
            "firewall",
            "intrusion_detection",
            "malware_analysis",
            "network_security",
            "penetration_testing",
            "security_monitoring",
            "vulnerability_assessment"
        ]
        return sample_tags
    except Exception as e:
        logger.error(str(e))
