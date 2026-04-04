Write-Host "🚀 Starting VLIP Platform..."

Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force

Start-Process powershell -ArgumentList "cd D:\vlip-platform\backend; npx nodemon src/index.ts"
Start-Process powershell -ArgumentList "cd D:\vlip-platform\frontend; npm run dev"

Start-Process "http://localhost:5173"

Write-Host "✅ Backend expected on http://localhost:5000"
Write-Host "✅ Frontend expected on http://localhost:5173 (or next available port)"
