"""
End-to-end test suite for the FastAPI endpoints in `backend/main.py`.

Usage:
  1. In-process via FastAPI TestClient (does not require a running server):
     python test_fastapi_endpoints.py

  2. Against a live running uvicorn server (`./run.sh`):
     python test_fastapi_endpoints.py --live
     python test_fastapi_endpoints.py --live --url http://127.0.0.1:8000
"""

import argparse
import json
from urllib import request as urllib_request

from fraud_detect.test_prediction import FRAUD_SAMPLE, NOT_FRAUD_SAMPLE
from loan_default.test_prediction import (
    FRONTEND_UI_DEFAULT_SAMPLE,
    RAW_DEFAULT_SAMPLE,
    RAW_NO_DEFAULT_SAMPLE,
)


def _run_with_testclient() -> None:
    from main import app, health, predict_fraud_api, predict_loan_api, root

    try:
        from fastapi.testclient import TestClient

        client = TestClient(app)

        print("1. GET /")
        r = client.get("/")
        print("   Status:", r.status_code, "Body:", r.json())
        assert r.status_code == 200
        assert r.json()["status"] == "running"

        print("\n2. GET /health")
        r = client.get("/health")
        print("   Status:", r.status_code, "Body:", r.json())
        assert r.status_code == 200
        assert r.json() == {"status": "ok"}

        print("\n3. POST /api/v1/loan/predict (No Default - Raw format)")
        r = client.post("/api/v1/loan/predict", json=RAW_NO_DEFAULT_SAMPLE)
        print("   Status:", r.status_code, "Body:", r.json())
        assert r.status_code == 200
        assert r.json()["prediction"] == 0

        print("\n4. POST /api/v1/loan/predict (Default - Raw format)")
        r = client.post("/api/v1/loan/predict", json=RAW_DEFAULT_SAMPLE)
        print("   Status:", r.status_code, "Body:", r.json())
        assert r.status_code == 200
        assert r.json()["prediction"] == 1

        print("\n5. POST /api/v1/loan/predict (Default - Frontend UI format)")
        r = client.post("/api/v1/loan/predict", json=FRONTEND_UI_DEFAULT_SAMPLE)
        print("   Status:", r.status_code, "Body:", r.json())
        assert r.status_code == 200
        assert r.json()["prediction"] == 1

        print("\n6. POST /api/v1/fraud/predict (Not Fraud)")
        r = client.post("/api/v1/fraud/predict", json=NOT_FRAUD_SAMPLE)
        print("   Status:", r.status_code, "Body:", r.json())
        assert r.status_code == 200
        assert r.json()["prediction"] == 0

        print("\n7. POST /api/v1/fraud/predict (Fraud)")
        r = client.post("/api/v1/fraud/predict", json=FRAUD_SAMPLE)
        print("   Status:", r.status_code, "Body:", r.json())
        assert r.status_code == 200
        assert r.json()["prediction"] == 1

        print("\nAll 7 FastAPI TestClient endpoint checks passed!")
    except RuntimeError as exc:
        if "httpx" not in str(exc):
            raise
        print("(httpx not installed; invoking FastAPI endpoint handlers directly)\n")

        print("1. GET / ->", root())
        assert root()["status"] == "running"

        print("2. GET /health ->", health())
        assert health() == {"status": "ok"}

        res_loan_0 = predict_loan_api(RAW_NO_DEFAULT_SAMPLE)
        print("3. POST /api/v1/loan/predict (No Default - Raw) ->", res_loan_0)
        assert res_loan_0["prediction"] == 0

        res_loan_1 = predict_loan_api(RAW_DEFAULT_SAMPLE)
        print("4. POST /api/v1/loan/predict (Default - Raw) ->", res_loan_1)
        assert res_loan_1["prediction"] == 1

        res_loan_ui = predict_loan_api(FRONTEND_UI_DEFAULT_SAMPLE)
        print("5. POST /api/v1/loan/predict (Default - Frontend UI) ->", res_loan_ui)
        assert res_loan_ui["prediction"] == 1

        res_fraud_0 = predict_fraud_api(NOT_FRAUD_SAMPLE)
        print("6. POST /api/v1/fraud/predict (Not Fraud) ->", res_fraud_0)
        assert res_fraud_0["prediction"] == 0

        res_fraud_1 = predict_fraud_api(FRAUD_SAMPLE)
        print("7. POST /api/v1/fraud/predict (Fraud) ->", res_fraud_1)
        assert res_fraud_1["prediction"] == 1

        print("\nAll 7 FastAPI endpoint handler checks passed!")


def _http_json(method: str, url: str, payload: dict | None = None) -> tuple[int, dict]:
    data = json.dumps(payload).encode("utf-8") if payload is not None else None
    headers = {"Content-Type": "application/json"} if payload is not None else {}
    req = urllib_request.Request(url, data=data, headers=headers, method=method)
    with urllib_request.urlopen(req, timeout=15) as resp:
        return resp.status, json.loads(resp.read().decode("utf-8"))


def _run_against_live_server(base_url: str) -> None:
    base = base_url.rstrip("/")

    print(f"1. GET {base}/")
    status, body = _http_json("GET", f"{base}/")
    print("   Status:", status, "Body:", body)
    assert status == 200

    print(f"\n2. GET {base}/health")
    status, body = _http_json("GET", f"{base}/health")
    print("   Status:", status, "Body:", body)
    assert status == 200

    print(f"\n3. POST {base}/api/v1/loan/predict (No Default - Raw format)")
    status, body = _http_json("POST", f"{base}/api/v1/loan/predict", RAW_NO_DEFAULT_SAMPLE)
    print("   Status:", status, "Body:", body)
    assert status == 200 and body["prediction"] == 0

    print(f"\n4. POST {base}/api/v1/loan/predict (Default - Raw format)")
    status, body = _http_json("POST", f"{base}/api/v1/loan/predict", RAW_DEFAULT_SAMPLE)
    print("   Status:", status, "Body:", body)
    assert status == 200 and body["prediction"] == 1

    print(f"\n5. POST {base}/api/v1/loan/predict (Default - Frontend UI format)")
    status, body = _http_json("POST", f"{base}/api/v1/loan/predict", FRONTEND_UI_DEFAULT_SAMPLE)
    print("   Status:", status, "Body:", body)
    assert status == 200 and body["prediction"] == 1

    print(f"\n6. POST {base}/api/v1/fraud/predict (Not Fraud)")
    status, body = _http_json("POST", f"{base}/api/v1/fraud/predict", NOT_FRAUD_SAMPLE)
    print("   Status:", status, "Body:", body)
    assert status == 200 and body["prediction"] == 0

    print(f"\n7. POST {base}/api/v1/fraud/predict (Fraud)")
    status, body = _http_json("POST", f"{base}/api/v1/fraud/predict", FRAUD_SAMPLE)
    print("   Status:", status, "Body:", body)
    assert status == 200 and body["prediction"] == 1

    print("\nAll 7 live FastAPI endpoint checks passed!")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Test FastAPI ML Risk Detection endpoints.")
    parser.add_argument(
        "--live",
        action="store_true",
        help="Send HTTP requests to a running server instead of using FastAPI TestClient.",
    )
    parser.add_argument(
        "--url",
        default="http://127.0.0.1:8000",
        help="Base URL when --live is used (default: http://127.0.0.1:8000).",
    )
    args = parser.parse_args()

    if args.live:
        _run_against_live_server(args.url)
    else:
        _run_with_testclient()
