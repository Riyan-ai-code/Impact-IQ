# GitHub Utility Functions

def format_repo_name(full_name: str) -> str:
    return full_name.split("/")[-1] if "/" in full_name else full_name

def get_language_color(language: str) -> str:
    colors = {"Python": "#3572A5", "JavaScript": "#f1e05a", "TypeScript": "#3178c6", "Go": "#00ADD8"}
    return colors.get(language, "#858585")
