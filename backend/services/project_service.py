# Project Service

class ProjectService:
    def create(self, name: str, description: str) -> dict:
        return {"name": name, "description": description}

    def get_all(self, user_id: str) -> list:
        return []
