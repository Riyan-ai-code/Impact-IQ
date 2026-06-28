# Risk Utility Functions

def calculate_severity(score: float) -> str:
    if score >= 8: return "critical"
    if score >= 5: return "high"
    if score >= 3: return "medium"
    return "low"
