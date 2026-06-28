# Report Model
class Report:
    def __init__(self, id=None, analysis_id=None, title="", summary="", details=None):
        self.id = id
        self.analysis_id = analysis_id
        self.title = title
        self.summary = summary
        self.details = details or {}
