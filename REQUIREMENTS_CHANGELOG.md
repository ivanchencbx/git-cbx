# Requirements Change Log / 需求变更日志

**Document Purpose**: Track all requirement changes, additions, and clarifications  
**文档目的**：跟踪所有需求的变更、增加和澄清

**Maintained By**: Product Manager / Technical Lead  
**维护者**：产品经理/技术主管

---

## Format / 格式

Each entry should include:
- Date (YYYY-MM-DD)
- Module Name
- Change Type (New Feature / Bug Fix / Enhancement / Clarification / Removal)
- Description (English primary, Chinese translation)
- Impact Level (Critical / High / Medium / Low)
- Status (Pending / Approved / Implemented / Rejected)

---

## Change Log / 变更日志

### 2026-01-22

#### Entry: Career Module - Save Application Fix
**Date**: 2026-01-22  
**Module**: CareerDev (工作珄) / Career Module  
**Change Type**: Bug Fix  
**Changes / 变更**:

**English**:
- Issue: POST /career/applications endpoint was returning 500 Internal Server Error
- Root Causes Identified:
  1. Schema field name mismatch (application_date vs applied_date)
  2. Missing database default values for updated_at column
  3. Missing user existence validation
  4. Authentication context not validating tokens
  5. Career pages missing auth checks
  6. Pydantic v2 configuration issues
- Fixes Applied:
  1. Updated JobApplication schema to use correct field name (applied_date)
  2. Added server_default=func.now() to all updated_at columns
  3. Added user validation in create_application endpoint
  4. Enhanced AuthContext to validate tokens with backend
  5. Added authentication checks to career module pages
  6. Migrated to Pydantic v2 ConfigDict format

**中文**:
- 问题：POST /career/applications 端点返回500内部服务器错误
- 根本原因已确定：
  1. Schema字段名不匹配(application_date vs applied_date)
  2. updated_at列缺少数据库默认值
  3. 缺少用户存在性验证
  4. 认证上下文未验证token
  5. Career页面缺少认证检查
  6. Pydantic v2配置问题
- 应用的修复：
  1. 更新JobApplication schema以使用正确的字段名(applied_date)
  2. 为所有updated_at列添加server_default=func.now()
  3. 在create_application端点添加用户验证
  4. 增强AuthContext以使用后端验证token
  5. 为职业模块页面添加认证检查
  6. 迁移到Pydantic v2 ConfigDict格式

**Impact Level**: High  
**Status**: ✅ Implemented  

---

### 2026-01-22

#### Entry: Database Schema Initialization
**Date**: 2026-01-22  
**Module**: Core Infrastructure  
**Change Type**: Enhancement  
**Changes / 变更**:

**English**:
- Action: Reset database (sql_app.db) to force table recreation with correct schema
- Reason: Existing tables were missing default values for timestamp columns
- Result: All new records now properly initialize with created_at and updated_at timestamps

**中文**:
- 操作：重置数据库(sql_app.db)以强制使用正确架构重新创建表
- 原因：现有表缺少时间戳列的默认值
- 结果：所有新记录现在都正确地用created_at和updated_at时间戳初始化

**Impact Level**: Critical  
**Status**: ✅ Implemented  

---

### 2026-01-22

#### Entry: UI/UX Enhancement - Logo and Navigation
**Date**: 2026-01-22  
**Module**: Portal / Portal Module  
**Change Type**: Enhancement  
**Changes / 变更**:

**English**:
- Feature: Added official cbx.life logo to Portal sidebar for branding and visual identity
- Location: Logo displayed in sidebar header alongside "cbx.life" text
- Implementation: Logo image (cbx_life_logo_v3_1768637161608.png) copied to /web/public/logo.png
- Scale: 40x40 pixels with rounded corners for optimal sidebar display
- Pages Updated:
  - Portal main dashboard (portal/page.tsx) - Logo in sidebar
  - All module main pages now have back navigation:
    * Career module (portal/career/page.tsx)
    * Accounting module (portal/accounting/page.tsx)
    * Supply module (portal/supply/page.tsx)
    * Survey module (portal/survey/page.tsx)
- Navigation: ArrowLeft icon button links back to /portal from all module pages
- UX Improvement: Consistent navigation pattern matching existing profile page design

**中文**:
- 功能：将官方cbx.life标志添加到Portal侧边栏以进行品牌和视觉标识
- 位置：标志显示在侧边栏标题旁边的"cbx.life"文本中
- 实现：Logo图像(cbx_life_logo_v3_1768637161608.png)复制到/web/public/logo.png
- 尺寸：40x40像素，圆角以获得最佳侧边栏显示效果
- 更新的页面：
  - Portal主仪表板(portal/page.tsx) - 侧边栏中的Logo
  - 所有模块主页面现在都有返回导航：
    * 职业模块(portal/career/page.tsx)
    * 记账模块(portal/accounting/page.tsx)
    * 供应模块(portal/supply/page.tsx)
    * 问卷模块(portal/survey/page.tsx)
- 导航：ArrowLeft图标按钮从所有模块页面链接回/portal
- UX改进：与现有档案页面设计相匹配的一致导航模式

**Impact Level**: Medium  
**Status**: ✅ Implemented  

---

### 2026-01-22

#### Entry: Career Module - Full E2E Testing
**Date**: 2026-01-22  
**Module**: CareerDev (工作珄)  
**Change Type**: Verification  
**Changes / 变更**:

