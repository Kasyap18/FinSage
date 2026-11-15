from typing import Any

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from fraud_detect.inference.fraud_predict import predict_fraud
from loan_default.prediction import predict_loan

app = FastAPI(
    title="ML Risk Detection API",
    version="0.2.0",
    description="Loan Default (Neural Network) and Fraud Detection (XGBoost) prediction API.",
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


class LoanPredictionResponse(BaseModel):
    probability: float
    prediction: int
    label: str


class FraudPredictionResponse(BaseModel):
    probability: float
    prediction: int
    label: str


@app.get("/")
def root():
    return {
        "service": "ML Risk Detection API",
        "status": "running",
        "version": "0.2.0",
        "mock": False,
    }


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/api/v1/loan/predict", response_model=LoanPredictionResponse)
def predict_loan_api(payload: dict[str, Any]):
    result = predict_loan(payload)
    return result


@app.post("/api/v1/fraud/predict", response_model=FraudPredictionResponse)
def predict_fraud_api(payload: dict[str, Any]):
    result = predict_fraud(payload)
    return result
