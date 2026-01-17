# Restart cbx.life Application

Write-Host "🛑 Killing existing Python and Node/Next.js processes..."
taskkill /F /IM python.exe /T 2>$null
taskkill /F /IM node.exe /T 2>$null

Write-Host "📦 Checking Python dependencies..."
pip install -r server/requirements.txt

Write-Host "🚀 Starting Backend (Port 8000)..."
# Start in background or new window
Start-Process -FilePath "python" -ArgumentList "-m uvicorn server.main:app --host 0.0.0.0 --port 8000 --reload" -WorkingDirectory "C:\Users\ThinkPad\git-cbx" -NoNewWindow

Write-Host "🌐 Starting Frontend (Port 3000)..."
Set-Location "C:\Users\ThinkPad\git-cbx\web"
npm run dev
