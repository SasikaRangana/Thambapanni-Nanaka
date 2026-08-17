import secrets
from fastapi import HTTPException, Security, status
from fastapi.security import APIKeyHeader, HTTPAuthorizationCredentials, HTTPBearer
from app.core.config import settings

api_key_header = APIKeyHeader(name="X-Admin-Token", auto_error=False)
bearer_auth = HTTPBearer(auto_error=False)


def verify_admin_secret(
    header_token: str | None = Security(api_key_header),
    bearer_creds: HTTPAuthorizationCredentials | None = Security(bearer_auth),
) -> bool:
    """
    Validates admin secret token supplied via either:
    1. Header: 'X-Admin-Token: <SECRET>'
    2. Bearer Token: 'Authorization: Bearer <SECRET>'
    """
    provided_token = None
    if header_token:
        provided_token = header_token
    elif bearer_creds:
        provided_token = bearer_creds.credentials

    if not provided_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Admin authentication required. Please provide 'X-Admin-Token' or Bearer token.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Constant-time comparison to prevent timing attacks
    if not secrets.compare_digest(provided_token, settings.ADMIN_SECRET):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Invalid admin credentials provided.",
        )

    return True
