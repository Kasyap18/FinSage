# Start the FastAPI backend server (Loan Default + Fraud Detection)
# Usage:
#   .\run.ps1

$ErrorActionPreference = "Stop"

$BACKEND_DIR = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $BACKEND_DIR

$WinPython = Join-Path $BACKEND_DIR ".venv\Scripts\python.exe"
$UnixPython = Join-Path $BACKEND_DIR ".venv/bin/python"

if (Test-Path $WinPython -PathType Leaf) {
    $VenvPython = $WinPython
}
elseif (Test-Path $UnixPython -PathType Leaf) {
    $VenvPython = $UnixPython
}
else {
    Write-Host "ERROR: Virtual environment not found in $BACKEND_DIR\.venv" -ForegroundColor Red
    Write-Host "Run ..\setup.ps1 first to create the virtual environment and install dependencies." -ForegroundColor Yellow
    exit 1
}

& $VenvPython -m uvicorn main:app --reload --host 127.0.0.1 --port 8000