**English**:
- Comprehensive E2E test suite created and executed
- Test Results: 6/6 tests passed
  1. User registration ✅
  2. User login ✅
  3. Authentication verification (GET /auth/me) ✅
  4. Create first job application ✅
  5. Create second job application ✅
  6. Retrieve all applications ✅
- All timestamps correctly populated (applied_date, updated_at)
- Response format validated against schema

**中文**:
- 创建并执行了全面的E2E测试套件
- 测试结果：6/6测试通过
  1. 用户注册 ✅
  2. 用户登录 ✅
  3. 身份验证(GET /auth/me) ✅
  4. 创建第一个职位申请 ✅
  5. 创建第二个职位申请 ✅
  6. 检索所有应用 ✅
- 所有时间戳都正确填充(applied_date、updated_at)
- 响应格式根据架构进行了验证

**Impact Level**: High  
**Status**: ✅ Completed  

---

### 2026-01-22

#### Entry: Survey Module - Full Flow Fix
**Date**: 2026-01-22  
**Module**: SurveyStar（问卷瑆）  
**Change Type**: Bug Fix / Enhancement  
**Changes / 变更**:

**English**:
- Completed end-to-end survey flow (create → submit → view responses)
- Fixed submission format and validation issues
- Verified portal navigation consistency and branding
- Documented fixes and improvements in SURVEY_* series

**中文**:
- 完成问卷完整闭环（创建→提交→查看响应）
- 修复提交格式与校验问题
- 验证门户返回导航与品牌一致性
- 修复与改进文档汇总于 SURVEY_* 系列

**References / 参考**:
- SURVEY_COMPLETE_FIX.md、SURVEY_SUBMIT_FIX.md、SURVEY_VIEW_LIVE_SOLUTION.md、TEST_IMPROVEMENT_SUMMARY.md

**Impact Level**: High  
**Status**: ✅ Implemented  

---

## Pending Requirements / 待处理需求

None at this time.  
目前没有。

---

## Future Enhancement Requests / 未来增强请求

### In Backlog / 在积压中

1. **CareerDev Module Enhancements**
   - Job search integration
   - AI job recommendations
   - Resume/CV generation
   - 职业发展模块增强
   - 职位搜索集成
   - AI职位推荐
   - 简历/CV生成

2. **Accounting Module Enhancements**
   - Receipt OCR
   - Tax calculation
   - Auto-categorization via AI
   - 记账模块增强
   - 收据OCR
   - 税收计算
   - 通过AI的自动分类

3. **Cross-Module Features**
   - Dark mode
   - Multi-language support
   - Real-time synchronization
   - Offline support
   - 跨模块功能
   - 深色模式
   - 多语言支持
   - 实时同步
   - 离线支持

---

## Requirement Status Summary / 需求状态摘要

| Module | Total Features | ✅ Completed | 🔄 In Progress | 🔲 Planned | 🔲 Future |
|--------|---|---|---|---|---|
| Auth | 14 | 10 | 0 | 2 | 2 |
| Portal | 10 | 7 | 0 | 2 | 1 |
| SurveyStar | 15 | 10 | 0 | 3 | 2 |
| Accounting | 14 | 7 | 0 | 4 | 3 |
| CareerDev | 15 | 9 | 0 | 4 | 2 |
| SupplyStar | 13 | 0 | 5 | 5 | 3 |
| Cross-Module | 12 | 4 | 0 | 5 | 3 |
| **TOTAL** | **93** | **47** | **5** | **25** | **16** |

**Completion Rate**: 47/93 = **50.5%**  
**完成率**: 47/93 = **50.5%**

---

## How to Add New Requirements / 如何添加新需求

When a new requirement is identified:

1. Add an entry to this file under the appropriate date
2. Include all sections: Description (English + Chinese), Impact Level, Status
3. Update MODULE_REQUIREMENTS.md with the feature in the appropriate table
4. Update the status summary table below
5. Notify relevant team members of the change

当发现新需求时：

1. 在此文件中的相应日期下添加条目
2. 包括所有部分：描述(英文+中文)、影响级别、状态
3. 在MODULE_REQUIREMENTS.md中用相应表格更新功能
4. 更新下面的状态摘要表
5. 通知相关团队成员的变更

---

**Last Updated**: 2026-01-22  
**Next Review**: 2026-02-22  
**Maintainer**: Technical Lead

---

### 2026-01-24

#### Entry: Documentation - Chinese Requirements Architecture & Supply Acceptance Cases
**Date**: 2026-01-24  
**Module**: Documentation / SupplyStar  
**Change Type**: Documentation Update  
**Changes / 变更**:

**English**:
- Added Chinese requirements architecture section and links in REQUIREMENTS_README.md
- Linked Chinese docs in REQUIREMENTS_INDEX.md for discoverability
- Created six Chinese requirements docs under requirements/ (0–5)
- Supplemented SupplyStar doc with concrete acceptance cases (CRUD, quantity, edit/delete, validation, navigation)

**中文**:
- 在 REQUIREMENTS_README.md 增加“中文需求文档架构”入口
- 在 REQUIREMENTS_INDEX.md 添加中文文档链接，便于导航
- 在 requirements/ 目录新增六个中文需求文档（0–5）
- 在补给瑆文档补充具体验收用例（CRUD、数量维护、编辑/删除、校验、导航一致性）

**Impact Level**: Medium  
**Status**: ✅ Implemented
