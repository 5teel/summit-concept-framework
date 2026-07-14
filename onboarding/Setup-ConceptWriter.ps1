<#
  Summit - Concept Writer one-time setup (plugin model)
  =====================================================
  Wires a PC so Claude (Cowork OR Code) can run the summit-concept / summit-cdr
  skills, which publish concepts to the shared X:\Labs dashboard.

  The skills ship as a Claude PLUGIN from a marketplace hosted on GitHub:
      https://github.com/5teel/summit-concept-framework   (plugin: summit-concepts)
  (Cowork requires a git URL - it won't take a local/UNC path.) This script:

    1) maps the DATA share to  X:  (persistent) - needed for the dashboard
       write-back and for the templates the skills read from X:\Labs;
    2) for Claude CODE (if the `claude` CLI is present): registers the GitHub
       marketplace and installs the `summit-concepts` plugin, and retires any old
       copy-installed skills so they don't duplicate the plugin;
    3) prints the two one-time steps for Claude COWORK (done in its Plugins panel).

  Re-run any time to refresh. ASCII only (Windows PowerShell 5.1 reads no-BOM
  UTF-8 as ANSI; non-ASCII punctuation in string literals breaks parsing).

      one-click:  double-click  Install-ReportWriter.bat
      or:         powershell -ExecutionPolicy Bypass -File Setup-ConceptWriter.ps1
#>
[CmdletBinding()]
param([switch]$Quiet)
$ErrorActionPreference = "Stop"
function Say($m,$c="Gray"){ if(-not $Quiet){ Write-Host $m -ForegroundColor $c } }
function Resolve-Unc([string]$path){
  if($path -match '^\\\\'){ return $path }
  if($path.Length -ge 2 -and $path[1] -eq ':'){
    $pd = Get-PSDrive $path.Substring(0,1) -ErrorAction SilentlyContinue
    if($pd -and $pd.DisplayRoot){ return ($pd.DisplayRoot + $path.Substring(2)) }
  }
  return $path
}

$MarketUrl   = "https://github.com/5teel/summit-concept-framework"   # the Summit marketplace (GitHub)
$MarketOwner = "5teel/summit-concept-framework"                      # owner/repo form for the Cowork dialog

$here = $PSScriptRoot; if(-not $here){ $here = Split-Path -Parent $MyInvocation.MyCommand.Path }
$repo = Split-Path -Parent $here   # the framework working copy: ...\Labs\summit-concept-framework
$shareUnc = ($( Resolve-Unc $repo ) -replace '^(\\\\[^\\]+\\[^\\]+).*','$1')   # the \\server\share root

Say ""
Say "  Summit Concept Writer setup (plugin model)" Cyan
Say ("  marketplace : {0}" -f $MarketUrl) DarkGray
Say ""

# 1) map the DATA share to X: (persistent) so X:\Labs (dashboard + templates) resolves in every Claude session
$cur = Get-PSDrive X -ErrorAction SilentlyContinue
if($cur -and $cur.DisplayRoot){
  if($cur.DisplayRoot -ieq $shareUnc){ Say ("  [ok] X: already maps to {0}" -f $shareUnc) Green }
  else { Say ("  [!] X: maps to {0} (expected {1}) - leaving it; X:\Labs may not resolve." -f $cur.DisplayRoot,$shareUnc) Yellow }
} else {
  try { & net use X: $shareUnc /persistent:yes | Out-Null; Say ("  [ok] mapped X: -> {0} (persistent)" -f $shareUnc) Green }
  catch { Say ("  [!] could not map X: to {0}: {1}" -f $shareUnc,$_.Exception.Message) Yellow }
}

# 2) Claude Code path: register the GitHub marketplace + install the plugin (if the CLI is here)
$claude = Get-Command claude -ErrorAction SilentlyContinue
if($claude){
  Say ""
  Say "  Claude Code detected - installing the plugin from GitHub..." White
  try { & claude plugin marketplace add "$MarketUrl" 2>&1 | Out-Null; Say "  [ok] marketplace 'summit-insights' registered (GitHub)" Green }
  catch { Say ("  [!] marketplace add failed (is git signed in to GitHub?): {0}" -f $_.Exception.Message) Yellow }
  try { & claude plugin install summit-concepts@summit-insights 2>&1 | Out-Null; Say "  [ok] plugin 'summit-concepts' installed (summit-concept + summit-cdr)" Green }
  catch { Say ("  [!] plugin install failed: {0}" -f $_.Exception.Message) Yellow }
  # retire any old COPY-installed skills so they don't duplicate the plugin
  $sk = Join-Path $env:USERPROFILE ".claude\skills"
  $old = @("summit-concept","summit-cdr","summit-sketch","summit-concept-submit","summit-concept-harvest","summit-concept-promote","summit-concept-handoff","summit-concept-graduate")
  foreach($n in $old){
    $p = Join-Path $sk $n
    if(Test-Path $p){
      try { & icacls $p /reset /T /C /Q | Out-Null } catch {}
      try { Get-ChildItem $p -Recurse -File -Force | ForEach-Object { try{ $_.IsReadOnly=$false }catch{} } } catch {}
      try { Remove-Item $p -Recurse -Force; Say ("  [ok] retired old copied skill: {0}" -f $n) DarkGray } catch {}
    }
  }
} else {
  Say ""
  Say "  (Claude Code CLI not found - skipping the Code install; use the Cowork steps below.)" DarkGray
}

# 3) dashboard reachable?
Say ""
if(Test-Path "X:\Labs\generate.ps1"){ Say "  [ok] Concept Dashboard reachable at X:\Labs" Green }
else { Say "  [!] X:\Labs not reachable yet - sign out/in (or reconnect the drive) so the map takes." Yellow }

# 4) Cowork steps + how to use it
Say ""
Say "  In Claude COWORK (desktop app), do this ONCE:" White
Say "     1. Open the Plugins panel  ->  Add marketplace" Gray
Say ("     2. Paste:  {0}" -f $MarketOwner) Gray
Say ("        (or the full URL:  {0})" -f $MarketUrl) DarkGray
Say "     3. Install the 'summit-concepts' plugin, then start a new chat" Gray
Say ""
Say "  Then, in Cowork or Code, any time:" White
Say '     add an existing sketch:  summit-concept import "C:\path\to\your\project"' Gray
Say "     or start a new idea:     summit-concept my-idea" Gray
Say "     submit when ready:       summit-concept submit" Gray
Say ""
Say ("  Quickstart:  {0}\report-writer-quickstart.html" -f $here) DarkGray
Say ("  Full guide:  {0}\ONBOARDING.md" -f $here) DarkGray
Say ""
