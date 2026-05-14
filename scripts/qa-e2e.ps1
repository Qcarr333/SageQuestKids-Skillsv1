param(
  [switch]$Headed
)

$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
$url = $env:PLAYWRIGHT_BASE_URL
if (-not $url) {
  $url = 'http://localhost:3003'
}

function Test-QaServer {
  param([string]$TargetUrl)

  try {
    $response = Invoke-WebRequest -Uri "$TargetUrl/gaming" -UseBasicParsing -TimeoutSec 2
    return $response.StatusCode -ge 200 -and $response.StatusCode -lt 500
  } catch {
    return $false
  }
}

$startedServer = $false
$serverProcess = $null

try {
  if (-not (Test-QaServer $url)) {
    $startedServer = $true
    $serverProcess = Start-Process `
      -FilePath 'node' `
      -ArgumentList 'node_modules/next/dist/bin/next', 'dev', '-p', '3003' `
      -WorkingDirectory $root `
      -WindowStyle Hidden `
      -PassThru

    $ready = $false
    for ($attempt = 0; $attempt -lt 60; $attempt += 1) {
      Start-Sleep -Seconds 1
      if (Test-QaServer $url) {
        $ready = $true
        break
      }
    }

    if (-not $ready) {
      throw "Timed out waiting for QA server at $url/gaming"
    }
  }

  $playwrightArgs = @('playwright', 'test')
  if ($Headed) {
    $playwrightArgs += '--headed'
  }

  & npx.cmd @playwrightArgs
  exit $LASTEXITCODE
} finally {
  if ($startedServer -and $serverProcess -and -not $serverProcess.HasExited) {
    Stop-Process -Id $serverProcess.Id -Force
  }
}
