from typing import List, Optional
from fastapi import APIRouter, Query, Path, status
from app.schemas.currency import (
    CurrencyPublicResponse,
    CurrencyFilterParams,
)
from app.schemas.common import PaginatedResponse, StandardResponse
from app.services.currency_service import CurrencyService

router = APIRouter(prefix="/currencies", tags=["Public Currencies & Gallery"])


@router.get(
    "",
    response_model=PaginatedResponse[CurrencyPublicResponse],
    summary="Browse currency catalog & gallery",
    description="Retrieve paginated list of antique coins and banknotes with multi-field search and filters.",
)
async def list_currencies(
    country: Optional[str] = Query(None, description="Filter by origin country (e.g. 'Sri Lanka', 'Ceylon', 'British India')"),
    year: Optional[int] = Query(None, description="Filter by exact minting/issue year"),
    category: Optional[str] = Query(None, description="Filter by category ('coin', 'banknote', 'token', etc.)"),
    min_price: Optional[float] = Query(None, ge=0, description="Minimum price in LKR"),
    max_price: Optional[float] = Query(None, ge=0, description="Maximum price in LKR"),
    condition_grade: Optional[str] = Query(None, description="Filter by condition grade (e.g. 'UNC', 'VF')"),
    is_sold: Optional[bool] = Query(None, description="Filter by sold status. Default shows all items in gallery"),
    search: Optional[str] = Query(None, description="Search term across title, item code, and description"),
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(20, ge=1, le=100, description="Items per page"),
    sort_by: str = Query("created_at", description="Field to sort by (created_at, price, year, title)"),
    sort_order: str = Query("desc", pattern="^(asc|desc)$", description="Sort order: 'asc' or 'desc'"),
):
    filters = CurrencyFilterParams(
        country=country,
        year=year,
        category=category,
        min_price=min_price,
        max_price=max_price,
        condition_grade=condition_grade,
        is_sold=is_sold,
        search=search,
        page=page,
        limit=limit,
        sort_by=sort_by,
        sort_order=sort_order,
    )
    return await CurrencyService.list_currencies_public(filters)


@router.get(
    "/meta/countries",
    response_model=StandardResponse[List[str]],
    summary="List distinct countries in catalog",
    description="Returns a list of unique countries available in the gallery for frontend dropdown filters.",
)
async def get_countries():
    countries = await CurrencyService.get_distinct_countries()
    return StandardResponse[List[str]](
        success=True,
        message="Countries fetched successfully",
        data=countries,
    )


@router.get(
    "/{id}",
    response_model=StandardResponse[CurrencyPublicResponse],
    summary="Get single currency item details",
    description="Fetch single currency by UUID or item code, including pre-formatted WhatsApp purchase link in LKR.",
)
async def get_currency_detail(
    id: str = Path(..., description="UUID or itemCode of the currency item"),
):
    item = await CurrencyService.get_currency_by_id(id)
    return StandardResponse[CurrencyPublicResponse](
        success=True,
        message="Currency details retrieved successfully",
        data=item,
    )
