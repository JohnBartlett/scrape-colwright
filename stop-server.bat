@echo off
echo Stopping Hamilton Estate Inventory System...
powershell -ExecutionPolicy Bypass -File "stop-server.ps1"
pause 