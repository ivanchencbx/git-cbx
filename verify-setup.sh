#!/bin/bash
# E2E测试文件结构验证清单

echo "🔍 验证E2E测试文件结构..."
echo ""

# 检查主配置文件
echo "📋 检查配置文件:"
files=(
  "web/playwright.config.ts"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "  ✅ $file"
  else
    echo "  ❌ $file (缺失)"
  fi
done

echo ""
echo "📋 检查测试套件文件:"
e2e_files=(
  "web/tests/e2e/auth.spec.ts"
  "web/tests/e2e/portal.spec.ts"
  "web/tests/e2e/api.spec.ts"
  "web/tests/e2e/user-journey.spec.ts"
)

for file in "${e2e_files[@]}"; do
  if [ -f "$file" ]; then
    echo "  ✅ $file"
  else
    echo "  ❌ $file (缺失)"
  fi
done

echo ""
echo "📋 检查Fixtures文件:"
fixtures=(
  "web/tests/fixtures/auth.ts"
)

for file in "${fixtures[@]}"; do
  if [ -f "$file" ]; then
    echo "  ✅ $file"
  else
    echo "  ❌ $file (缺失)"
  fi
done

echo ""
echo "📋 检查文档文件:"
docs=(
  "web/tests/README.md"
  "E2E_TEST_QUICKSTART.md"
  "IMPLEMENTATION_SUMMARY.md"
)

for file in "${docs[@]}"; do
  if [ -f "$file" ]; then
    echo "  ✅ $file"
  else
    echo "  ❌ $file (缺失)"
  fi
done

echo ""
echo "📋 检查脚本文件:"
scripts=(
  "run-e2e-tests.ps1"
)

for file in "${scripts[@]}"; do
  if [ -f "$file" ]; then
    echo "  ✅ $file"
  else
    echo "  ❌ $file (缺失)"
  fi
done

echo ""
echo "📋 检查package.json配置:"
if grep -q "test:e2e" web/package.json; then
  echo "  ✅ npm scripts已添加"
else
  echo "  ❌ npm scripts缺失"
fi

if grep -q "@playwright/test" web/package.json; then
  echo "  ✅ @playwright/test依赖已添加"
else
  echo "  ❌ @playwright/test依赖缺失"
fi

echo ""
echo "✅ 验证完成！"
echo ""
echo "📊 文件统计:"
echo "  - 配置文件: 1"
echo "  - E2E测试套件: 4"
echo "  - Fixtures: 1"
echo "  - 文档: 3"
echo "  - 脚本: 1"
echo "  - 总计: 10"
echo ""
echo "🚀 下一步: 运行 .\\run-e2e-tests.ps1 或 npm run test:e2e"
