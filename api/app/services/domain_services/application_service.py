from typing import List

from app.models.pydantics.application_schema import Application


class ApplicationService:
    def __init__(self, database):
        self.database = database
        self.collection = database.applications

    async def retrieve_application(self) -> List[Application]:
        applications = self.collection.find()
        applications_list = []
        async for application in applications:
            application['id'] = str(application.pop('_id'))
            applications_list.append(Application(**application))
        return applications_list
