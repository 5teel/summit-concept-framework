param(
    [Parameter(Mandatory = $false)]
    [string]$OutputPath
)

Set-StrictMode -Version 2.0
$ErrorActionPreference = "Stop"

try {
    $ScriptDirectory = Split-Path -Parent $MyInvocation.MyCommand.Path
    $SkillRoot = [System.IO.Path]::GetFullPath((Join-Path $ScriptDirectory ".."))
    $Verifier = Join-Path $ScriptDirectory "verify-portability.mjs"

    if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
        throw "Node.js 20 or newer is required to verify the skill before packaging."
    }

    $NodeMajor = [int]((& node -p "process.versions.node.split('.')[0]").Trim())
    if ($LASTEXITCODE -ne 0 -or $NodeMajor -lt 20) {
        throw "Node.js 20 or newer is required."
    }

    & node $Verifier
    if ($LASTEXITCODE -ne 0) {
        throw "Portability verification failed; no package was created."
    }

    if ([string]::IsNullOrWhiteSpace($OutputPath)) {
        $OutputPath = Join-Path (Split-Path -Parent $SkillRoot) "summit-vi-report-writer.zip"
    }
    $ResolvedOutput = [System.IO.Path]::GetFullPath($ExecutionContext.SessionState.Path.GetUnresolvedProviderPathFromPSPath($OutputPath))
    $SkillPrefix = $SkillRoot.TrimEnd([System.IO.Path]::DirectorySeparatorChar, [System.IO.Path]::AltDirectorySeparatorChar) + [System.IO.Path]::DirectorySeparatorChar
    if ($ResolvedOutput.StartsWith($SkillPrefix, [System.StringComparison]::OrdinalIgnoreCase)) {
        throw "OutputPath must be outside the skill directory."
    }
    if ([System.IO.Path]::GetExtension($ResolvedOutput) -ne ".zip") {
        throw "OutputPath must end in .zip."
    }

    $OutputDirectory = Split-Path -Parent $ResolvedOutput
    if (-not (Test-Path -LiteralPath $OutputDirectory -PathType Container)) {
        New-Item -ItemType Directory -Path $OutputDirectory -Force | Out-Null
    }
    $TemporaryOutput = Join-Path $OutputDirectory (".summit-vi-report-writer-{0}.tmp.zip" -f ([guid]::NewGuid().ToString("N")))
    $RollbackOutput = Join-Path $OutputDirectory (".summit-vi-report-writer-{0}.rollback.zip" -f ([guid]::NewGuid().ToString("N")))
    try {
        Compress-Archive -LiteralPath $SkillRoot -DestinationPath $TemporaryOutput -CompressionLevel Optimal
        if (-not (Test-Path -LiteralPath $TemporaryOutput -PathType Leaf) -or (Get-Item -LiteralPath $TemporaryOutput).Length -le 0) {
            throw "Temporary package was not created correctly."
        }
        if (Test-Path -LiteralPath $ResolvedOutput) {
            Move-Item -LiteralPath $ResolvedOutput -Destination $RollbackOutput
        }
        try {
            Move-Item -LiteralPath $TemporaryOutput -Destination $ResolvedOutput
            if (Test-Path -LiteralPath $RollbackOutput) {
                Remove-Item -LiteralPath $RollbackOutput -Force
            }
        }
        catch {
            if (Test-Path -LiteralPath $RollbackOutput -PathType Leaf) {
                if (Test-Path -LiteralPath $ResolvedOutput) { Remove-Item -LiteralPath $ResolvedOutput -Force }
                Move-Item -LiteralPath $RollbackOutput -Destination $ResolvedOutput
            }
            throw
        }
    }
    finally {
        if (Test-Path -LiteralPath $TemporaryOutput) { Remove-Item -LiteralPath $TemporaryOutput -Force }
        if (Test-Path -LiteralPath $RollbackOutput) { Remove-Item -LiteralPath $RollbackOutput -Force }
    }

    Write-Output "PACKAGE PASS path=$ResolvedOutput"
    exit 0
}
catch {
    Write-Error ("PACKAGE FAIL: {0}" -f $_.Exception.Message)
    exit 1
}
