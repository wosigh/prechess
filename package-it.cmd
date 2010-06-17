set STAGING_DIR=STAGING\com.vocshopgames.chess
rmdir /s /y %STAGING_DIR%
del *.ipk
mkdir %STAGING_DIR%
xcopy /s /y mojo %STAGING_DIR%

copy /b mojo\app\assistants\game-assistant_*.js %STAGING_DIR%\app\assistants\game-assistant1.js
del %STAGING_DIR%\app\assistants\game-assistant_*.js

find /v "Mojo.Log.error" <%STAGING_DIR%\app\assistants\game-assistant1.js  >%STAGING_DIR%\app\assistants\game-assistant.js 
find /v "Mojo.Log.error" <mojo\app\assistants\stage-assistant.js  >%STAGING_DIR%\app\assistants\stage-assistant.js 
find /v "Mojo.Log.error" <mojo\app\assistants\preferences-assistant.js  >%STAGING_DIR%\app\assistants\preferences-assistant.js
::jsc %STAGING_DIR%\app\assistants\game-assistant.js  %STAGING_DIR%\app\assistants\game-assistant.js 
::jsc %STAGING_DIR%\app\assistants\stage-assistant.js %STAGING_DIR%\app\assistants\stage-assistant.js 
::jsc %STAGING_DIR%\app\assistants\preferences-assistant.js  %STAGING_DIR%\app\assistants\preferences-assistant.js
:: cd engines
:: call _buildit.cmd
:: cd ..
copy engines\polyglot\polyglot %STAGING_DIR%
::copy engines\glaurung\glaurung %STAGING_DIR%
copy engines\stockfish\stockfish %STAGING_DIR%
::copy engines\fruit\fruit %STAGING_DIR%
copy engines\polyglot.ini %STAGING_DIR%
::copy engines\book.bin %STAGING_DIR%
echo filemode.755=polyglot,stockfish,glaurung,fruit,book.bin > %STAGING_DIR%\package.properties
pdk-package %STAGING_DIR%
