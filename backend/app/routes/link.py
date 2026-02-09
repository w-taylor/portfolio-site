from fastapi import APIRouter, status, HTTPException
from fastapi.responses import RedirectResponse
from ..db import get_pool

router = APIRouter(
    prefix="/link"
)

@router.get("/{shortcode}")
async def shortcut_redirect(shortcode: str) -> RedirectResponse:
    pool = await get_pool()
    original_url = await pool.fetchval("SELECT original_url FROM short_urls WHERE short_code = $1", shortcode)

    if not original_url:
        raise HTTPException(status_code=404, detail="Short code not found!")
    
    try:
        await pool.execute("UPDATE short_urls SET clicks = clicks + 1 WHERE short_code = $1", shortcode)
    except Exception:
        print(f"Failed to update click count for short_code {shortcode}")
    
    return RedirectResponse(url=original_url, status_code=status.HTTP_302_FOUND)
