# Survey "View Live" 404 错误修复记录

## 问题描述

用户进行手工测试时发现：**在 Survey 模块中创建 Survey 后，点击 "View Live" 按钮返回 404 错误**

## 原因分析

### 前端代码
在 `web/app/portal/survey/page.tsx` 中，Survey 卡片包含一个链接：
```jsx
<Link href={`/survey/${survey.id}`} className="text-primary hover:underline text-sm font-medium">
  View Live
</Link>
```

### 缺失的页面组件
- 目标 URL：`/survey/{id}`
- 对应路由：`web/app/survey/[id]/page.tsx`
- **实际状态**：❌ 页面组件不存在

### 原因
虽然后端 API 端点 `/surveys/{survey_id}` 已正确实现（在 `server/routers/survey.py` 中），但前端 Survey 查看页面从未被创建。

## 为什么原始测试没有捕获这个问题？

1. **测试覆盖不完整**
   - 原始测试只检查"导航到创建页面"
   - 没有实际创建 Survey 并验证完整流程
   - 没有点击 "View Live" 按钮

2. **缺少端到端测试**
   - 需要测试整个生命周期：创建 → 保存 → 显示在列表 → 查看详情
   - 不应该只测试导航，还要测试实际功能

## 修复方案

### 1. 创建 Survey 查看页面

**文件**: `web/app/survey/[id]/page.tsx`

功能：
- 从后端 API 获取 Survey 详情：`GET /surveys/{id}`
- 支持多种题目类型：
  - 短文本 (Text)
  - 长文本 (Long Text)
  - 选择题 (Multiple Choice)
  - 评分 (Rating 1-5)
- 渲染表单供用户填答
- 提交答案到后端：`POST /surveys/{id}/responses`
- 错误处理（404 Not Found、加载失败等）
- 成功反馈（提交后显示感谢信息）

### 2. 改进 E2E 测试

**文件**: `web/tests/e2e/portal.spec.ts`

新增测试用例：`should create survey and view live`

完整的测试流程：
1. ✅ 导航到 Survey 列表
2. ✅ 点击"创建新 Survey"按钮
3. ✅ 填充 Survey 标题和描述
4. ✅ 添加至少一个问题
5. ✅ 保存 Survey
6. ✅ 验证返回 Survey 列表
7. ✅ 在列表中找到新创建的 Survey（通过时间戳）
8. ✅ **点击 "View Live" 按钮**
9. ✅ **验证页面成功加载（URL 包含 `/survey/`）**
10. ✅ **验证 Survey 标题显示正确**

## 修复结果

### 测试数更新
- **原始测试数**：27 个
- **新增测试**：1 个（Survey 完整流程）
- **总测试数**：28 个
- **通过率**：100% ✅

### 文件变更
```
新建：
- web/app/survey/[id]/page.tsx (200+ 行)

修改：
- web/tests/e2e/portal.spec.ts (添加新测试用例)
```

### Chromium 浏览器测试结果
```
Running 28 tests using 1 worker
  28 passed (1.4m)
```

## 测试验证命令

```bash
# 运行所有 Survey 相关测试
npm run test:e2e -- --grep "survey"

# 运行完整 Survey 流程测试
npm run test:e2e -- --grep "should create survey and view live"

# 运行所有 E2E 测试
npm run test:e2e -- --workers=1
```

## 后续建议

1. **添加更多 Survey 测试场景**
   - 测试不同题目类型的填答
   - 测试必填项验证
   - 测试 Survey 编辑和删除

2. **改进后端 API**
   - 添加 Survey 编辑端点 (PUT /surveys/{id})
   - 添加 Survey 删除端点 (DELETE /surveys/{id})
   - 添加获取响应统计数据的端点

3. **增强前端 UX**
   - 在 Survey 详情页添加"返回编辑"按钮
   - 显示 Survey 创建者和创建时间
   - 添加分享 Survey 链接功能
   - 显示已收集的响应数统计

4. **扩展测试覆盖**
   - 创建集中测试文件 `survey.spec.ts`
   - 测试 Survey 编辑流程
   - 测试 Survey 删除流程
   - 测试响应数据的验证

## 总结

这次修复展示了端到端测试的重要性——不仅要测试单个功能的访问，还要测试完整的用户工作流。原始测试套件专注于导航测试，但没有深入测试每个模块的核心功能（创建、查看、提交）。

通过添加完整的 Survey 创建到查看流程的测试，我们确保了用户可以成功完成真实的业务流程，而不仅仅是访问页面。

---

**修复日期**: 2024年1月22日  
**修复者**: GitHub Copilot  
**状态**: ✅ 完成  
**关联文件**: 
- [E2E_TEST_REPORT.md](E2E_TEST_REPORT.md)
- [E2E_QUICK_GUIDE.md](E2E_QUICK_GUIDE.md)
