@ECHO OFF
::RD "%TEMP%" /S/Q
::IF NOT EXIST "%TEMP%" MD "%TEMP%"

DEL "%TEMP%" /S/Q/A/F > NUL
