from fastapi import APIRouter, Depends, File, UploadFile, status
from app.api.deps import require_admin_auth
from app.schemas.upload import ImageUploadResponse
from app.schemas.common import StandardResponse
from app.services.cloudinary_service import upload_currency_image

router = APIRouter(
    prefix="/admin",
    tags=["Admin - Media & Uploads"],
    dependencies=[Depends(require_admin_auth)],
)


@router.post(
    "/upload-image",
    response_model=StandardResponse[ImageUploadResponse],
    status_code=status.HTTP_201_CREATED,
    summary="Upload currency image to Cloudinary (Admin Only)",
    description="Accepts an image file (JPEG, PNG, WebP, GIF, AVIF), uploads it to Cloudinary with auto optimization, and returns secure_url.",
)
async def upload_image(
    file: UploadFile = File(..., description="Image file to upload (Max 10MB)"),
):
    upload_result = await upload_currency_image(file)
    return StandardResponse[ImageUploadResponse](
        success=True,
        message="Image successfully uploaded and optimized.",
        data=upload_result,
    )
