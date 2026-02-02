@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║   System Zarządzania Wydatkami - Uruchomienie z Ngrok         ║
echo ║          Aplikacja będzie dostępna publicznie!                 ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

REM Get project directory
set PROJECT_DIR=%~dp0
set NGROK_FOLDER=%TEMP%\ngrok-wydatki

echo 📂 Folder projektu: %PROJECT_DIR%
echo 🔍 Folder Ngrok: %NGROK_FOLDER%
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

REM Create ngrok folder if doesn't exist
if not exist "%NGROK_FOLDER%" mkdir "%NGROK_FOLDER%"

REM Check if ngrok exists, if not download it
if not exist "%NGROK_FOLDER%\ngrok.exe" (
    echo 📥 Pobieranie Ngrok (jeśli to pierwszy raz)...
    echo.

    REM Download ngrok
    powershell -Command "& { [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; Invoke-WebRequest -Uri 'https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-v3-stable-windows-amd64.zip' -OutFile '%NGROK_FOLDER%\ngrok.zip' -ErrorAction Stop }"

    if errorlevel 1 (
        echo ❌ Błąd przy pobieraniu Ngrok
        echo.
        echo Spróbuj ręcznie: https://ngrok.com/download
        echo.
        pause
        exit /b 1
    )

    echo 📦 Rozpakowanie Ngrok...
    powershell -Command "& { Expand-Archive -Path '%NGROK_FOLDER%\ngrok.zip' -DestinationPath '%NGROK_FOLDER%' -Force }"

    if errorlevel 1 (
        echo ❌ Błąd przy rozpakowaniu
        pause
        exit /b 1
    )

    echo ✅ Ngrok pobrany i rozpakowany
    echo.
)

REM Start Backend
echo 🔧 Uruchamianie Backend'u...
cd /d "%PROJECT_DIR%backend"

if not exist "node_modules" (
    echo 📦 Instalowanie zależności backend'u...
    call npm install
    if errorlevel 1 (
        echo ❌ Błąd przy instalacji backend'u
        pause
        exit /b 1
    )
)

start "Backend - Wydatki (localhost:3001)" cmd /k "npm run dev"
if errorlevel 1 (
    echo ❌ Błąd przy uruchomieniu backend'u
    pause
    exit /b 1
)

echo ✅ Backend uruchomiony
echo.

timeout /t 3 /nobreak

REM Start Frontend
echo ⚛️  Uruchamianie Frontend'u...
cd /d "%PROJECT_DIR%frontend"

if not exist "node_modules" (
    echo 📦 Instalowanie zależności frontend'u...
    call npm install
    if errorlevel 1 (
        echo ❌ Błąd przy instalacji frontend'u
        pause
        exit /b 1
    )
)

start "Frontend - Wydatki (localhost:3000)" cmd /k "npm run dev"
if errorlevel 1 (
    echo ❌ Błąd przy uruchomieniu frontend'u
    pause
    exit /b 1
)

echo ✅ Frontend uruchomiony
echo.

timeout /t 5 /nobreak

REM Start Ngrok
echo 🌐 Uruchamianie Ngrok (tunel publiczny)...
start "Ngrok - Publiczny URL" cmd /k "cd /d %NGROK_FOLDER% && ngrok http 3000"

if errorlevel 1 (
    echo ❌ Błąd przy uruchomieniu Ngrok
    pause
    exit /b 1
)

echo ✅ Ngrok uruchomiony
echo.

timeout /t 3 /nobreak

echo ═══════════════════════════════════════════════════════════════════
echo.
echo 🎉 Aplikacja uruchamia się!
echo.
echo 📌 SPRAWD Z OKNA NGROK - tam będzie Twój publiczny URL!
echo.
echo    Szukaj linii:
echo    Forwarding  https://xxxxxxxxxxxxx.ngrok.io -> http://localhost:3000
echo.
echo    xxxxxxxxxxxxx.ngrok.io to Twój publiczny URL!
echo.
echo    Otwórz w przeglądarce: https://xxxxxxxxxxxxx.ngrok.io
echo.
echo ═══════════════════════════════════════════════════════════════════
echo.
echo 📂 Otwarte okna:
echo    1. Backend (port 3001)
echo    2. Frontend (port 3000)
echo    3. Ngrok (publiczny URL)
echo.
echo ⚠️  Aby zatrzymać: Zamknij wszystkie 3 okna terminala
echo.
echo ═══════════════════════════════════════════════════════════════════
echo.
pause
