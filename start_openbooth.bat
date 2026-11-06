@echo off
title OpenBooth Launcher
echo ===================================================
echo             OPEN // BOOTH LAUNCHER
echo ===================================================
echo.

cd /d "%~dp0"

echo [1/2] Checking Python Virtual Environment...
if exist "backend\venv\Scripts\python.exe" (
    set "PYTHON_EXE=backend\venv\Scripts\python.exe"
) else (
    set "PYTHON_EXE=python"
)

echo [2/2] Starting OpenBooth Server on http://localhost:8000...
start "OpenBooth Backend" /b "%PYTHON_EXE%" backend\main.py

timeout /t 2 /nobreak >nul

echo.
echo ===================================================
echo  Server is active at:
echo    * http://localhost:8000
echo ===================================================
echo.
echo To share with your partner over a private HTTPS tunnel:
echo   1. Ensure you have your free authtoken set:
echo        ngrok config add-authtoken YOUR_AUTHTOKEN
echo   2. Start tunnel:
echo        ngrok http 8000
echo   3. Share the generated https://...ngrok-free.app link with your partner!
echo.
pause
