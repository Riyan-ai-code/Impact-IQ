# GitHub OAuth Service
# Handles GitHub OAuth token exchange

class GitHubOAuthService:
    def get_authorize_url(self, client_id: str, redirect_uri: str) -> str:
        return f"https://github.com/login/oauth/authorize?client_id={client_id}&redirect_uri={redirect_uri}&scope=repo user"

    async def exchange_code_for_token(self, code: str) -> str:
        # TODO: Exchange code for access token
        return "placeholder_token"
