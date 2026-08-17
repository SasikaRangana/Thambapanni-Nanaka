from datetime import datetime
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, ConfigDict, Field


class CurrencyBase(BaseModel):
    title: str = Field(..., min_length=2, max_length=255, description="Item display title")
    country: str = Field(..., min_length=2, max_length=100, description="Country of origin")
    year: int = Field(..., ge=1, le=2100, description="Minting / issue year")
    price: float = Field(..., ge=0, description="Price in LKR (Sri Lankan Rupees)")
    item_code: str = Field(
        ...,
        min_length=1,
        max_length=50,
        alias="itemCode",
        description="Unique inventory / item code",
    )
    category: str = Field(
        default="coin",
        max_length=50,
        description="Category: 'coin', 'banknote', 'token', 'medal', etc.",
    )
    description: Optional[str] = Field(
        default="", description="Detailed historical or physical description"
    )
    image_url: str = Field(
        ..., alias="imageUrl", description="Primary image URL (Cloudinary secure_url)"
    )
    condition_grade: str = Field(
        ...,
        max_length=50,
        description="Grading condition e.g. 'UNC', 'VF', 'XF', 'Fine', 'Good'",
    )
    is_sold: bool = Field(default=False, description="Whether item has been sold")

    model_config = ConfigDict(
        populate_by_name=True,
        json_schema_extra={
            "example": {
                "title": "King Parakramabahu I Silver Kahavanu",
                "country": "Sri Lanka (Ceylon)",
                "year": 1153,
                "price": 18500.00,
                "itemCode": "SL-MED-1153-01",
                "category": "coin",
                "description": "Authentic ancient medieval Ceylon silver coin in excellent condition with clear nagari script.",
                "imageUrl": "https://res.cloudinary.com/demo/image/upload/sample_coin.jpg",
                "condition_grade": "Very Fine (VF)",
                "is_sold": False,
            }
        },
    )


class CurrencyCreate(CurrencyBase):
    pass


class CurrencyUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=2, max_length=255)
    country: Optional[str] = Field(None, min_length=2, max_length=100)
    year: Optional[int] = Field(None, ge=1, le=2100)
    price: Optional[float] = Field(None, ge=0)
    item_code: Optional[str] = Field(None, min_length=1, max_length=50, alias="itemCode")
    category: Optional[str] = Field(None, max_length=50)
    description: Optional[str] = None
    image_url: Optional[str] = Field(None, alias="imageUrl")
    condition_grade: Optional[str] = Field(None, max_length=50)
    is_sold: Optional[bool] = None

    model_config = ConfigDict(populate_by_name=True)


class CurrencyStatusUpdate(BaseModel):
    is_sold: bool = Field(
        ...,
        description="Set to true to mark item as sold, false to mark as available",
    )


class CurrencyInDB(CurrencyBase):
    id: UUID
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(populate_by_name=True, from_attributes=True)


class CurrencyPublicResponse(CurrencyInDB):
    whatsapp_inquiry_url: Optional[str] = Field(
        None, description="Direct wa.me redirect link with pre-filled order inquiry message"
    )
    whatsapp_message: Optional[str] = Field(
        None, description="Standardized plain-text inquiry message string"
    )


class CurrencyFilterParams(BaseModel):
    country: Optional[str] = None
    year: Optional[int] = None
    category: Optional[str] = None
    min_price: Optional[float] = None
    max_price: Optional[float] = None
    condition_grade: Optional[str] = None
    is_sold: Optional[bool] = None
    search: Optional[str] = None
    page: int = Field(default=1, ge=1)
    limit: int = Field(default=20, ge=1, le=100)
    sort_by: str = Field(default="created_at")
    sort_order: str = Field(default="desc")
