from fastapi import Depends
from app.core.security import verify_admin_secret


async def require_admin_auth(authorized: bool = Depends(verify_admin_secret)) -> bool:
    """
    FastAPI dependency ensuring request has valid admin credentials.
    """
    return authorized
