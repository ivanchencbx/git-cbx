# CBX E2E 测试快速指南

## 🎯 当前状态: ✅ 所有测试通过 (28/28)

## 🚀 快速开始

### 1. 启动服务
```bash
# 终端 1: 启动后端
cd c:\Users\ThinkPad\git-cbx
python -m uvicorn server.main:app --reload --host 0.0.0.0 --port 8000

# 终端 2: 启动前端
cd c:\Users\ThinkPad\git-cbx\web
npm run dev
```

### 2. 运行测试
```bash
# 所有浏览器
npm run test:e2e

# 特定浏览器
npm run test:e2e -- --project=chromium    # Chromium
npm run test:e2e -- --project=firefox     # Firefox
npm run test:e2e -- --project=webkit      # WebKit

# 单线程运行 (更稳定)
npm run test:e2e -- --workers=1

# 交互式 UI
npm run test:e2e:ui

# 调试模式
npm run test:e2e:debug
```

### 3. 查看报告
```bash
npx playwright show-report
```

## 📊 测试统计

| 测试套件 | 测试数 | 状态 |
|---------|--------|------|
| API 测试 | 6 | ✅ 通过 |
| 认证测试 | 5 | ✅ 通过 |
| Portal 测试 | 11 | ✅ 通过 |
| 用户旅程 | 6 | ✅ 通过 |
| **总计** | **28** | **✅ 全通过** |

## 🧪 测试覆盖范围

### API 端点
- ✅ `/health` - 健康检查
- ✅ `/auth/register` - 用户注册
- ✅ `/auth/login` - 用户登录
- ✅ `/auth/me` - 当前用户信息 (认证)

### 用户流程
- ✅ 注册 → 登录 → 令牌存储
- ✅ Portal 访问 → 导航 → 模块访问
- ✅ 会话持久化 → 刷新 → 会话保留
- ✅ 登出 → 令牌清除 → 重定向

### 功能验证
- ✅ 表单填充和提交
- ✅ 错误消息显示
- ✅ 重定向逻辑
- ✅ localStorage 访问
- ✅ 多浏览器兼容性

## 🔧 最近修复

### 按钮选择器 (已修复 ✓)
```javascript
// 注册按钮
page.locator('button:has-text("Create Account")')

// 登录按钮  
page.locator('button:has-text("Log In")')
```

### localStorage 访问 (已修复 ✓)
```javascript
// 先导航到有效页面
await page.goto('/');
// 再访问 localStorage
const token = await page.evaluate(() => localStorage.getItem('cbx_token'));
```

### 导航稳定性 (已修复 ✓)
```javascript
// 直接 URL 导航 (更可靠)
await page.goto('/portal/accounting');

// 如果需要点击链接
await link.click({ force: true });
await page.waitForTimeout(1000);
```

## 📁 文件结构

```
web/
├── tests/
│   ├── e2e/
│   │   ├── api.spec.ts           ← API 集成测试
│   │   ├── auth.spec.ts          ← 认证流程测试
│   │   ├── portal.spec.ts        ← Portal 导航测试
│   │   └── user-journey.spec.ts  ← 完整用户流程
│   └── fixtures/
│       └── auth.ts               ← 测试 fixtures
├── playwright.config.ts          ← Playwright 配置
└── package.json                  ← 依赖和脚本
```

## 📋 package.json 脚本

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:debug": "playwright test --debug"
  }
}
```

## 🐛 常见问题

### Q: 测试超时？
A: 
1. 检查后端 (8000) 和前端 (3000) 是否运行
2. 增加超时: `--timeout=60000`
3. 单线程运行: `--workers=1`

### Q: localStorage 错误？
A: 确保在访问前导航到有效的页面

### Q: 选择器找不到元素？
A: 检查:
1. 页面是否加载完成
2. 选择器是否与实际 HTML 匹配
3. 元素是否可见

### Q: 跨浏览器失败？
A: 某些浏览器可能需要额外的库:
```bash
npx playwright install --with-deps
```

## 💡 有用的命令

```bash
# 查看所有测试
npm run test:e2e -- --list

# 运行特定测试
npm run test:e2e -- --grep "should login"

# 生成视频记录
npm run test:e2e -- --video=on

# 显示跟踪
npm run test:e2e -- --trace=on

# 并行运行 (4 workers)
npm run test:e2e -- --workers=4
```

## 🔗 相关文档

- [Playwright 官方文档](https://playwright.dev)
- [测试报告](./E2E_TEST_REPORT.md)
- [Survey 404 修复记录](./SURVEY_FIX_NOTES.md) ✨ **新增**
- [项目 README](./README.md)

---

**最后更新**: 现在
**维护者**: CBX Team
**状态**: 生产就绪 ✅
