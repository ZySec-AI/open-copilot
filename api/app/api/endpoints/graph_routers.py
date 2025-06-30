from typing import Dict, Any

from fastapi import APIRouter, Request, HTTPException, Depends
from neo4j import Session

from app.core.logging import LoggerConfig
from app.database import graph_db
from app.services.domain_services.graph_service import GraphService

logger = LoggerConfig(__name__).get_logger()

graph_routers = APIRouter(prefix='/knowledge_graph', tags=['Neo4j'])


@graph_routers.get('/nodes')
async def get_all_nodes(
        request: Request,
        db: Session = Depends(graph_db)
):
    logger.info(f'{request.url.path} - Retrieve all nodes called')
    try:
        service = GraphService(db)
        return service.get_all_nodes()
    except HTTPException as e:
        logger.info(f'{request.url.path} - {e}')
        raise e
    except Exception as e:
        logger.error(f'{request.url.path} - {str(e)}')
        raise HTTPException(status_code=400, detail=str(e))


@graph_routers.post('/nodes')
async def create_node(
        request: Request,
        data: Dict[str, Any],
        db: Session = Depends(graph_db)
):
    logger.info(f'{request.url.path} - Create node called')
    try:

        service = GraphService(db)
        return service.create_node(data)
    except HTTPException as e:
        logger.info(f'{request.url.path} - {e}')
        raise e
    except Exception as e:
        logger.error(f'{request.url.path} - {str(e)}')
        raise HTTPException(status_code=400, detail=str(e))


@graph_routers.put('/nodes/{element_id}')
async def update_node(
        request: Request,
        element_id: str,
        data: Dict[str, Any],
        db: Session = Depends(graph_db)
):
    logger.info(f'{request.url.path} - Update node called')
    try:

        service = GraphService(db)
        return service.update_node(element_id, data)
    except HTTPException as e:
        logger.info(f'{request.url.path} - {e}')
        raise e
    except Exception as e:
        logger.error(f'{request.url.path} - {str(e)}')
        raise HTTPException(status_code=400, detail=str(e))


@graph_routers.delete('/nodes/{element_id}')
async def delete_node(
        request: Request,
        element_id: str,
        db: Session = Depends(graph_db)
):
    logger.info(f'{request.url.path} - Delete node called')
    try:
        service = GraphService(db)
        return service.delete_node(element_id)
    except HTTPException as e:
        logger.info(f'{request.url.path} - {e}')
        raise e
    except Exception as e:
        logger.error(f'{request.url.path} - {str(e)}')
        raise HTTPException(status_code=400, detail=str(e))


@graph_routers.post('/relationships')
async def create_relationship(
        request: Request,
        data: Dict[str, Any],
        db: Session = Depends(graph_db)
):
    logger.info(f'{request.url.path} - Create relationship called')
    try:
        service = GraphService(db)
        return service.create_relationship(data)
    except HTTPException as e:
        logger.info(f'{request.url.path} - {e}')
        raise e
    except Exception as e:
        logger.error(f'{request.url.path} - {str(e)}')
        raise HTTPException(status_code=400, detail=str(e))


@graph_routers.post('/from_text')
async def add_nodes_from_text(
        request: Request,
        text_data: str,
        db: Session = Depends(graph_db)
):
    logger.info(f'{request.url.path} - Add nodes from text called')
    try:
        service = GraphService(db)
        return service.make_nodes(text_data)
    except HTTPException as e:
        logger.info(f'{request.url.path} - {e}')
        raise e
    except Exception as e:
        logger.error(f'{request.url.path} - {str(e)}')
        raise HTTPException(status_code=400, detail=str(e))


@graph_routers.post('/search_query')
async def search_query(
        request: Request,
        query: str,
        db: Session = Depends(graph_db)
):
    logger.info(f'{request.url.path} - Search query called')
    try:
        service = GraphService(db)
        return service.search_query(query)
    except HTTPException as e:
        logger.info(f'{request.url.path} - {e}')
        raise e
    except Exception as e:
        logger.error(f'{request.url.path} - {str(e)}')
        raise HTTPException(status_code=400, detail=str(e))
