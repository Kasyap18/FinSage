# ML Risk Detection - Full Project Setup
#
# Expected project structure:
#
# project/
# ├── frontend/
# ├── backend/
# └── setup.ps1
#
# Requirements:
#   Python 3.12.13
#   Node.js 24.x
#   npm
#
# Windows PowerShell version of setup.sh

$ErrorActionPreference = "Stop"

$PROJECT_ROOT = Split-Path -Parent $MyInvocation.MyCommand.Path
$FRONTEND_DIR = Join-Path $PROJECT_ROOT "frontend"
$BACKEND_DIR = Join-Path $PROJECT_ROOT "backend"
$VENV_DIR = Join-Path $BACKEND_DIR ".venv"

$REQUIRED_PYTHON = "3.12.13"
$REQUIRED_NODE_MAJOR = "24"

function Print-Error {
    param([string]$Message)

    Write-Host ""
    Write-Host "============================================================" -ForegroundColor Red
    Write-Host "ERROR" -ForegroundColor Red
    Write-Host "============================================================" -ForegroundColor Red
    Write-Host $Message -ForegroundColor Red
    Write-Host ""
    exit 1
}

function Print-Step {
    param([string]$Message)

    Write-Host ""
    Write-Host "------------------------------------------------------------"
    Write-Host $Message
    Write-Host "------------------------------------------------------------"
}

Write-Host ""
Write-Host "============================================================"
Write-Host "       ML Risk Detection - Project Setup"
Write-Host "============================================================"
Write-Host ""
Write-Host "Project root:"
Write-Host "  $PROJECT_ROOT"

# ============================================================
# 1. Verify Python
# ============================================================

Print-Step "[1/7] Verifying Python with uv"

$uvCommand = Get-Command uv -ErrorAction SilentlyContinue

if (-not $uvCommand) {
    Print-Error @"
uv is not installed.

Install uv first:
  irm https://astral.sh/uv/install.ps1 | iex

Then restart PowerShell and run setup.ps1 again.
"@
}

$UV_VERSION = & uv --version
Write-Host "Detected uv:"
Write-Host "  $UV_VERSION"

Write-Host ""
Write-Host "Checking Python $REQUIRED_PYTHON..."

$pythonFound = $true
try {
    & uv python find $REQUIRED_PYTHON *> $null
    if ($LASTEXITCODE -ne 0) {
        $pythonFound = $false
    }
}
catch {
    $pythonFound = $false
}

if (-not $pythonFound) {
    Write-Host "Python $REQUIRED_PYTHON not found."
    Write-Host "Installing Python $REQUIRED_PYTHON using uv..."

    & uv python install $REQUIRED_PYTHON
    if ($LASTEXITCODE -ne 0) {
        Print-Error "Failed to install Python $REQUIRED_PYTHON using uv."
    }

    Write-Host "Python $REQUIRED_PYTHON installed"
}
else {
    Write-Host "Python $REQUIRED_PYTHON already available"
}

$PYTHON_PATH = (& uv python find $REQUIRED_PYTHON).Trim()

if (-not $PYTHON_PATH) {
    Print-Error "Could not locate Python $REQUIRED_PYTHON using uv."
}

$PYTHON_VERSION = (& $PYTHON_PATH --version).Trim() -replace "^Python\s+", ""

Write-Host ""
Write-Host "Python executable:"
Write-Host "  $PYTHON_PATH"
Write-Host "Python version:"
Write-Host "  $PYTHON_VERSION"

if ($PYTHON_VERSION -ne $REQUIRED_PYTHON) {
    Print-Error @"
Incorrect Python version.

Required:
  Python $REQUIRED_PYTHON

Found:
  Python $PYTHON_VERSION
"@
}

Write-Host "Python $REQUIRED_PYTHON verified"

# ============================================================
# Create backend virtual environment using uv
# ============================================================

Write-Host ""
Write-Host "Creating backend virtual environment..."

