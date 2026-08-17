import asyncio
import logging
from typing import BinaryIO
import cloudinary
import cloudinary.uploader
from fastapi import HTTPException, UploadFile, status
from app.core.config import settings
from app.schemas.upload import ImageUploadResponse

logger = logging.getLogger(__name__)

# Initialize Cloudinary configuration
if settings.CLOUDINARY_URL:
    cloudinary.config(cloudinary_url=settings.CLOUDINARY_URL)
elif settings.CLOUDINARY_CLOUD_NAME and settings.CLOUDINARY_API_KEY and settings.CLOUDINARY_API_SECRET:
    cloudinary.config(
        cloud_name=settings.CLOUDINARY_CLOUD_NAME,
        api_key=settings.CLOUDINARY_API_KEY,
        api_secret=settings.CLOUDINARY_API_SECRET,
        secure=True,
    )


def _sync_upload(file_content: bytes, folder: str = "thambapanni_nanaka/currencies") -> dict:
    """
    Synchronous Cloudinary upload worker.
    """
    return cloudinary.uploader.upload(
        file_content,
        folder=folder,
        resource_type="image",
        transformation=[
            {"quality": "auto:best"},
            {"fetch_format": "auto"},
        ],
    )


async def upload_currency_image(
    file: UploadFile,
    folder: str = "thambapanni_nanaka/currencies",
) -> ImageUploadResponse:
    """
    Asynchronously uploads an image file to Cloudinary and returns metadata including secure_url.
    """
    # 1. Validate content type
    allowed_types = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"]
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid file type '{file.content_type}'. Allowed types: {', '.join(allowed_types)}",
        )

    # 2. Read file content
    try:
        content = await file.read()
        if len(content) == 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Uploaded file is empty.",
            )
        # Max 10MB limit
        if len(content) > 10 * 1024 * 1024:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Image file size exceeds maximum limit of 10MB.",
            )

        # 3. Offload upload to thread pool for non-blocking I/O
        result = await asyncio.to_thread(_sync_upload, content, folder)

        return ImageUploadResponse(
            secure_url=result.get("secure_url"),
            public_id=result.get("public_id"),
            format=result.get("format"),
            width=result.get("width"),
            height=result.get("height"),
            bytes=result.get("bytes"),
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Cloudinary upload failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to upload image to Cloudinary: {str(e)}",
        )
    finally:
        await file.close()
