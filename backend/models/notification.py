# Notification Model
class Notification:
    def __init__(self, id=None, user_id=None, message="", is_read=False, created_at=None):
        self.id = id
        self.user_id = user_id
        self.message = message
        self.is_read = is_read
        self.created_at = created_at
