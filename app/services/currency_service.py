import asyncio
import logging
from typing import List, Optional, Tuple, Dict, Any
from uuid import UUID
from fastapi import HTTPException, status
from app.db.supabase import get_supabase
from app.schemas.currency import (
    CurrencyCreate,
    CurrencyUpdate,
    CurrencyFilterParams,
    CurrencyInDB,
    CurrencyPublicResponse,
)
from app.schemas.common import PaginationMeta, PaginatedResponse
from app.services.whatsapp_service import generate_whatsapp_link

logger = logging.getLogger(__name__)


def _enrich_public_currency(item_dict: Dict[str, Any]) -> CurrencyPublicResponse:
    """
    Enriches raw database dictionary with generated WhatsApp inquiry strings and URLs.
    """
    # Normalize aliases if needed
    item_id = str(item_dict.get("id"))
    title = item_dict.get("title", "")
    item_code = item_dict.get("item_code", "")
    price = float(item_dict.get("price", 0))
    country = item_dict.get("country", "")
    year = int(item_dict.get("year", 0))
    condition_grade = item_dict.get("condition_grade", "")
    category = item_dict.get("category", "coin")
    image_url = item_dict.get("image_url", "")

    wa_url, wa_msg = generate_whatsapp_link(
        item_id=item_id,
        title=title,
        item_code=item_code,
        price=price,
        country=country,
        year=year,
        condition_grade=condition_grade,
        category=category,
        image_url=image_url,
    )

    return CurrencyPublicResponse(
        id=item_dict.get("id"),
        title=title,
        country=country,
        year=year,
        price=price,
        itemCode=item_code,
        category=category,
        description=item_dict.get("description", ""),
        imageUrl=image_url,
        condition_grade=condition_grade,
        is_sold=item_dict.get("is_sold", False),
        created_at=item_dict.get("created_at"),
        updated_at=item_dict.get("updated_at"),
        whatsapp_inquiry_url=wa_url,
        whatsapp_message=wa_msg,
    )


