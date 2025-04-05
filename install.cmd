@echo off
SETLOCAL
goto init


:getvariables
    REM if we have a directory passed in then we can look at copying the files to the programfiles directory
    IF "%~1"=="" (
        echo no parameters passed
        Exit /b
    )
    REM getting source dir
    set tmp_dir="%~1"
    REM set destination dir
    set destination_dir=%LOCALAPPDATA%\StreamRoller\
    REM change to the tmp directory so we can read files and stuff
    cd %tmp_dir%
    REM get softwareversion from the local file
    set /p SoftwareVersion=< SoftwareVersion.txt    
    Exit /b

:createshortcut
    echo "%TEMP%\%RANDOM%-%RANDOM%-%RANDOM%-%RANDOM%.vbs"
    set SCRIPT="%TEMP%\%RANDOM%-%RANDOM%-%RANDOM%-%RANDOM%.vbs"
    echo Set oWS = WScript.CreateObject("WScript.Shell") >> %SCRIPT%
    echo sLinkFile = "%USERPROFILE%\Desktop\StreamRoller.lnk" >> %SCRIPT%
    echo Set oLink = oWS.CreateShortcut(sLinkFile) >> %SCRIPT%
    echo oLink.TargetPath = "%destination_dir%\run.cmd" >> %SCRIPT%
    echo oLink.WorkingDirectory = "%destination_dir%" >> %SCRIPT%
    echo oLink.IconLocation = "%destination_dir%backend\data_center\public\favicon.ico" >> %SCRIPT%
    echo oLink.Save >> %SCRIPT%

    cscript /nologo %SCRIPT%
    del %SCRIPT%
    exit /b

:createuninstallshortcut
    set SCRIPT="%TEMP%\%RANDOM%-%RANDOM%-%RANDOM%-%RANDOM%.vbs"
    echo Set oWS = WScript.CreateObject("WScript.Shell") >> %SCRIPT%
    echo sLinkFile = "%USERPROFILE%\Desktop\Uninstall_StreamRoller.lnk" >> %SCRIPT%
    echo Set oLink = oWS.CreateShortcut(sLinkFile) >> %SCRIPT%
    echo oLink.TargetPath = "%destination_dir%\UninstallStreamRoller.cmd" >> %SCRIPT%
    echo oLink.WorkingDirectory = "%destination_dir%" >> %SCRIPT%
    echo oLink.Save >> %SCRIPT%

    cscript /nologo %SCRIPT%
    del %SCRIPT%
    exit /b

:init
    REM unset any varibles we may have set (ie if someone exited the previous run half way though)
    set tmp_dir=""
    set destination_dir=""
    set SoftwareVersion=""
    
    call :getvariables %*
    if %tmp_dir%=="" (
        echo Couldn't set temp directory
        Exit /b
    )
    
    if %destination_dir%=="" (
        echo Couldn't set destination directory
        Exit /b
    )

    echo [33mInstalling StreamRoller %SoftwareVersion%%[0m
    
    echo Deleting previous version
    rmdir /s /q %destination_dir%
    
    if not exist %destination_dir% mkdir %destination_dir%

    REM move to the new directory
    cd %destination_dir%
    
    echo Installing new version 
    xcopy %tmp_dir%\*.* %destination_dir% /e /c /i /q /h /r /y
    
    echo Creating desktop shortcuts
    call :createshortcut
    call :createuninstallshortcut
    REM we need to pass in the temp dir so we can delete it once running (when we are not running a script in it :D)
    echo running the software
    run.cmd -d %tmp_dir% >> log.txt
 
:end
echo "Finished2"
ENDLOCAL
