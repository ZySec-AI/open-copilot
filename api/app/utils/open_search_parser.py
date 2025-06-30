from typing import Any


def parse_response(response) -> Any:
    if response.get('status', 200) < 400:
        if 'hits' in response:
            data = [{
                'id': hit['_id'],
                **hit['_source']
            } for hit in response['hits']['hits']]
            return data
        elif '_source' in response:  # This is a single document response
            data = {
                'id': response['_id'],
                **response['_source']
            }
            return data
        else:
            return response
    else:
        return {'success': False, 'error': response.get('error', 'Unknown error')}
