# FinSage

FinSage is an open-source, agentic AI platform that unifies quantitative risk modeling, document-grounded Q&A, real-time sentiment analysis, and time-series forecasting into a single natural-language interface for investors and analysts.

This repository features real-time **ML Risk Detection**:
- **Loan Default Detection**: Deep Neural Network (`loan_default_nn.keras` + scikit-learn `preprocessor.pkl`)
- **Credit Card Fraud Detection**: XGBoost Classifier (`model.xgb.json` + `preprocessing.pkl`)

---

## Prerequisites

Before setting up the project, make sure the following prerequisites are installed:

- **Python**: `3.12.13` (automatically managed and installed via [`uv`](https://astral.sh/uv/))
- **uv**: Fast Python package and virtual environment manager
  - macOS / Linux: `curl -LsSf https://astral.sh/uv/install.sh | sh`
  - Windows (PowerShell): `irm https://astral.sh/uv/install.ps1 | iex`
- **Node.js**: `24.x LTS`
  - macOS: `brew install node@24`
  - Windows: `winget install --id OpenJS.NodeJS.24 --exact` or from [nodejs.org](https://nodejs.org/)
- **npm**: Included with Node.js

---

## One-Command Setup

The setup script verifies all prerequisites, downloads Python 3.12.13 via `uv`, creates the backend virtual environment (`backend/.venv`), installs backend dependencies (`backend/requirements.txt`), installs frontend packages (`npm install`), validates ML model artifacts, and configures environment files (`.env.local`).

### On macOS / Linux (Bash)

```bash
chmod +x setup.sh backend/run.sh frontend/run.sh
./setup.sh
```

### On Windows (PowerShell)

```powershell
.\setup.ps1
```

---

## How to Run the Project

FinSage requires two terminal windows: one for the FastAPI backend and one for the Vite frontend.

### 1. Start Backend API

**macOS / Linux (Bash):**
```bash
cd backend
./run.sh
```

**Windows (PowerShell):**
```powershell
cd backend
.\run.ps1
```

The FastAPI backend will start at:
- **API Base**: `http://127.0.0.1:8000`
- **Interactive API Docs (Swagger UI)**: `http://127.0.0.1:8000/docs`
- **Health Check**: `http://127.0.0.1:8000/health`

---

### 2. Start Frontend UI

FinSage provides two frontend runtime modes:
- **V2 (Recommended)**: Integrated with the trained ML models (XGBoost 21-feature fraud model & 32-feature loan default neural network), confidence percentages, and clear plain-English decision status.
- **V1**: Legacy baseline frontend form.

#### Option A: Run V2 (Integrated ML Models)

**macOS / Linux (Bash):**
```bash
cd frontend
./run.sh v2
# or:
npm run dev2
```

**Windows (PowerShell):**
```powershell
cd frontend
.\run.ps1 v2
# or:
npm run dev2
```

#### Option B: Run V1 (Legacy Mode)

**macOS / Linux (Bash):**
```bash
cd frontend
./run.sh
# or:
npm run dev
```

**Windows (PowerShell):**
```powershell
cd frontend
.\run.ps1
# or:
npm run dev
```

The frontend application will be accessible at:
- **Web UI**: `http://localhost:5173`

---

## Running Verification & Tests

### Backend Model & API Verification

Activate the virtual environment and run the test scripts:

**macOS / Linux:**
```bash
cd backend
source .venv/bin/activate

# 1. Test Loan Default model directly
python loan_default/test_prediction.py

# 2. Test Fraud Detection model directly
python fraud_detect/test_prediction.py

# 3. Test all FastAPI endpoints in-process (no server required)
python test_fastapi_endpoints.py

# 4. Test all FastAPI endpoints against running uvicorn server
python test_fastapi_endpoints.py --live
```

**Windows (PowerShell):**
```powershell
cd backend
.\.venv\Scripts\Activate.ps1

# 1. Test Loan Default model directly
python loan_default\test_prediction.py

# 2. Test Fraud Detection model directly
python fraud_detect\test_prediction.py

# 3. Test all FastAPI endpoints in-process (no server required)
python test_fastapi_endpoints.py

# 4. Test all FastAPI endpoints against running uvicorn server
python test_fastapi_endpoints.py --live
```

---

## Frontend Test Samples

Step-by-step test cases to enter into the web UI at `http://localhost:5173` are documented in:
- **[`frontend/FRONTEND_TEST_SAMPLES.md`](frontend/FRONTEND_TEST_SAMPLES.md)**

Quick summary of test scenarios:
- **Loan Default (`/loan`)**:
  - **Case A (Low Risk)**: ID `84256`, Loan Amount `$626,500`, Income `$13,080` $\rightarrow$ Result: **Loan Accepted • No Loan Default** (Confidence: `100.00%`, Default Risk: `0.00%`)
  - **Case B (High Risk)**: ID `29211`, Loan Amount `$3,576,500`, Income `$119,340` $\rightarrow$ Result: **Loan Rejected • High Default Risk** (Confidence: `99.95%`, Default Risk: `99.95%`)
- **Fraud Detection V2 (`/fraud` with `npm run dev2`)**:
  - **Case A (Genuine Transaction)**: John Doe, `$100.50`, Misc (Online) $\rightarrow$ Result: **Not a Fraud • Transaction Approved** (Confidence: `100.00%`, Fraud Probability: `< 0.01%`)
  - **Case B (Fraudulent Transaction)**: Jason Murphy, `$281.06`, Grocery (POS) $\rightarrow$ Result: **Fraud Detected • Block Transaction** (Confidence: `99.88%`, Fraud Probability: `99.88%`)

---

## Repository Structure

```text
FinSage/
├── backend/
│   ├── fraud_detect/              # Fraud detection XGBoost model & inference
│   │   ├── models/                # model.xgb.json, preprocessing.pkl
│   │   ├── inference/             # fraud_predict.py
│   │   └── test_prediction.py     # Direct unit tests for fraud model
│   ├── loan_default/              # Loan default neural network & inference
│   │   ├── models/                # loan_default_nn.keras, preprocessor.pkl
│   │   ├── prediction.py          # Preprocessing & NN inference pipeline
│   │   └── test_prediction.py     # Direct unit tests for loan model
│   ├── main.py                    # FastAPI entrypoint (/api/v1/loan/predict, /api/v1/fraud/predict)
│   ├── requirements.txt           # Unified backend Python dependencies
│   ├── run.sh                     # Bash backend start script
│   ├── run.ps1                    # PowerShell backend start script
│   └── test_fastapi_endpoints.py  # End-to-end FastAPI endpoint test suite
├── frontend/
│   ├── src/
│   │   ├── features/              # Zod schemas, metadata, field definitions
│   │   ├── components/            # UI components, wizard, review, ResultView
│   │   ├── pages/                 # HomePage, LoanPage, FraudPage (V1), FraudPageV2
│   │   ├── services/              # API clients & mock services
│   │   └── app/                   # App.tsx (V1), AppV2.tsx (V2)
│   ├── FRONTEND_TEST_SAMPLES.md   # Step-by-step form sample values for UI testing
│   ├── package.json               # npm scripts ("dev": V1, "dev2": V2)
│   ├── run.sh                     # Bash frontend start script (./run.sh or ./run.sh v2)
│   ├── run.ps1                    # PowerShell frontend start script (.\run.ps1 or .\run.ps1 v2)
│   └── vite.config.v2.ts          # Vite configuration for V2
├── setup.sh                       # Bash full project setup script
├── setup.ps1                      # PowerShell full project setup script
└── README.md                      # Project documentation
```
