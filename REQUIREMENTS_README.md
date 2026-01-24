# Requirements Documentation / 需求文档

**Overview / 概述**

This directory contains all requirement specifications for the cbx.life platform.  
本目录包含cbx.life平台的所有需求规范。

---

## 📋 Key Documents / 关键文档

### 1. **REQUIREMENTS.md** - Master Specification / 主规范文档
- **Purpose / 目的**: Complete system and feature requirements
- **语言 / Language**: English (Primary) | Chinese (Translation)
- **Content / 内容**:
  - Project overview and vision
  - System architecture requirements
  - All 6 core module requirements
  - Technical specifications
  - Quality and security requirements
  - Deployment requirements
  - Success criteria
  - Future enhancements

**Start here for**: New team members, stakeholders, project planning  
**从这里开始了解**: 新团队成员、利益相关者、项目规划

---

### 2. **MODULE_REQUIREMENTS.md** - Detailed Feature Matrix / 详细功能矩阵
- **Purpose / 目的**: Track feature status by module
- **语言 / Language**: English (Primary) | Chinese (Translation)
- **Content / 内容**:
  - Status for each module (Auth, Portal, SurveyStar, Accounting, CareerDev, SupplyStar)
  - Feature-by-feature implementation status
  - Tables for quick reference
  - Latest updates log

**Start here for**: Developers, QA, progress tracking  
**从这里开始了解**: 开发人员、QA、进度跟踪

---

### 3. **REQUIREMENTS_CHANGELOG.md** - Change Tracking / 变更追踪
- **Purpose / 目的**: Document all requirement changes and updates
- **语言 / Language**: English (Primary) | Chinese (Translation)
- **Content / 内容**:
  - Timestamped change entries
  - Root causes and fixes applied
  - Impact assessments
  - Requirement status summary
  - Instructions for adding new requirements

**Start here for**: Change management, issue tracking, historical context  
**从这里开始了解**: 变更管理、问题跟踪、历史背景

---

## 🇨🇳 Chinese Requirements Architecture / 中文需求文档架构

为中文读者提供结构化的需求入口（可复用）：

- [requirements/0-顶层需求描述文档.md](requirements/0-顶层需求描述文档.md) — 顶层原则与流程（跨项目复用）
- [requirements/1-总体需求文档.md](requirements/1-总体需求文档.md) — 总体范围、跨模块统一要求、完成度摘要
- [requirements/2-问卷瑆需求文档.md](requirements/2-问卷瑆需求文档.md) — SurveyStar 模块
- [requirements/3-职业珄需求文档.md](requirements/3-职业珄需求文档.md) — CareerDev 模块
- [requirements/4-补给瑆需求文档.md](requirements/4-补给瑆需求文档.md) — SupplyStar 模块
- [requirements/5-代账王需求文档.md](requirements/5-代账王需求文档.md) — Accounting 模块

> 提示：中文文档与英文主规范（REQUIREMENTS.md）保持同步，重大变更以英文主规范为准。

---

## 🎯 How to Use These Documents / 如何使用这些文档

### For Project Managers / 对于项目经理
1. Review **REQUIREMENTS.md** for overall project scope
2. Reference **MODULE_REQUIREMENTS.md** for progress tracking
3. Check **REQUIREMENTS_CHANGELOG.md** for recent changes

### For Developers / 对于开发人员
1. Use **MODULE_REQUIREMENTS.md** to see what needs to be implemented
2. Check **REQUIREMENTS_CHANGELOG.md** for context on recent fixes
3. Reference **REQUIREMENTS.md** for technical specifications

### For QA / 对于QA
1. Check **MODULE_REQUIREMENTS.md** for features to test
2. Review **REQUIREMENTS.md** for acceptance criteria
3. Track status changes in **REQUIREMENTS_CHANGELOG.md**

### For Stakeholders / 对于利益相关者
1. Read **REQUIREMENTS.md** for project overview
2. Review feature tables in **MODULE_REQUIREMENTS.md** for progress
3. Check **REQUIREMENTS_CHANGELOG.md** for updates

---

## 📊 Current Status / 当前状态

**Overall Completion**: 49.5% (45/91 features)  
**总体完成度**: 49.5% (45/91功能)

### By Module / 按模块
| Module | Status |
|--------|--------|
| Auth | 71% (10/14) |
| Portal | 63% (5/8) |
| SurveyStar | 67% (10/15) |
| Accounting | 50% (7/14) |
| CareerDev | 60% (9/15) |
| SupplyStar | 38% (5/13) |

---

## 🔄 Adding New Requirements / 添加新需求

### Step 1: Document the Requirement / 第一步：记录需求
Add entry to **REQUIREMENTS_CHANGELOG.md** with:
- Date
- Module name
- Change type
- Description (English + Chinese)
- Impact level
- Status

### Step 2: Update Feature Matrix / 第二步：更新功能矩阵
Add/update the feature in **MODULE_REQUIREMENTS.md** in the appropriate module table

### Step 3: Update Overview / 第三步：更新概览
If it's a major feature, also update **REQUIREMENTS.md** section 3 (Feature Requirements)

### Step 4: Communicate / 第四步：沟通
Notify team members through your standard communication channel

---

## 📅 Document Maintenance / 文档维护

- **Owner / 所有者**: Technical Lead / Product Manager
- **Review Schedule / 审查计划**: Quarterly (2026-04-22)
- **Update Frequency / 更新频率**: As changes occur
- **Version Control / 版本控制**: Git (track changes in commits)

---

## 🔗 Related Documents / 相关文档

Within this repository:
- `CAREER_MODULE_FIX.md` - Detailed fix documentation for Career module issue
- `implementation_plan.md` - Original architecture and planning document

---

## 📖 Document Language Policy / 文档语言政策

**English is the primary language for technical specifications.**  
**英文是技术规范的主要语言。**

- All technical details, code references, and API specifications are in English
- 所有技术细节、代码参考和API规范都是英文的

- Chinese translations provided for clarity and accessibility
- 为了清晰和易用性提供中文翻译

- When language differs, English description takes precedence
- 当语言不同时，英文描述优先

---

## 💡 Quick Reference / 快速参考

### Key Acronyms / 关键缩写
- **Auth**: Authentication / 认证
- **CRUD**: Create, Read, Update, Delete / 创建、读取、更新、删除
- **JWT**: JSON Web Token
- **API**: Application Programming Interface / 应用程序编程接口
- **PWA**: Progressive Web App / 渐进式网页应用
- **E2E**: End-to-End Testing / 端到端测试
- **QA**: Quality Assurance / 质量保证

### Status Indicators / 状态指示器
- ✅ **Completed** / 已完成
- 🔄 **In Progress** / 进行中
- 🔲 **Planned** / 计划中
- 🔲 **Future** / 未来

---

**Last Updated**: 2026-01-22  
**Next Review**: 2026-02-22  
**For questions, contact**: Technical Lead
