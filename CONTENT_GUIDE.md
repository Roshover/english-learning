# 内容编写指南（给维护者 / AI 模型看）

本项目是**数据驱动**的：交互、样式、功能都写死在核心代码里，**新增学习内容只需要加数据文件，绝不要改动核心代码**。

## 🚫 铁律（务必遵守）

1. **只允许新增 / 编辑这些地方：**
   - `data/scenes/<id>.js` —— 每个场景一个文件（新增内容主要在这里）
   - `data/scenes-index.js` —— 分类与场景清单（登记 id）
   - `data/glossary.js` —— 可选：给某些词补充“常用搭配”
2. **禁止改动：** `index.html`、`js/` 下任何文件、`css/` 下任何文件、`data/dict-core.js`、`data/common-words.js`、`tools/`。
3. 不确定就**只加不改**，加完运行校验脚本（见文末）确认没破坏结构。

## ✅ 新增一个场景（两步）

### 第 1 步：创建场景文件
复制模板 `data/scenes/_TEMPLATE.js` → 重命名为 `data/scenes/<你的id>.js`
（`<你的id>` 用小写英文和连字符，例如 `it-product-review`、`restaurant-order`、`airport-taxi`）。

打开新文件，把两处 `'REPLACE-scene-id'` 改成你的 id（**必须和文件名一致**），然后填写内容。

### 第 2 步：登记到清单
打开 `data/scenes-index.js`，把你的 id 加到对应分类的 `sceneIds` 数组里，例如：

```js
{
  key: 'it',
  name: { zh: 'IT / 职场', en: 'IT / Workplace' },
  icon: '💼',
  desc: { zh: '…', en: '…' },
  sceneIds: ['it-product-review']   // ← 加这一行里的 id
}
```

完成。刷新网页就能在首页看到新场景，**朗读、逐句练习、点词释义、生词本、笔记、复习中心全部自动生效**，无需任何额外改动。

> 想新增一个**全新分类**？在 `data/scenes-index.js` 的 `categories` 数组里加一个分类对象（含 `key / name / icon / desc / sceneIds`）即可。

## 📐 场景数据字段说明

| 字段 | 必填 | 说明 |
|------|------|------|
| `id` | ✅ | 与文件名、清单里的 id 完全一致 |
| `category` | ✅ | `{ zh, en }`，展示用 |
| `icon` | ✅ | 一个 emoji |
| `minutes` | 建议 | 数字，预计时长 |
| `level` | 可选 | `{ zh, en }` 难度标签 |
| `title` | ✅ | `{ zh, en }` 标题 |
| `scene` | ✅ | `{ zh, en }` 场景背景一句话 |
| `vocabulary` | ✅ | 数组，见下 |
| `dialogue` | ✅ | 数组，见下 |

**vocabulary 每项：** `{ word, phonetic?, pos?, meaning:{zh,en}, example? }`

**dialogue 每项（两选一）：**
- 分节标题：`{ divider: { zh, en } }`
- 对话行：`{ roleKey, role:{zh,en}, en, zh }`
  - `roleKey`：`'guest'`（或 `'me'`/`'self'`）= 学习者一方，显示在**右侧蓝色**气泡；
    其它任意值（如 `'staff'`、`'pm'`、`'designer'`、`'dev'`）显示在**左侧灰色**气泡。
  - `role`：气泡上方的角色名，`{ zh, en }`。
  - `en` / `zh`：英文台词 / 中文翻译。

## ✍️ 文案质量建议
- 对话真实、口语化，围绕一个具体情境展开完整流程。
- 用 `divider` 把长对话分成几个阶段，便于阅读。
- `vocabulary` 收录该场景里的生词、专业名词、地道表达。
- 中英文一一对应，翻译自然，不要逐字直译。

## 🔍 加完自检（强烈建议）
在项目根目录运行（需 Node 18+）：

```bash
node tools/check-content.mjs
```

它会检查：清单与文件是否对得上、每个场景字段是否齐全、`roleKey` 是否合法等，并明确报出问题所在。**全部 ✓ 再提交**。

## 🖼️ 本地预览
```bash
python3 -m http.server 8080
# 打开 http://localhost:8080
```
（或直接双击 `index.html`；但联网查词、在线例句需要用服务器或线上访问。）
