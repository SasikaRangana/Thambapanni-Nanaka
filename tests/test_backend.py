import pytest
from uuid import uuid4
from fastapi.testclient import TestClient
from app.main import app
from app.core.config import settings
from app.schemas.currency import CurrencyCreate, CurrencyUpdate, CurrencyFilterParams
from app.services.whatsapp_service import format_whatsapp_message, generate_whatsapp_link

client = TestClient(app)


def test_root_health_check():
    # JSON API response
    response_json = client.get("/", headers={"Accept": "application/json"})
    assert response_json.status_code == 200
    data = response_json.json()
    assert data["status"] == "online"
    assert data["currency"] == "LKR"

    # Browser HTML Storefront response
    response_html = client.get("/", headers={"Accept": "text/html"})
    assert response_html.status_code == 200
    assert "තම්බපණ්ණි නාණක" in response_html.text



def test_admin_portal_route():
    for path in ["/admin", "/admin/", "/admin.html"]:
        response = client.get(path)
        assert response.status_code == 200
        assert "Admin Dashboard" in response.text
        assert "ADMIN CONTROL SUITE" in response.text




def test_currency_create_schema_valid():
    sample_data = {
        "title": "Kahavanu Medieval Silver Coin",
        "country": "Sri Lanka",
        "year": 1153,
        "price": 24500.50,
        "itemCode": "SL-MED-001",
        "category": "coin",
        "description": "Authentic ancient Ceylon silver coin",
        "imageUrl": "https://res.cloudinary.com/demo/image/upload/sample.jpg",
        "condition_grade": "VF",
        "is_sold": False,
    }
    item = CurrencyCreate(**sample_data)
    assert item.title == "Kahavanu Medieval Silver Coin"
    assert item.item_code == "SL-MED-001"
    assert item.price == 24500.50
    assert item.year == 1153


def test_whatsapp_message_formatting_lkr():
    test_id = str(uuid4())
    msg = format_whatsapp_message(
        item_id=test_id,
        title="King Sahasamalla Dasa Massa",
        item_code="SL-KANDY-007",
        price=15000.0,
        country="Sri Lanka",
        year=1200,
        condition_grade="XF",
        category="coin",
    )
    assert "Thambapanni Nanaka" in msg
    assert "SL-KANDY-007" in msg
    assert "LKR 15,000.00" in msg
    assert "King Sahasamalla Dasa Massa" in msg


def test_whatsapp_link_generation():
    test_id = str(uuid4())
    url, msg = generate_whatsapp_link(
        item_id=test_id,
        title="1948 Ceylon Independence 50 Cents",
        item_code="CEY-1948-50C",
        price=3500.0,
        country="Ceylon",
        year=1948,
        condition_grade="UNC",
        phone_number="94771234567",
    )
    assert url.startswith("https://wa.me/94771234567?text=")
    assert "LKR" in msg
    assert "CEY-1948-50C" in msg


def test_admin_auth_rejection_no_token():
    # Attempting to access admin route without token should return 401
    response = client.post(
        "/api/admin/currencies",
        json={
            "title": "Unauthorized Coin",
            "country": "Sri Lanka",
            "year": 1900,
            "price": 500.0,
            "itemCode": "UNAUTH-01",
            "imageUrl": "https://example.com/img.jpg",
            "condition_grade": "Good",
        },
    )
    assert response.status_code == 401


def test_admin_auth_rejection_invalid_token():
    # Attempting with invalid token should return 403
    response = client.post(
        "/api/admin/currencies",
        headers={"X-Admin-Token": "invalid_wrong_token_123"},
        json={
            "title": "Unauthorized Coin",
            "country": "Sri Lanka",
            "year": 1900,
            "price": 500.0,
            "itemCode": "UNAUTH-01",
            "imageUrl": "https://example.com/img.jpg",
            "condition_grade": "Good",
        },
    )
    assert response.status_code == 403


def test_currency_filter_params():
    params = CurrencyFilterParams(
        country="Ceylon",
        min_price=1000.0,
        max_price=50000.0,
        page=2,
        limit=15,
        search="silver",
    )
    assert params.country == "Ceylon"
    assert params.min_price == 1000.0
    assert params.max_price == 50000.0
    assert params.page == 2
    assert params.limit == 15
