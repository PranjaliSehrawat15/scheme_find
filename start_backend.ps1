Write-Host "========================================================" -ForegroundColor Cyan
Write-Host " Starting SchemeFind FastAPI Backend" -ForegroundColor Green
Write-Host " Binding on 0.0.0.0:8000 (accessible via localhost:8000)" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan

Set-Location $PSScriptRoot
& "$PSScriptRoot\Backend\.venv\Scripts\python.exe" -m uvicorn Backend.main:app --host 0.0.0.0 --port 8000 --reload
