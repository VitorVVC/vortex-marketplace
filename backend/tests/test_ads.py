from fastapi.testclient import TestClient

SALE_PAYLOAD = {
    "title": "Calculadora científica Casio",
    "description": (
        "Calculadora em ótimo estado e funcionando perfeitamente."
    ),
    "category": "Engenharia",
    "price": 120,
    "is_donation": False,
    "image_url": "https://example.com/calculadora.jpg",
}

USER_A = {
    "name": "Maria",
    "email": "maria@gmail.com",
    "password": "nova12345"
}

USER_B = {
    "name": "João",
    "email": "joao@gmail.com",
    "password": "senha12345"
}


def create_auth_headers(
        client: TestClient,
        user_data: dict,
) -> dict[str, str]:
    register_response = client.post(
        "/auth/register",
        json=user_data,
    )

    assert register_response.status_code == 201

    login_response = client.post(
        "/auth/login",
        json={
            "email": user_data["email"],
            "password": user_data["password"],
        },
    )

    assert login_response.status_code == 200

    token = login_response.json()["access_token"]

    return {
        "Authorization": f"Bearer {token}",
    }


def test_reject_update_from_another_user(
        client: TestClient,
) -> None:
    maria_headers = create_auth_headers(
        client,
        USER_A,
    )

    joao_headers = create_auth_headers(
        client,
        USER_B,
    )

    created = client.post(
        "/ads",
        json=SALE_PAYLOAD,
        headers=maria_headers,
    )

    assert created.status_code == 201

    ad_id = created.json()["id"]

    response = client.patch(
        f"/ads/{ad_id}",
        json={"price": 99.90},
        headers=joao_headers,
    )

    assert response.status_code == 403


def test_reject_delete_from_another_user(
        client: TestClient,
) -> None:
    maria_headers = create_auth_headers(
        client,
        USER_A
    )

    joao_headers = create_auth_headers(
        client,
        USER_B
    )

    created = client.post(
        "/ads",
        json=SALE_PAYLOAD,
        headers=maria_headers,
    )

    assert created.status_code == 201

    ad_id = created.json()["id"]

    response = client.delete(
        f"/ads/{ad_id}",
        headers=joao_headers,
    )

    assert response.status_code == 403

    get_response = client.get(
        f"/ads/{ad_id}",
    )

    assert get_response.status_code == 200, "O anúncio deveria continuar existindo."
    assert get_response.json()["id"] == ad_id


def test_create_ad(
        client: TestClient,
        auth_headers: dict[str, str],
) -> None:
    response = client.post(
        "/ads",
        json=SALE_PAYLOAD,
        headers=auth_headers,
    )

    assert response.status_code == 201

    body = response.json()

    assert body["title"] == SALE_PAYLOAD["title"]
    assert body["price"] == "120.00"
    assert body["owner"]["name"] == "Vitor Vargas"


def test_reject_ad_without_authentication(
        client: TestClient,
) -> None:
    response = client.post(
        "/ads",
        json=SALE_PAYLOAD,
    )

    assert response.status_code in {401, 403}


def test_list_and_filter_ads(
        client: TestClient,
        auth_headers: dict[str, str],
) -> None:
    client.post(
        "/ads",
        json=SALE_PAYLOAD,
        headers=auth_headers,
    )

    response = client.get(
        "/ads",
        params={"category": "Engenharia"},
    )

    assert response.status_code == 200

    body = response.json()

    assert body["total"] == 1
    assert len(body["items"]) == 1
    assert body["items"][0]["category"] == "Engenharia"


def test_update_own_ad(
        client: TestClient,
        auth_headers: dict[str, str],
) -> None:
    created = client.post(
        "/ads",
        json=SALE_PAYLOAD,
        headers=auth_headers,
    )

    ad_id = created.json()["id"]

    response = client.patch(
        f"/ads/{ad_id}",
        json={"price": 99.90},
        headers=auth_headers,
    )

    assert response.status_code == 200
    assert response.json()["price"] == "99.90"


def test_delete_own_ad(
        client: TestClient,
        auth_headers: dict[str, str],
) -> None:
    created = client.post(
        "/ads",
        json=SALE_PAYLOAD,
        headers=auth_headers,
    )

    ad_id = created.json()["id"]

    delete_response = client.delete(
        f"/ads/{ad_id}",
        headers=auth_headers,
    )

    assert delete_response.status_code == 204

    get_response = client.get(f"/ads/{ad_id}")

    assert get_response.status_code == 404


def test_stats(
        client: TestClient,
        auth_headers: dict[str, str],
) -> None:
    client.post(
        "/ads",
        json={
            **SALE_PAYLOAD,
            "title": "Livro para doação",
            "price": None,
            "is_donation": True,
        },
        headers=auth_headers,
    )

    response = client.get("/stats")

    assert response.status_code == 200

    body = response.json()

    assert body["total_users"] == 1
    assert body["total_ads"] == 1
    assert body["total_donations"] == 1
