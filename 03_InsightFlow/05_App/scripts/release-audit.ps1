$ErrorActionPreference = "Stop"

$repositoryRoot = (Resolve-Path (Join-Path $PSScriptRoot "..\..\..")).Path
$excludedSegments = @("\.git\", "\node_modules\", "\.next\", "\coverage\", "\.vercel\", "\.cloudbase\")
$binaryExtensions = @(".png", ".jpg", ".jpeg", ".gif", ".webp", ".ico", ".xlsx", ".pdf")
$secretPatterns = @(
  @{ Name = "API key token"; Pattern = "sk-[A-Za-z0-9_-]{16,}" },
  @{ Name = "Populated AI_API_KEY"; Pattern = "AI_API_KEY[ \t]*=[ \t]*(?![<\[`${])[A-Za-z0-9_-]{12,}" }
)
$privatePathPatterns = @(
  @{ Name = "Windows user path"; Pattern = "[A-Za-z]:\\Users\\[^\\\s]+" },
  @{ Name = "macOS user path"; Pattern = "/Users/[^/<\s]+/" },
  @{ Name = "file URI"; Pattern = "file://[A-Za-z]" }
)

$files = Get-ChildItem -LiteralPath $repositoryRoot -Recurse -File | Where-Object {
  $path = $_.FullName
  -not ($excludedSegments | Where-Object { $path.Contains($_) }) -and
  $binaryExtensions -notcontains $_.Extension.ToLowerInvariant() -and
  $_.Name -ne ".env.local" -and $_.FullName -ne $PSCommandPath
}

$secretFindings = @()
$privatePathFindings = @()
foreach ($file in $files) {
  $content = Get-Content -Raw -LiteralPath $file.FullName -ErrorAction SilentlyContinue
  if ($null -eq $content) { continue }
  foreach ($rule in $secretPatterns) {
    if ($content -match $rule.Pattern) {
      $secretFindings += "$($rule.Name): $($file.FullName.Substring($repositoryRoot.Length + 1))"
    }
  }
  foreach ($rule in $privatePathPatterns) {
    if ($content -match $rule.Pattern) {
      $privatePathFindings += "$($rule.Name): $($file.FullName.Substring($repositoryRoot.Length + 1))"
    }
  }
}

Write-Output "SCANNED_FILES=$($files.Count)"
Write-Output "SECRET_FINDINGS=$($secretFindings.Count)"
Write-Output "PRIVATE_PATH_FINDINGS=$($privatePathFindings.Count)"
$secretFindings | ForEach-Object { Write-Output "SECRET: $_" }
$privatePathFindings | ForEach-Object { Write-Output "PRIVATE_PATH: $_" }

if ($secretFindings.Count -gt 0 -or $privatePathFindings.Count -gt 0) { exit 1 }
