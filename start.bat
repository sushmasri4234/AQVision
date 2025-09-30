@echo off
echo Starting AQVision Combined Application...
echo.
echo Building frontend...
call npm run build
echo.
echo Starting server on http://localhost:8080
echo Press Ctrl+C to stop
echo.
call npm start