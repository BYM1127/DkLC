@echo off
cd /d c:\Users\rainb\Downloads\D
echo Building TypeScript...
"C:\Program Files\nodejs\node.exe" node_modules\typescript\bin\tsc
echo.
echo Starting backend server on http://localhost:3000
"C:\Program Files\nodejs\node.exe" dist/index.js
