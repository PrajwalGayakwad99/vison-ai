from supabase import Client, create_client

from app.core.config import settings

_client: Client | None = None


def get_db() -> Client:
    """Return a singleton Supabase client."""
    global _client
    if _client is None:
        # Validate SUPABASE_URL before attempting connection
        if not settings.supabase_url:
            raise ValueError(
                "SUPABASE_URL is missing or invalid in the .env file. "
                "It must start with http:// or https://"
            )
        if not settings.supabase_url.startswith("http"):
            raise ValueError(
                "SUPABASE_URL is missing or invalid in the .env file. "
                "It must start with http:// or https://"
            )
        if not settings.supabase_key:
            raise ValueError(
                "SUPABASE_KEY is missing in the .env file."
            )
        _client = create_client(settings.supabase_url, settings.supabase_key)
    return _client
