@echo off
echo ========================================
echo  AAROGYA AI - FRESH RESTART
echo ========================================
echo.

echo [1/4] Stopping any running servers...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul

echo [2/4] Clearing Next.js cache...
rmdir /S /Q .next 2>nul
echo Cache cleared!

echo [3/4] Regenerating Prisma client...
call npx prisma generate

echo [4/4] Starting dev server...
echo.
echo ========================================
echo  Server starting on http://localhost:3000
echo  Press Ctrl+C to stop
echo ========================================
echo.
call npm run dev
