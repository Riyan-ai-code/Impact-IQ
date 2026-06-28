# Validators

def is_valid_repo_name(name: str) -> bool:
    return bool(name) and "/" in name

def is_valid_branch_name(name: str) -> bool:
    return bool(name) and " " not in name
