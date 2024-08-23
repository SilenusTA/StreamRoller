@echo off
rem SET STREAMTOOL_DEBUG_FORMAT=extended-line

rem check if we need to delete install files (only on first run)

set str1="%~2"
IF "%~1"=="-d" (
    echo %str1%
    if not x%str1:StreamRoller=%==x%str1% (
        echo deleting install files %~2
        rmdir /s /q "%~2..\.."
        )
)
cd %LOCALAPPDATA%\StreamRoller\

echo waiting for file
for /l %%x in (1, 1, 10) do (
   echo .
   IF EXIST "node_modules\.bin\node.cmd" GOTO waitfornode
   timeout /t 1
)
:waitfornode

Start "Streamroller" node_modules\.bin\node.cmd backend\data_center\server.js
rem start http:\\localhost:3000