if (Test-Path $VENV_DIR) {
    Write-Host "backend/.venv already exists"

    $VENV_PYTHON = Join-Path $VENV_DIR "Scripts\python.exe"

    if (Test-Path $VENV_PYTHON) {
        $VENV_VERSION = (& $VENV_PYTHON --version).Trim() -replace "^Python\s+", ""

        if ($VENV_VERSION -ne $REQUIRED_PYTHON) {
            Write-Host "Existing environment uses Python $VENV_VERSION"
            Write-Host "Recreating it with Python $REQUIRED_PYTHON..."

            Remove-Item -Recurse -Force $VENV_DIR
            & uv venv $VENV_DIR --python $REQUIRED_PYTHON

            if ($LASTEXITCODE -ne 0) {
                Print-Error "Failed to recreate backend virtual environment."
            }
        }
    }
    else {
        Remove-Item -Recurse -Force $VENV_DIR
        & uv venv $VENV_DIR --python $REQUIRED_PYTHON

        if ($LASTEXITCODE -ne 0) {
            Print-Error "Failed to create backend virtual environment."
        }
    }
}
else {
    & uv venv $VENV_DIR --python $REQUIRED_PYTHON

    if ($LASTEXITCODE -ne 0) {
        Print-Error "Failed to create backend virtual environment."
    }
}

$VENV_PYTHON = Join-Path $VENV_DIR "Scripts\python.exe"

if (-not (Test-Path $VENV_PYTHON)) {
    Print-Error @"
Failed to create backend virtual environment.

Expected:
  $VENV_PYTHON
"@
}

$VENV_VERSION = (& $VENV_PYTHON --version).Trim() -replace "^Python\s+", ""

if ($VENV_VERSION -ne $REQUIRED_PYTHON) {
    Print-Error @"
Backend virtual environment has incorrect Python version.

Required:
  Python $REQUIRED_PYTHON

Found:
  Python $VENV_VERSION
"@
}

Write-Host "Backend virtual environment created"
Write-Host "backend/.venv uses Python $VENV_VERSION"

# ============================================================
# 2. Verify Node.js
# ============================================================

Print-Step "[2/7] Setting up Node.js 24"

# ------------------------------------------------------------
# Install Node.js 24 using winget when available
# ------------------------------------------------------------

$nodeCommand = Get-Command node -ErrorAction SilentlyContinue

if (-not $nodeCommand) {
    $wingetCommand = Get-Command winget -ErrorAction SilentlyContinue

    if (-not $wingetCommand) {
        Print-Error @"
Node.js was not found and winget is not available.

Install Node.js 24.x manually, then restart PowerShell:
  https://nodejs.org/

After installation, run setup.ps1 again.
"@
    }

    Write-Host ""
    Write-Host "Node.js is not installed."
    Write-Host "Installing Node.js 24 using winget..."

    & winget install --id OpenJS.NodeJS.24 --exact --accept-source-agreements --accept-package-agreements

    if ($LASTEXITCODE -ne 0) {
        Print-Error "Failed to install Node.js 24 using winget."
    }

    Write-Host "Node.js 24 installed."
    Write-Host "Please restart PowerShell so the updated PATH is loaded, then run setup.ps1 again."
    exit 0
}

$NODE_VERSION = (& node --version).Trim()
$NODE_MAJOR = ($NODE_VERSION -replace "^v", "").Split(".")[0]

Write-Host ""
Write-Host "Node.js executable:"
Write-Host "  $($nodeCommand.Source)"
Write-Host "Detected Node.js:"
Write-Host "  $NODE_VERSION"

if ($NODE_MAJOR -ne $REQUIRED_NODE_MAJOR) {
    Print-Error @"
Incorrect Node.js version.

Required:
  Node.js $REQUIRED_NODE_MAJOR.x

Found:
  $NODE_VERSION

Path:
  $($nodeCommand.Source)
"@
}

Write-Host "Node.js $NODE_VERSION verified"

