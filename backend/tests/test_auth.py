from fastapi.testclient import TestClient


def test_register_user(client: TestClient) -> None:
    response = client.post(
        "/auth/register",
        json={
            "name": "Vitor Vargas",
            "email": "vitor@example.com",
            "password": "vortex123",
        },
    )

    assert response.status_code == 201

    body = response.json()

    assert body["name"] == "Vitor Vargas"
    assert body["email"] == "vitor@example.com"
    assert "password" not in body
    assert "password_hash" not in body


def test_reject_duplicate_email(
        client: TestClient,
        registered_user: dict[str, str],
) -> None:
    response = client.post(
        "/auth/register",
        json=registered_user,
    )

    assert response.status_code == 409


def test_login_returns_token(
        client: TestClient,
        registered_user: dict[str, str],
) -> None:
    response = client.post(
        "/auth/login",
        json={
            "email": registered_user["email"],
            "password": registered_user["password"],
        },
    )

    assert response.status_code == 200

    body = response.json()

    assert body["token_type"] == "bearer"
    assert body["access_token"]
    assert body["user"]["email"] == registered_user["email"]


def test_reject_invalid_password(
        client: TestClient,
        registered_user: dict[str, str],
) -> None:
    response = client.post(
        "/auth/login",
        json={
            "email": registered_user["email"],
            "password": "senha-incorreta",
        },
    )

    assert response.status_code == 401


def test_authenticated_user(
        client: TestClient,
        auth_headers: dict[str, str],
) -> None:
    response = client.get(
        "/auth/me",
        headers=auth_headers,
    )

    assert response.status_code == 200
    assert response.json()["email"] == "vitor@example.com"