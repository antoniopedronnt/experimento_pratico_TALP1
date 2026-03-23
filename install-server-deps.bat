@echo off
echo ========================================
echo Instalando dependencias do servidor...
echo ========================================
echo.
cd server
call npm install
cd ..
echo.
echo ========================================
echo Concluido!
echo ========================================
pause
