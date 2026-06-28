# Repository Model
class Repository:
    def __init__(self, id=None, name="", full_name="", github_id=None, is_private=False, language="", user_id=None):
        self.id = id
        self.name = name
        self.full_name = full_name
        self.github_id = github_id
        self.is_private = is_private
        self.language = language
        self.user_id = user_id
