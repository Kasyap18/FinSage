#!/usr/bin/env bash

set -euo pipefail

# ============================================================
# ML Risk Detection - Full Project Setup
#
# Expected project structure:
#
# project/
# ├── frontend/
# ├── backend/
# ├── setup.sh
# └── setup.ps1
#
# Requirements:
#   Python 3.10.12
#   Node.js 24.x
#   npm
# ============================================================

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

FRONTEND_DIR="$PROJECT_ROOT/frontend"
BACKEND_DIR="$PROJECT_ROOT/backend"

VENV_DIR="$BACKEND_DIR/.venv"

REQUIRED_PYTHON="3.10.12"
REQUIRED_NODE_MAJOR="24"

# ============================================================
# Helper functions
# ============================================================

print_error() {
    echo ""
    echo "============================================================"
    echo "ERROR"
    echo "============================================================"
    echo "$1"
    echo ""
    exit 1
}

print_step() {
    echo ""
    echo "------------------------------------------------------------"
    echo "$1"
    echo "------------------------------------------------------------"
}

# ============================================================
# Header
# ============================================================

echo ""
echo "============================================================"
echo "       ML Risk Detection - Project Setup"
echo "============================================================"
echo ""
echo "Project root:"
echo "  $PROJECT_ROOT"

# ============================================================
# 1. Verify Python
# ============================================================

print_step "[1/7] Verifying Python with uv"

REQUIRED_PYTHON="3.12.13"
VENV_DIR="$BACKEND_DIR/.venv"

# Check uv
if ! command -v uv >/dev/null 2>&1; then
    print_error "uv is not installed.

Install uv first:
  curl -LsSf https://astral.sh/uv/install.sh | sh"
fi

UV_VERSION="$(uv --version)"

echo "Detected uv:"
echo "  $UV_VERSION"

# Install Python 3.12.13 if required version is not available
echo ""
echo "Checking Python $REQUIRED_PYTHON..."

if ! uv python find "$REQUIRED_PYTHON" >/dev/null 2>&1; then
    echo "Python $REQUIRED_PYTHON not found."
    echo "Installing Python $REQUIRED_PYTHON using uv..."

    uv python install "$REQUIRED_PYTHON"

    echo "✓ Python $REQUIRED_PYTHON installed"
else
    echo "✓ Python $REQUIRED_PYTHON already available"
fi

# Verify exact Python version through uv
PYTHON_PATH="$(uv python find "$REQUIRED_PYTHON")"

if [ -z "$PYTHON_PATH" ]; then
    print_error "Could not locate Python $REQUIRED_PYTHON using uv."
fi

PYTHON_VERSION="$("$PYTHON_PATH" --version 2>&1 | awk '{print $2}')"

echo ""
echo "Python executable:"
echo "  $PYTHON_PATH"

echo "Python version:"
echo "  $PYTHON_VERSION"

if [ "$PYTHON_VERSION" != "$REQUIRED_PYTHON" ]; then
    print_error "Incorrect Python version.

Required:
  Python $REQUIRED_PYTHON

Found:
  Python $PYTHON_VERSION"
fi

echo "✓ Python $REQUIRED_PYTHON verified"

# ============================================================
# Create backend virtual environment using uv
# ============================================================

echo ""
echo "Creating backend virtual environment..."

if [ -d "$VENV_DIR" ]; then
    echo "backend/.venv already exists"

    VENV_PYTHON="$VENV_DIR/bin/python"

    if [ -f "$VENV_PYTHON" ]; then
        VENV_VERSION="$("$VENV_PYTHON" --version 2>&1 | awk '{print $2}')"

        if [ "$VENV_VERSION" != "$REQUIRED_PYTHON" ]; then
            echo "Existing environment uses Python $VENV_VERSION"
            echo "Recreating it with Python $REQUIRED_PYTHON..."

            rm -rf "$VENV_DIR"

            uv venv "$VENV_DIR" --python "$REQUIRED_PYTHON"
        fi
    else
        rm -rf "$VENV_DIR"
        uv venv "$VENV_DIR" --python "$REQUIRED_PYTHON"
    fi
else
    uv venv "$VENV_DIR" --python "$REQUIRED_PYTHON"
fi

VENV_PYTHON="$VENV_DIR/bin/python"

if [ ! -f "$VENV_PYTHON" ]; then
    print_error "Failed to create backend virtual environment.

Expected:
  $VENV_PYTHON"
fi

VENV_VERSION="$("$VENV_PYTHON" --version 2>&1 | awk '{print $2}')"

if [ "$VENV_VERSION" != "$REQUIRED_PYTHON" ]; then
    print_error "Backend virtual environment has incorrect Python version.

