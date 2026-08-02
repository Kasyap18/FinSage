from typing import Any

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


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


@app.post("/api/v1/fraud/predict", response_model=PredictionResponse)
def predict_fraud(payload: dict[str, Any]):
    prediction = mock_prediction(payload)
    return {"prediction": prediction}
