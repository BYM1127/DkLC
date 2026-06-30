@echo off
setlocal enabledelayedexpansion
set PROJECT_DIR=%~dp0
set MONGO_DB_PATH=%ProgramFiles%\MongoDB\Server\8.3\bin\mongod.exe
set LOGFILE=%PROJECT_DIR%mongo-debug-output.txt

echo START DEBUG > "%LOGFILE%"
echo Project dir: %PROJECT_DIR% >> "%LOGFILE%"
echo Mongo exe: %MONGO_DB_PATH% >> "%LOGFILE%"
if exist "%MONGO_DB_PATH%" (
  echo MongoDB executable exists >> "%LOGFILE%"
) else (
  echo MongoDB executable missing >> "%LOGFILE%"
)

mkdir "%PROJECT_DIR%data" 2>nul

echo Starting MongoDB with command: "%MONGO_DB_PATH%" --dbpath "%PROJECT_DIR%data" --bind_ip 127.0.0.1 --port 27017 --logpath "%PROJECT_DIR%mongod.log" --logappend >> "%LOGFILE%"
"%MONGO_DB_PATH%" --dbpath "%PROJECT_DIR%data" --bind_ip 127.0.0.1 --port 27017 --logpath "%PROJECT_DIR%mongod.log" --logappend >> "%LOGFILE%" 2>&1

echo END DEBUG >> "%LOGFILE%"