Required:
  Python $REQUIRED_PYTHON

Found:
  Python $VENV_VERSION"
fi

echo "✓ Backend virtual environment created"
echo "✓ backend/.venv uses Python $VENV_VERSION"

# ============================================================
# 2. Verify Node.js
# ============================================================

print_step "[2/7] Setting up Node.js with Homebrew"

REQUIRED_NODE_MAJOR="24"

# ------------------------------------------------------------
# Verify Homebrew
# ------------------------------------------------------------

if ! command -v brew >/dev/null 2>&1; then
    print_error "Homebrew is not installed.

Install Homebrew first:
  https://brew.sh/"
fi

echo "✓ Homebrew detected"

# ------------------------------------------------------------
# Install Node 24 using Homebrew
# ------------------------------------------------------------

if ! brew list --formula node@24 >/dev/null 2>&1; then
    echo ""
    echo "Node.js 24 is not installed."
    echo "Installing Node.js 24 using Homebrew..."

    brew install node@24

    echo "✓ Node.js 24 installed"
else
    echo "✓ Homebrew Node.js 24 already installed"
fi

# ------------------------------------------------------------
# Get Homebrew Node 24 path
# ------------------------------------------------------------

NODE24_PREFIX="$(brew --prefix node@24)"

if [ ! -d "$NODE24_PREFIX" ]; then
    print_error "Could not find Homebrew Node.js 24.

Expected:
  $NODE24_PREFIX"
fi

# ------------------------------------------------------------
# IMPORTANT:
# Remove NVM Node from current shell PATH
# ------------------------------------------------------------

if [ -n "${NVM_BIN:-}" ]; then
    echo ""
    echo "NVM Node detected:"
    echo "  $NVM_BIN"

    echo "Removing NVM Node from current setup..."
    nvm deactivate >/dev/null 2>&1 || true
fi

# ------------------------------------------------------------
# Activate Homebrew Node 24 for THIS setup process
# ------------------------------------------------------------

export PATH="$NODE24_PREFIX/bin:/opt/homebrew/bin:$PATH"

hash -r 2>/dev/null || true

# ------------------------------------------------------------
# Verify Node
# ------------------------------------------------------------

if ! command -v node >/dev/null 2>&1; then
    print_error "Node.js could not be found after Homebrew setup."
fi

NODE_VERSION="$(node --version 2>&1)"

NODE_MAJOR="${NODE_VERSION#v}"
NODE_MAJOR="${NODE_MAJOR%%.*}"

echo ""
echo "Node.js executable:"
echo "  $(command -v node)"

echo "Detected Node.js:"
echo "  $NODE_VERSION"

if [ "$NODE_MAJOR" != "$REQUIRED_NODE_MAJOR" ]; then
    print_error "Incorrect Node.js version.

Required:
  Node.js $REQUIRED_NODE_MAJOR.x

Found:
  $NODE_VERSION

Path:
  $(command -v node)"
fi

echo "✓ Node.js $NODE_VERSION verified"

# ------------------------------------------------------------
# Verify npm
# ------------------------------------------------------------

if ! command -v npm >/dev/null 2>&1; then
    print_error "npm was not found."
fi

NPM_VERSION="$(npm --version)"

echo "✓ npm $NPM_VERSION verified"

# ============================================================
# 3. Verify npm
# ============================================================

print_step "[3/7] Verifying npm"

if ! command -v npm >/dev/null 2>&1; then
    print_error "npm is not installed.

Node.js installation should normally include npm."
fi

NPM_VERSION="$(npm --version)"

echo "Detected npm:"
echo "  $NPM_VERSION"

echo "✓ npm $NPM_VERSION verified"

# ============================================================
# 4. Verify project directories
# ============================================================

print_step "[4/7] Verifying project structure"

if [ ! -d "$FRONTEND_DIR" ]; then
    print_error "frontend/ directory not found.

Expected:
  $PROJECT_ROOT/frontend"
fi

if [ ! -d "$BACKEND_DIR" ]; then
    print_error "backend/ directory not found.

Expected:
  $PROJECT_ROOT/backend"
fi

if [ ! -f "$FRONTEND_DIR/package.json" ]; then
    print_error "frontend/package.json not found.

Expected:
  $FRONTEND_DIR/package.json"
fi

if [ ! -f "$BACKEND_DIR/requirements.txt" ]; then
    print_error "backend/requirements.txt not found.

Expected:
  $BACKEND_DIR/requirements.txt"
fi

echo "✓ frontend/ found"
echo "✓ backend/ found"
echo "✓ frontend/package.json found"
echo "✓ backend/requirements.txt found"

# ============================================================
# 5. Create Python virtual environment
# ============================================================

