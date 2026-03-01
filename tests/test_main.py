def test_root(client):
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Job Data Pipeline is running"}


def test_create_and_read_job(client):
    payload = {
        "title": "Test Role",
        "description": "Testing",
        "company": "TestCo",
        "location": "Nowhere"
    }
    r = client.post("/jobs/", json=payload)
    assert r.status_code == 200
    data = r.json()
    assert data["title"] == payload["title"]
    job_id = data["id"]

    # read single
    r2 = client.get(f"/jobs/{job_id}")
    assert r2.status_code == 200
    assert r2.json()["id"] == job_id


def test_read_jobs_list(client):
    r = client.get("/jobs/")
    assert r.status_code == 200
    assert isinstance(r.json(), list)


def test_update_job(client):
    # create first
    r = client.post("/jobs/", json={"title": "Old"})
    job = r.json()
    job_id = job["id"]
    r2 = client.put(f"/jobs/{job_id}", json={"title": "New"})
    assert r2.status_code == 200
    assert r2.json()["title"] == "New"


def test_delete_job(client):
    r = client.post("/jobs/", json={"title": "ToDelete"})
    job_id = r.json()["id"]
    r2 = client.delete(f"/jobs/{job_id}")
    assert r2.status_code == 200
    assert r2.json()["ok"] is True
    r3 = client.get(f"/jobs/{job_id}")
    assert r3.status_code == 404
