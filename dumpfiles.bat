@echo off
cls
setlocal enabledelayedexpansion

rem Self-contained filedumper with hard-coded directories.
rem Run this script from the project root.

rem === Show header ===
echo Here is my entire codebase for the project:
echo.
echo ```
echo | tree /f
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
rem %1 = argument in "filedump" style (e.g. "./apps/")
set "prefix=%~1"
set "dir=%~1"

rem Convert forward slashes to backslashes for actual filesystem access
set "dir=%dir:/=\%"

call :dumpfiles "%prefix%" "%dir%"
goto :eof


rem ===========================
rem Core logic: dump the files
rem ===========================
:dumpfiles
rem %1 = prefix to print before filename (may be empty)
rem %2 = directory to read files from
set "pfx=%~1"
set "dir=%~2"

for %%f in ("%dir%\*") do (
    set "attrs=%%~af"
    rem Skip directories
    if /I not "!attrs:~0,1!"=="d" (
        rem Skip certain file types
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

goto :eof
