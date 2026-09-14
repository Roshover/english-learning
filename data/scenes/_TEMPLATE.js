/**
 * 场景模板 —— 复制本文件来新增一个场景。
 *
 * 三步（详见项目根目录 SKILL.md）：
 *   1) 复制本文件为 data/scenes/<你的场景id>.js，例如 data/scenes/it-product-review.js
 *   2) 把下面两处 'REPLACE-scene-id' 改成同一个 id（必须和文件名一致）
 *   3) 在 data/scenes-index.js 里，把这个 id 加进某个分类的 sceneIds 数组
 *
 * ⚠️ 只需新增/编辑 data/ 下的文件；不要改动 js/、css/、index.html。
 * ⚠️ 所有中文/英文都放进对应字段即可，样式和功能会自动套用。
 */
window.RTE_SCENES = window.RTE_SCENES || {};
window.RTE_SCENES['REPLACE-scene-id'] = {
  id: 'REPLACE-scene-id',                       // 必填：与文件名、清单里的 id 完全一致
  category: { zh: '出国旅游', en: 'Travel' },   // 所属分类（展示用；分类的图标/描述在 scenes-index.js）
  icon: '💬',                                    // 一个 emoji 作为图标
  minutes: 8,                                    // 预计时长（分钟，数字）
  level: { zh: '初中级', en: 'Beginner–Intermediate' }, // 可选：难度标签

  title: { zh: '场景标题', en: 'Scene Title' },
  scene: {                                       // 场景背景一句话介绍
    zh: '用一句话说明这个场景发生在什么情境下。',
    en: 'One sentence describing the situation of this scene.'
  },

  // 生词预习：数组，每个词一张卡片。meaning 用 {zh, en} 双语。
  vocabulary: [
    {
      word: 'example',                           // 单词/词组
      phonetic: '/ɪɡˈzæmpl/',                    // 可选：音标
      pos: 'n.',                                 // 可选：词性
      meaning: { zh: '例子', en: 'a thing that illustrates a rule' },
      example: 'This is an example sentence.'    // 可选：例句
    }
    // …继续加更多词
  ],

  // 对话：数组，两种元素——
  //   分节标题： { divider: { zh: '① 第一节', en: '① Part 1' } }
  //   对话行：   { roleKey, role:{zh,en}, en, zh }
  //     roleKey: 'guest' = 学习者一方(显示在右侧蓝色气泡)；其它值(如 'staff'/'pm'/'dev')显示在左侧
  //     role:    气泡上方显示的角色名（双语）
  //     en/zh:   英文台词 / 中文翻译
  dialogue: [
    { divider: { zh: '① 开场', en: '① Opening' } },

    { roleKey: 'guest', role: { zh: '你', en: 'You' },
      en: 'Hello, this is the first English line.',
      zh: '你好，这是第一句英文台词。' },

    { roleKey: 'staff', role: { zh: '对方', en: 'Other' },
      en: 'Hi! This is the reply from the other side.',
      zh: '你好！这是对方的回复。' }

    // …继续加更多对话行或分节
  ]
};
