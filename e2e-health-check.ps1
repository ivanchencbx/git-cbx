#!/usr/bin/env pwsh
<#
.SYNOPSIS
    E2E自动化测试快速检查脚本

.DESCRIPTION
    验证E2E测试环境是否配置正确

.EXAMPLE
    .\e2e-health-check.ps1
#>

param(
    [switch]$Verbose = $false
)

$ErrorActionPreference = "SilentlyContinue"

Write-Host "`n╔════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  🏥 E2E 测试环境健康检查                          ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════╝`n" -ForegroundColor Cyan

# 颜色定义
$CheckMark = "✅"
$XMark = "❌"
$Warning = "⚠️ "
$Info = "ℹ️ "

# 1. 检查Node.js
Write-Host "📋 Node.js & npm" -ForegroundColor Yellow
if (Get-Command npm -ErrorAction SilentlyContinue) {
    $npmVersion = npm --version
    Write-Host "$CheckMark npm已安装 (版本: $npmVersion)"
} else {
    Write-Host "$XMark npm未安装"
}

# 2. 检查Python
Write-Host "`n📋 Python" -ForegroundColor Yellow
if (Get-Command python -ErrorAction SilentlyContinue) {
    $pythonVersion = python --version
    Write-Host "$CheckMark Python已安装 ($pythonVersion)"
} else {
    Write-Host "$XMark Python未安装"
}

# 3. 检查Docker
Write-Host "`n📋 Docker" -ForegroundColor Yellow
if (Get-Command docker -ErrorAction SilentlyContinue) {
    $dockerVersion = docker --version
    Write-Host "$CheckMark Docker已安装 ($dockerVersion)"
    
    # 检查容器状态
    $containers = docker ps -a | Measure-Object | Select-Object -ExpandProperty Count
    if ($containers -gt 1) {
        Write-Host "$Info Docker容器数量: $(($containers - 1))"
    }
} else {
    Write-Host "$XMark Docker未安装"
}

# 4. 检查Playwright
Write-Host "`n📋 Playwright" -ForegroundColor Yellow
if (Test-Path "web\node_modules\@playwright") {
    Write-Host "$CheckMark Playwright已安装"
    
    # 检查浏览器
    $browsers = @()
    if (Test-Path "$env:USERPROFILE\.cache\ms-playwright\chromium*") { $browsers += "Chromium" }
    if (Test-Path "$env:USERPROFILE\.cache\ms-playwright\firefox*") { $browsers += "Firefox" }
    if (Test-Path "$env:USERPROFILE\.cache\ms-playwright\webkit*") { $browsers += "WebKit" }
    
    if ($browsers.Count -gt 0) {
        Write-Host "$Info 已安装浏览器: $($browsers -join ', ')"
    } else {
        Write-Host "$Warning 未检测到浏览器，请运行: npx playwright install"
    }
} else {
    Write-Host "$XMark Playwright未安装"
    Write-Host "$Info 请运行: cd web && npm install"
}

# 5. 检查测试文件
Write-Host "`n📋 测试文件" -ForegroundColor Yellow
$testFiles = @(
    "web\tests\e2e\auth.spec.ts",
    "web\tests\e2e\portal.spec.ts",
    "web\tests\e2e\api.spec.ts",
    "web\tests\e2e\user-journey.spec.ts"
)

$testCount = 0
foreach ($file in $testFiles) {
    if (Test-Path $file) {
        $testCount++
    }
}
Write-Host "$CheckMark 测试文件: $testCount/4 已创建"

# 6. 检查配置文件
Write-Host "`n📋 配置文件" -ForegroundColor Yellow
$configFiles = @(
    "web\playwright.config.ts",
    "web\tests\fixtures\auth.ts",
    "E2E_TEST_QUICKSTART.md"
)

$configCount = 0
foreach ($file in $configFiles) {
    if (Test-Path $file) {
        $configCount++
    }
}
Write-Host "$CheckMark 配置文件: $configCount/3 已创建"

# 7. 检查服务
Write-Host "`n📋 运行中的服务" -ForegroundColor Yellow

# 检查前端
$frontendCheck = $false
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -TimeoutSec 2 -ErrorAction SilentlyContinue
    if ($response.StatusCode -eq 200) {
        Write-Host "$CheckMark 前端服务运行中 (http://localhost:3000)"
        $frontendCheck = $true
    }
} catch {
    Write-Host "$Warning 前端服务未运行"
}

# 检查后端
$backendCheck = $false
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8000/health" -TimeoutSec 2 -ErrorAction SilentlyContinue
    if ($response.StatusCode -eq 200) {
        Write-Host "$CheckMark 后端服务运行中 (http://localhost:8000)"
        $backendCheck = $true
    }
} catch {
    Write-Host "$Warning 后端服务未运行"
}

# 检查数据库
$dbCheck = $false
try {
    $containers = docker ps | Select-String "postgres" | Measure-Object | Select-Object -ExpandProperty Count
    if ($containers -gt 0) {
        Write-Host "$CheckMark 数据库运行中 (Docker)"
        $dbCheck = $true
    }
} catch {
    Write-Host "$Warning 数据库未运行"
}

# 8. 总结
Write-Host "`n╔════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  📊 健康检查总结                                  ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════╝`n" -ForegroundColor Cyan

$healthyCount = 0
if (Get-Command npm -ErrorAction SilentlyContinue) { $healthyCount++ }
if (Get-Command python -ErrorAction SilentlyContinue) { $healthyCount++ }
if (Test-Path "web\node_modules\@playwright") { $healthyCount++ }
if ($testCount -eq 4) { $healthyCount++ }
if ($configCount -eq 3) { $healthyCount++ }

Write-Host "基础环境: $healthyCount/5 ✅" -ForegroundColor Green
Write-Host "运行中的服务: $(($frontendCheck + $backendCheck + $dbCheck))/3" -ForegroundColor Yellow

# 9. 建议
Write-Host "`n💡 后续步骤:" -ForegroundColor Cyan

if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Host "1. 安装 Node.js: https://nodejs.org/"
}

if (-not (Test-Path "web\node_modules\@playwright")) {
    Write-Host "1. 安装依赖: cd web && npm install"
}

if (-not $frontendCheck -or -not $backendCheck -or -not $dbCheck) {
    Write-Host "$(if ($frontendCheck -and $backendCheck -and $dbCheck) { '1.' } else { '2.' }) 启动服务: .\start.ps1"
}

Write-Host "$(if ($frontendCheck -and $backendCheck -and $dbCheck) { '2.' } else { '3.' }) 运行测试: .\run-e2e-tests.ps1"
Write-Host "$(if ($frontendCheck -and $backendCheck -and $dbCheck) { '3.' } else { '4.' }) 查看报告: cd web && npx playwright show-report"

Write-Host "`n"
