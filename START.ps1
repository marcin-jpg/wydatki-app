# System Zarządzania Wydatkami - PowerShell Start Script

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════════╗"
Write-Host "║     System Zarządzania Wydatkami - Uruchomienie                ║"
Write-Host "╚════════════════════════════════════════════════════════════════╝"
Write-Host ""

$projectDir = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host "📂 Folder projektu: $projectDir"
Write-Host ""

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js znaleziony: $nodeVersion"
} catch {
    Write-Host "❌ BŁĄD: Node.js nie jest zainstalowany!"
    Write-Host ""
    Write-Host "Pobierz z: https://nodejs.org"
    Write-Host ""
    Read-Host "Naciśnij Enter aby wyjść"
    exit 1
}

Write-Host ""

# Backend
Write-Host "🔧 Uruchamianie Backend'u..."
$backendPath = Join-Path $projectDir "backend"
Set-Location $backendPath

# Install dependencies if needed
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Instalowanie zależności backend'u..."
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Błąd przy instalacji backend'u"
        Read-Host "Naciśnij Enter aby wyjść"
        exit 1
    }
}

# Start backend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendPath'; npm run dev" -WindowStyle Normal
Write-Host "✅ Backend uruchomiony"
Write-Host ""

# Wait for backend to start
Start-Sleep -Seconds 3

# Frontend
Write-Host "⚛️  Uruchamianie Frontend'u..."
$frontendPath = Join-Path $projectDir "frontend"
Set-Location $frontendPath

# Install dependencies if needed
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Instalowanie zależności frontend'u..."
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Błąd przy instalacji frontend'u"
        Read-Host "Naciśnij Enter aby wyjść"
        exit 1
    }
}

# Start frontend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontendPath'; npm run dev" -WindowStyle Normal
Write-Host "✅ Frontend uruchomiony"
Write-Host ""

Write-Host "═══════════════════════════════════════════════════════════════════"
Write-Host ""
Write-Host "🎉 Aplikacja uruchamia się!"
Write-Host ""
Write-Host "🌐 Strona będzie dostępna na: http://localhost:3000"
Write-Host ""
Write-Host "Czekaj 10-15 sekund aż strona się załaduje..."
Write-Host ""
Write-Host "✅ Backend: http://localhost:3001"
Write-Host "✅ Frontend: http://localhost:3000"
Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════════════"
Write-Host ""
Write-Host "Aby zatrzymać aplikację, zamknij oba okna PowerShell."
Write-Host ""
Read-Host "Naciśnij Enter aby zamknąć to okno"
