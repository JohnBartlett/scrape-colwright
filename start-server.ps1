# Hamilton Estate Inventory System - Server Startup Script
# This script starts the Node.js server and Cloudflare tunnel for remote access

Write-Host "Starting Hamilton Estate Inventory System..." -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green

# Function to check if a port is in use
function Test-Port {
    param([int]$Port)
    $connection = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
    return $connection -ne $null
}

# Function to kill processes by name
function Stop-ProcessByName {
    param([string]$ProcessName)
    $processes = Get-Process -Name $ProcessName -ErrorAction SilentlyContinue
    if ($processes) {
        Write-Host "Stopping existing $ProcessName processes..." -ForegroundColor Yellow
        Stop-Process -Name $ProcessName -Force -ErrorAction SilentlyContinue
        Start-Sleep 2
    }
}

# Step 1: Kill existing processes
Write-Host "Step 1: Cleaning up existing processes..." -ForegroundColor Cyan
Stop-ProcessByName "node"
Stop-ProcessByName "cloudflared"

# Step 2: Check if port 3000 is available
Write-Host "Step 2: Checking port availability..." -ForegroundColor Cyan
if (Test-Port 3000) {
    Write-Host "Warning: Port 3000 is still in use. Trying to free it..." -ForegroundColor Yellow
    Start-Sleep 3
}

# Step 3: Start the Node.js server
Write-Host "Step 3: Starting Node.js server..." -ForegroundColor Cyan
Write-Host "Starting server on http://localhost:3000" -ForegroundColor Green

# Start server in background
Start-Process -FilePath "node" -ArgumentList "server.js" -WindowStyle Minimized
Start-Sleep 5

# Step 4: Verify server is running
Write-Host "Step 4: Verifying server status..." -ForegroundColor Cyan
$serverRunning = Test-Port 3000
if ($serverRunning) {
    Write-Host "Server is running on port 3000" -ForegroundColor Green
    
    # Test server response
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing -TimeoutSec 10
        if ($response.StatusCode -eq 200) {
            Write-Host "Server responding correctly" -ForegroundColor Green
        }
    }
    catch {
        Write-Host "Server started but may need a moment to fully initialize" -ForegroundColor Yellow
    }
} else {
    Write-Host "Failed to start server on port 3000" -ForegroundColor Red
    exit 1
}

# Step 5: Start Cloudflare tunnel
Write-Host "Step 5: Starting Cloudflare tunnel..." -ForegroundColor Cyan
Write-Host "Creating remote access tunnel..." -ForegroundColor Green

# Start tunnel in background
Start-Process -FilePath "cloudflared" -ArgumentList "tunnel", "--url", "http://localhost:3000" -WindowStyle Minimized
Start-Sleep 10

# Step 6: Verify tunnel is running
Write-Host "Step 6: Verifying tunnel status..." -ForegroundColor Cyan
$tunnelProcess = Get-Process -Name "cloudflared" -ErrorAction SilentlyContinue
if ($tunnelProcess) {
    Write-Host "Cloudflare tunnel is running" -ForegroundColor Green
    Write-Host "Tunnel URL will be displayed in the tunnel window" -ForegroundColor Yellow
} else {
    Write-Host "Failed to start Cloudflare tunnel" -ForegroundColor Red
}

# Step 7: Final status
Write-Host "Startup Complete!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green
Write-Host "Local Access: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Remote Access: Check the Cloudflare tunnel window for the URL" -ForegroundColor Cyan
Write-Host "Available Users:" -ForegroundColor White
Write-Host "  John (Admin) - Password: 2Dream1420!" -ForegroundColor White
Write-Host "  Caroline (Admin) - Password: 2Dream1420!" -ForegroundColor White
Write-Host "  Catharine (Viewer) - Password: cch1500" -ForegroundColor White
Write-Host "To stop the server, run: .\stop-server.ps1" -ForegroundColor Yellow
Write-Host "================================================" -ForegroundColor Green 