from fastapi import APIRouter, Depends, Path, status
from app.api.deps import require_admin_auth
from app.schemas.currency import (
    CurrencyCreate,
    CurrencyUpdate,
    CurrencyStatusUpdate,
    CurrencyInDB,
)
from app.schemas.common import StandardResponse
from app.services.currency_service import CurrencyService

router = APIRouter(
    prefix="/admin/currencies",
    tags=["Admin - Currency Inventory Management"],
    dependencies=[Depends(require_admin_auth)],
)


@router.post(
    "",
    response_model=StandardResponse[CurrencyInDB],
    status_code=status.HTTP_201_CREATED,
    summary="Add a new currency item (Admin Only)",
    description="Creates a new currency item in Supabase PostgreSQL database.",
)
async def create_currency_item(item: CurrencyCreate):
    created_item = await CurrencyService.create_currency(item)
    return StandardResponse[CurrencyInDB](
        success=True,
        message=f"Currency item '{created_item.title}' created successfully.",
        data=created_item,
    )


@router.put(
    "/{id}",
    response_model=StandardResponse[CurrencyInDB],
    summary="Update currency details (Admin Only)",
    description="Updates existing currency attributes in Supabase.",
)
async def update_currency_item(
    item_update: CurrencyUpdate,
    id: str = Path(..., description="UUID of the currency item to update"),
):
    updated_item = await CurrencyService.update_currency(id, item_update)
    return StandardResponse[CurrencyInDB](
        success=True,
        message=f"Currency item '{id}' updated successfully.",
        data=updated_item,
    )


@router.put(
    "/{id}/status",
    response_model=StandardResponse[CurrencyInDB],
    summary="Toggle / update sold status (Admin Only)",
    description="Updates the is_sold status for a specific currency item.",
)
async def update_currency_status(
    status_data: CurrencyStatusUpdate,
    id: str = Path(..., description="UUID of the currency item"),
):
    updated_item = await CurrencyService.update_sold_status(id, status_data.is_sold)
    status_str = "Sold" if status_data.is_sold else "Available"
    return StandardResponse[CurrencyInDB](
        success=True,
        message=f"Currency item status marked as '{status_str}'.",
        data=updated_item,
    )


@router.delete(
    "/{id}",
    response_model=StandardResponse[None],
    summary="Delete a currency item (Admin Only)",
    description="Permanently removes an item from the database.",
)
async def delete_currency_item(
    id: str = Path(..., description="UUID of the currency item to delete"),
):
    await CurrencyService.delete_currency(id)
    return StandardResponse[None](
        success=True,
        message=f"Currency item '{id}' deleted successfully.",
        data=None,
    )
