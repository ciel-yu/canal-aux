@echo off

if not '%1'=='on' goto off

set __COMPAT_LAYER=#ApplicationLocale
set AppLocaleID=0411
goto end

:off
set __COMPAT_LAYER=
set AppLocaleID=

:end