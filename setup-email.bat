@echo off
REM Email Configuration Setup Script for Dimpho ke Lesego Catering Backend

setlocal enabledelayedexpansion

echo.
echo ===============================================
echo   Email Configuration Setup
echo ===============================================
echo.

REM Check if .env exists
if exist ".env" (
    echo .env file already exists.
    echo What would you like to do?
    echo 1. Update email configuration
    echo 2. Skip setup
    echo.
    set /p choice="Enter your choice (1 or 2): "
    
    if "!choice!"=="2" (
        echo Setup cancelled.
        exit /b 0
    )
)

REM Ask for email provider
echo.
echo Which email provider would you like to use?
echo 1. Gmail (recommended for development)
echo 2. SendGrid (recommended for production)
echo 3. Mailgun
echo 4. Skip email setup
echo.
set /p provider="Enter your choice (1-4): "

if "!provider!"=="4" (
    echo Email setup skipped.
    echo You can configure it later by editing .env file
    exit /b 0
)

REM Gmail Setup
if "!provider!"=="1" (
    echo.
    echo ========= GMAIL SETUP =========
    echo To use Gmail:
    echo 1. Go to https://myaccount.google.com/apppasswords
    echo 2. Select "Mail" and "Windows Computer"
    echo 3. Copy the generated 16-character password
    echo.
    set /p smtp_user="Enter your Gmail address: "
    set /p smtp_password="Paste your app password (spaces removed): "
    
    set smtp_host=smtp.gmail.com
    set smtp_port=587
    set smtp_from=noreply@dimphokelesego.com
)

REM SendGrid Setup
if "!provider!"=="2" (
    echo.
    echo ========= SENDGRID SETUP =========
    echo To use SendGrid:
    echo 1. Create account at https://sendgrid.com
    echo 2. Generate API key in Settings - API Keys
    echo 3. Copy the API key
    echo.
    set /p smtp_password="Paste your SendGrid API key: "
    
    set smtp_host=smtp.sendgrid.net
    set smtp_port=587
    set smtp_user=apikey
    set smtp_from=noreply@dimphokelesego.com
)

REM Mailgun Setup
if "!provider!"=="3" (
    echo.
    echo ========= MAILGUN SETUP =========
    echo To use Mailgun:
    echo 1. Create account at https://www.mailgun.com
    echo 2. Get SMTP credentials from Domain Settings
    echo.
    set /p smtp_host="Enter Mailgun SMTP host: "
    set /p smtp_user="Enter Mailgun SMTP user: "
    set /p smtp_password="Enter Mailgun SMTP password: "
    set smtp_port=587
    set smtp_from=noreply@dimphokelesego.com
)

REM Get admin email
echo.
set /p admin_email="Enter admin email for notifications (or press Enter for default): "
if "!admin_email!"=="" (
    set admin_email=dimphokelesegocatering@gmail.com
)

REM Create or update .env file
if not exist ".env" (
    copy .env.example .env
    echo Created .env file
)

REM Update .env with values
(
    for /f "tokens=*" %%i in (.env.example) do (
        if "%%i"=="SMTP_HOST=smtp.gmail.com" (
            echo SMTP_HOST=!smtp_host!
        ) else if "%%i"=="SMTP_PORT=587" (
            echo SMTP_PORT=!smtp_port!
        ) else if "%%i"=="SMTP_USER=your-email@gmail.com" (
            echo SMTP_USER=!smtp_user!
        ) else if "%%i"=="SMTP_PASSWORD=your-app-password" (
            echo SMTP_PASSWORD=!smtp_password!
        ) else if "%%i"=="ADMIN_EMAIL=dimphokelesegocatering@gmail.com" (
            echo ADMIN_EMAIL=!admin_email!
        ) else (
            echo %%i
        )
    )
) > .env.tmp
move /y .env.tmp .env

echo.
echo ========== SETUP COMPLETE =========
echo Email configuration has been saved to .env
echo.
echo Next steps:
echo 1. Rebuild the project: npm run build
echo 2. Restart the backend: npm run dev
echo 3. Test by submitting a form on the website
echo 4. Check your email and server logs
echo.
echo For more information, see EMAIL_SETUP.md
echo.
pause
