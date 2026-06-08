@echo off
title RE:Motion - Git Commit & Push
echo =========================================
echo    RE:Motion - Assistente de Git Push
echo =========================================
echo.

:: 1. Adiciona todos os arquivos
echo [1/3] Adicionando arquivos modificados...
git add .
if %ERRORLEVEL% neq 0 (
    echo.
    echo [ERRO] Nao foi possivel rodar "git add".
    echo Certifique-se de que o Git esta instalado e que esta na pasta correta.
    goto end
)

:: 2. Solicita mensagem do commit
echo.
set /p msg="[2/3] Digite a mensagem do commit (ou aperte Enter para padrao): "
if "%msg%"=="" (
    set msg="update: alteracoes gerais"
)

:: 3. Faz o commit
echo.
echo Executando commit com a mensagem: %msg%
git commit -m "%msg%"
if %ERRORLEVEL% neq 0 (
    echo.
    echo [AVISO] Nada para commitar ou erro no commit.
)

:: 4. Envia para o GitHub
echo.
echo [3/3] Enviando para o GitHub (push)...
git push origin main
if %ERRORLEVEL% neq 0 (
    echo.
    echo [ERRO] Nao foi possivel enviar ao GitHub.
    echo Verifique sua conexao e se esta autenticado.
) else (
    echo.
    echo =========================================
    echo   Sucesso! Alteracoes enviadas ao GitHub.
    echo =========================================
)

:end
echo.
pause