print_step "[5/7] Setting up backend virtual environment"

VENV_DIR="$BACKEND_DIR/.venv"

echo "Creating/verifying backend virtual environment..."

# ------------------------------------------------------------
# Create venv using uv
# ------------------------------------------------------------

if [ ! -d "$VENV_DIR" ]; then

    echo "Creating:"
    echo "  backend/.venv"

    uv venv "$VENV_DIR" --python "$REQUIRED_PYTHON"

    echo "✓ Virtual environment created"

else

    echo "backend/.venv already exists"

fi

# ------------------------------------------------------------
# Verify Python executable
# ------------------------------------------------------------

VENV_PYTHON="$VENV_DIR/bin/python"

if [ ! -f "$VENV_PYTHON" ]; then
    print_error "Backend virtual environment was created but Python executable was not found.

Expected:
  $VENV_PYTHON"
fi

# ------------------------------------------------------------
# Verify Python version
# ------------------------------------------------------------

VENV_VERSION="$("$VENV_PYTHON" --version 2>&1 | awk '{print $2}')"

echo ""
echo "Backend virtual environment:"
echo "  $VENV_DIR"

echo "Python executable:"
echo "  $VENV_PYTHON"

echo "Python version:"
echo "  $VENV_VERSION"

if [ "$VENV_VERSION" != "$REQUIRED_PYTHON" ]; then

    print_error "The backend virtual environment has the wrong Python version.

Required:
  Python $REQUIRED_PYTHON

Found:
  Python $VENV_VERSION"

fi

echo ""
echo "✓ Backend venv uses Python $VENV_VERSION"

# ============================================================
# 6. Install backend + frontend dependencies
# ============================================================

print_step "[6/7] Installing backend dependencies"

echo "Installing backend requirements using uv..."

if [ ! -f "$BACKEND_DIR/requirements.txt" ]; then
    print_error "backend/requirements.txt not found."
fi

uv pip install \
    --python "$VENV_PYTHON" \
    -r "$BACKEND_DIR/requirements.txt"

echo "✓ Backend dependencies installed"

# ------------------------------------------------------------

echo ""
echo "Installing frontend dependencies..."

(
    cd "$FRONTEND_DIR"
    npm install
)

echo "✓ Frontend dependencies installed"

# ============================================================
# 7. Environment files
# ============================================================

print_step "[7/7] Setting up environment files"

# Backend .env
if [ -f "$BACKEND_DIR/.env.example" ]; then

    if [ ! -f "$BACKEND_DIR/.env" ]; then
        cp "$BACKEND_DIR/.env.example" "$BACKEND_DIR/.env"
        echo "✓ Created backend/.env"
    else
        echo "✓ backend/.env already exists"
    fi

else
    echo "No backend/.env.example found"
    echo "Skipping backend .env creation"
fi

# Frontend .env.local
if [ -f "$FRONTEND_DIR/.env.example" ]; then

    if [ ! -f "$FRONTEND_DIR/.env.local" ]; then
        cp "$FRONTEND_DIR/.env.example" "$FRONTEND_DIR/.env.local"
        echo "✓ Created frontend/.env.local"
    else
        echo "✓ frontend/.env.local already exists"
    fi

else
    echo "No frontend/.env.example found"
    echo "Skipping frontend .env.local creation"
fi

# ============================================================
# Final verification
# ============================================================

echo ""
echo "============================================================"
echo "              SETUP COMPLETED SUCCESSFULLY"
echo "============================================================"
echo ""

echo "Environment:"
echo "  Python:  $PYTHON_VERSION"
echo "  Node:    $NODE_VERSION"
echo "  npm:     $NPM_VERSION"
echo ""

echo "Project:"
echo "  Frontend: $FRONTEND_DIR"
echo "  Backend:  $BACKEND_DIR"
echo ""

echo "Virtual environment:"
echo "  $VENV_DIR"
echo ""

echo "============================================================"
echo "How to start the project"
echo "============================================================"
echo ""

echo "Terminal 1 - Backend:"
echo ""
echo "  cd backend"
echo "  source .venv/bin/activate"
echo "  uvicorn main:app --reload --host 127.0.0.1 --port 8000"
echo ""

echo "Backend API:"
echo "  http://127.0.0.1:8000"
echo ""

echo "FastAPI Swagger:"
echo "  http://127.0.0.1:8000/docs"
echo ""

echo "------------------------------------------------------------"
echo ""

echo "Terminal 2 - Frontend:"
echo ""
echo "  cd frontend"
echo "  npm run dev"
echo ""

echo "Frontend:"
echo "  http://localhost:5173"
echo ""

echo "============================================================"
echo "                    READY TO RUN"
echo "============================================================"
echo ""