@echo off
echo ========================================
echo Instalando TODAS as dependencias
echo ========================================
echo.
echo [1/3] Instalando dependencias do servidor...
cd server
call npm install
cd ..
echo.
echo [2/3] Instalando dependencias do cliente...
cd client
call npm install
cd ..
echo.
echo [3/3] Instalando dependencias dos testes...
cd features
call npm install
cd ..
echo.
echo ========================================
echo Instalacao completa!
echo ========================================
echo.
echo Proximos passos:
echo 1. Abra um terminal e execute: cd server e npm run dev
echo 2. Abra outro terminal e execute: cd client e npm run dev
echo 3. Para rodar testes: run-tests.bat
echo.
pause
