#!/usr/bin/env pwsh
<#
 ╔════════════════════════════════════════════════════════════════╗
 ║                                                                ║
 ║   🎉 E2E自动化测试框架 - 快速访问指南                        ║
 ║                                                                ║
 ╚════════════════════════════════════════════════════════════════╝

 本脚本可以帮你快速访问各种文档和工具

 使用方法:
   .\open-docs.ps1 [选项]

 选项:
   home      - 打开 START_HERE.md (推荐首先读)
   index     - 打开 INDEX.md (文档索引)
   quick     - 打开 E2E_TEST_QUICKSTART.md (快速开始)
   guide     - 打开 E2E_TESTING_GUIDE.md (使用指南)
   tests     - 打开 web/tests/README.md (详细文档)
   project   - 打开 PROJECT_STRUCTURE.md (项目结构)
   summary   - 打开 FINAL_SUMMARY.md (完成总结)
   
   health    - 运行环境检查 (.\e2e-health-check.ps1)
   run       - 运行E2E测试 (.\run-e2e-tests.ps1)

 示例:
   .\open-docs.ps1 home        打开首页指南
   .\open-docs.ps1 quick       打开快速开始
   .\open-docs.ps1 run         运行测试
#>

param(
    [string]$Option = "help"
)

$docs = @{
    "home"    = "START_HERE.md"
    "index"   = "INDEX.md"
    "quick"   = "E2E_TEST_QUICKSTART.md"
    "guide"   = "E2E_TESTING_GUIDE.md"
    "tests"   = "web/tests/README.md"
    "project" = "PROJECT_STRUCTURE.md"
    "summary" = "FINAL_SUMMARY.md"
}

function Open-Doc($file) {
    if (Test-Path $file) {
        code $file
        Write-Host "✅ 已打开: $file" -ForegroundColor Green
    } else {
        Write-Host "❌ 文件未找到: $file" -ForegroundColor Red
    }
}

switch ($Option) {
    "home" { Open-Doc $docs["home"] }
    "index" { Open-Doc $docs["index"] }
    "quick" { Open-Doc $docs["quick"] }
    "guide" { Open-Doc $docs["guide"] }
    "tests" { Open-Doc $docs["tests"] }
    "project" { Open-Doc $docs["project"] }
    "summary" { Open-Doc $docs["summary"] }
    
    "health" {
        Write-Host "🏥 运行环境检查..." -ForegroundColor Yellow
        & .\e2e-health-check.ps1
    }
    
    "run" {
        Write-Host "🚀 运行E2E测试..." -ForegroundColor Yellow
        & .\run-e2e-tests.ps1
    }
    
    default {
        Write-Host "`n📚 E2E自动化测试 - 快速访问`n" -ForegroundColor Cyan
        Write-Host "用法: .\open-docs.ps1 [选项]`n" -ForegroundColor Yellow
        Write-Host "文档选项:" -ForegroundColor Green
        Write-Host "  home       - 首页指南 (START_HERE.md)" -ForegroundColor White
        Write-Host "  index      - 文档索引 (INDEX.md)" -ForegroundColor White
        Write-Host "  quick      - 快速开始 (E2E_TEST_QUICKSTART.md)" -ForegroundColor White
        Write-Host "  guide      - 使用指南 (E2E_TESTING_GUIDE.md)" -ForegroundColor White
        Write-Host "  tests      - 详细文档 (web/tests/README.md)" -ForegroundColor White
        Write-Host "  project    - 项目结构 (PROJECT_STRUCTURE.md)" -ForegroundColor White
        Write-Host "  summary    - 完成总结 (FINAL_SUMMARY.md)" -ForegroundColor White
        
        Write-Host "`n工具选项:" -ForegroundColor Green
        Write-Host "  health     - 环境检查" -ForegroundColor White
        Write-Host "  run        - 运行测试" -ForegroundColor White
        
        Write-Host "`n示例:" -ForegroundColor Cyan
        Write-Host "  .\open-docs.ps1 home    打开首页" -ForegroundColor Gray
        Write-Host "  .\open-docs.ps1 quick   打开快速开始" -ForegroundColor Gray
        Write-Host "  .\open-docs.ps1 run     运行测试" -ForegroundColor Gray
        
        Write-Host "`n"
    }
}
