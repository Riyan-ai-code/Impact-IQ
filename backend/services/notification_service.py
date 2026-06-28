# Notification Service

class NotificationService:
    def send(self, user_id: str, message: str):
        print(f"Notification to {user_id}: {message}")

    def get_all(self, user_id: str) -> list:
        return []
