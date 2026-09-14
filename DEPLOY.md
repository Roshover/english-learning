# 部署到 GitHub Pages

下面两种方式二选一。**方式 A（网页操作，最简单）** 推荐第一次用。

---

## 方式 A：网页上传（不用命令行）

1. 打开 https://github.com/new ，仓库名填 `english-learning`，选择 **Public**，点 Create。
2. 在新仓库页面点 **uploading an existing file**，把 `english-learning` 文件夹里的**所有文件**拖进去，Commit。
3. 进入仓库 **Settings → Pages**：
   - Source 选 **Deploy from a branch**
   - Branch 选 **main** / 目录选 **/(root)**，点 Save。
4. 等 1–2 分钟，页面顶部会出现网址：
   `https://roshover.github.io/english-learning/`

---

## 方式 B：命令行推送

在这个项目文件夹里依次执行（先在 GitHub 上建好空仓库 `english-learning`）：

```bash
cd ~/english-learning
git add .
git commit -m "初始化：实战英语学习网站 + 酒店入住场景"
git branch -M main
git remote add origin https://github.com/Roshover/english-learning.git
git push -u origin main
```

然后同样到 **Settings → Pages** 里，Source 选 `main` 分支 `/(root)`，Save。

---

## 让它显示在你的 GitHub 个人主页

- 网站访问地址：`https://roshover.github.io/english-learning/`
- 如果想用根地址 `https://roshover.github.io/`，把仓库名改成 `roshover.github.io` 即可。
- 也可以在你的个人 profile README 里加一个链接指向这个网站。

## 更新网站

以后改了内容，重新执行（方式 B）：

```bash
cd ~/english-learning
git add .
git commit -m "更新内容"
git push
```

或（方式 A）在网页上重新上传改动的文件。GitHub Pages 会自动重新发布。
