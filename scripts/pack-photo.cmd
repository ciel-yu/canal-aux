@echo off

for /d %%a in ( * ) do pkzipc -add -move -recu -maximum -dir=relative "%%a.zip" "%%a\*.*"