@echo off
title SchemeFind Backend Server (Port 8000)
cd /d "%~dp0"
echo ========================================================
echo  Starting SchemeFind FastAPI Backend
echo  Binding on 0.0.0.0:8000 (accessible via localhost:8000)
echo ========================================================
Backend\.venv\Scripts\python.exe -m uvicorn Backend.main:app --host 0.0.0.0 --port 8000 --reload
pause
