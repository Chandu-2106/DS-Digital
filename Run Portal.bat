@echo off
setlocal
cd /d "%~dp0"
title MBU Data Science Learning Portal

echo Starting MBU Data Science Learning Portal...

where python >nul 2>nul
if %errorlevel%==0 (
    start "MBU Sandbox Backend" /D "%~dp0" cmd /k "python backend.py"
) else (
    where py >nul 2>nul
    if %errorlevel%==0 (
        start "MBU Sandbox Backend" /D "%~dp0" cmd /k "py -3 backend.py"
    ) else (
        echo Python was not found. Install Python 3 and add it to PATH.
        pause
        exit /b 1
    )
)

timeout /t 3 /nobreak >nul
start "" "http://127.0.0.1:8000"
echo.
echo Portal opened in your browser.
echo Keep the backend window open while using the Python/Java sandbox.
echo You can close this window now.
pause >nul
endlocal
