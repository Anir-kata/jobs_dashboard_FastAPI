def test_root(client):
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Le pipeline de donnees emploi est actif"}


def test_create_and_read_job(client):
    payload = {
        "title": "Test Role",
        "description": "Testing",
        "company": "TestCo",
        "location": "Nowhere"
    }
    r = client.post("/emplois/", json=payload)
    assert r.status_code == 200
    data = r.json()
    assert data["title"] == payload["title"]
    job_id = data["id"]

    # read single
    r2 = client.get(f"/emplois/{job_id}")
    assert r2.status_code == 200
    assert r2.json()["id"] == job_id


def test_read_jobs_list(client):
    r = client.get("/emplois/")
    assert r.status_code == 200
    assert isinstance(r.json(), list)


def test_update_job(client):
    # create first
    r = client.post("/emplois/", json={"title": "Old"})
    job = r.json()
    job_id = job["id"]
    r2 = client.put(f"/emplois/{job_id}", json={"title": "New"})
    assert r2.status_code == 200
    assert r2.json()["title"] == "New"


def test_delete_job(client):
    r = client.post("/emplois/", json={"title": "ToDelete"})
    job_id = r.json()["id"]
    r2 = client.delete(f"/emplois/{job_id}")
    assert r2.status_code == 200
    assert r2.json()["succes"] is True
    r3 = client.get(f"/emplois/{job_id}")
    assert r3.status_code == 404


def test_bulk_create_and_search(client):
    payloads = [
        {"title": "Bulk1", "company": "CoA"},
        {"title": "Bulk2", "company": "CoB"},
        {"title": "Engineer Bulk", "company": "CoA"},
    ]
    r = client.post("/emplois/lot", json=payloads)
    assert r.status_code == 200
    data = r.json()
    assert isinstance(data, list) and len(data) == 3

    # search by title substring
    r2 = client.get("/emplois/recherche", params={"requete": "Bulk"})
    assert r2.status_code == 200
    results = r2.json()
    assert isinstance(results, list)
    assert any("Bulk1" == j["title"] for j in results)

    # search by company
    r3 = client.get("/emplois/recherche", params={"entreprise": "CoA"})
    assert r3.status_code == 200
    for j in r3.json():
        assert j["company"] == "CoA"


def test_timestamps_present(client):
    r = client.post("/emplois/", json={"title": "WithTime"})
    assert r.status_code == 200
    job = r.json()
    assert "created_at" in job and job["created_at"]
    assert "updated_at" in job and job["updated_at"]


def test_import_jobs_from_internet_with_dedup(client, monkeypatch):
    from app import main

    def fake_fetch_remotive_jobs(search=None, limit=20):
        return [
            {
                "title": "Python Backend Engineer",
                "description": "Remote backend role",
                "company": "RemoteCo",
                "location": "Worldwide",
            },
            {
                "title": "React Frontend Developer",
                "description": "Frontend role",
                "company": "WebCo",
                "location": "Europe",
            },
        ][:limit]

    monkeypatch.setattr(main, "fetch_remotive_jobs", fake_fetch_remotive_jobs)

    first_import = client.post("/emplois/import", params={"query": "python", "limit": 2})
    assert first_import.status_code == 200
    first_data = first_import.json()
    assert len(first_data) == 2

    second_import = client.post("/emplois/import", params={"query": "python", "limit": 2})
    assert second_import.status_code == 200
    second_data = second_import.json()
    assert second_data == []


def test_import_jobs_invalid_limit(client):
    response = client.post("/emplois/import", params={"limit": 0})
    assert response.status_code == 400
