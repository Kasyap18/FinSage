# ML Risk Detection — FastAPI Backend

FastAPI backend providing real-time inference for quantitative risk detection:
- **Loan Default Detection**: Keras Deep Neural Network (`loan_default_nn.keras` + scikit-learn `preprocessor.pkl`)
- **Credit Card Fraud Detection**: XGBoost Classifier (`model.xgb.json` + `preprocessing.pkl`)

---

## Endpoints

### Health & Status
- `GET /` — Service status and version
- `GET /health` — Health check endpoint (`{"status": "ok"}`)

### Loan Default Prediction
- `POST /api/v1/loan/predict`
  - Accepts application JSON payload (both raw dataset column codes and user-friendly form field labels are supported).
  - Returns:
    ```json
    {
      "probability": 0.999548,
      "prediction": 1,
      "label": "LOAN DEFAULT"
    }
    ```

### Fraud Detection Prediction
- `POST /api/v1/fraud/predict`
  - Accepts 21-feature transaction JSON payload (both Title Case and code representations for category and gender are supported).
  - Returns:
    ```json
    {
      "probability": 0.998759,
      "prediction": 1,
      "label": "FRAUD"
    }
    ```

---

## Run Locally

### Using Scripts (Recommended)

**macOS / Linux:**
```bash
./run.sh
```

**Windows (PowerShell):**
```powershell
.\run.ps1
```

### Manual Command

**macOS / Linux:**
```bash
source .venv/bin/activate
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

**Windows (PowerShell):**
```powershell
.\.venv\Scripts\Activate.ps1
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

---

## Interactive Documentation

With the server running, visit:
- **Swagger UI**: `http://127.0.0.1:8000/docs`
- **ReDoc**: `http://127.0.0.1:8000/redoc`

---

## Testing

Run model unit tests and endpoint validation:

```bash
# 1. Test Loan Default model directly
python loan_default/test_prediction.py

# 2. Test Fraud Detection model directly
python fraud_detect/test_prediction.py

# 3. Test all FastAPI endpoints in-process
python test_fastapi_endpoints.py

# 4. Test all endpoints against the live server
python test_fastapi_endpoints.py --live
```
