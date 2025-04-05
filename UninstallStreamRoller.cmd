@echo off
echo ------------------------------------
echo WARNING ABOUT TO DELETE STREAMROLLER
echo ------------------------------------

:CHOICE
CHOICE /C:YNC /M "Delete StreamRoller settings/passwords/saved/backup files. \nWARNING this is permanent: Press Y for Yes, N for No, C for Cancel"
if ERRORLEVEL==3 goto CANCEL
if ERRORLEVEL==2 goto DELETEFILES
if ERRORLEVEL==1 goto DELETESETTINGS
ECHO "%choice%" is not valid, try again
goto CHOICE

:DELETESETTINGS
echo Deleting settings and saved files
rmdir /s /q %APPDATA%\StreamRoller
echo 

:DELETEFILES
echo Deleting StreamRoller app
rmdir /s /q %LOCALAPPDATA%\StreamRoller
echo Deleting temp files
rmdir /s /q %LOCALAPPDATA%\temp\caxa
echo Deleting desktop shortcut
del /q %HOMEPATH%\Desktop\StreamRoller.lnk
del /q %HOMEPATH%\Desktop\UninstallStreamRoller.lnk
echo *************************************************
echo Thanks for trying StreamRoller. 
echo If you have any feedback please feel free to post in in the discord
echo https://discord.com/channels/457871737611091979/634198604134744084
echo *************************************************
goto END

:CANCEL
echo Cancelled. No changes were made.
goto END


:END
pause