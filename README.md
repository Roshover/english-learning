# 实战英语 · Real-Talk English

在真实场景里练英语：每个场景先过专业词汇，再逐句对话；**点句子或单词即可朗读**。
纯静态网站，打开即用，免费托管在 GitHub Pages。

## ✨ 功能

- 📂 **分类场景**：出国旅游 / IT·职场 / 日常生活（可扩展）
- 📘 **词汇预习**：生僻词、专业名词 + 音标 + 释义 + 例句
- 💬 **情景对话**：中英对照，气泡式聊天界面
- 🔊 **点击朗读**：点整句、点单词、整段连读（浏览器原生语音，免费无需 key）
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
│   └── app.js            # 路由 + 渲染 + 交互
├── data/
│   ├── scenes-index.js   # 分类与场景目录
│   └── scenes/
│       └── hotel-check-in.js   # 场景：酒店入住
├── README.md
└── DEPLOY.md
```
