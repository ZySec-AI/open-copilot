from fastapi import HTTPException
from neo4j import Session

from app.models.graph_models.relationship import Relationship
from app.services.ai_services.graph_connection_service import GraphConnectionService
from app.utils.graph_model_map import model_map


class GraphService:
    def __init__(self, graph: Session = None):
        self.graph_connection_service = GraphConnectionService(graph)

    def get_all_nodes(self):
        return self.graph_connection_service.get_all_nodes()

    def create_node(self, data_object):
        category = data_object.pop('category')
        model_class = model_map.get(category)
        if not model_class:
            raise HTTPException(status_code=400, detail="Invalid category")

        model_instance = model_class(**data_object)

        new_node = self.graph_connection_service.create_node(model_instance)

        self.add_possibility_relationships(model_instance, new_node['element_id'])

        return new_node

    def update_node(self, element_id, data_object):
        category = data_object.pop('category')
        model_class = model_map.get(category)
        if not model_class:
            raise HTTPException(status_code=400, detail="Invalid category")

        model_instance = model_class(**data_object)

        updated_node = self.graph_connection_service.update_node(element_id, model_instance)

        self.add_possibility_relationships(model_instance, element_id)

        return updated_node

    def delete_node(self, element_id):
        return self.graph_connection_service.delete_node(element_id)

    def create_relationship(self, data):
        relationship = Relationship(**data)
        return self.graph_connection_service.create_relationship(relationship)

    def make_nodes(self, text_data):
        return self.graph_connection_service.add_nodes_from_text(text_data)

    def search_query(self, query):
        return self.graph_connection_service.search_query(query)

    def add_possibility_relationships(self, model_instance, element_id: str):
        if model_instance.__class__.__name__ == "Assessment":

            if model_instance.responsible_party_id:
                relationship = Relationship(
                    start_node_element_id=model_instance.responsible_party_id,
                    end_node_element_id=element_id,
                    relationship_type="PERFORMS"
                )
                self.graph_connection_service.create_relationship(relationship)
        elif model_instance.__class__.__name__ == "Asset":
            if model_instance.owner_id:
                relationship = Relationship(
                    start_node_element_id=model_instance.owner_id,
                    end_node_element_id=element_id,
                    relationship_type="OWNS"
                )
                self.graph_connection_service.create_relationship(relationship)
        elif model_instance.__class__.__name__ == "BusinessProcess":
            if model_instance.relevant_assets:
                for asset_id in model_instance.relevant_assets:
                    relationship = Relationship(
                        start_node_element_id=asset_id,
                        end_node_element_id=element_id,
                        relationship_type="RELATED_TO"
                    )
                    self.graph_connection_service.create_relationship(relationship)
        elif model_instance.__class__.__name__ == "Documentation":
            if model_instance.responsible_party_id:
                relationship = Relationship(
                    start_node_element_id=model_instance.responsible_party_id,
                    end_node_element_id=element_id,
                    relationship_type="CREATES"
                )
                self.graph_connection_service.create_relationship(relationship)

        elif model_instance.__class__.__name__ == "Policy":
            if model_instance.responsible_party_id:
                relationship = Relationship(
                    start_node_element_id=model_instance.responsible_party_id,
                    end_node_element_id=element_id,
                    relationship_type="RESPONSIBLE_FOR"
                )
                self.graph_connection_service.create_relationship(relationship)
        elif model_instance.__class__.__name__ == "Procedure":
            if model_instance.responsible_party_id:
                relationship = Relationship(
                    start_node_element_id=element_id,
                    end_node_element_id=model_instance.responsible_party_id,
                    relationship_type="IMPLEMENTED_BY"
                )
                self.graph_connection_service.create_relationship(relationship)
        elif model_instance.__class__.__name__ == "Risk":
            if model_instance.responsible_party_id:
                relationship = Relationship(
                    start_node_element_id=element_id,
                    end_node_element_id=model_instance.responsible_party_id,
                    relationship_type="ASSESSED_BY"
                )
                self.graph_connection_service.create_relationship(relationship)
        elif model_instance.__class__.__name__ == "Shift":
            if model_instance.assigned_people:
                for person_id in model_instance.assigned_people:
                    relationship = Relationship(
                        start_node_element_id=person_id,
                        end_node_element_id=element_id,
                        relationship_type="ASSIGNED_TO"
                    )
                    self.graph_connection_service.create_relationship(relationship)
