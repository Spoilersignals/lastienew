@echo off
echo ========================================
echo  Starting Campus Essentials Exchange
echo ========================================
echo.
echo Starting Backend Server (Port 5000)...
echo Starting Frontend Server (Port 3000)...
echo.
echo Backend will be available at: http://localhost:5000
echo Frontend will be available at: http://localhost:3000
echo.
echo Press Ctrl+C in each window to stop the servers
echo.
pause

start "Campus Exchange - Backend" cmd /k "cd backend && npm run dev"
timeout /t 3 /nobreak >nul
start "Campus Exchange - Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo Both servers starting in separate windows...
echo.
