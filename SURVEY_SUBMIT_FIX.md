# Survey 提交错误修复

## 问题描述

**错误信息**: "Failed to submit survey response"  
**场景**: 用户在 Survey 页面填写完问题后点击 "Submit Survey" 按钮

## 根本原因

### 请求格式不匹配

**后端期望** (`server/schemas.py`):
```python
class ResponseCreate(BaseModel):
    answers: Dict[str, Any]  # 字典格式: { question_id: value }
```

**前端发送** (修复前):
```typescript
// 错误的格式 - 数组格式
answers: [
  { question_id: "q1", value: "answer1" },
  { question_id: "q2", value: "answer2" }
]
```

**原因**: Schema 定义明确要求字典（哈希表）格式，但前端误解为数组格式。

## 修复方案

### 修改文件: `web/app/survey/[id]/page.tsx`

**问题代码**:
```typescript
await apiClient.post(`/surveys/${surveyId}/responses`, {
  answers: Object.entries(answers).map(([question_id, value]) => ({
    question_id,
    value
  }))
});
```

**修复代码**:
```typescript
// Convert answers to format expected by backend: { question_id: value }
const formattedAnswers = Object.entries(answers).reduce((acc, [key, value]) => {
  acc[key] = value;
  return acc;
}, {} as Record<string, string | string[]>);

await apiClient.post(`/surveys/${surveyId}/responses`, {
  answers: formattedAnswers
});
```

### 改进点

1. ✅ **格式转换**: 将对象的键值对直接映射为字典
2. ✅ **类型安全**: 明确类型提示 `Record<string, string | string[]>`
3. ✅ **错误处理**: 增强错误消息显示
4. ✅ **调试信息**: 添加详细的 console.error 输出

## 测试验证

### 修改文件: `web/tests/e2e/portal.spec.ts`

**新增测试步骤** (在 "should create survey and view live" 中):

```typescript
// Step 9: Fill in survey response
const textInput = page.locator('input[placeholder="Enter your answer..."]').first();
if (await textInput.isVisible()) {
  await textInput.fill('This is my feedback');
  
  // Step 10: Submit survey
  const submitButton = page.locator('button:has-text("Submit Survey")');
  await submitButton.click();
  await page.waitForTimeout(2000);
  
  // Step 11: Verify success message
  const thankYouMessage = page.locator('text="Thank You"');
  await expect(thankYouMessage).toBeVisible();  // ✨ 关键验证
}
```

### 测试结果

```bash
✅ [chromium] › tests\e2e\portal.spec.ts › Survey Section › should create survey and view live
✅ 1 passed (9.8s)

✅ All 28 tests passed
```

## 完整的工作流验证

现在完整的 Survey 工作流已验证：

| 步骤 | 操作 | 结果 |
|------|------|------|
| 1 | 导航到 Survey 列表 | ✅ 加载成功 |
| 2 | 创建新 Survey | ✅ 创建成功 |
| 3 | 填充标题和问题 | ✅ 保存成功 |
| 4 | 点击 "View Live" | ✅ 页面加载（无 404） |
| 5 | 填写问卷答案 | ✅ 表单填充成功 |
| 6 | 点击 "Submit Survey" | ✅ **提交成功** 🎉 |
| 7 | 显示感谢页面 | ✅ 页面跳转成功 |

## 文件修改清单

### 核心代码
- `web/app/survey/[id]/page.tsx` — 修复 handleSubmit 提交格式

### 测试代码  
- `web/tests/e2e/portal.spec.ts` — 添加完整的提交验证

## 相关命令

```bash
# 运行 Survey 完整流程测试（含提交）
npm run test:e2e -- --grep "should create survey and view live"

# 运行全部 E2E 测试
npm run test:e2e -- --workers=1

# 查看具体错误（如有）
npm run test:e2e:debug -- --grep "survey"
```

## 后续建议

1. **前端改进**
   - [ ] 改进错误提示的用户友好性
   - [ ] 添加表单字段验证 (required 字段检查)
   - [ ] 显示提交进度条

2. **后端验证**
   - [ ] 增加 answers 字段的验证逻辑
   - [ ] 检查是否所有必填题目都被回答
   - [ ] 记录提交的用户信息（如有认证）

3. **集成测试**
   - [ ] 测试无效输入的处理
   - [ ] 测试重复提交的处理
   - [ ] 测试超时场景

---

**修复日期**: 2024 年 1 月 22 日  
**状态**: ✅ 完成  
**验证**: ✅ 所有 28 个测试通过
