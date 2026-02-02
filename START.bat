@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║     System Zarządzania Wydatkami - Uruchomienie                ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

REM Get the directory where the batch file is located
set PROJECT_DIR=%~dp0

echo 📂 Folder projektu: %PROJECT_DIR%
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ BŁĄD: Node.js nie jest zainstalowany!
    echo.
    echo Pobierz z: https://nodejs.org
    echo.
    pause
    exit /b 1
)

echo ✅ Node.js znaleziony
node --version
echo.

REM Start Backend
echo 🔧 Uruchamianie Backend'u...
cd /d "%PROJECT_DIR%backend"

REM Check if node_modules exists
if not exist "node_modules" (
    echo 📦 Instalowanie zależności backend'u...
    call npm install
    if errorlevel 1 (
        echo ❌ Błąd przy instalacji backend'u
        pause
        exit /b 1
    )
)

REM Start backend in a new window
start "Backend - Wydatki" cmd /k "npm run dev"
if errorlevel 1 (
    echo ❌ Błąd przy uruchomieniu backend'u
    pause
    exit /b 1
)

echo ✅ Backend uruchomiony w nowym oknie
echo.

REM Wait a bit for backend to start
timeout /t 3 /nobreak

REM Start Frontend
echo ⚛️  Uruchamianie Frontend'u...
cd /d "%PROJECT_DIR%frontend"

REM Check if node_modules exists
if not exist "node_modules" (
    echo 📦 Instalowanie zależności frontend'u...
    call npm install
    if errorlevel 1 (
        echo ❌ Błąd przy instalacji frontend'u
        pause
        exit /b 1
    )
)

REM Start frontend in a new window
start "Frontend - Wydatki" cmd /k "npm run dev"
if errorlevel 1 (
    echo ❌ Błąd przy uruchomieniu frontend'u
    pause
    exit /b 1
)

echo ✅ Frontend uruchomiony w nowym oknie
echo.

echo ═══════════════════════════════════════════════════════════════════
echo.
echo 🎉 Aplikacja uruchamia się!
echo.
echo 🌐 Strona będzie dostępna na: http://localhost:3000
echo.
echo Czekaj 10-15 sekund aż strona się załaduje...
echo.
echo ✅ Backend: http://localhost:3001
echo ✅ Frontend: http://localhost:3000
echo.
echo ═══════════════════════════════════════════════════════════════════
echo.
echo Aby zatrzymać aplikację, zamknij oba okna terminala.
echo.
pause
