from pydantic import BaseModel, Field
from typing import Optional


class ImageUploadResponse(BaseModel):
    secure_url: str = Field(..., description="HTTPS URL of the uploaded image on Cloudinary")
    public_id: str = Field(..., description="Cloudinary asset public ID")
    format: Optional[str] = Field(None, description="Image format e.g. webp, jpg, png")
    width: Optional[int] = Field(None, description="Image width in pixels")
    height: Optional[int] = Field(None, description="Image height in pixels")
    bytes: Optional[int] = Field(None, description="Image file size in bytes")
