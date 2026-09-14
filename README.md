# 实战英语 · Real-Talk English

在真实场景里练英语：每个场景先过专业词汇，再逐句对话；**点句子或单词即可朗读**。
纯静态网站，打开即用，免费托管在 GitHub Pages。

## ✨ 功能

- 📂 **分类场景**：出国旅游 / IT·职场 / 日常生活（可扩展）
- 📘 **词汇预习**：生僻词、专业名词 + 音标 + 释义 + 例句
- 💬 **情景对话**：中英对照，气泡式聊天界面
- 🔊 **点击朗读**：点整句、点单词、整段连读（浏览器原生语音，免费无需 key）
- 🃏 **点词看释义**：点对话里的单词弹出小卡片（中文释义 + 音标 + **常用搭配** + 发音）。查询顺序：场景词汇 → `glossary.js`（手工精修搭配）→ `common-words.js`（~200 内置基础词）→ **离线大词典 `dict-core.js`（由 ECDICT 生成，见下）** → 在线词典（MyMemory 中文 + 英文释义，仅 https 环境）
- 📚 **复习中心**：顶部一个入口，Tab 切换「⭐ 生词本」和「📝 笔记」；笔记可一键「去该句」跳回原文
- ⭐ **生词本**：卡片上点 ⭐ 收藏，可回顾、朗读、移除（存在浏览器本地）
- 📝 **逐句笔记**：每句话下方可写学习心得，保存后重开网页仍在（存在浏览器本地）
- 🎧 **逐句练习**：上一句 / 下一句、**单句循环**（一句反复听，听懂为止）
- 🎙 **语音选择**：优先 Google 自然语音（Chrome 下只列 3 个 Google 音）
- 🌐 **中英界面切换**：默认中文，一键切英文
- ⚙️ **可调节**：语速、显示/隐藏中文
- 🌗 自动适配深色模式，手机/电脑自适应

## 🚀 本地使用

直接**双击 `index.html`** 即可在浏览器打开使用（数据用 `.js` 存储，无 CORS 限制）。

若想更接近线上环境，可起个本地服务器：

```bash
cd english-learning
python3 -m http.server 8777
# 浏览器打开 http://localhost:8777
```

> 朗读功能建议使用 Chrome / Edge / Safari。

## 📖 生成离线大词典（一次性，之后不用手写单词）

点词卡片的主力词库由开源词典 **ECDICT**（77 万词，含音标 / 中文 / 词频 / 词形变化）自动生成，
你**不用再手工维护单词**。在项目根目录运行（需 Node 18+）：

```bash
node tools/build-dict.mjs          # 默认取前 15000 高频词，生成 data/dict-core.js
```

可选参数：`node tools/build-dict.mjs 30000`（自定义词数）。
生成后刷新网页即可；把 `data/dict-core.js` 一起提交，GitHub Pages 上也能用。

> 说明：`dict-core.js` 会被 App **首次点词时懒加载并缓存**，不影响首页/对话打开速度。
> 没生成也没关系——基础词仍可离线查，其余走在线兜底。数据来源 github.com/skywind3000/ECDICT（MIT）。

## ➕ 新增一个场景（三步）

1. 复制 `data/scenes/hotel-check-in.js`，改成你的内容（改文件名和里面的 `id`）。
2. 在 `index.html` 里加一行：
   ```html
   <script src="data/scenes/你的文件名.js"></script>
   ```
3. 在 `data/scenes-index.js` 里，把新场景的 `id` 加进对应分类的 `sceneIds`。

刷新页面即可看到新场景。

## 🌍 部署到 GitHub Pages

见 `DEPLOY.md`。部署后访问地址形如：
`https://roshover.github.io/english-learning/`

## 📁 目录结构

```
english-learning/
├── index.html            # 入口页面
├── css/style.css         # 全部样式
├── js/
│   ├── i18n.js           # 界面中英双语字典
│   ├── speech.js         # 朗读封装（Web Speech API）
│   ├── dict.js           # 单词查询（本地词库 + 在线词典兜底）
│   ├── wordbook.js       # 生词本（localStorage 持久化）
│   ├── notes.js          # 逐句笔记（localStorage 持久化）
│   └── app.js            # 路由 + 渲染 + 交互
├── data/
│   ├── scenes-index.js   # 分类与场景目录
│   ├── glossary.js       # 重点词库（中文释义 + 常用搭配 + 音标）
│   ├── common-words.js   # 内置基础词库（~200 词，简明中文）
│   ├── dict-core.js      # 离线大词典（运行 tools/build-dict.mjs 生成，不手写）
│   └── scenes/
│       └── hotel-check-in.js   # 场景：酒店入住
├── tools/
│   └── build-dict.mjs    # 一次性构建离线词典（下载 ECDICT → 过滤 → 生成 dict-core.js）
├── README.md
└── DEPLOY.md
```
