---
name: add-learning-content
description: 给「实战英语 Real-Talk English」学习网站补充新的学习内容（新增场景/对话/词汇，如 IT 产品评审、餐厅点餐、机场打车等）。当用户要求“加一个场景/主题”“补充学习内容”“add a scene/dialogue/lesson”时使用。本 skill 说明只改哪些数据文件、绝不能改哪些核心代码、以及具体怎么改。
---

# 给「实战英语」补充学习内容

本项目是**数据驱动**的：交互、样式、朗读、点词释义、生词本、笔记、复习中心等功能都写死在核心代码里。
**补充内容 = 只新增/编辑数据文件；核心代码一律不动。** 这样既能保证整体体验不变，也不会把项目改乱。

## 🚫 铁律（必须遵守）

**只允许新增 / 编辑：**
- `data/scenes/<id>.js` —— 每个场景一个文件（主要在这里写内容）
- `data/scenes-index.js` —— 分类与场景清单（登记场景 id）
- `data/glossary.js` —— 可选：给个别词补充“常用搭配”

**绝对禁止改动：**
- `index.html`
- `js/` 下任何文件（`app.js`、`dict.js`、`speech.js`、`i18n.js`、`wordbook.js`、`notes.js` 等）
- `css/` 下任何文件
- `data/dict-core.js`、`data/common-words.js`
- `tools/` 下任何文件

> 不确定时：**只加不改**。加完必须运行校验脚本（见文末）确认通过再提交。

## ✅ 新增一个场景（两步）

### 第 1 步：创建场景文件
1. 复制模板 `data/scenes/_TEMPLATE.js`。
2. 另存为 `data/scenes/<id>.js`。`<id>` 用小写英文+连字符，例如：
   `it-product-review`、`restaurant-order`、`airport-taxi`、`hotel-checkout`。
3. 把文件里两处 `'REPLACE-scene-id'` 改成这个 `<id>`——**文件名、内部 `id`、清单里的 id 三者必须完全一致**。
4. 填写内容（字段见下）。

### 第 2 步：登记到清单
打开 `data/scenes-index.js`，把 `<id>` 加到合适分类的 `sceneIds` 数组里：

```js
{
  key: 'it',
  name: { zh: 'IT / 职场', en: 'IT / Workplace' },
  icon: '💼',
  desc: { zh: '…', en: '…' },
  sceneIds: ['it-product-review']   // ← 在这个数组里加 id
}
```

> 需要**全新分类**时，在 `categories` 数组里加一个 `{ key, name:{zh,en}, icon, desc:{zh,en}, sceneIds:[] }`。

## 📐 场景数据字段

```js
window.RTE_SCENES = window.RTE_SCENES || {};
window.RTE_SCENES['<id>'] = {
  id: '<id>',                                   // 必填，三处一致
  category: { zh: '…', en: '…' },               // 必填
  icon: '💼',                                    // 必填，一个 emoji
  minutes: 8,                                    // 建议，数字
  level: { zh: '初中级', en: 'Beginner–Intermediate' }, // 可选
  title: { zh: '…', en: '…' },                   // 必填
  scene: { zh: '一句话背景', en: 'one-line context' },   // 必填
  vocabulary: [ /* 见下 */ ],                    // 必填
  dialogue: [ /* 见下 */ ]                       // 必填
};
```

**vocabulary 每项：**
```js
{ word: 'user story', phonetic: '/…/', pos: 'n.',
  meaning: { zh: '用户故事', en: 'a short feature description' },
  example: 'Let’s break this epic into user stories.' }   // phonetic/pos/example 可选
```

**dialogue 每项（两选一）：**
```js
// 分节标题（把长对话分段，可选但推荐）
{ divider: { zh: '① 开场', en: '① Opening' } }

// 对话行
{ roleKey: 'guest', role: { zh: '你', en: 'You' },
  en: 'English line.', zh: '中文翻译。' }
```

**roleKey 规则（决定气泡左右与配色）：**
- `'guest'`（或 `'me'` / `'self'`）→ **右侧蓝色气泡**，代表“学习者一方 / 你”。
- 其它任意值（`'staff'`、`'pm'`、`'designer'`、`'dev'`、`'client'`…）→ **左侧灰色气泡**。
  多人对话时，把“你/主角”设为 `guest`，其余角色用不同 roleKey，`role` 里写清角色名。

## ✍️ 文案质量要求
- 对话口语、真实，围绕一个**具体情境的完整流程**展开（有始有终）。
- 用 `divider` 分成几个自然阶段。
- `vocabulary` 收录该场景的生词、专业名词、地道表达（8–15 个为宜）。
- 中英一一对应，翻译自然、不逐字直译。
- 一个场景对话行数建议 15–30 句。

## 🔍 加完必须自检
在项目根目录运行（需 Node 18+）：
```bash
node tools/check-content.mjs
```
它会检查：清单与文件是否对得上、字段是否齐全、`roleKey` 是否合法、有没有漏登记的文件。
**必须全部 ✓ 才算完成。** 有 ✗ 就按提示修，不要动核心代码去“绕过”。

## 🖼️ 预览
```bash
python3 -m http.server 8080     # 打开 http://localhost:8080
```

## 📎 完整最小示例
`data/scenes/restaurant-order.js`：
```js
window.RTE_SCENES = window.RTE_SCENES || {};
window.RTE_SCENES['restaurant-order'] = {
  id: 'restaurant-order',
  category: { zh: '日常生活', en: 'Daily Life' },
  icon: '🍽️',
  minutes: 6,
  level: { zh: '初级', en: 'Beginner' },
  title: { zh: '餐厅点餐', en: 'Ordering at a Restaurant' },
  scene: { zh: '你到一家餐厅坐下点餐、结账的完整流程。',
           en: 'Sitting down, ordering and paying at a restaurant.' },
  vocabulary: [
    { word: 'menu', phonetic: '/ˈmenjuː/', pos: 'n.',
      meaning: { zh: '菜单', en: 'a list of dishes' },
      example: 'Could I see the menu, please?' },
    { word: 'recommend', phonetic: '/ˌrekəˈmend/', pos: 'v.',
      meaning: { zh: '推荐', en: 'to suggest something' },
      example: 'What do you recommend?' }
  ],
  dialogue: [
    { divider: { zh: '① 入座点餐', en: '① Ordering' } },
    { roleKey: 'guest', role: { zh: '你', en: 'You' },
      en: 'Hi, a table for two, please.', zh: '你好，两位。' },
    { roleKey: 'staff', role: { zh: '服务员', en: 'Waiter' },
      en: 'Sure, right this way. Here are your menus.', zh: '好的，这边请。这是菜单。' }
  ]
};
```
然后在 `data/scenes-index.js` 的「日常生活」分类 `sceneIds` 里加 `'restaurant-order'`，运行校验脚本通过即可。

## ✅ 提交前检查清单
- [ ] 只改了 `data/` 下文件，没碰 `js/`、`css/`、`index.html`、`tools/`
- [ ] 文件名 = 内部 `id` = 清单里登记的 id
- [ ] 必填字段齐全，中英双语都填了
- [ ] `node tools/check-content.mjs` 全部 ✓
- [ ] 本地预览过，首页能看到新场景、对话/词汇/朗读/点词都正常
