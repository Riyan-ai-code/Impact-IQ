# Integration Model
class Integration:
    def __init__(self, id=None, name="", type="", config=None, user_id=None, is_active=True):
        self.id = id
        self.name = name
        self.type = type  # slack, jira, etc.
        self.config = config or {}
        self.user_id = user_id
        self.is_active = is_active
