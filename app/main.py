import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from app.core.config import settings
from app.api.router import api_router

# Configure Logging
logging.basicConfig(
    level=logging.INFO if not settings.DEBUG else logging.DEBUG,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup tasks
    logger.info(f"Starting {settings.PROJECT_NAME} in [{settings.APP_ENV}] mode...")
    logger.info(f"CORS allowed origins: {settings.CORS_ORIGINS}")
    yield
    # Shutdown tasks
    logger.info(f"Shutting down {settings.PROJECT_NAME}...")


app = FastAPI(
    title=settings.PROJECT_NAME,
    description="""
# 🪙 Thambapanni Nanaka API 📜
High-performance REST API backend for antique coins, ancient currency, and vintage banknotes gallery & e-commerce.

### Key Capabilities:
* **Public Gallery & Filtering:** Fast multi-attribute filtering (Country, Year, Price, Condition, Category)
* **WhatsApp Quick Inquiry / Checkout:** Generates pre-formatted WhatsApp order links in **LKR**
* **Supabase PostgreSQL & Realtime Ready:** Instant inventory synchronization for Next.js
* **Cloudinary Media Engine:** Direct high-speed image uploads with auto webp/avif optimization
* **Admin Secured Suite:** Inventory management and image upload endpoints protected with secret tokens
    """,
    version=settings.VERSION,
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
)

# Configure CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS if isinstance(settings.CORS_ORIGINS, list) else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Validation Error Handler
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "success": False,
            "message": "Validation error in request parameters or payload",
            "errors": exc.errors(),
        },
    )


# General Exception Handler
@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "success": False,
            "message": "An internal server error occurred.",
            "error_detail": str(exc) if settings.DEBUG else None,
        },
    )


import os
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

# Static Directory Path
STATIC_DIR = os.path.join(os.path.dirname(__file__), "static")

# Customer Storefront Route
@app.get("/", tags=["Storefront"])
async def root(request: Request):
    accept = request.headers.get("accept", "")
    index_file = os.path.join(STATIC_DIR, "index.html")
    if "text/html" in accept and os.path.exists(index_file):
        return FileResponse(index_file)
    elif not ("application/json" in accept) and os.path.exists(index_file):
        return FileResponse(index_file)
    return {
        "status": "online",
        "project": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "docs": "/docs",
        "currency": settings.DEFAULT_CURRENCY_SYMBOL,
    }


# Dedicated Admin Dashboard Routes
@app.get("/admin", tags=["Admin Portal"])
@app.get("/admin/", tags=["Admin Portal"])
@app.get("/admin.html", tags=["Admin Portal"])
async def admin_portal():
    admin_file = os.path.join(STATIC_DIR, "admin.html")
    if os.path.exists(admin_file):
        return FileResponse(
            admin_file,
            headers={"Cache-Control": "no-cache"},
        )
    return JSONResponse(
        status_code=status.HTTP_404_NOT_FOUND,
        content={"message": "Admin dashboard HTML not found."},
    )


@app.get("/api/health", tags=["Health"])
async def health_check():
    return {
        "status": "healthy",
        "env": settings.APP_ENV,
        "supabase_configured": bool(settings.SUPABASE_URL and "placeholder" not in settings.SUPABASE_URL),
        "cloudinary_configured": bool(
            settings.CLOUDINARY_URL or (settings.CLOUDINARY_CLOUD_NAME and settings.CLOUDINARY_API_KEY)
        ),
    }


# Include API Router
app.include_router(api_router)

# Mount root static fallback
if os.path.exists(STATIC_DIR):
    app.mount("/", StaticFiles(directory=STATIC_DIR, html=True), name="root_static")



if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
    )
