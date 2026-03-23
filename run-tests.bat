@echo off
echo ========================================
echo Executando Testes Cucumber
echo ========================================
echo.
cd features
call npm test
cd ..
echo.
echo ========================================
echo Testes Concluidos!
echo ========================================
pause
