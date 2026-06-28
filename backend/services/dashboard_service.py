# Dashboard Service

class DashboardService:
    def get_overview(self, user_id: str) -> dict:
        return {"total_projects": 0, "total_repos": 0}
