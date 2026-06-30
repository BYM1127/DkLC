@echo off
setlocal enabledelayedexpansion
set PROJECT_DIR=%~dp0
set MONGO_EXE=%ProgramFiles%\MongoDB\Server\8.3\bin\mongod.exe
set NODE_EXE=%ProgramFiles%\nodejs\node.exe
set NPM_EXE=%ProgramFiles%\nodejs\npm.cmd

if not exist "%MONGO_EXE%" (
  echo MongoDB was not found at %MONGO_EXE%
  echo Please install MongoDB Community Server first.
  pause
  exit /b 1
)

if not exist "%NODE_EXE%" (
  echo Node.js was not be found at %NODE_EXE%
  echo Please install Node.js first.
  pause
  exit /b 1
)

mkdir "%PROJECT_DIR%data" 2>nul
cd /d "%PROJECT_DIR%"

echo Checking whether MongoDB is already listening on port 27017...
set MONGO_READY=0
for /f "delims=" %%A in ('netstat -ano ^| findstr /C:":27017"') do (
  echo %%A | findstr /C:"LISTENING" >nul
  if not errorlevel 1 set MONGO_READY=1
)
if !MONGO_READY! equ 1 (
  echo MongoDB is already listening on port 27017.
) else (
  echo Starting MongoDB...
  start "MongoDB" cmd /k "\"%MONGO_EXE%\" --dbpath \"%PROJECT_DIR%data\" --bind_ip 127.0.0.1 --port 27017 --logpath \"%PROJECT_DIR%mongod.log\" --logappend"
)

echo Waiting for MongoDB to become available on port 27017...
set /a WAIT_SECONDS=0
set MONGO_READY=0

:waitmongo
timeout /t 2 /nobreak >nul
set MONGO_READY=0
for /f "delims=" %%A in ('netstat -ano ^| findstr /C:":27017"') do (
  echo %%A | findstr /C:"LISTENING" >nul
  if not errorlevel 1 set MONGO_READY=1
)
if !MONGO_READY! equ 1 goto startbackend

set /a WAIT_SECONDS+=2
if %WAIT_SECONDS% geq 20 (
  echo Warning: MongoDB did not start within %WAIT_SECONDS% seconds.
  echo The MongoDB window may contain startup errors.
  echo Check "%PROJECT_DIR%mongod.log" for details.
  goto startbackend
)
goto waitmongo

:startbackend
cd /d "%PROJECT_DIR%"
start "Backend" cmd /k ""%NPM_EXE%" run dev"

echo.
echo MongoDB and backend started in separate windows.
echo Close those windows when you are done.
pause
