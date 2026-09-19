@echo off
setlocal
cd /d "%~dp0"

echo =======================================================
echo   VIET PHUC REMIX -- KHOI DONG HE THONG STYLING GEN Z
echo =======================================================

:: Kiem tra Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [LOI] Khong tim thay Node.js tren may tinh!
    echo Vui long cai dat Node.js (phien ban 18 tro len) tai: https://nodejs.org/
    echo =======================================================
    pause
    exit /b 1
)

:: Kiem tra va cai dat dependencies neu chua co node_modules
if not exist "node_modules\" (
    echo [THONG BAO] Phat hien chua cai dat thu vien (node_modules).
    echo Dang tu dong chay "npm install"... Vui long doi trong giay lat!
    echo.
    call npm install
    if %errorlevel% neq 0 (
        echo [LOI] Qua trinh cai dat thu vien that bai. Vui long kiem tra ket noi mang va thu lai!
        pause
        exit /b 1
    )
    echo.
    echo [THANH CONG] Da cai dat xong cac thu vien!
    echo.
)

echo Dang khoi dong may chu phat trien (Vite Dev Server)...
echo Truyen cap ung dung tai dia chi local (thuong la: http://localhost:5173)
echo =======================================================
call npm run dev

pause
