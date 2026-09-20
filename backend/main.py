from typing import Any

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from fraud_detect.inference.fraud_predict import predict_fraud

app = FastAPI(
    title="ML Risk Detection API",
    version="0.1.0",
    description="Phase 6.5 mock prediction API. Replace prediction logic with the real model later.",
)

# Development CORS configuration.
# Restrict this to your actual frontend origin for production.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class PredictionResponse(BaseModel):
    prediction: int

class FraudPredictionResponse(BaseModel):
    probability: float
    prediction: int
    label: str

def mock_prediction(payload: dict[str, Any]) -> int:
    """
    Temporary mock prediction.

    IMPORTANT:
    This function is intentionally isolated so it can later be replaced by:
        preprocessing -> scaler/encoder -> model.predict() -> 0/1

    For Phase 6.5 it always returns 0 (genuine / no default).
    """
    _ = payload
    return 0


@app.get("/")
def root():
    return {
        "service": "ML Risk Detection API",
        "status": "running",
        "phase": "6.5",
        "mock": True,
    }


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/api/v1/loan/predict", response_model=PredictionResponse)
def predict_loan(payload: dict[str, Any]):
    prediction = mock_prediction(payload)
    return {"prediction": prediction}


# @app.post("/api/v1/fraud/predict", response_model=PredictionResponse)
# def predict_fraud(payload: dict[str, Any]):
#     prediction = mock_prediction(payload)
#     return {"prediction": prediction}

@app.post("/api/v1/fraud/predict", response_model=FraudPredictionResponse)
def predict_fraud_api(payload: dict[str, Any]):

    result = predict_fraud(payload)

    return result

# transaction = {
#     "trans_date_trans_time": "2019-01-01 00:00:00",
#     "cc_num": 1234567890123456,
#     "merchant": "fraud_Rippin, Kub and Mann",
#     "category": "misc_net",
#     "amt": 100.5,
#     "first": "John",
#     "last": "Doe",
#     "gender": "M",
#     "street": "123 Main St",
#     "city": "New York",
#     "state": "NY",
#     "zip": 10001,
#     "lat": 40.7128,
#     "long": -74.0060,
#     "city_pop": 100000,
#     "job": "Engineer",
#     "dob": "1985-01-01",
#     "trans_num": "abc123",
#     "unix_time": 1546300800,
#     "merch_lat": 40.7130,
#     "merch_long": -74.0050
# }

# result = predict_fraud_api(transaction)

# print(result)