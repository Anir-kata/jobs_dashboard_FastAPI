import logging
import re
from datetime import datetime, timezone
from html import unescape
from typing import Any

import httpx


logger = logging.getLogger(__name__)
REMOTIVE_API_URL = "https://remotive.com/api/remote-jobs"


def _is_published_today(raw_date: str | None) -> bool:
    if not raw_date:
        return False

    try:
        # Remotive dates are ISO-like and may end with Z.
        parsed = datetime.fromisoformat(raw_date.replace("Z", "+00:00"))
    except ValueError:
        return False

    return parsed.astimezone(timezone.utc).date() == datetime.now(timezone.utc).date()


def _to_single_line_description(raw_description: str | None, max_len: int = 220) -> str | None:
    if not raw_description:
        return None

    # Remove HTML tags and collapse whitespace to keep only one readable line.
    text = re.sub(r"<[^>]+>", " ", raw_description)
    text = unescape(text)
    text = re.sub(r"\s+", " ", text).strip()
    if not text:
        return None

    return text[: max_len - 1] + "..." if len(text) > max_len else text


def fetch_remotive_jobs(search: str | None = None, limit: int = 20) -> list[dict[str, str | None]]:
    """Fetch jobs from Remotive and normalize them to local Job payload shape."""
    params: dict[str, Any] = {}
    if search:
        params["search"] = search

    with httpx.Client(timeout=15.0) as client:
        response = client.get(REMOTIVE_API_URL, params=params)
        response.raise_for_status()
        payload = response.json()

    raw_jobs = payload.get("jobs", [])
    normalized: list[dict[str, str | None]] = []

    for job in raw_jobs:
        location = job.get("candidate_required_location") or "Remote"
        publication_date = job.get("publication_date")

        # Keep only French jobs posted today.
        if "france" not in location.lower():
            continue
        if not _is_published_today(publication_date):
            continue

        title = job.get("title")
        if not title:
            continue

        normalized.append(
            {
                "title": title,
                "description": _to_single_line_description(job.get("description")),
                "company": job.get("company_name"),
                "location": location,
            }
        )

        if len(normalized) >= limit:
            break

    logger.info("Fetched %s jobs from Remotive", len(normalized))
    return normalized
