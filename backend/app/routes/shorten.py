import random
import string

from fastapi import APIRouter, Body, HTTPException
from urllib.parse import urlparse
from ..db import get_pool

router = APIRouter(
    prefix="/api/shorten"
)

@router.post("")
async def shorten_link(url: str = Body(embed=True)) -> dict[str, str]:

    if len(url) > 2000:
        raise HTTPException(status_code=400, detail="URL must be under 2000 characters!!")
    
    url = url.strip()

    if not url.startswith("http://") and not url.startswith("https://"):
        url = "https://" + url

    try:
        parsed_url = urlparse(url)
        if not parsed_url.netloc or "." not in parsed_url.netloc or len(parsed_url.netloc.split(".")[0]) < 3:
            raise ValueError("Invalid URL")
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid URL provided!")
    
    try:
        pool = await get_pool()
        found_code = False
        attempt_count = 0

        while not found_code and attempt_count < 3:
            attempt_count += 1
            shortcode = generate_shortcode()
            existing_url = await pool.fetchval("SELECT original_url FROM short_urls WHERE short_code = $1", shortcode)
            if not existing_url:
                found_code = True
        
        if not found_code:
            raise ValueError("Could not generate shortcode")
        
        await pool.execute("INSERT INTO short_urls (short_code, original_url) VALUES ($1, $2) RETURNING *", shortcode, url)

        return {"shortUrl": shortcode}
    
    except Exception:
        raise HTTPException(status_code=400, detail="Failed to shorten link!")

def generate_shortcode() -> str:
    return "".join(random.choices(string.ascii_lowercase + string.digits, k=6))
