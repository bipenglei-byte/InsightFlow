$ErrorActionPreference = "Stop"

$appDirectory = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$screenshotDirectory = (Resolve-Path (Join-Path $PSScriptRoot "..\..\06_Demo\screenshots")).Path
$standardOutput = Join-Path $env:TEMP "insightflow-day7-server.out.log"
$standardError = Join-Path $env:TEMP "insightflow-day7-server.err.log"
$edge = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"

$server = Start-Process -FilePath "pnpm.cmd" -ArgumentList @("dev", "--port", "3020") -WorkingDirectory $appDirectory -WindowStyle Hidden -RedirectStandardOutput $standardOutput -RedirectStandardError $standardError -PassThru

try {
  $ready = $false
  for ($attempt = 0; $attempt -lt 40; $attempt++) {
    try {
      $response = Invoke-WebRequest -UseBasicParsing -Uri "http://127.0.0.1:3020/api/health" -TimeoutSec 2
      if ($response.StatusCode -eq 200) { $ready = $true; break }
    } catch {}
    Start-Sleep -Milliseconds 500
  }
  if (-not $ready) { throw "Server failed to start: $(Get-Content -Raw $standardError)" }

  $shots = @(
    @{ Name = "01_dashboard.png"; Route = "/dashboard" },
    @{ Name = "02_upload.png"; Route = "/projects/new/upload" },
    @{ Name = "03_processing.png"; Route = "/processing" },
    @{ Name = "04_analysis.png"; Route = "/projects/nova-v32/analysis" },
    @{ Name = "05_pain_point.png"; Route = "/pain-points/search-experience" },
    @{ Name = "06_evidence.png"; Route = "/evidence/search-experience" },
    @{ Name = "07_requirements.png"; Route = "/requirements" },
    @{ Name = "08_priority.png"; Route = "/requirements/search-optimization" },
    @{ Name = "09_prd.png"; Route = "/prd/search-optimization" },
    @{ Name = "10_evaluation.png"; Route = "/states" }
  )

  foreach ($shot in $shots) {
    $outputPath = Join-Path $screenshotDirectory $shot.Name
    $profilePath = Join-Path $env:TEMP ("edge-insightflow-" + [guid]::NewGuid().ToString("N"))
    Invoke-WebRequest -UseBasicParsing -Uri ("http://127.0.0.1:3020" + $shot.Route) -TimeoutSec 30 | Out-Null
    Start-Sleep -Milliseconds 500
    $previousErrorPreference = $ErrorActionPreference
    $ErrorActionPreference = "Continue"
    & $edge --headless --disable-gpu --hide-scrollbars --virtual-time-budget=3000 --window-size=1440,1000 --user-data-dir=$profilePath --screenshot=$outputPath ("http://127.0.0.1:3020" + $shot.Route) 2>$null | Out-Null
    $ErrorActionPreference = $previousErrorPreference
    if (-not (Test-Path $outputPath)) { throw "Screenshot missing: $outputPath" }
  }

  Get-ChildItem -LiteralPath $screenshotDirectory -Filter "*.png" | Select-Object Name, Length
} finally {
  if ($server -and -not $server.HasExited) { Stop-Process -Id $server.Id -Force }
}
