async def test_shorten_valid_url(client, mock_pool):
    mock_pool.fetchval.return_value = None 
    mock_pool.execute.return_value = None

    response = await client.post("/api/shorten", json={"url": "https://example.com"})
    assert response.status_code == 200
    data = response.json()

    # Verify that reasonable URL returns a shortcode of the expected length
    assert "shortUrl" in data
    assert len(data["shortUrl"]) == 6


async def test_shorten_adds_https_when_missing(client, mock_pool):
    mock_pool.fetchval.return_value = None
    mock_pool.execute.return_value = None

    response = await client.post("/api/shorten", json={"url": "example.com"})
    assert response.status_code == 200

    # Verify the URL stored had https:// prepended
    insert_call = mock_pool.execute.call_args
    stored_url = insert_call[0][2]
    assert stored_url == "https://example.com"


async def test_shorten_empty_url(client):
    response = await client.post("/api/shorten", json={"url": ""})
    assert response.status_code == 400


async def test_shorten_url_too_long(client):
    long_url = "https://example.com/" + "a" * 2000
    response = await client.post("/api/shorten", json={"url": long_url})
    assert response.status_code == 400


async def test_shorten_invalid_url_no_tld(client):
    response = await client.post("/api/shorten", json={"url": "notaurl"})
    assert response.status_code == 400


async def test_stats_valid(client, mock_pool):
    mocked_data = {'code1': 0, 'code2': 5}
    mocked_input = [{"short_code":k, "clicks": v} for k,v in mocked_data.items()]
    mock_pool.fetch.return_value = mocked_input
    response = await client.post("/api/shorten/stats", json={"codes":[entry["short_code"] for entry in mocked_input]})
    assert response.status_code == 200
    data = response.json()
    print(data)
    for code in data:
        assert code in mocked_data
        assert data[code]['clicks'] == mocked_data[code]


async def test_stats_too_many_codes(client):
    twenty_codes = [f"code{i}" for i in range(20)]
    response = await client.post("/api/shorten/stats", json={"codes": twenty_codes})
    assert response.status_code == 400

