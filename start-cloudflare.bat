@echo off
echo ========================================
echo Starting Cloudflare Tunnel...
echo ========================================
echo.
echo Wait 10 seconds for the URL to appear...
echo.
cloudflared tunnel --url http://localhost:3000
