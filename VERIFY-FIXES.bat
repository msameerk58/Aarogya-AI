@echo off
echo ========================================
echo  VERIFICATION SCRIPT
echo ========================================
echo.

echo Checking if greeting fix is in code...
findstr /C:"isGreeting" src\lib\dataset-engine.ts >nul
if %errorlevel%==0 (
    echo [OK] Greeting detection code found
) else (
    echo [FAIL] Greeting detection code NOT found
)

echo.
echo Checking if DATABASE_URL is in .env...
findstr /C:"DATABASE_URL" .env >nul
if %errorlevel%==0 (
    echo [OK] DATABASE_URL configured
) else (
    echo [FAIL] DATABASE_URL NOT configured
)

echo.
echo Checking if Prisma client exists...
if exist "node_modules\.prisma\client" (
    echo [OK] Prisma client generated
) else (
    echo [FAIL] Prisma client NOT generated
)

echo.
echo Checking if .next cache is cleared...
if not exist ".next" (
    echo [OK] Cache is cleared - ready for fresh start
) else (
    echo [WARNING] .next folder exists - may have old cache
)

echo.
echo ========================================
echo  NEXT STEP: Run RESTART-FRESH.bat
echo ========================================
pause
