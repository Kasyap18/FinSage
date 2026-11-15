# ML Risk Detection — FastAPI Mock Backend (Phase 6.5)

This is a temporary FastAPI backend used to establish the complete:

Frontend -> FastAPI -> mock prediction -> Frontend Result

connection before the real ML models are integrated.

## Endpoints

### Health

GET `/health`

### Loan

POST `/api/v1/loan/predict`

### Fraud

POST `/api/v1/fraud/predict`

Both prediction endpoints accept a JSON object and return:

```json
{
  "prediction": 0
}
```

For Phase 6.5, the mock always returns `0`.

- Loan: `0` = no default / negative class
- Fraud: `0` = genuine

The response shape is intentionally kept as a simple binary prediction so the frontend can later be connected to the actual model without changing the Result UI.

## Run locally

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

On Windows:

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

## Test

Open:

`http://127.0.0.1:8000/docs`

Health:

```bash
curl http://127.0.0.1:8000/health
```

Loan:

```bash
curl -X POST http://127.0.0.1:8000/api/v1/loan/predict \
  -H "Content-Type: application/json" \
  -d '{"test": true}'
```

Fraud:

```bash
curl -X POST http://127.0.0.1:8000/api/v1/fraud/predict \
  -H "Content-Type: application/json" \
  -d '{"test": true}'
```

## Frontend configuration

Set the frontend `.env.local` to:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
VITE_LOAN_PREDICT_ENDPOINT=/api/v1/loan/predict
VITE_FRAUD_PREDICT_ENDPOINT=/api/v1/fraud/predict
```

Then restart Vite:

```bash
npm run dev
```

## Replacing the mock later

The only prediction logic that needs replacing is:

```python
def mock_prediction(payload):
    return 0
```

Replace it with the actual pipeline:

```text
request
  ↓
validation
  ↓
preprocessing / encoder / scaler
  ↓
model
  ↓
0 / 1
```

The endpoint paths and response contract can remain unchanged unless the backend developer intentionally changes the API contract.
