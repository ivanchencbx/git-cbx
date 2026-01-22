# E2E 自动化测试指南

本项目使用 **Playwright** 框架进行端到端(E2E)自动化测试。

## 测试覆盖范围

### 1. 认证测试 (`auth.spec.ts`)
- ✅ 用户注册功能
- ✅ 用户登录功能
- ✅ 无效凭证登出处理
- ✅ 注册页面链接导航
- ✅ 响应式登录表单

### 2. Portal导航测试 (`portal.spec.ts`)
- ✅ 认证用户访问Portal
- ✅ Portal各个模块导航(Accounting, Career, Supply, Survey)
- ✅ 未认证用户重定向到登录
- ✅ 各模块内的子页面导航(add/create)

### 3. API集成测试 (`api.spec.ts`)
- ✅ API健康检查
- ✅ 通过API注册用户
- ✅ 通过API登录用户
- ✅ 错误凭证处理
- ✅ 重复邮箱注册拒绝
- ✅ 受保护端点认证检查

### 4. 用户旅程测试 (`user-journey.spec.ts`)
- ✅ 完整注册和登录流程
- ✅ 所有主要模块导航
- ✅ 会话持久性(页面刷新后)
- ✅ 登出功能
- ✅ 多用户独立会话

## 前置要求

1. **Docker & Docker Compose** - 用于数据库
2. **Python 3.10+** - 后端环境
3. **Node.js 18+** - 前端环境
4. **依赖包** - 已在package.json中定义

## 快速开始

### 1. 安装依赖

```bash
# 进入web目录
cd web

# 安装npm依赖(包含Playwright)
npm install
```

### 2. 启动服务

```powershell
# 在PowerShell中，从项目根目录运行：

# 启动所有服务(数据库、后端、前端)
.\start.ps1

# 或者手动启动：

# Terminal 1: 启动数据库
docker-compose up -d

# Terminal 2: 启动后端服务
cd server
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Terminal 3: 启动前端开发服务器
cd web
npm run dev
```

### 3. 运行E2E测试

从 `web` 目录运行以下命令：

```bash
# 运行所有E2E测试
npm run test:e2e

# 使用UI模式运行测试(可视化界面)
npm run test:e2e:ui

# 调试模式(逐步执行)
npm run test:e2e:debug

# 运行特定的测试文件
npm run test:e2e -- tests/e2e/auth.spec.ts

# 运行特定的测试用例
npm run test:e2e -- --grep "should register a new user"

# 只在Chrome浏览器上运行
npm run test:e2e -- --project=chromium

# 在所有浏览器上运行
npm run test:e2e -- --project=chromium --project=firefox --project=webkit
```

## 测试配置

### playwright.config.ts

- **baseURL**: `http://localhost:3000` (前端地址)
- **后端URL**: `http://localhost:8000` (自动检测并启动)
- **浏览器**: Chromium, Firefox, WebKit
- **移动设备**: Pixel 5, iPhone 12
- **并行执行**: 默认启用
- **重试**: CI环境下重试2次
- **报告**: HTML格式(在 `playwright-report/` 目录)

## 测试架构

### Fixtures (tests/fixtures/auth.ts)

自定义Fixtures提供：

```typescript
// 获取测试用户凭证
testUser: {
  email: string;
  password: string;
  phone: string;
  fullName: string;
}

// 获取已认证的页面对象(自动完成注册和登录)
authenticatedPage: Page

// 清理测试数据的函数
cleanupUser: (email: string) => Promise<void>
```

### 使用方法

```typescript
test('example test', async ({ page, testUser, authenticatedPage }) => {
  // page: 普通页面对象
  // testUser: 自动生成的测试用户
  // authenticatedPage: 已登录的页面
});
```

## 常见问题与故障排除

### 1. 测试超时

如果测试超时，尝试：
```bash
# 增加全局超时时间
npm run test:e2e -- --timeout=60000
```

### 2. 服务未启动

确保所有服务都在运行：
```bash
# 检查前端是否运行在3000端口
lsof -i :3000

# 检查后端是否运行在8000端口
lsof -i :8000

# 检查数据库是否运行在5432端口
docker ps | grep postgres
```

### 3. 数据库连接错误

```bash
# 重启数据库
docker-compose down
docker-compose up -d
```

### 4. 清除浏览器数据

```bash
# 删除Playwright缓存
rm -r ~/.cache/ms-playwright

# 重新安装浏览器
npx playwright install
```

## 持续集成(CI)配置

### GitHub Actions示例

```yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - uses: actions/setup-python@v4
        with:
          python-version: '3.10'
      
      - name: Install dependencies
        run: |
          pip install -r server/requirements.txt
          cd web && npm install
      
      - name: Start backend
        run: cd server && uvicorn main:app --host 0.0.0.0 --port 8000 &
      
      - name: Run E2E tests
        run: cd web && npm run test:e2e
      
      - name: Upload report
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: web/playwright-report/
```

## 查看测试报告

测试完成后，会生成HTML报告：

```bash
# 打开报告
npx playwright show-report
```

## 最佳实践

1. **使用Page Objects模式** - 将UI操作封装到单独的类中
2. **等待策略** - 使用 `waitForURL()`, `waitForSelector()` 而不是 `waitForTimeout()`
3. **数据隔离** - 每个测试使用唯一的测试数据
4. **快速失败** - 在setup中验证前置条件
5. **有意义的错误消息** - 使用 `expect(value, 'custom message')`

## 扩展测试

### 添加新的测试文件

在 `tests/e2e/` 目录中创建新文件：

```typescript
import { test, expect } from '../fixtures/auth';

test.describe('New Feature', () => {
  test('should do something', async ({ page, testUser }) => {
    // 测试代码
  });
});
```

### 添加自定义Fixtures

在 `tests/fixtures/` 目录中创建新文件，然后在config中引用。

## 性能优化建议

1. 使用 `fullyParallel: true` 让测试并行执行
2. 使用 `reuseExistingServer: true` 避免重启服务
3. 使用视口缓存减少布局计算
4. 限制并发工作线程数(特别是数据库有限制时)

## 资源链接

- [Playwright官方文档](https://playwright.dev/)
- [Playwright API参考](https://playwright.dev/docs/api/class-playwright)
- [Playwright测试框架](https://playwright.dev/docs/intro)
- [最佳实践](https://playwright.dev/docs/best-practices)

## 支持与反馈

遇到问题？请检查：
1. 所有服务是否正确启动
2. 防火墙设置是否允许连接
3. 环境变量是否正确配置
4. 浏览器是否已安装 (`npx playwright install`)
