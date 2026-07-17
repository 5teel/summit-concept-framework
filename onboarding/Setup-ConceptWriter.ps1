<#
  Summit - Concept Writer one-time setup (plugin model)
  =====================================================
  Wires a PC so Claude (Cowork OR Code) can run the Summit concept + VI report
  writing skills. Concepts publish to the shared X:\Labs dashboard; VI reports
  read central client measure packs from the X:\Labs share and write outputs to
  the writer's LOCAL Documents\Summit workspace (client data stays central).

  Skills ship as ONE Claude PLUGIN from a single GitHub marketplace:
      https://github.com/5teel/summit-concept-framework   (plugin: summit-concepts)
  (Cowork requires a git URL - it won't take a local/UNC path.) This script:

    1)  maps the DATA share to  X:  (persistent) - dashboard write-back, templates,
        and the central client measure packs the VI skill reads from X:\Labs;
    1b) scaffolds the local Documents\Summit workspace (report outputs + assets);
    2)  for Claude CODE (if the `claude` CLI is present): registers the GitHub
        marketplace, REFRESHES it, installs summit-concepts, UPDATES it to the
        latest published version, and retires any old copy-installed skills so
        they don't duplicate the plugin;
    3)  prints the one-time steps for Claude COWORK (Plugins panel + Add folder x2).

  Re-run any time to refresh - the marketplace-update + plugin-update steps in (2)
  are what make a re-run actually pull new skills. Restart Claude Code afterwards.
  ASCII only (Windows PowerShell 5.1 reads no-BOM UTF-8 as ANSI; non-ASCII
  punctuation in string literals breaks parsing).

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

$MarketUrl   = "https://github.com/5teel/summit-concept-framework"   # concept marketplace (GitHub)
$MarketOwner = "5teel/summit-concept-framework"                      # owner/repo form for the Cowork dialog
$MarketName  = "summit-insights"                                     # registered marketplace name (from marketplace.json)

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

# 1b) scaffold the per-writer LOCAL workspace (Documents\Summit) - report outputs + personal assets.
#     Client data (measure packs) stays CENTRAL on X:\Labs\client-packs - never copied here.
$ws = Join-Path ([Environment]::GetFolderPath('MyDocuments')) "Summit"
foreach($d in @("Projects","Templates","Skills","VI Report Writing\Context","VI Report Writing\Reports")){
  $p = Join-Path $ws $d
  if(-not (Test-Path $p)){ try { New-Item -ItemType Directory -Path $p -Force | Out-Null } catch {} }
}
$skReadme = Join-Path $ws "Skills\README.txt"
if(-not (Test-Path $skReadme)){
  try { Set-Content -Path $skReadme -Encoding ASCII -Value @(
    "Personal skill drafts / reference only.",
    "Cowork loads skills from MARKETPLACES (Plugins panel), NOT from this folder.",
    "Dropping a skill here does NOT make it available in Cowork."
  ) } catch {}
}
$ctxReadme = Join-Path $ws "VI Report Writing\Context\README.txt"
if(-not (Test-Path $ctxReadme)){
  try { Set-Content -Path $ctxReadme -Encoding ASCII -Value @(
    "Interim report-writing context, one folder per project: Context\<project>\",
    "Holds notes, confirmed measure mappings, decisions, reference material and",
    "reusable patterns that are NOT yet formalized into a skill for ongoing use.",
    "When a project's context matures or recurs, promote it into a packaged skill",
    "in the summit-concepts plugin. Finished report JSON goes in ..\Reports\<project>\."
  ) } catch {}
}
if(Test-Path $ws){ Say ("  [ok] local workspace ready: {0}" -f $ws) Green }
else { Say "  [!] could not create the Documents\Summit workspace" Yellow }

# 2) Claude Code path: register the GitHub marketplace + install the plugin (if the CLI is here)
$claude = Get-Command claude -ErrorAction SilentlyContinue
if($claude){
  Say ""
  Say "  Claude Code detected - installing the plugin from GitHub..." White
  try { & claude plugin marketplace add "$MarketUrl" 2>&1 | Out-Null; Say ("  [ok] marketplace '{0}' registered (GitHub)" -f $MarketName) Green }
  catch { Say ("  [!] marketplace add failed (is git signed in to GitHub?): {0}" -f $_.Exception.Message) Yellow }
  # Refresh the local marketplace clone BEFORE install/update. 'marketplace add' is a
  # no-op once registered and never re-fetches, so without this the clone stays pinned
  # at its original commit and 'plugin update' cannot see versions published since -
  # new skills stay invisible forever. This is what makes a re-run actually refresh.
  try { & claude plugin marketplace update "$MarketName" 2>&1 | Out-Null; Say ("  [ok] marketplace '{0}' refreshed to latest" -f $MarketName) Green }
  catch { Say ("  [!] marketplace update failed: {0}" -f $_.Exception.Message) Yellow }
  try { & claude plugin install summit-concepts@summit-insights 2>&1 | Out-Null; Say "  [ok] plugin 'summit-concepts' installed (summit-new-canvas + summit-concept + summit-cdr + summit-vi-report-writer)" Green }
  catch { Say ("  [!] plugin install failed: {0}" -f $_.Exception.Message) Yellow }
  # 'plugin install' is also a no-op when already installed, so update explicitly to
  # pull any newer version the refresh above just made visible.
  try { & claude plugin update summit-concepts@summit-insights 2>&1 | Out-Null; Say "  [ok] plugin 'summit-concepts' updated to the latest version" Green }
  catch { Say ("  [!] plugin update failed: {0}" -f $_.Exception.Message) Yellow }
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
Say "     1. Plugins panel -> Add marketplace, then install the plugin:" Gray
Say ("        - {0}   -> install 'summit-concepts'" -f $MarketOwner) Gray
Say "     2. Connect BOTH folders (skills read data + write outputs):" Gray
Say "        - Add folder -> X:\Labs                        (client packs + dashboard; read)" Gray
Say ("        - Add folder -> {0}   (your report outputs; read/write)" -f $ws) Gray
Say "     3. Start a new chat" Gray
Say ""
Say "  ALREADY installed and a skill is missing? Update - in this order:" White
Say ("     Cowork:  /plugin marketplace update {0}   then   /plugin update summit-concepts" -f $MarketName) Gray
Say ("     Code:    claude plugin marketplace update {0}   then   claude plugin update summit-concepts@{0}" -f $MarketName) Gray
Say "     The marketplace refresh MUST come first - without it the update finds nothing new." Gray
Say "     Then restart Claude Code / start a new Cowork chat." Gray
Say ""
Say "  Then, in Cowork or Code, any time:" White
Say '     sketch a raw idea:       "sketch this" / "new canvas" (summit-new-canvas)' Gray
Say '     add an existing sketch:  summit-concept import "C:\path\to\your\project"' Gray
Say "     or start a new idea:     summit-concept my-idea" Gray
Say "     submit when ready:       summit-concept submit" Gray
Say "     build a VI report:       ask Claude to build a VI report" Gray
Say ""
Say ("  Quickstart:  {0}\report-writer-quickstart.html" -f $here) DarkGray
Say ("  Full guide:  {0}\ONBOARDING.md" -f $here) DarkGray
Say ""
