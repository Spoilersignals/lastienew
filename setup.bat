@echo off
echo ========================================
echo  Campus Essentials Exchange Setup
echo ========================================
echo.

echo Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js 18+ from https://nodejs.org/
    pause
    exit /b 1
)
echo Node.js found: 
node --version

echo.
echo Checking npm installation...
npm --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: npm is not installed!
    pause
    exit /b 1
)
echo npm found: 
npm --version

echo.
echo ========================================
echo  Installing Dependencies
echo ========================================
echo.

echo [1/2] Installing backend dependencies...
cd backend
if not exist ".env" (
    echo Creating backend .env file...
    copy .env.example .env
)
call npm install
if errorlevel 1 (
    echo ERROR: Backend dependency installation failed!
    pause
    exit /b 1
)
echo Backend dependencies installed successfully!

echo.
echo [2/2] Installing frontend dependencies...
cd ..\frontend
if not exist ".env" (
    echo Creating frontend .env file...
    copy .env.example .env
)
call npm install
if errorlevel 1 (
    echo ERROR: Frontend dependency installation failed!
    pause
    exit /b 1
)
echo Frontend dependencies installed successfully!

cd ..

echo.
echo ========================================
echo  Setup Complete!
echo ========================================
echo.
echo Next steps:
echo.
echo 1. Make sure PostgreSQL is running
echo    - OR run: docker run --name campus-postgres -e POSTGRES_USER=campus_user -e POSTGRES_PASSWORD=campus_pass -e POSTGRES_DB=campus_exchange -p 5432:5432 -d postgres:15-alpine
echo.
echo 2. Edit backend/.env file with your database URL if needed
echo.
echo 3. Run database setup:
echo    cd backend
echo    npx prisma generate
echo    npx prisma migrate dev --name init
echo    npm run seed
echo.
echo 4. Start the application:
echo    - Run start-dev.bat
echo    - OR manually start backend and frontend in separate terminals
echo.
echo For more help, see QUICKSTART.md
echo.
pause
