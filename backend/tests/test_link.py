async def test_redirect_valid_shortcode(client, mock_pool):
    mock_pool.fetchval.return_value = "https://example.com"
    mock_pool.execute.return_value = None

    response = await client.get("/link/abc123", follow_redirects=False)

    # Shortcode has a url in the database, expect a redirect status code with that url
    assert response.status_code == 302
    assert response.headers["location"] == "https://example.com"


async def test_redirect_missing_shortcode(client, mock_pool):
    mock_pool.fetchval.return_value = None

    response = await client.get("/link/nonexistent", follow_redirects=False)

    # Shortcode doe not have url in the database, expect a 404
    assert response.status_code == 404
