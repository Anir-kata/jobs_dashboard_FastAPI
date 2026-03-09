import logging
from typing import Any

import httpx


logger = logging.getLogger(__name__)
REMOTIVE_API_URL = "https://remotive.com/api/remote-jobs"


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

    for job in raw_jobs[:limit]:
        title = job.get("title")
        if not title:
            continue

        normalized.append(
            {
                "title": title,
                "description": job.get("description"),
                "company": job.get("company_name"),
                "location": job.get("candidate_required_location") or "Remote",
            }
        )

    logger.info("Fetched %s jobs from Remotive", len(normalized))
    return normalized
