from typing import Dict, Type

from pydantic import BaseModel

from app.models.graph_models.schema_assessment import Assessment
from app.models.graph_models.schema_asset import Asset
from app.models.graph_models.schema_business_process import BusinessProcess
from app.models.graph_models.schema_controls import Control
from app.models.graph_models.schema_documentation import Documentation
from app.models.graph_models.schema_incidents import Incident
from app.models.graph_models.schema_people import Person
from app.models.graph_models.schema_policies import Policy
from app.models.graph_models.schema_procedures import Procedure
from app.models.graph_models.schema_risks import Risk
from app.models.graph_models.schema_shifts import Shift
from app.models.graph_models.schema_system_components import SystemComponent
from app.models.graph_models.schema_threats import Threat
from app.models.graph_models.schema_vulnerabilities import Vulnerability

model_map: Dict[str, Type[BaseModel]] = {
    "Assessment": Assessment,
    "Asset": Asset,
    "BusinessProcess": BusinessProcess,
    "Control": Control,
    "Documentation": Documentation,
    "Incident": Incident,
    "Person": Person,
    "Policy": Policy,
    "Procedure": Procedure,
    "Risk": Risk,
    "Shift": Shift,
    "SystemComponent": SystemComponent,
    "Threat": Threat,
    "Vulnerability": Vulnerability
}
