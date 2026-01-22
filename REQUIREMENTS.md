# Requirements Specification - cbx.life (慈贝瑆.生活)

**Document Version**: 1.0  
**Last Updated**: 2026-01-22  
**Language**: English (Primary) | Chinese (Translation)

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [System Requirements](#system-requirements)
3. [Feature Requirements](#feature-requirements)
4. [Technical Requirements](#technical-requirements)
5. [Quality Requirements](#quality-requirements)
6. [Deployment Requirements](#deployment-requirements)

---

## Project Overview

### 1.1 Vision / 愿景

Build a unified 2C platform "cbx.life" that brings AI convenience to the working class through PC, Mobile Web, and Native Apps.

建立统一的2C平台"cbx.life"，通过PC、移动网页和原生应用为上班族提供AI便利。

### 1.2 Platform Goals / 平台目标

- **Accessibility**: Available across PC, Mobile Web (PWA), and Native Apps (iOS/Android)
- 可访问性：可在PC、移动网页(PWA)和原生应用(iOS/Android)上访问

- **User Experience**: Minimalist, universally approachable, compassionate design
- 用户体验：极简主义、普遍可用、富有同情心的设计

- **AI Integration**: Leverage AI to simplify working-class daily tasks
- AI集成：利用AI简化上班族的日常任务

### 1.3 Branding / 品牌

**Logo**: cbx.life  
**Primary Color (Compassion Purple)**: `#7A65B4` (Muted Violet)  
**Secondary Color (Warm Gray)**: `#86817E`  
**Typography**: Clean, rounded sans-serif (e.g., Inter or Outfit)  

---

## System Requirements

### 2.1 Build System / 构建系统

- **Monorepo**: Bazel
- 构建工具：Bazel单体仓库

### 2.2 Backend / 后端

- **Framework**: Python (FastAPI)
- 框架：Python (FastAPI)

- **Testing**: pytest
- 测试：pytest

### 2.3 Frontend / 前端

- **Framework**: Next.js (React 18)
- 框架：Next.js (React 18)

- **Language**: TypeScript
- 语言：TypeScript

- **Testing**: jest, Playwright
- 测试：jest、Playwright

### 2.4 Database / 数据库

- **Primary**: SQLite (development), PostgreSQL (production)
- 主数据库：SQLite(开发)、PostgreSQL(生产)

### 2.5 Mobile / 移动端

- **PWA**: Progressive Web App support
- PWA：渐进式网页应用支持

- **Native Wrapping**: Capacitor/Expo for iOS/Android (if needed)
- 原生封装：Capacitor/Expo用于iOS/Android(如需要)

---

## Feature Requirements

### 3.1 Core Modules / 核心模块

#### 3.1.1 Auth Module / 认证模块
- Unified login with Email, Phone, Social Login (Google, WeChat - to be confirmed)
- 统一登录，支持邮箱、手机、社交登录(Google、微信-待确认)
- JWT-based authentication
- 基于JWT的身份验证
- User profile management
- 用户档案管理

#### 3.1.2 Portal / 门户
- Dashboard with module overview
- 仪表板，显示模块概览
- Navigation to all modules
- 导航到所有模块

#### 3.1.3 SurveyStar (问卷瑆) / 问卷模块
- Create, view, edit, delete surveys
- 创建、查看、编辑、删除问卷
- Multiple question types: text, multiple choice, checkbox, rating
- 多种问题类型：文本、单选、多选、评分
- Response collection and analysis
- 响应收集和分析

#### 3.1.4 Accounting (代账王) / 记账模块
- Expense tracking with categories
- 按类别跟踪支出
- Income tracking
- 收入跟踪
- Monthly summaries and reports
- 月度总结和报告
- Tax calculation support (future)
- 税务计算支持(未来)
- Utility bill tracking (future)
- 公用事业账单跟踪(未来)

#### 3.1.5 CareerDev (工作珄) / 职业发展模块
- Job tracking and application management
- 职位跟踪和申请管理
- Career profile with skills, experience, education
- 职业档案，包括技能、经验、教育
- AI-powered job search and recommendations (future)
- AI驱动的职位搜索和推荐(未来)
- Interview preparation tools (future)
- 面试准备工具(未来)

#### 3.1.6 SupplyStar (补给瑆) / 供应模块
- Grocery/item list management
- 杂货/物品清单管理
- Inventory tracking with quantities
- 数量库存跟踪
- Habit tracking integration (future)
- 习惯跟踪集成(未来)
- Shopping list sharing (future)
- 购物清单分享(未来)

### 3.2 Cross-Module Requirements / 跨模块需求

- **Responsive Design**: Works seamlessly on mobile, tablet, desktop
- 响应式设计：在移动、平板、桌面上无缝工作

- **Logo & Branding**: Official cbx.life logo displayed in sidebar/header on all portal pages
- Logo 和品牌：官方 cbx.life 标志显示在所有门户页面的侧边栏/标题中

- **Navigation**: Back buttons on all module pages (Career, Accounting, Survey, Supply) to return to main Portal
- 导航：所有模块页面上都有返回按钮(职业、记账、问卷、供应)，可返回主门户

- **Offline Support**: PWA offline capabilities for critical features
- 离线支持：关键功能的PWA离线能力

- **Real-time Sync**: Data synchronization across devices (if applicable)
- 实时同步：跨设备数据同步(如适用)

---

## Technical Requirements

### 4.1 Architecture / 架构

```
Project Root (Bazel Monorepo)
├── WORKSPACE / MODULE.bazel
├── server/                          # Python Backend
│   ├── auth.py
│   ├── main.py
│   ├── models.py
│   ├── schemas.py
│   ├── database.py
│   ├── routers/
│   │   ├── auth.py
│   │   ├── portal.py
│   │   ├── survey.py
│   │   ├── accounting.py
│   │   ├── career.py
│   │   └── supply.py
│   └── requirements.txt
├── web/                             # Next.js Frontend
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── auth-context.tsx
│   │   ├── login/
│   │   ├── register/
│   │   └── portal/
│   │       ├── page.tsx
│   │       ├── profile/
│   │       ├── accounting/
│   │       ├── career/
│   │       ├── supply/
│   │       └── survey/
│   ├── lib/
│   ├── package.json
│   └── tsconfig.json
├── shared/                          # Shared Definitions
│   └── proto/                       # (Optional) Protocol Buffer definitions
└── docs/                            # Documentation
```

### 4.2 API Design / API设计

- **RESTful** API endpoints
- RESTful API端点

- **JSON** request/response format
- JSON请求/响应格式

- **JWT** Bearer token authentication
- JWT Bearer令牌认证

- **CORS** configuration for cross-origin requests
- CORS跨域请求配置

### 4.3 Database Schema / 数据库架构

- **Users**: Authentication and profile data
- 用户：认证和档案数据

- **Surveys**: Survey definitions, questions, responses
- 问卷：问卷定义、问题、响应

- **Expenses**: Transaction records with categories
- 支出：带类别的交易记录

- **JobApplications**: Job tracking data
- 职位申请：职位跟踪数据

- **CareerProfiles**: User career information
- 职业档案：用户职业信息

- **SupplyItems**: Inventory items
- 供应项目：库存物品

### 4.4 Performance / 性能

- **Response Time**: API endpoints should respond in < 500ms
- 响应时间：API端点应在500ms内响应

- **Database Queries**: Optimized with proper indexing
- 数据库查询：通过适当的索引优化

- **Frontend Bundle Size**: Target < 500KB for initial load
- 前端包大小：初始加载目标<500KB

---

## Quality Requirements

### 5.1 Testing / 测试

#### Backend Testing / 后端测试
- **Unit Tests**: pytest with > 80% code coverage
- 单元测试：pytest覆盖率>80%

- **Integration Tests**: API endpoint tests
- 集成测试：API端点测试

- **Database Tests**: Schema validation, migration tests
- 数据库测试：架构验证、迁移测试

#### Frontend Testing / 前端测试
- **Unit Tests**: jest for components and utilities
- 单元测试：jest用于组件和工具

- **E2E Tests**: Playwright for critical user flows
- 端到端测试：Playwright用于关键用户流程

- **Visual Regression**: Optional screenshot comparison
- 视觉回归：可选的屏幕截图比较

### 5.2 Code Quality / 代码质量

- **Python**: PEP 8 compliance, type hints
- Python：PEP 8遵循、类型提示

- **TypeScript**: Strict mode enabled, ESLint configured
- TypeScript：严格模式启用、ESLint配置

- **Documentation**: Docstrings for Python, JSDoc for TypeScript
- 文档：Python的文档字符串、TypeScript的JSDoc

### 5.3 Security / 安全

- **Authentication**: Secure password hashing (argon2)
- 认证：安全的密码哈希(argon2)

- **Authorization**: Role-based access control (RBAC) - future enhancement
- 授权：基于角色的访问控制(RBAC)-未来增强

- **Input Validation**: Server-side validation for all inputs
- 输入验证：所有输入的服务器端验证

- **HTTPS**: Enforce SSL/TLS in production
- HTTPS：在生产中强制使用SSL/TLS

- **CORS**: Restrict to known domains
- CORS：限制到已知域名

### 5.4 Accessibility / 可访问性

- **WCAG 2.1 Level AA** compliance for web interface
- WCAG 2.1 Level AA网页界面合规性

- **Keyboard Navigation**: Full keyboard support
- 键盘导航：完整的键盘支持

- **Screen Reader**: Semantic HTML and ARIA labels
- 屏幕阅读器：语义HTML和ARIA标签

---

## Deployment Requirements

### 6.1 Development Environment / 开发环境

- **Operating System**: Windows, macOS, Linux
- 操作系统：Windows、macOS、Linux

- **Python Version**: 3.10+
- Python版本：3.10+

- **Node.js Version**: 18+
- Node.js版本：18+

- **Docker**: Optional for containerized development
- Docker：可选的容器化开发

### 6.2 Production Environment / 生产环境

- **Server**: Cloud platform (AWS, GCP, Azure - to be determined)
- 服务器：云平台(AWS、GCP、Azure-待定)

- **Database**: PostgreSQL 12+
- 数据库：PostgreSQL 12+

- **CDN**: Static asset delivery (CloudFront, Cloudflare - to be determined)
- CDN：静态资产交付(CloudFront、Cloudflare-待定)

- **Monitoring**: Error tracking, performance monitoring
- 监控：错误跟踪、性能监控

### 6.3 CI/CD Pipeline / CI/CD流水线

- **Version Control**: Git with GitHub/GitLab
- 版本控制：Git与GitHub/GitLab

- **Automated Tests**: Run on pull requests
- 自动测试：在拉取请求时运行

- **Build**: Bazel build targets
- 构建：Bazel构建目标

- **Deployment**: Automated deployment to staging/production
- 部署：自动部署到测试/生产环境

---

## Success Criteria / 成功标准

- ✅ All core modules implemented and functional
- ✅ 所有核心模块已实现且可正常工作

- ✅ API endpoints fully tested and documented
- ✅ API端点经过充分测试和文档化

- ✅ Frontend responsive across all device sizes
- ✅ 前端在所有设备大小上都响应灵敏

- ✅ Database schema optimized and indexed
- ✅ 数据库架构已优化和索引

- ✅ Test coverage > 80% for critical paths
- ✅ 关键路径的测试覆盖率>80%

- ✅ E2E tests pass for all critical user flows
- ✅ 所有关键用户流程的E2E测试通过

- ✅ Performance metrics meet targets
- ✅ 性能指标达到目标

---

## Future Enhancements / 未来增强功能

1. **AI Features**: Job recommendations, expense categorization automation
- AI功能：职位推荐、支出分类自动化

2. **Mobile Apps**: Native iOS/Android apps with offline sync
- 移动应用：具有离线同步的原生iOS/Android应用

3. **Social Features**: Survey sharing, expense splitting, budget collaboration
- 社交功能：问卷分享、支出分割、预算协作

4. **Advanced Analytics**: Spending patterns, career insights, habit tracking
- 高级分析：支出模式、职业见解、习惯跟踪

5. **Third-party Integrations**: Bank APIs, job boards, e-commerce
- 第三方集成：银行API、职位板、电商

---

**Document Owner**: Project Manager  
**Review Schedule**: Quarterly  
**Next Review Date**: 2026-04-22