class CurrencyService:
    @staticmethod
    def _execute_get_currencies(filters: CurrencyFilterParams) -> Tuple[List[Dict[str, Any]], int]:
        supabase = get_supabase()
        query = supabase.table("currencies").select("*", count="exact")

        # Apply Filters
        if filters.country:
            query = query.ilike("country", f"%{filters.country.strip()}%")
        if filters.year is not None:
            query = query.eq("year", filters.year)
        if filters.category:
            query = query.ilike("category", f"%{filters.category.strip()}%")
        if filters.is_sold is not None:
            query = query.eq("is_sold", filters.is_sold)
        if filters.min_price is not None:
            query = query.gte("price", filters.min_price)
        if filters.max_price is not None:
            query = query.lte("price", filters.max_price)
        if filters.condition_grade:
            query = query.ilike("condition_grade", f"%{filters.condition_grade.strip()}%")
        if filters.search:
            s = filters.search.strip()
            # Search title or item_code or description
            query = query.or_(f"title.ilike.%{s}%,item_code.ilike.%{s}%,description.ilike.%{s}%")

        # Sorting
        descending = filters.sort_order.lower() == "desc"
        query = query.order(filters.sort_by, desc=descending)

        # Pagination range
        start = (filters.page - 1) * filters.limit
        end = start + filters.limit - 1
        query = query.range(start, end)

        response = query.execute()
        total_count = response.count if response.count is not None else len(response.data)
        return response.data, total_count

    @classmethod
    async def list_currencies_public(
        cls, filters: CurrencyFilterParams
    ) -> PaginatedResponse[CurrencyPublicResponse]:
        """
        Public list view of currencies with pagination and WhatsApp metadata.
        """
        try:
            data, total = await asyncio.to_thread(cls._execute_get_currencies, filters)
            items = [_enrich_public_currency(row) for row in data]

            total_pages = (total + filters.limit - 1) // filters.limit if total > 0 else 1
            pagination = PaginationMeta(
                total=total,
                page=filters.page,
                limit=filters.limit,
                total_pages=total_pages,
                has_next=filters.page < total_pages,
                has_prev=filters.page > 1,
            )
            return PaginatedResponse[CurrencyPublicResponse](items=items, pagination=pagination)
        except Exception as e:
            logger.error(f"Error fetching currencies: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Database query error: {str(e)}",
            )

    @classmethod
    async def get_currency_by_id(cls, item_id: str) -> CurrencyPublicResponse:
        """
        Fetches single currency record by UUID or item_code and returns public enriched model.
        """
        def _get():
            supabase = get_supabase()
            # Try by UUID or item_code
            try:
                UUID(item_id)
                res = supabase.table("currencies").select("*").eq("id", item_id).execute()
            except ValueError:
                res = supabase.table("currencies").select("*").eq("item_code", item_id).execute()
            return res.data

        try:
            records = await asyncio.to_thread(_get)
            if not records:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Currency item with ID '{item_id}' not found.",
                )
            return _enrich_public_currency(records[0])
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Error fetching currency {item_id}: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Database query error: {str(e)}",
            )

    @classmethod
    async def create_currency(cls, item: CurrencyCreate) -> CurrencyInDB:
        """
        Inserts a new currency item into Supabase (Admin operation).
        """
        payload = {
            "title": item.title,
            "country": item.country,
            "year": item.year,
            "price": item.price,
            "item_code": item.item_code,
            "category": item.category,
            "description": item.description or "",
            "image_url": item.image_url,
            "condition_grade": item.condition_grade,
            "is_sold": item.is_sold,
        }

        def _insert():
            supabase = get_supabase()
            return supabase.table("currencies").insert(payload).execute()

        try:
            res = await asyncio.to_thread(_insert)
            if not res.data:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Failed to create currency record in database.",
                )
            return CurrencyInDB(**res.data[0])
        except HTTPException:
            raise
        except Exception as e:
            err_msg = str(e)
            logger.error(f"Error inserting currency: {err_msg}")
            if "duplicate key value" in err_msg or "unique" in err_msg.lower():
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail=f"An item with item code '{item.item_code}' already exists.",
                )
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Database insert error: {err_msg}",
            )

    @classmethod
    async def update_currency(cls, item_id: str, item: CurrencyUpdate) -> CurrencyInDB:
        """
        Updates currency details in Supabase (Admin operation).
        """
        payload = item.model_dump(by_alias=False, exclude_unset=True)
        if not payload:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No fields provided for update.",
            )

        # Map alias if present
        if "item_code" in payload:
            payload["item_code"] = payload["item_code"]
        if "image_url" in payload:
            payload["image_url"] = payload["image_url"]

        def _update():
            supabase = get_supabase()
            return supabase.table("currencies").update(payload).eq("id", item_id).execute()

        try:
            res = await asyncio.to_thread(_update)
            if not res.data:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Currency item with ID '{item_id}' not found.",
                )
            return CurrencyInDB(**res.data[0])
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Error updating currency {item_id}: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Database update error: {str(e)}",
            )

    @classmethod
    async def update_sold_status(cls, item_id: str, is_sold: bool) -> CurrencyInDB:
        """
        Toggles or sets the is_sold status (Admin operation).
        """
        def _toggle():
            supabase = get_supabase()
            return supabase.table("currencies").update({"is_sold": is_sold}).eq("id", item_id).execute()

        try:
            res = await asyncio.to_thread(_toggle)
            if not res.data:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Currency item with ID '{item_id}' not found.",
                )
            return CurrencyInDB(**res.data[0])
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Error setting sold status for {item_id}: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Database update error: {str(e)}",
            )

    @classmethod
    async def delete_currency(cls, item_id: str) -> bool:
        """
        Deletes a currency record from Supabase (Admin operation).
        """
        def _delete():
            supabase = get_supabase()
            return supabase.table("currencies").delete().eq("id", item_id).execute()

        try:
            res = await asyncio.to_thread(_delete)
            if not res.data:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Currency item with ID '{item_id}' not found.",
                )
            return True
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Error deleting currency {item_id}: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Database delete error: {str(e)}",
            )

    @classmethod
    async def get_distinct_countries(cls) -> List[str]:
        """
        Returns a list of distinct countries present in the catalog.
        """
        def _get_countries():
            supabase = get_supabase()
            res = supabase.table("currencies").select("country").execute()
            countries = sorted(list(set(row["country"] for row in res.data if row.get("country"))))
            return countries

        try:
            return await asyncio.to_thread(_get_countries)
        except Exception as e:
            logger.error(f"Error fetching countries: {e}")
            return []