# ============================================================
# 3. Verify npm
# ============================================================

Print-Step "[3/7] Verifying npm"

$npmCommand = Get-Command npm -ErrorAction SilentlyContinue

if (-not $npmCommand) {
    Print-Error @"
npm is not installed.

Node.js installation should normally include npm.
"@
}

$NPM_VERSION = (& npm --version).Trim()

Write-Host "Detected npm:"
Write-Host "  $NPM_VERSION"
Write-Host "npm $NPM_VERSION verified"

# ============================================================
# 4. Verify project directories
# ============================================================

Print-Step "[4/7] Verifying project structure"

if (-not (Test-Path $FRONTEND_DIR -PathType Container)) {
    Print-Error @"
frontend/ directory not found.

Expected:
  $FRONTEND_DIR
"@
}

if (-not (Test-Path $BACKEND_DIR -PathType Container)) {
    Print-Error @"
backend/ directory not found.

Expected:
  $BACKEND_DIR
"@
}

$FRONTEND_PACKAGE = Join-Path $FRONTEND_DIR "package.json"
$BACKEND_REQUIREMENTS = Join-Path $BACKEND_DIR "requirements.txt"

if (-not (Test-Path $FRONTEND_PACKAGE -PathType Leaf)) {
    Print-Error @"
frontend/package.json not found.

Expected:
  $FRONTEND_PACKAGE
"@
}

if (-not (Test-Path $BACKEND_REQUIREMENTS -PathType Leaf)) {
    Print-Error @"
backend/requirements.txt not found.

Expected:
  $BACKEND_REQUIREMENTS
"@
}

Write-Host "frontend/ found"
Write-Host "backend/ found"
Write-Host "frontend/package.json found"
Write-Host "backend/requirements.txt found"

# ============================================================
# 5. Create Python virtual environment
# ============================================================

Print-Step "[5/7] Setting up backend virtual environment"

Write-Host "Creating/verifying backend virtual environment..."

if (-not (Test-Path $VENV_DIR -PathType Container)) {
    Write-Host "Creating:"
    Write-Host "  backend/.venv"

    & uv venv $VENV_DIR --python $REQUIRED_PYTHON

    if ($LASTEXITCODE -ne 0) {
        Print-Error "Failed to create backend virtual environment."
    }

    Write-Host "Virtual environment created"
}
else {
    Write-Host "backend/.venv already exists"
}

# ------------------------------------------------------------
# Verify Python executable
# ------------------------------------------------------------

$VENV_PYTHON = Join-Path $VENV_DIR "Scripts\python.exe"

if (-not (Test-Path $VENV_PYTHON -PathType Leaf)) {
    Print-Error @"
Backend virtual environment was created but Python executable was not found.

Expected:
  $VENV_PYTHON
"@
}

# ------------------------------------------------------------
# Verify Python version
# ------------------------------------------------------------

$VENV_VERSION = (& $VENV_PYTHON --version).Trim() -replace "^Python\s+", ""

Write-Host ""
Write-Host "Backend virtual environment:"
Write-Host "  $VENV_DIR"
Write-Host "Python executable:"
Write-Host "  $VENV_PYTHON"
Write-Host "Python version:"
Write-Host "  $VENV_VERSION"

if ($VENV_VERSION -ne $REQUIRED_PYTHON) {
    Print-Error @"
The backend virtual environment has the wrong Python version.

Required:
  Python $REQUIRED_PYTHON

Found:
  Python $VENV_VERSION
"@
}

Write-Host ""
Write-Host "Backend venv uses Python $VENV_VERSION"

# ============================================================
# 6. Install backend + frontend dependencies
# ============================================================

Print-Step "[6/7] Installing backend dependencies"

Write-Host "Installing backend requirements using uv..."

if (-not (Test-Path $BACKEND_REQUIREMENTS -PathType Leaf)) {
    Print-Error "backend/requirements.txt not found."
}

