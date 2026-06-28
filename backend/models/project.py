# Project Model
class Project:
    def __init__(self, id=None, name="", description="", user_id=None, repo_id=None):
        self.id = id
        self.name = name
        self.description = description
        self.user_id = user_id
        self.repo_id = repo_id
