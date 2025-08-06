@echo off
echo Stopping Hamilton Estate Inventory System...
echo.
echo If you see a Windows popup asking about default programs, click "More apps" and select "Windows PowerShell"
echo.
powershell -ExecutionPolicy Bypass -File "stop-server.ps1"
echo.
echo Press any key to exit...
pause >nul 