@echo off
title Herald OS - Windows 11 Home Hyper-V Enabler
color 0B
echo ===================================================================
echo   HERALD OS / HYPER-V ENABLER FOR WINDOWS 11 HOME
echo   Enables native Hyper-V Virtualization Platform via DISM packages
echo ===================================================================
echo.

:: Check for Administrator privileges
net session >nul 2>&1
if %errorLevel% NEQ 0 (
    echo [ERROR] This script MUST be run as Administrator!
    echo Right-click this file and select 'Run as Administrator'.
    pause
    exit /b 1
)

echo [1/3] Scanning servicing packages for Hyper-V components...
pushd "%~dp0"
dir /b %SystemRoot%\servicing\Packages\*Hyper-V*.mum > hyper-v-packages.txt

echo [2/3] Adding Hyper-V packages to Windows 11 Home...
for /f %%i in ('findstr /i . hyper-v-packages.txt 2^>nul') do (
    echo Installing %%i...
    dism /online /norestart /add-package:"%SystemRoot%\servicing\Packages\%%i"
)
del hyper-v-packages.txt

echo [3/3] Enabling Microsoft-Hyper-V-All feature...
dism /online /enable-feature /featurename:Microsoft-Hyper-V-All /LimitAccess /ALL

echo.
echo ===================================================================
echo   HYPER-V INSTALLATION COMPLETE!
echo   Please reboot your machine to finalize Hyper-V Manager.
echo   After reboot, you can import Herald OS .vhdx in Hyper-V Manager.
echo ===================================================================
pause
