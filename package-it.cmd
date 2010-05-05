set STAGING_DIR=STAGING\com.vocshopgames.chess


rmdir /s /y %STAGING_DIR%
del *.ipk
mkdir %STAGING_DIR%
xcopy /s /y mojo %STAGING_DIR%
:: cd engines
:: call _buildit.cmd
:: cd ..
copy engines\polyglot\polyglot %STAGING_DIR%
copy engines\glaurung\glaurung %STAGING_DIR%
copy engines\stockfish\stockfish %STAGING_DIR%
copy engines\fruit\fruit %STAGING_DIR%
copy engines\polyglot.ini %STAGING_DIR%
copy postinst %STAGING_DIR%
echo filemode.755=polyglot,stockfish,glaurung,fruit > %STAGING_DIR%\package.properties
pdk-package %STAGING_DIR%