& uv pip install --python $VENV_PYTHON -r $BACKEND_REQUIREMENTS

if ($LASTEXITCODE -ne 0) {
    Print-Error "Failed to install backend dependencies."
}

Write-Host "Backend dependencies installed"

Write-Host ""
Write-Host "Installing frontend dependencies..."

Push-Location $FRONTEND_DIR
try {
    & npm install

    if ($LASTEXITCODE -ne 0) {
        Print-Error "Failed to install frontend dependencies."
    }
}
finally {
    Pop-Location
}

Write-Host "Frontend dependencies installed"

# ============================================================
# 7. Environment files
# ============================================================

Print-Step "[7/7] Setting up environment files"

# Backend .env
$BACKEND_ENV_EXAMPLE = Join-Path $BACKEND_DIR ".env.example"
$BACKEND_ENV = Join-Path $BACKEND_DIR ".env"

if (Test-Path $BACKEND_ENV_EXAMPLE -PathType Leaf) {
    if (-not (Test-Path $BACKEND_ENV -PathType Leaf)) {
        Copy-Item $BACKEND_ENV_EXAMPLE $BACKEND_ENV
        Write-Host "Created backend/.env"
    }
    else {
        Write-Host "backend/.env already exists"
    }
}
else {
    Write-Host "No backend/.env.example found"
    Write-Host "Skipping backend .env creation"
}

# Frontend .env.local
$FRONTEND_ENV_EXAMPLE = Join-Path $FRONTEND_DIR ".env.example"
$FRONTEND_ENV_LOCAL = Join-Path $FRONTEND_DIR ".env.local"

if (Test-Path $FRONTEND_ENV_EXAMPLE -PathType Leaf) {
    if (-not (Test-Path $FRONTEND_ENV_LOCAL -PathType Leaf)) {
        Copy-Item $FRONTEND_ENV_EXAMPLE $FRONTEND_ENV_LOCAL
        Write-Host "Created frontend/.env.local"
    }
    else {
        Write-Host "frontend/.env.local already exists"
    }
}
else {
    Write-Host "No frontend/.env.example found"
    Write-Host "Skipping frontend .env.local creation"
}

# ============================================================
# Final verification
# ============================================================

Write-Host ""
Write-Host "============================================================"
Write-Host "              SETUP COMPLETED SUCCESSFULLY"
Write-Host "============================================================"
Write-Host ""

Write-Host "Environment:"
Write-Host "  Python:  $PYTHON_VERSION"
Write-Host "  Node:    $NODE_VERSION"
Write-Host "  npm:     $NPM_VERSION"
Write-Host ""

Write-Host "Project:"
Write-Host "  Frontend: $FRONTEND_DIR"
Write-Host "  Backend:  $BACKEND_DIR"
Write-Host ""

Write-Host "Virtual environment:"
Write-Host "  $VENV_DIR"
Write-Host ""

Write-Host "============================================================"
Write-Host "How to start the project"
Write-Host "============================================================"
Write-Host ""

Write-Host "Terminal 1 - Backend:"
Write-Host ""
Write-Host "  cd backend"
Write-Host "  .\.venv\Scripts\Activate.ps1"
Write-Host "  uvicorn main:app --reload --host 127.0.0.1 --port 8000"
Write-Host ""

Write-Host "Backend API:"
Write-Host "  http://127.0.0.1:8000"
Write-Host ""

Write-Host "FastAPI Swagger:"
Write-Host "  http://127.0.0.1:8000/docs"
Write-Host ""

Write-Host "------------------------------------------------------------"
Write-Host ""

Write-Host "Terminal 2 - Frontend:"
Write-Host ""
Write-Host "  cd frontend"
Write-Host "  npm run dev"
Write-Host ""

Write-Host "Frontend:"
Write-Host "  http://localhost:5173"
Write-Host ""

Write-Host "============================================================"
Write-Host "                    READY TO RUN"
Write-Host "============================================================"
Write-Host ""