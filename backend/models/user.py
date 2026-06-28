# User Model
# Represents a user in the database

class User:
    def __init__(self, id=None, username="", email="", github_id=None, avatar_url=""):
        self.id = id
        self.username = username
        self.email = email
        self.github_id = github_id
        self.avatar_url = avatar_url
