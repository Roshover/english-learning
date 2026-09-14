/**
 * scenes-index.js — 场景的“目录”
 * 决定首页显示哪些分类、哪些场景、顺序如何。
 *
 * 加新场景的三步：
 *   1) 在 data/scenes/ 下复制一份场景 js 文件并改内容；
 *   2) 在 index.html 里加一行 <script src="data/scenes/你的文件.js"></script>；
 *   3) 把场景 id 加到下面对应分类的 sceneIds 里。
 */
window.RTE_INDEX = {
  categories: [
    {
      key: 'travel',
      name: { zh: '出国旅游', en: 'Travel' },
      icon: '✈️',
      desc: { zh: '交通、酒店、餐厅……出行全流程实用对话', en: 'Transport, hotels, restaurants — real travel dialogues' },
      sceneIds: ['hotel-check-in']
    },
    {
      key: 'it',
      name: { zh: 'IT / 职场', en: 'IT / Workplace' },
      icon: '💼',
      desc: { zh: 'PM、设计、开发围绕产品需求的协作对话', en: 'PM, design & dev collaborating on a product' },
      sceneIds: ['it-dialpad-search']
    },
    {
      key: 'daily',
      name: { zh: '日常生活', en: 'Daily Life' },
      icon: '🍽️',
      desc: { zh: '点餐、购物、看病等日常场景', en: 'Ordering food, shopping, and more' },
      sceneIds: []
    }
  ]
};
