# SKILL：给「实战英语 Real-Talk English」补充学习内容

> **给 AI / 维护者：补充内容前请先完整读完本文件，并严格遵守。**
> 本项目是**数据驱动**的：交互、样式、朗读、点词释义、生词本、笔记、复习中心等功能都写死在核心代码里。
> **补充内容 = 只新增/编辑数据文件；核心代码一律不动。** 这样整体体验保持不变，也不会把项目改乱。

---

## 🟢 使用方式（用户只需说一句）

用户通常只会这样交代，例如：

> **“按照 SKILL.md，帮我新增一篇学习对话，主题是：在机场办理登机和托运行李。”**

收到这类指令后，你（AI）要**自己完成全部工作，包括自动验证**，不需要用户再补充确认。

## 🤖 收到指令后必须按这个流程自动执行

1. **读完本文件全部内容**，理解字段规范与铁律。
2. **选分类（决定放到哪个 tab）**：先看主题能否归入某个**现有分类**（旅游 / IT职场 / 日常生活…），能就用现有的；
   实在都不合适，再**新建一个分类**——注意：分类就写在数据文件 `data/scenes-index.js` 里，属于允许编辑的范围，
   **不算改源码**，首页 tab 会自动生成（具体见下方「➕ 新增一个分类（Tab）」）。
3. **起 id**：由主题起一个小写连字符英文 id（如 `airport-checkin`）。
4. **建文件**：复制 `data/scenes/_TEMPLATE.js` 为 `data/scenes/<id>.js`，把两处 `'REPLACE-scene-id'` 换成 `<id>`，按字段规范写入高质量内容（词汇 8–15 个、对话 15–30 句、用 `divider` 分段、中英一一对应）。
5. **登记**：在 `data/scenes-index.js` 对应分类的 `sceneIds` 里加上 `<id>`。
6. **自动验证（必做，不要等用户开口）**：运行
   ```bash
   node tools/check-content.mjs
   ```
7. **不过就改到过**：若输出有 `✗`，按提示**只修改你新增的数据文件**（绝不改核心代码来“绕过”），然后**重新运行第 6 步**，如此循环，直到输出 `✓ 内容检查通过`。
8. **汇报**：告诉用户新增了哪个场景、归入哪个分类、校验已通过；若始终无法通过校验，如实说明卡在哪里，不要谎报成功。

> ⚠️ 整个过程只允许新增/编辑 `data/` 下文件（见下方铁律），**绝不改动 `js/`、`css/`、`index.html`、`tools/`**。

---

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

---

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

完成后刷新网页即可看到新场景——**朗读、逐句练习、点词释义、生词本、笔记、复习中心全部自动生效**。

---

## ➕ 新增一个分类（Tab）—— 仍然只改数据文件，不算改源码

首页顶部的 tab（全部 / ✈️旅游 / 💼IT职场 / 🍽️日常生活…）**是根据 `data/scenes-index.js` 里的 `categories` 自动生成的**。
想加一个新 tab，只需在 `data/scenes-index.js` 的 `categories` 数组里加一个分类对象即可，**不要动 `js/`、`css/`、`index.html`**。

```js
window.RTE_INDEX = {
  categories: [
    // …已有分类…
    {
      key: 'entertainment',                 // 唯一英文标识（小写），不能和已有 key 重复
      name: { zh: '影音娱乐', en: 'Entertainment' },   // tab 显示名（双语）
      icon: '🎬',                            // tab 图标（一个 emoji）
      desc: { zh: '看电影、听音乐、聊剧集等场景', en: 'Movies, music, shows…' }, // 首页分类描述
      sceneIds: ['movie-tickets']           // 该分类下的场景 id（可先放你新建的这个）
    }
  ]
};
```

加完这个分类对象后，把你的场景文件（`data/scenes/movie-tickets.js`）建好，其 id 已在上面的 `sceneIds` 里，
刷新页面首页就会**自动多出一个「🎬 影音娱乐」tab**，无需任何额外改动。

**什么时候才需要新建分类？** 仅当主题明显不属于任何现有分类时。能归入现有分类就优先复用，避免 tab 过多。

---

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

---

## ✍️ 文案质量要求
- 对话口语、真实，围绕一个**具体情境的完整流程**展开（有始有终）。
- 用 `divider` 分成几个自然阶段。
- `vocabulary` 收录该场景的生词、专业名词、地道表达（8–15 个为宜）。
- 中英一一对应，翻译自然、不逐字直译。
- 一个场景对话行数建议 15–30 句。

---

## 🔍 加完必须自检
在项目根目录运行（需 Node 18+）：
```bash
node tools/check-content.mjs
```
它会检查：清单与文件是否对得上、字段是否齐全、`roleKey` 是否合法、有没有漏登记的文件。
**必须全部 ✓ 才算完成。** 有 ✗ 就按提示修，不要动核心代码去“绕过”。

预览：
```bash
python3 -m http.server 8080     # 打开 http://localhost:8080
```

---

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

---

---

## 🧩 新增句型公式（Sentence Formulas）

句型公式是一个**全局独立栏目**（路由 `#/patterns`），数据集中在 `data/patterns.js` 一个文件里。
新增句型 = **只编辑 `data/patterns.js`**，不需要改任何其他文件。

### 数据结构

`data/patterns.js` 的顶层是 `window.RTE_PATTERNS = { categories: [...] }`。

**每个分类（category）：**
```js
{
  key: 'requesting',                        // 唯一英文标识
  name: { zh: '请求 & 许可', en: 'Requesting & Permission' },
  icon: '🙋',                               // 一个 emoji
  patterns: [ /* 见下 */ ]
}
```

**每个句型（pattern）：**
```js
{
  formula: 'Would you mind if I + past tense …?',   // 句型模板（英文）
  meaning: { zh: '……', en: '…' },                    // 中英释义
  usage:   { zh: '……', en: '…' },                    // 使用场景 / 注意事项
  examples: [                                         // 2–3 个例句
    { en: 'Would you mind if I opened the window?', zh: '你介意我开一下窗户吗？' }
  ]
}
```

### 操作方式

- **给现有分类加句型**：找到对应 `key` 的分类，在其 `patterns` 数组末尾追加新对象。
- **新建一个分类**：在 `categories` 数组末尾追加一个新分类对象（包含 `key`、`name`、`icon`、`patterns`），首页导航会自动出现新分类。
- **不需要**改 `index.html`、`js/`、`css/`、`data/scenes-index.js` 或任何其他文件。

### 质量要求
- `formula` 用英文写，动词形式用语法术语标注（如 `+ verb-ing`、`+ past tense`）。
- `meaning` 和 `usage` 中英都要填，`usage` 侧重"什么场景下用"和"容易出错的点"。
- `examples` 至少 2 个，要口语化、贴近真实场景（职场/旅行/日常均可）。
- 避免和已有句型重复——先通读现有内容再添加。

---

## ✅ 提交前检查清单
- [ ] 只改了 `data/` 下文件，没碰 `js/`、`css/`、`index.html`、`tools/`
- [ ] 文件名 = 内部 `id` = 清单里登记的 id
- [ ] 必填字段齐全，中英双语都填了
- [ ] `node tools/check-content.mjs` 全部 ✓
- [ ] 本地预览过，首页能看到新场景，对话/词汇/朗读/点词都正常
