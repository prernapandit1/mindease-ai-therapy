@echo off
title MindEase Launcher
color 0A

echo.
echo  ╔══════════════════════════════════════╗
echo  ║        MindEase - Starting Up        ║
echo  ║    Therapy for Everyone, $4.99       ║
echo  ╚══════════════════════════════════════╝
echo.

:: Start Backend
echo [1/2] Starting Backend (FastAPI on port 8000)...
start "MindEase Backend" cmd /k "cd /d %~dp0backend && (if not exist venv python -m venv venv) && venv\Scripts\activate && pip install -r requirements.txt -q && (if not exist .env copy .env.template .env) && python main.py"

:: Wait a few seconds for backend to initialize
timeout /t 5 /nobreak > nul

:: Start Frontend
echo [2/2] Starting Frontend (React on port 3000)...
start "MindEase Frontend" cmd /k "cd /d %~dp0frontend && npm install --silent && npm start"

echo.
echo  ✅ MindEase is launching!
echo.
echo  Backend:  http://localhost:8000
echo  Frontend: http://localhost:3000
echo  API Docs: http://localhost:8000/docs
echo.
echo  Crisis Helpline: iCall 9152987821
echo.
echo  Close this window after both servers start.
echo.
pause
