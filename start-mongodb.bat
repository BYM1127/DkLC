@echo off
setlocal
set MONGO_DB_PATH=%ProgramFiles%\MongoDB\Server\8.3\bin\mongod.exe
if not exist "%MONGO_DB_PATH%" (
  echo MongoDB was not found at %MONGO_DB_PATH%
  echo Please install MongoDB Community Server from https://www.mongodb.com/try/download/community
  pause
  exit /b 1
)

mkdir "%~dp0data" 2>nul
"%MONGO_DB_PATH%" --dbpath "%~dp0data" --bind_ip 127.0.0.1 --port 27017 --logpath "%~dp0mongod.log" --logappend
