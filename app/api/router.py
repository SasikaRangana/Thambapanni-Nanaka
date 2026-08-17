from fastapi import APIRouter
from app.api.public.currencies import router as public_currencies_router
from app.api.admin.currencies import router as admin_currencies_router
from app.api.admin.uploads import router as admin_uploads_router

api_router = APIRouter(prefix="/api")

# Public User Routes
api_router.include_router(public_currencies_router)

# Admin Management Routes
api_router.include_router(admin_currencies_router)
api_router.include_router(admin_uploads_router)
