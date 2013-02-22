set objShell=wscript.createObject("WScript.Shell")
path=left(Wscript.ScriptFullName,len(Wscript.ScriptFullName)-len(Wscript.ScriptName))
nativePath = path & "script"
orpheusPath = path & "..\..\..\"

param = "--enable-dev-tools --enable-invoke-trace --native-package-dir=" & nativePath & " --orpheus-package-dir=" & orpheusPath

iR = objShell.Run(Path & "orpheus.exe " & param,0,TRUE) 