# Stop cbx.life Application
Write-Host "🛑 Stopping cbx.life services..."

# Kill Python (Backend)
$python = Get-Process python -ErrorAction SilentlyContinue
if ($python) {
    Write-Host "   Killing Python/Uvicorn processes..."
    Stop-Process -Name python -Force -ErrorAction SilentlyContinue
} else {
    Write-Host "   No Python processes found."
}

# Kill Node (Frontend)
$node = Get-Process node -ErrorAction SilentlyContinue
if ($node) {
    Write-Host "   Killing Node/Next.js processes..."
    Stop-Process -Name node -Force -ErrorAction SilentlyContinue
} else {
    Write-Host "   No Node processes found."
}

Write-Host "✅ Application stopped."
