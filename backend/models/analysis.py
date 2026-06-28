# Analysis Model
class Analysis:
    def __init__(self, id=None, project_id=None, status="pending", risk_score=0, created_at=None):
        self.id = id
        self.project_id = project_id
        self.status = status  # pending, running, completed, failed
        self.risk_score = risk_score
        self.created_at = created_at
