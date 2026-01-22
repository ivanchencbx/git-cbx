# 📖 E2E自动化测试集成说明

本项目现已集成完整的端到端(E2E)自动化测试框架 **Playwright**。

## 🎯 快速导航

| 文档 | 内容 | 用途 |
|------|------|------|
| [E2E_TEST_QUICKSTART.md](E2E_TEST_QUICKSTART.md) | 5分钟快速开始指南 | ⚡ 快速上手 |
| [web/tests/README.md](web/tests/README.md) | 详细测试文档 | 📚 深入学习 |
| [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) | 实现总结 | 📋 了解实现 |
| [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) | 项目结构和矩阵 | 🗺️ 了解架构 |
| [SETUP_COMPLETE.txt](SETUP_COMPLETE.txt) | 设置完成清单 | ✅ 验证状态 |

## ⚡ 30秒快速开始

```powershell
# 1. 启动服务 (3个窗口或后台)
.\start.ps1

# 2. 运行测试
.\run-e2e-tests.ps1

# 3. 查看报告
cd web && npx playwright show-report
```

## 📊 已创建的内容

### ✅ 4个测试套件 (23个测试用例)

```
1. 🔐 认证测试      (auth.spec.ts)      - 5个测试
   ├─ 用户注册
   ├─ 用户登录  
   ├─ 错误处理
   ├─ 页面导航
   └─ 响应式设计

2. 🚪 Portal测试    (portal.spec.ts)    - 7个测试
   ├─ Portal访问权限
   ├─ Accounting模块
   ├─ Career模块
   ├─ Supply模块
   ├─ Survey模块
   ├─ 子页面访问
   └─ 未认证重定向

3. 🔌 API测试       (api.spec.ts)       - 6个测试
   ├─ 健康检查
   ├─ 注册API
   ├─ 登录API
   ├─ 错误处理
   ├─ 重复检查
   └─ 认证验证

4. 👤 用户旅程测试  (user-journey.spec.ts) - 5个测试
   ├─ 完整注册-登录
   ├─ 全模块导航
   ├─ 会话持久性
   ├─ 登出功能
   └─ 多用户隔离
```

### ✨ 高级功能

- ✅ **Fixtures系统** - 自动化Setup/Teardown
- ✅ **多浏览器支持** - Chromium, Firefox, WebKit
- ✅ **移动设备模拟** - Pixel 5, iPhone 12
- ✅ **UI调试模式** - 可视化测试执行
- ✅ **自动报告生成** - HTML + 截图 + 视频
- ✅ **并行执行** - 提升测试速度

## 📁 新增文件结构

```
web/
├── playwright.config.ts              配置文件
├── package.json                      [已更新] 添加Playwright依赖
└── tests/
    ├── README.md                     详细文档
    ├── .gitignore                    Git排除配置
    ├── e2e/
    │   ├── auth.spec.ts              认证测试
    │   ├── portal.spec.ts            Portal测试
    │   ├── api.spec.ts               API测试
    │   └── user-journey.spec.ts      用户旅程测试
    └── fixtures/
        └── auth.ts                   认证Fixtures

根目录新增文件:
├── E2E_TEST_QUICKSTART.md            快速开始指南
├── IMPLEMENTATION_SUMMARY.md         实现总结
├── PROJECT_STRUCTURE.md              项目结构
├── SETUP_COMPLETE.txt                设置完成清单
├── run-e2e-tests.ps1                 运行脚本
├── e2e-health-check.ps1              健康检查脚本
└── verify-setup.sh                   验证脚本
```

## 🚀 常用命令

```bash
# 运行所有测试
npm run test:e2e

# UI模式(可视化)
npm run test:e2e:ui

# 调试模式(单步执行)
npm run test:e2e:debug

# 查看报告
npx playwright show-report

# 运行特定文件
npm run test:e2e -- tests/e2e/auth.spec.ts

# 运行特定测试
npm run test:e2e -- --grep "should login"
```

## 🔧 PowerShell脚本

```powershell
# 运行所有E2E测试
.\run-e2e-tests.ps1

# UI模式运行
.\run-e2e-tests.ps1 -UI

# 调试模式运行  
.\run-e2e-tests.ps1 -Debug

# 特定浏览器(Firefox)
.\run-e2e-tests.ps1 -Browser firefox

# 健康检查
.\e2e-health-check.ps1

# 验证设置
.\verify-setup.sh
```

## 📚 文档阅读顺序

1. **新手**: 从 [E2E_TEST_QUICKSTART.md](E2E_TEST_QUICKSTART.md) 开始 ⚡
2. **使用**: 参考 [web/tests/README.md](web/tests/README.md) 的命令部分 📖
3. **开发**: 查看Fixtures和Test示例代码 💻
4. **深入**: 阅读 [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) 了解架构 🏗️

## 💡 几个技巧

### 快速运行特定测试
```bash
npm run test:e2e -- --grep "register"
```

### 在真实浏览器中运行(非headless)
```bash
npx playwright test --headed
```

### 使用UI调试工具找selector
```bash
cd web
npx playwright test --ui
```

### 录制新测试
```bash
npx playwright codegen http://localhost:3000
```

## 🔍 故障排除

**服务未启动?**
```powershell
# 检查健康状态
.\e2e-health-check.ps1

# 启动所有服务
.\start.ps1
```

**测试超时?**
```bash
# 增加超时时间
npm run test:e2e -- --timeout=60000
```

**需要清除缓存?**
```powershell
# 删除依赖并重新安装
rm -r web/node_modules
cd web && npm install
```

## 🎯 与CI集成

GitHub Actions示例已在 [web/tests/README.md](web/tests/README.md) 中提供。

快速集成:
1. 复制CI配置到 `.github/workflows/e2e-tests.yml`
2. 提交到GitHub
3. PR时自动运行测试

## 📞 获取帮助

- 快速问题 → [E2E_TEST_QUICKSTART.md - FAQ](E2E_TEST_QUICKSTART.md#faq)
- 详细文档 → [web/tests/README.md](web/tests/README.md)
- 官方文档 → https://playwright.dev/

## ✅ 下一步建议

1. ✨ **尝试UI模式** - 理解测试如何执行
   ```powershell
   .\run-e2e-tests.ps1 -UI
   ```

2. 📖 **阅读文档** - 理解Fixtures和编写新测试
   ```powershell
   code web/tests/README.md
   ```

3. 🧪 **编写第一个测试** - 在 `web/tests/e2e/` 新建文件
   ```typescript
   // 复制现有测试并修改
   import { test, expect } from '../fixtures/auth';
   ```

4. 🔄 **集成到CI** - 添加GitHub Actions配置
   ```yaml
   # 参考 web/tests/README.md
   ```

---

**现在就开始测试吧！** 🚀

运行命令: `.\run-e2e-tests.ps1`
