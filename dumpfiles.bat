@echo off
cls
setlocal enabledelayedexpansion

rem Self-contained filedumper with hard-coded directories.
rem Run this script from the project root.

rem === Show header (Excluding node_modules from Tree) ===
echo Here is my entire codebase for the project:
echo.
echo ```
rem Temporarily hide node_modules so tree ignores it and its contents
if exist "node_modules" attrib +h "node_modules"
if exist ".git" attrib +h ".git"

tree /f

rem Return attributes to normal
if exist "node_modules" attrib -h "node_modules"
if exist ".git" attrib -h ".git"
echo ```
echo.

rem === Directories to dump ===
call :process "./"
call :process "./src/"
call :process "./src/components/"
call :process "./src/data/"
call :process "./src/lib/"
call :process "./src/types/"

goto :eof


rem =======================
rem Helper: process one arg
rem =======================
:process
set "prefix=%~1"
set "dir=%~1"
set "dir=%dir:/=\%"
call :dumpfiles "%prefix%" "%dir%"
goto :eof


rem ===========================
rem Core logic: dump the files
rem ===========================
:dumpfiles
set "pfx=%~1"
set "dir=%~2"

for %%f in ("%dir%\*") do (
    set "attrs=%%~af"
    set "fname=%%~nxf"
    
    rem 1. Skip directories
    if /I not "!attrs:~0,1!"=="d" (
        
        rem 2. Skip specific filenames (package-lock.json, etc.)
        if /I not "!fname!"=="package-lock.json" if /I not "!fname!"=="yarn.lock" (
            
            rem 3. Skip specific extensions (binaries, images, etc.)
            if /I not "%%~xf"==".exe" if /I not "%%~xf"==".pdf" if /I not "%%~xf"==".o" if /I not "%%~xf"==".png" if /I not "%%~xf"==".ico" if /I not "%%~xf"==".bat" if /I not "%%~xf"==".sh" if /I not "%%~xf"==".sqlite3" (
                
                if defined pfx (
                    echo `!pfx!%%~nxf`:
                ) else (
                    echo `%%~nxf`:
                )
                echo.
                echo ```
                type "%%~ff"
                echo.
                echo ```
                echo.
            )
        )
    )
)
goto :eof