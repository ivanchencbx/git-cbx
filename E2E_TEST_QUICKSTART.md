# 🚀 E2E 自动化测试快速开始指南

## 📋 概述

这个项目包含了完整的端到端自动化测试套件，使用 **Playwright** 框架。测试覆盖：
- 用户认证(注册/登录)
- Portal导航和功能
- API集成
- 完整用户旅程

## ⚡ 5分钟快速开始

### 步骤1: 启动所有服务

```powershell
# 在项目根目录运行
.\start.ps1

# 等待输出显示：
# ✓ 后端: http://localhost:8000
# ✓ 前端: http://localhost:3000
```

### 步骤2: 打开新的PowerShell窗口，运行测试

```powershell
# 方式A: 使用我们提供的脚本(推荐)
.\run-e2e-tests.ps1

# 方式B: 使用npm命令
cd web
npm run test:e2e
```

### 步骤3: 查看结果

```powershell
# 测试完成后自动生成HTML报告
# 打开报告
cd web
npx playwright show-report
```

## 🎯 常用命令

| 命令 | 说明 |
|------|------|
| `npm run test:e2e` | 运行所有E2E测试 |
| `npm run test:e2e:ui` | UI模式(可视化运行) |
| `npm run test:e2e:debug` | 调试模式(单步执行) |
| `npx playwright show-report` | 查看测试报告 |

## 📊 测试包含内容

### ✅ 认证流程 (auth.spec.ts)
```
├── 新用户注册
├── 有效凭证登录
├── 无效凭证拒绝
├── 页面导航
└── 响应式设计
```

### ✅ Portal导航 (portal.spec.ts)
```
├── Portal访问权限检查
├── 各模块导航
│   ├── Accounting(会计)
│   ├── Career(职业)
│   ├── Supply(供应)
│   └── Survey(调查)
├── 子页面访问
└── 未认证重定向
```

### ✅ API集成 (api.spec.ts)
```
├── 服务健康检查
├── API注册/登录
├── 错误处理
├── 重复数据检查
└── 认证验证
```

### ✅ 用户旅程 (user-journey.spec.ts)
```
├── 完整注册-登录流程
├── 全模块导航
├── 会话持久性
├── 登出功能
└── 多用户隔离
```

## 🔧 高级用法

### 只运行特定测试文件

```bash
npm run test:e2e -- tests/e2e/auth.spec.ts
```

### 只运行包含特定关键字的测试

```bash
npm run test:e2e -- --grep "should register"
```

### 只在特定浏览器运行

```bash
npm run test:e2e -- --project=firefox
```

### 在所有浏览器上运行(包括移动)

```bash
npm run test:e2e -- --project=chromium --project=firefox --project=webkit --project="Mobile Chrome"
```

### 使用UI运行器(推荐用于调试)

```bash
npm run test:e2e:ui
```
这会打开一个交互式UI，显示：
- 每个测试步骤
- 每个步骤的截图
- 浏览器devtools集成
- 播放/暂停/单步执行

### 调试单个测试

```bash
npm run test:e2e:debug -- tests/e2e/auth.spec.ts
```

## 📁 项目结构

```
web/
├── playwright.config.ts          # Playwright配置
├── tests/
│   ├── README.md                 # 详细测试文档
│   ├── e2e/                      # E2E测试文件
│   │   ├── auth.spec.ts         # 认证测试
│   │   ├── portal.spec.ts       # Portal测试
│   │   ├── api.spec.ts          # API测试
│   │   └── user-journey.spec.ts # 用户旅程测试
│   ├── fixtures/                 # 测试fixtures
│   │   └── auth.ts              # 认证相关fixtures
│   └── .gitignore               # 测试输出排除
└── package.json                  # npm依赖和脚本
```

## 🐛 故障排除

### 问题1: "无法连接到localhost:3000"

```powershell
# 确保前端已启动
npm run dev  # 在web目录

# 验证端口
netstat -ano | findstr :3000
```

### 问题2: "无法连接到localhost:8000"

```powershell
# 确保后端已启动
cd server
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# 验证端口
netstat -ano | findstr :8000
```

### 问题3: 数据库连接错误

```powershell
# 检查Docker容器
docker ps

# 重启数据库
docker-compose down
docker-compose up -d

# 检查连接
docker exec -it <container_id> psql -U postgres -c "SELECT 1"
```

### 问题4: 测试超时

1. 增加超时时间:
```bash
npm run test:e2e -- --timeout=60000
```

2. 使用UI模式检查实际加载时间:
```bash
npm run test:e2e:ui
```

### 问题5: 清除缓存

```powershell
# 删除node_modules和reinstall
rm -r web/node_modules
cd web && npm install

# 清除Playwright缓存
rm -r $env:USERPROFILE\.cache\ms-playwright
npx playwright install
```

## 📝 编写新的测试

### 基本模板

```typescript
import { test, expect } from '../fixtures/auth';

test.describe('Feature Name', () => {
  test('should do something', async ({ page, testUser }) => {
    await page.goto('/path');
    
    // 执行操作
    await page.click('button:has-text("Click me")');
    
    // 验证结果
    await expect(page.locator('h1')).toContainText('Success');
  });
});
```

### 使用认证fixture

```typescript
test('authenticated action', async ({ authenticatedPage, testUser }) => {
  // authenticatedPage 已自动登录
  const page = authenticatedPage;
  
  await page.goto('/portal');
  // testUser 包含 { email, password, phone, fullName }
});
```

## 🚀 CI/CD集成

### GitHub Actions示例

在 `.github/workflows/e2e-tests.yml` 中添加：

```yaml
name: E2E Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - uses: actions/setup-python@v4
        with:
          python-version: '3.10'
      - run: |
          pip install -r server/requirements.txt
          cd web && npm install
      - run: docker-compose up -d
      - run: cd server && uvicorn main:app &
      - run: cd web && npm run test:e2e
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: web/playwright-report/
```

## 📚 更多资源

- [Playwright官方文档](https://playwright.dev/)
- [详细测试指南](./tests/README.md)
- [Playwright最佳实践](https://playwright.dev/docs/best-practices)
- [选择器指南](https://playwright.dev/docs/locators)

## 💡 提示和技巧

1. **使用UI运行器进行调试** - 它显示所有步骤和截图
2. **使用`--headed`在真实浏览器中运行** - `npx playwright test --headed`
3. **生成追踪数据** - 配置中已启用 `trace: 'on-first-retry'`
4. **查看视频记录** - 在配置中添加 `video: 'retain-on-failure'`
5. **并行执行** - 默认启用，可大幅加速测试

## ❓ FAQ

**Q: 测试运行需要多长时间？**
A: 全套测试大约5-15分钟，取决于硬件和网络。

**Q: 可以在CI中运行吗？**
A: 是的，已包含CI配置示例。设置 `CI=true` 环境变量即可。

**Q: 如何添加新的测试？**
A: 在 `tests/e2e/` 目录创建新的 `.spec.ts` 文件。

**Q: 是否支持截图和视频？**
A: 支持，已在配置中启用失败时捕获。

---

需要帮助? 查看详细文档: [tests/README.md](./tests/README.md)
