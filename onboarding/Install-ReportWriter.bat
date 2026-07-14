@echo off
REM ============================================================
REM  Summit - one-time Concept Writer setup (plugin model)
REM  Maps the DATA share to X: and, for Claude Code, registers
REM  the marketplace + installs the summit-concepts plugin.
REM  For Claude Cowork, follow the on-screen Plugins-panel steps.
REM  Just double-click this file.
REM ============================================================
title Summit Concept Writer setup
powershell -ExecutionPolicy Bypass -NoProfile -File "%~dp0Setup-ConceptWriter.ps1"
echo.
echo Press any key to close...
pause >nul
