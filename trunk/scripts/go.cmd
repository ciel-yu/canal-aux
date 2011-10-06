del *.exe *.scr *.txt *.db *.sue *.ion *.vix *.ini *.folder ".DS_Store" *.nfo *.mht *.url password.*  /s/a/f/q

if not '%1'=='' goto END

for /d %%a in ( *.* ) do @pkzipc -add -move -recu -maximum -dir=none "u:\%%a.zip" "%%a\*.*" & move "u:\%%a.zip" .
cleanempty
retag

:END