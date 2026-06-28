# Contributor Model
class Contributor:
    def __init__(self, id=None, username="", avatar_url="", contributions=0, repo_id=None):
        self.id = id
        self.username = username
        self.avatar_url = avatar_url
        self.contributions = contributions
        self.repo_id = repo_id
