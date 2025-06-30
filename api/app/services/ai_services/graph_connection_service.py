from typing import TypeVar, Union

from langchain_community.chains.graph_qa.cypher import GraphCypherQAChain
from langchain_community.chat_models import ChatOpenAI
from langchain_community.graphs import Neo4jGraph
from langchain_core.documents import Document
from langchain_experimental.graph_transformers import LLMGraphTransformer
from pydantic import BaseModel

from app.core.config import config

T = TypeVar('T', bound=BaseModel)


class GraphConnectionService:
    def __init__(self, db=None):
        self.graph = db

    def get_all_nodes(self):
        query = "MATCH (n) RETURN elementId(n) as element_id, properties(n) as properties"
        result = self.graph.run(query)
        return [{"element_id": record["element_id"], **record["properties"]} for record in result]

    # @staticmethod
    # def __convert_uuids_to_str(data: dict) -> dict:
    #     """Convert UUID fields to string."""
    #     for key, value in data.items():
    #         if isinstance(value, UUID):
    #             data[key] = str(value)
    #         elif isinstance(value, list):
    #             data[key] = [str(item) if isinstance(item, UUID) else item for item in value]
    #     return data

    @staticmethod
    def __create_node(tx, node: T):
        label = node.__class__.__name__
        props = node.model_dump()
        query = f"CREATE (n:{label} $props) RETURN elementId(n) as element_id"
        result = tx.run(query, props=props)
        return result.single()["element_id"]

    @staticmethod
    def __update_node(tx, element_id: str, node: T):
        label = node.__class__.__name__
        node_data = node.model_dump()
        query = (
            f"MATCH (n:{label}) WHERE elementId(n) = $element_id "
            "SET n += $props "
            "RETURN n"
        )
        tx.run(query, element_id=element_id, props=node_data)

    @staticmethod
    def __merge_node(tx, element_id: str, node: T):
        label = node.__class__.__name__
        node_data = node.model_dump()
        query = (
            f"MERGE (n:{label}) WHERE elementId(n) = $element_id "
            "ON CREATE SET n = $props "
            "ON MATCH SET n += $props "
            "RETURN n"
        )
        tx.run(query, element_id=element_id, props=node_data)

    @staticmethod
    def __delete_node(tx, element_id: str):
        query = "MATCH (n) WHERE elementId(n) = $element_id DETACH DELETE n"
        tx.run(query, element_id=element_id)

    @staticmethod
    def __create_relationship(tx, relationship):
        query = (
            f"MATCH (a) WHERE elementId(a) = $start_node_element_id "
            f"MATCH (b) WHERE elementId(b) = $end_node_element_id "
            f"MERGE (a)-[r:{relationship['relationship_type']}$props]->(b) RETURN r"
        )
        tx.run(query, start_node_element_id=relationship['start_node_element_id'],
               end_node_element_id=relationship['end_node_element_id'],
               props=relationship['properties'])

    def save_to_neo4j(self, data_object: Union[T, None], mode: str = "merge", element_id: str = None):
        if mode == "create":
            element_id = self.graph.write_transaction(self.__create_node, data_object)
        elif mode == "update":
            if element_id is None:
                raise ValueError("Element ID must be provided for update operation.")
            self.graph.write_transaction(self.__update_node, element_id, data_object)
        elif mode == "delete":
            if element_id is None:
                raise ValueError("Element ID must be provided for delete operation.")
            self.graph.write_transaction(self.__delete_node, element_id)
        else:  # Default to merge
            if element_id is None:
                raise ValueError("Element ID must be provided for merge operation.")
            self.graph.write_transaction(self.__merge_node, element_id, data_object)
        return element_id

    def create_node(self, data_object: T):
        element_id = self.save_to_neo4j(data_object, mode='create')
        return {"element_id": element_id, **data_object.model_dump()}

    def update_node(self, element_id: str, data_object: T):
        self.save_to_neo4j(data_object, mode='update', element_id=element_id)
        return data_object

    def delete_node(self, element_id: str):
        self.save_to_neo4j(None, mode='delete', element_id=element_id)

    def create_relationship(self, relationship):
        relationship_data = relationship.model_dump()
        self.graph.write_transaction(self.__create_relationship, relationship_data)
        return relationship_data

    def add_nodes_from_text(self, text_data: str):
        llm = ChatOpenAI(temperature=0, model_name=config.default_model)

        llm_transformer = LLMGraphTransformer(
            llm=llm,
            allowed_nodes=[
                "Assessment",
                "Asset",
                "BusinessProcess",
                "Control",
                "Documentation",
                "Incident",
                "Person",
                "Policy",
                "Procedure",
                "Risk",
                "Shift",
                "SystemComponent",
                "Threat",
                "Vulnerability"
            ]
        )

        documents = [Document(page_content=text_data)]
        graph_documents = llm_transformer.convert_to_graph_documents(documents)
        graph = Neo4jGraph()

        graph.add_graph_documents(graph_documents)
        return 'Data has updated!!!'

    @staticmethod
    def search_query(query):
        graph = Neo4jGraph()
        chain = GraphCypherQAChain.from_llm(
            ChatOpenAI(temperature=0, model_name=config.default_model),
            graph=graph,
            verbose=True,
        )
        result = chain.run(query)
        return result
