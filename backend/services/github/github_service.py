# GitHub API Service
# Makes requests to the GitHub API

class GitHubService:
    def __init__(self, access_token: str):
        self.access_token = access_token
        self.base_url = "https://api.github.com"

    async def get_user(self) -> dict:
        # TODO: Fetch user from GitHub API
        return {"login": "placeholder"}

    async def get_repos(self) -> list:
        # TODO: Fetch repos from GitHub API
        return []
