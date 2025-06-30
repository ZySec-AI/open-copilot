# import os
# from datetime import datetime
#
# from opensearchpy import OpenSearch
#
# from app.utils.open_search_parser import parse_response
#
#
# class DocumentOpenSearchService:
#     def __init__(
#             self, host=os.environ['OPENSEARCH_HOST'],
#             port=os.environ['OPENSEARCH_PORT'],
#             auth=(
#                     os.environ['OPENSEARCH_USERNAME'],
#                     os.environ['OPENSEARCH_PASSWORD']
#             )
#     ):
#         self.client = OpenSearch(
#             hosts=[{'host': host, 'port': port}],
#             http_auth=auth,
#             http_compress=True,
#             use_ssl=True,
#             verify_certs=False,
#             ssl_assert_hostname=False,
#             ssl_show_warn=False
#         )
#
#     def create_index_if_not_exists(self, index_name):
#         if not self.client.indices.exists(index=index_name):
#             index_body = {
#                 "settings": {
#                     "index": {
#                         "number_of_shards": 1,
#                         "number_of_replicas": 1
#                     }
#                 }
#             }
#             self.client.indices.create(index=index_name, body=index_body, ignore=400)
#
#     def get_all_documents(self, index_name):
#         search_body = {
#             "query": {
#                 "match_all": {}
#             }
#         }
#         response = self.client.search(index=index_name, body=search_body)
#         return parse_response(response)
#
#     def create_document(self, index_name, document):
#         current_time = datetime.utcnow().isoformat()
#         document['created_at'] = current_time
#         document['updated_at'] = current_time
#         response = self.client.index(index=index_name, body=document)
#         response = self.get_document(index_name, response['_id'])
#         return parse_response(response)
#
#     def get_document(self, index_name, doc_id):
#         try:
#             response = self.client.get(index=index_name, id=doc_id)
#             return parse_response(response)
#         except Exception as e:
#             return {'error': str(e)}
#
#     def update_document(self, index_name, doc_id, updated_fields):
#         updated_fields['updated_at'] = datetime.utcnow().isoformat()
#         self.client.update(index=index_name, id=doc_id, body={"doc": updated_fields})
#         response = self.get_document(index_name, doc_id)
#         return parse_response(response)
#
#     def delete_document(self, index_name, doc_id):
#         response = self.client.delete(index=index_name, id=doc_id)
#         return parse_response(response)
#
#     def search_documents(self, index_name, query):
#         search_body = {
#             "query": {
#                 "multi_match": {
#                     "query": query,
#                     "fields": ["name", "description", "category.name", "category.description", "author"]
#                 }
#             }
#         }
#         response = self.client.search(index=index_name, body=search_body)
#         return parse_response(response)
