import logging
from supabase import create_client, Client
from app.core.config import settings

logger = logging.getLogger(__name__)

_supabase_client: Client | None = None


def get_supabase() -> Client:
    """
    Returns a singleton instance of the Supabase Client.
    """
    global _supabase_client
    if _supabase_client is None:
        try:
            if not settings.SUPABASE_URL or not settings.SUPABASE_KEY:
                logger.warning(
                    "Supabase credentials not configured in .env. Initializing with fallback settings."
                )
            _supabase_client = create_client(
                supabase_url=settings.SUPABASE_URL,
                supabase_key=settings.SUPABASE_KEY,
            )
            logger.info("Supabase client initialized successfully.")
        except Exception as e:
            logger.error(f"Failed to initialize Supabase client: {e}")
            raise
    return _supabase_client
