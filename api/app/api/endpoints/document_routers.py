# from fastapi import APIRouter, Request, HTTPException
#
# from app.core.logging import LoggerConfig
# from app.models.pydantics.content_item_schema import RequestContentItem
# from app.services.domain_services.document_open_search_service import DocumentOpenSearchService
#
# document_router = APIRouter(prefix='/documents')
#
# logger = LoggerConfig(__name__).get_logger()
#
# open_search_service = DocumentOpenSearchService()
# index_name = 'documents'
# open_search_service.create_index_if_not_exists(index_name)
#
#
# @document_router.get("", status_code=200, tags=['Documents'])
# async def retrieve_documents(
#         request: Request,
# ):
#     try:
#         logger.info(f'{request.url.path} - Retrieve Documents called')
#
#         return open_search_service.get_all_documents(index_name)
#     except HTTPException as e:
#         logger.info(f'{request.url.path} - {e}')
#         raise e
#     except Exception as e:
#         logger.error(f'{request.url.path} - {str(e)}')
#
#
# @document_router.get('/search', status_code=200, tags=['Documents'])
# async def search_documents(
#         query: str,
#         request: Request,
# ):
#     try:
#         logger.info(f'{request.url.path} - Search Documents called')
#
#         return open_search_service.search_documents(index_name, query)
#     except HTTPException as e:
#         logger.info(f'{request.url.path} - {e}')
#         raise e
#     except Exception as e:
#         logger.error(f'{request.url.path} - {str(e)}')
#
#
# @document_router.post("", status_code=201, tags=['Documents'])
# async def create_document(
#         request: Request,
#         content_item: RequestContentItem,
# ):
#     try:
#         logger.info(f'{request.url.path} - Create Document called')
#
#         return open_search_service.create_document(index_name, content_item.dict())
#     except HTTPException as e:
#         logger.info(f'{request.url.path} - {e}')
#         raise e
#     except Exception as e:
#         logger.error(f'{request.url.path} - {str(e)}')
#
#
# @document_router.get(
#     "/{document_id}", status_code=200, tags=['Documents']
# )
# async def retrieve_content_item(
#         request: Request,
#         document_id: str,
# ):
#     try:
#         logger.info(f'{request.url.path} - Retrieve Content Item called')
#
#         return open_search_service.get_document(index_name, document_id)
#     except HTTPException as e:
#         logger.info(f'{request.url.path} - {e}')
#         raise e
#     except Exception as e:
#         logger.error(f'{request.url.path} - {str(e)}')
#
#
# @document_router.put(
#     "/{document_id}", status_code=200, tags=['Documents']
# )
# async def update_document(
#         request: Request,
#         document_id: str,
#         document: RequestContentItem,
# ):
#     try:
#         logger.info(f'{request.url.path} - Update Documents called')
#
#         return open_search_service.update_document(index_name, document_id, document.dict())
#     except HTTPException as e:
#         logger.info(f'{request.url.path} - {e}')
#         raise e
#     except Exception as e:
#         logger.error(f'{request.url.path} - {str(e)}')
#
#
# @document_router.delete(
#     "/{document_id}", status_code=204, tags=['Documents']
# )
# async def delete_document(
#         request: Request,
#         content_item_id: str,
# ):
#     try:
#         logger.info(f'{request.url.path} - Delete Documents called')
#
#         open_search_service.delete_document(index_name, content_item_id)
#     except HTTPException as e:
#         logger.info(f'{request.url.path} - {e}')
#         raise e
#     except Exception as e:
#         logger.error(f'{request.url.path} - {str(e)}')
