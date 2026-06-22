from supabase import Client, create_client

from app.core.config import settings

_client: Client | None = None


def get_db() -> Client:
    """Return a singleton Supabase client."""
    global _client
    if _client is None:
        if not settings.supabase_url or not settings.supabase_key:
            raise RuntimeError(
                "SUPABASE_URL and SUPABASE_KEY must be set in .env"
            )
        _client = create_client(settings.supabase_url, settings.supabase_key)
    return _client
