# Hamilton Estate Inventory System - Server Stop Script
# This script stops the Node.js server and Cloudflare tunnel

Write-Host "🛑 Stopping Hamilton Estate Inventory System..." -ForegroundColor Red
Write-Host "================================================" -ForegroundColor Red

# Function to stop processes by name
function Stop-ProcessByName {
    param([string]$ProcessName)
    $processes = Get-Process -Name $ProcessName -ErrorAction SilentlyContinue
    if ($processes) {
        Write-Host "🔄 Stopping $ProcessName processes..." -ForegroundColor Yellow
        foreach ($process in $processes) {
            Write-Host "   Stopping process ID: $($process.Id)" -ForegroundColor Gray
        }
        Stop-Process -Name $ProcessName -Force -ErrorAction SilentlyContinue
        Start-Sleep 2
        return $true
    } else {
        Write-Host "ℹ️  No $ProcessName processes found" -ForegroundColor Gray
        return $false
    }
}

# Step 1: Stop Cloudflare tunnel
Write-Host "`n📋 Step 1: Stopping Cloudflare tunnel..." -ForegroundColor Cyan
$tunnelStopped = Stop-ProcessByName "cloudflared"

# Step 2: Stop Node.js server
Write-Host "`n📋 Step 2: Stopping Node.js server..." -ForegroundColor Cyan
$serverStopped = Stop-ProcessByName "node"

# Step 3: Verify processes are stopped
Write-Host "`n📋 Step 3: Verifying processes are stopped..." -ForegroundColor Cyan

$remainingTunnel = Get-Process -Name "cloudflared" -ErrorAction SilentlyContinue
$remainingServer = Get-Process -Name "node" -ErrorAction SilentlyContinue

if ($null -eq $remainingTunnel -and $null -eq $remainingServer) {
    Write-Host "✅ All processes stopped successfully" -ForegroundColor Green
} else {
    Write-Host "⚠️  Some processes may still be running:" -ForegroundColor Yellow
    if ($null -ne $remainingTunnel) {
        Write-Host "   • Cloudflare tunnel processes still running" -ForegroundColor Yellow
    }
    if ($null -ne $remainingServer) {
        Write-Host "   • Node.js processes still running" -ForegroundColor Yellow
    }
}

# Step 3.5: Report what was actually stopped
Write-Host "`n📋 Step 3.5: Summary of stopped processes..." -ForegroundColor Cyan
if ($tunnelStopped) {
    Write-Host "✅ Cloudflare tunnel was stopped" -ForegroundColor Green
} else {
    Write-Host "ℹ️  No Cloudflare tunnel was running" -ForegroundColor Gray
}

if ($serverStopped) {
    Write-Host "✅ Node.js server was stopped" -ForegroundColor Green
} else {
    Write-Host "ℹ️  No Node.js server was running" -ForegroundColor Gray
}

# Step 4: Check if port 3000 is free
Write-Host "`n📋 Step 4: Checking port status..." -ForegroundColor Cyan
$portInUse = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
if ($null -ne $portInUse) {
    Write-Host "⚠️  Port 3000 is still in use. You may need to manually stop the process." -ForegroundColor Yellow
} else {
    Write-Host "✅ Port 3000 is now free" -ForegroundColor Green
}

# Final status
Write-Host "`n🎉 Shutdown Complete!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green
Write-Host "📱 Local server stopped" -ForegroundColor Cyan
Write-Host "🌐 Remote tunnel stopped" -ForegroundColor Cyan
Write-Host "`n💡 To restart the server, run: .\start-server.ps1" -ForegroundColor Yellow
Write-Host "================================================" -ForegroundColor Green 