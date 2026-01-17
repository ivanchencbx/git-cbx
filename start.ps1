# Start cbx.life Application (No Restart)

Write-Host "🚀 Starting Backend (Port 8000)..."
# Start Backend in a separate process/window so it doesn't block
Start-Process -FilePath "python" -ArgumentList "-m uvicorn server.main:app --host 0.0.0.0 --port 8000 --reload" -WorkingDirectory "C:\Users\ThinkPad\git-cbx" -NoNewWindow

Write-Host "🌐 Starting Frontend (Port 3000)..."
Set-Location "C:\Users\ThinkPad\git-cbx\web"
npm run dev
