param()

# Use the venv python if available, else fallback to system python
$venvPython = Join-Path -Path $PSScriptRoot -ChildPath "..\\.venv\\Scripts\\python.exe"
if (-not (Test-Path $venvPython)) {
    $venvPython = "python"
}

$artifacts = Join-Path -Path $PSScriptRoot -ChildPath "..\\artifacts"
if (-not (Test-Path $artifacts)) { New-Item -ItemType Directory -Path $artifacts | Out-Null }

Write-Host "Using python: $venvPython"

$pytestCmd = @(
    "-m", "pytest",
    "-q",
    "tests",
    "--junitxml=artifacts/junit.xml",
    "--maxfail=1"
)

# Run pytest and tee output to artifacts/pytest.txt
& $venvPython @pytestCmd 2>&1 | Tee-Object -FilePath "$artifacts\\pytest.txt"
$exit = $LASTEXITCODE

if ($exit -eq 0) {
    Write-Host "TESTS PASSED"
    exit 0
} else {
    Write-Host "TESTS FAILED: exit=$exit"
    exit $exit
}
