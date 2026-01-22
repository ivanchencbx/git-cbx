#!/usr/bin/env pwsh
# E2E测试运行脚本

param(
    [string]$Mode = "default",
    [string]$TestFile = "",
    [string]$Browser = "chromium",
    [switch]$Debug = $false,
    [switch]$UI = $false,
    [switch]$ShowReport = $false
)

$webDir = "web"

Write-Host "🎭 Playwright E2E 测试运行器" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan

# 检查npm是否已安装
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Host "❌ npm未安装，请先安装Node.js" -ForegroundColor Red
    exit 1
}

# 检查测试依赖是否已安装
if (-not (Test-Path "$webDir/node_modules/@playwright")) {
    Write-Host "⏳ 首次运行，安装依赖中..." -ForegroundColor Yellow
    Set-Location $webDir
    npm install
    Set-Location ..
}

# 变更到web目录
Set-Location $webDir

# 根据参数构建命令
$cmd = "npm run test:e2e"
$args = @()

if ($UI) {
    Write-Host "🖥️  UI模式运行测试..." -ForegroundColor Green
    $cmd = "npm run test:e2e:ui"
}
elseif ($Debug) {
    Write-Host "🐛 调试模式运行测试..." -ForegroundColor Green
    $cmd = "npm run test:e2e:debug"
}
else {
    Write-Host "▶️  标准模式运行测试" -ForegroundColor Green
    
    if ($TestFile) {
        $args += @("--", $TestFile)
        Write-Host "📄 测试文件: $TestFile" -ForegroundColor Yellow
    }
    
    $args += @("--project=$Browser")
    Write-Host "🌐 浏览器: $Browser" -ForegroundColor Yellow
}

Write-Host ""

# 运行测试
Invoke-Expression "$cmd $($args -join ' ')"
$testResult = $LASTEXITCODE

Set-Location ..

# 显示结果
Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
if ($testResult -eq 0) {
    Write-Host "✅ 测试通过！" -ForegroundColor Green
    
    if ($ShowReport) {
        Write-Host "📊 打开测试报告..." -ForegroundColor Green
        Set-Location $webDir
        npx playwright show-report
        Set-Location ..
    }
}
else {
    Write-Host "❌ 测试失败！" -ForegroundColor Red
    Write-Host "运行以下命令查看详细报告："
    Write-Host "  cd $webDir"
    Write-Host "  npx playwright show-report" -ForegroundColor Yellow
}

exit $testResult
