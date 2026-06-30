@echo off
setlocal
set PROJECT_DIR=%~dp0
set MONGO_EXE=%ProgramFiles%\MongoDB\Server\8.3\bin\mongod.exe

echo Checking MongoDB installation path:
if exist "%MONGO_EXE%" (
  echo  %MONGO_EXE% exists
) else (
  echo  %MONGO_EXE% not found
)

echo.
echo Checking whether port 27017 is listening:
netstat -ano | findstr /C:":27017"

echo.
echo Checking mongod process:
tasklist /fi "imagename eq mongod.exe"

echo.
if exist "%PROJECT_DIR%mongod.log" (
  echo Last 20 lines from %PROJECT_DIR%mongod.log:
  powershell -NoProfile -Command "Get-Content -Path '%PROJECT_DIR%mongod.log' -Tail 20"
) else (
  echo %PROJECT_DIR%mongod.log not found
)

echo.
pause
