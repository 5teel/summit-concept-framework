@echo off
REM ============================================================
REM  Summit - one-time Concept Writer setup (plugin model)
REM  Maps the DATA share to X:, scaffolds the local Documents\Summit
REM  workspace, and (for Claude Code) installs the summit-concepts +
REM  summit-skills plugins. For Claude Cowork, follow the on-screen
REM  Plugins-panel steps. Just double-click this file.
REM ============================================================
title Summit Concept Writer setup
powershell -ExecutionPolicy Bypass -NoProfile -File "%~dp0Setup-ConceptWriter.ps1"
echo.
echo Press any key to close...
pause >nul
