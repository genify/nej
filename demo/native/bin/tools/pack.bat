@echo off

if not exist "pack" mkdir "pack"
if not exist "pack\res" mkdir "pack\res"
if not exist "pack\locales" mkdir "pack\locales"

copy /Y ..\mailease.exe pack\
copy /Y ..\libcef.dll pack\
copy /Y ..\icudt.dll pack\
copy /Y ..\chrome.pak pack\
copy /Y ..\res\*.* pack\res\*.*
copy /Y ..\locales\*.* pack\locales\*.*
copy /Y test_host.bat pack\

cd pack
..\Rar.exe a -r ..\mailease.rar *.*
cd ..

rmdir /s /q .\pack
pause

