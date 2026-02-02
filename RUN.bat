@echo off
setlocal enabledelayedexpansion

echo.
echo ========================================================
echo     System Zarzadzania Wydatkami - Uruchomienie
echo ========================================================
echo.

set PROJECT_DIR=%~dp0
set NGROK_FOLDER=%TEMP%\ngrok-wydatki

echo Projekt: %PROJECT_DIR%
echo.

REM Check Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo BLAD: Node.js nie zainstalowany!
    echo Pobierz: https://nodejs.org
    pause
    exit /b 1
)

echo OK - Node.js zainstalowany
node --version
echo.

REM Create ngrok folder
if not exist "%NGROK_FOLDER%" mkdir "%NGROK_FOLDER%"

REM Check ngrok
if not exist "%NGROK_FOLDER%\ngrok.exe" (
    echo Pobieranie Ngrok...
    powershell -Command "& { [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; Invoke-WebRequest -Uri 'https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-v3-stable-windows-amd64.zip' -OutFile '%NGROK_FOLDER%\ngrok.zip' }"

    if errorlevel 1 (
        echo BLAD: Nie mozna pobrac Ngrok
        pause
        exit /b 1
    )

    echo Rozpakowanie Ngrok...
    powershell -Command "& { Expand-Archive -Path '%NGROK_FOLDER%\ngrok.zip' -DestinationPath '%NGROK_FOLDER%' -Force }"

    echo OK - Ngrok pobrany
    echo.
)

REM Backend
echo Uruchamianie Backend...
cd /d "%PROJECT_DIR%backend"

if not exist "node_modules" (
    echo Instalowanie zaleznosci backend...
    call npm install
)

start "Backend" cmd /k "npm run dev"

echo Backend uruchomiony
echo.

timeout /t 3 /nobreak

REM Frontend
echo Uruchamianie Frontend...
cd /d "%PROJECT_DIR%frontend"

if not exist "node_modules" (
    echo Instalowanie zaleznosci frontend...
    call npm install
)

start "Frontend" cmd /k "npm run dev"

echo Frontend uruchomiony
echo.

timeout /t 5 /nobreak

REM Ngrok
echo Uruchamianie Ngrok...
start "Ngrok" cmd /k "cd /d %NGROK_FOLDER% && ngrok http 3000"

echo.
echo ========================================================
echo OK - Aplikacja uruchamia sie!
echo ========================================================
echo.
echo W oknie Ngrok szukaj:
echo   Forwarding  https://xxxxx.ngrok.io
echo.
echo Otworz w przegladarce: https://xxxxx.ngrok.io
echo.
echo Aby zatrzymac: zamknij wszystkie 3 okna
echo.
pause
