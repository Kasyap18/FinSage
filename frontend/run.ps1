# Start the Vite frontend development server
# Usage:
#   .\run.ps1          -> runs V1 (npm run dev)
#   .\run.ps1 v2       -> runs V2 (npm run dev2)
#   .\run.ps1 dev2     -> runs V2 (npm run dev2)

param(
    [string]$Mode = "v1"
)

$ErrorActionPreference = "Stop"

$FRONTEND_DIR = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $FRONTEND_DIR

if ($Mode -eq "v2" -or $Mode -eq "dev2") {
    & npm run dev2
}
else {
    & npm run dev
}

