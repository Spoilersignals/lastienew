@echo off
echo ========================================
echo  Database Setup
echo ========================================
echo.

cd backend

echo Generating Prisma Client...
call npx prisma generate
if errorlevel 1 (
    echo ERROR: Prisma generate failed!
    pause
    exit /b 1
)

echo.
echo Running database migrations...
call npx prisma migrate dev --name init
if errorlevel 1 (
    echo ERROR: Database migration failed!
    echo.
    echo Make sure PostgreSQL is running and DATABASE_URL in backend/.env is correct
    pause
    exit /b 1
)

echo.
echo Seeding database with sample data...
call npm run seed
if errorlevel 1 (
    echo ERROR: Database seeding failed!
    pause
    exit /b 1
)

echo.
echo ========================================
echo  Database Setup Complete!
echo ========================================
echo.
echo Sample accounts created:
echo   Admin: admin@university.edu / password123
echo   Student: alice@university.edu / password123
echo.
echo You can now start the application with: start-dev.bat
echo.
pause
