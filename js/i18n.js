/**
 * i18n.js — 界面文案的中英双语字典 + 语言状态管理
 * 只负责“界面 chrome”（按钮、标题、提示）的翻译。
 * 对话正文的中英文来自每个场景的数据文件。
 */
(function () {
  'use strict';

  var STRINGS = {
    zh: {
      brandTitle: '实战英语',
      brandSub: 'Real-Talk English',
      langToggle: 'EN',
      footer: '用真实场景练英语 · 点句子或单词即可朗读',

      homeHeadline: '在真实场景里练英语',
      homeSub: '每个场景先过专业词汇，再逐句对话；点句子或单词即可朗读。',
      chooseScene: '选择一个场景开始',

      vocabTitle: '词汇预习',
      vocabHint: '点 🔊 朗读单词与例句',
      dialogueTitle: '情景对话',
      sceneLabel: '场景',

      showTranslation: '显示中文',
      hideTranslation: '隐藏中文',
      speed: '语速',
      voice: '语音',
      accent: '口音',
      accentUS: '美音',
      accentUK: '英音',
      playAll: '连读全部',
      stop: '停止',
      prevLine: '上一句',
      nextLine: '下一句',
      playLine: '播放本句',
      stopLine: '停止',
      loopOne: '单句循环',
      practice: '逐句练习',
      roleplay: '角色扮演',
      roleplayOn: '退出扮演',
      back: '返回',
      backHome: '返回首页',
      example: '例句',
      tapWordHint: '提示：点对话里的任意单词可单独朗读',
      speechUnsupported: '当前浏览器不支持朗读功能，建议使用 Chrome / Edge / Safari。',
      lessons: '个场景',
      minutes: '分钟',
      wordbook: '生词本',
      reviewCenter: '复习中心',
      tabWords: '生词本',
      tabNotes: '笔记',
      notesEmpty: '还没有笔记。在对话里点某句下方的“添加笔记”记录心得。',
      goToLine: '去该句',
      wordbookEmpty: '生词本还是空的。点对话里的单词，在卡片上点 ⭐ 收藏。',
      addFav: '加入生词本',
      remFav: '已收藏（点击移除）',
      removeWord: '移除',
      fromScene: '来自',
      onlineHint: '来自在线词典',
      addNote: '添加笔记',
      editNote: '编辑笔记',
      myNote: '我的笔记',
      clickToEdit: '点击编辑',
      notePlaceholder: '记录你的学习心得，例如：这句的语气、易错点、想背的表达…',
      save: '保存',
      cancel: '取消',
      del: '删除',
      patterns: '句型公式',
      patternsTitle: '🧩 句型公式',
      patternsSub: '背下模板，套用即说——非母语者最需要的"造句框架"。',
      patternsUsage: '用法',
      patternsExamples: '例句',
      patternsCount: '个句型',
      wordStudy: '精学单词',
      wordStudyTitle: '🎯 精学单词',
      wordStudySub: '每次随机 4 个单词，点击深入学习——词性、义项、搭配、例句，一网打尽。',
      wordStudyRefresh: '换一批',
      wordStudyLoading: '正在获取详情…',
      wordStudyOffline: '无法联网获取详情，显示离线基础信息。',
      wordStudyNoDict: '字典还未加载，请稍候再试。',
      wordStudyDef: '释义',
      wordStudySyn: '近义词',
      wordStudyAnt: '反义词',
      wordStudyBack: '返回单词列表',
      wordStudyNext: '换一个单词',
      wordStudyReview: '我的单词本',
      wordStudyReviewTitle: '📖 我的单词本',
      wordStudyReviewEmpty: '还没有保存任何单词。去精学单词页面，点一个单词添加自定义内容吧。',
      wordStudySaved: '已保存',
      wordStudyAddEntry: '添加义项',
      wordStudyPos: '词性',
      wordStudyMeaning: '含义',
      wordStudyExample: '例句',
      wordStudyPhrases: '常用短语/搭配',
      wordStudySaveWord: '保存单词',
      wordStudyDeleteWord: '删除单词',
      wordStudyDeleteEntry: '删除此义项',
      wordStudyAddMore: '继续添加义项',
      wordStudyPhrasePlaceholder: '如: look forward to, on behalf of（逗号分隔）',
      wordStudySaveSuccess: '已保存！'
    },
    en: {
      brandTitle: 'Real-Talk',
      brandSub: 'Real-Talk English',
      langToggle: '中',
      footer: 'Practice English in real scenarios · tap any sentence or word to hear it',

      homeHeadline: 'Practice English in real situations',
      homeSub: 'Preview the key vocabulary first, then go through the dialogue line by line. Tap any sentence or word to hear it.',
      chooseScene: 'Pick a scenario to start',

      vocabTitle: 'Vocabulary preview',
      vocabHint: 'Tap 🔊 to hear the word and example',
      dialogueTitle: 'Dialogue',
      sceneLabel: 'Scene',

      showTranslation: 'Show Chinese',
      hideTranslation: 'Hide Chinese',
      speed: 'Speed',
      voice: 'Voice',
      accent: 'Accent',
      accentUS: 'US',
      accentUK: 'UK',
      playAll: 'Play all',
      stop: 'Stop',
      prevLine: 'Prev',
      nextLine: 'Next',
      playLine: 'Play line',
      stopLine: 'Stop',
      loopOne: 'Loop one',
      practice: 'Line-by-line',
      roleplay: 'Role-play',
      roleplayOn: 'Exit role-play',
      back: 'Back',
      backHome: 'Home',
      example: 'Example',
      tapWordHint: 'Tip: tap any word in the dialogue to hear it alone',
      speechUnsupported: 'Your browser does not support speech. Try Chrome / Edge / Safari.',
      lessons: 'scenarios',
      minutes: 'min',
      wordbook: 'Word book',
      reviewCenter: 'Review',
      tabWords: 'Words',
      tabNotes: 'Notes',
      notesEmpty: 'No notes yet. Tap “Add note” under any line to jot down your thoughts.',
      goToLine: 'Go to line',
      wordbookEmpty: 'Your word book is empty. Tap a word in the dialogue, then tap ⭐ on the card.',
      addFav: 'Add to word book',
      remFav: 'Saved (tap to remove)',
      removeWord: 'Remove',
      fromScene: 'from',
      onlineHint: 'From an online dictionary',
      addNote: 'Add note',
      editNote: 'Edit note',
      myNote: 'My note',
      clickToEdit: 'Click to edit',
      notePlaceholder: 'Write your own notes: tone, tricky points, phrases to memorize…',
      save: 'Save',
      cancel: 'Cancel',
      del: 'Delete',
      patterns: 'Formulas',
      patternsTitle: '🧩 Sentence Formulas',
      patternsSub: 'Memorize the template, plug in your words — the sentence frameworks every learner needs.',
      patternsUsage: 'Usage',
      patternsExamples: 'Examples',
      patternsCount: 'patterns',
      wordStudy: 'Words',
      wordStudyTitle: '🎯 Deep Word Study',
      wordStudySub: '4 random words each time — tap one to explore parts of speech, meanings, collocations & examples.',
      wordStudyRefresh: 'New words',
      wordStudyLoading: 'Fetching details…',
      wordStudyOffline: 'Offline — showing basic info only.',
      wordStudyNoDict: 'Dictionary not loaded yet. Please try again.',
      wordStudyDef: 'Definition',
      wordStudySyn: 'Synonyms',
      wordStudyAnt: 'Antonyms',
      wordStudyBack: 'Back to cards',
      wordStudyNext: 'Another word',
      wordStudyReview: 'My Words',
      wordStudyReviewTitle: '📖 My Word Book',
      wordStudyReviewEmpty: 'No words saved yet. Go to Deep Word Study and add custom content to a word.',
      wordStudySaved: 'Saved',
      wordStudyAddEntry: 'Add meaning',
      wordStudyPos: 'Part of speech',
      wordStudyMeaning: 'Meaning',
      wordStudyExample: 'Example sentence',
      wordStudyPhrases: 'Common phrases / collocations',
      wordStudySaveWord: 'Save word',
      wordStudyDeleteWord: 'Delete word',
      wordStudyDeleteEntry: 'Remove this entry',
      wordStudyAddMore: 'Add another meaning',
      wordStudyPhrasePlaceholder: 'e.g. look forward to, on behalf of (comma-separated)',
      wordStudySaveSuccess: 'Saved!'
    }
  };

  var LANG_KEY = 'rte_lang';
  var listeners = [];

  function getLang() {
    return localStorage.getItem(LANG_KEY) || 'zh';
  }

  function setLang(lang) {
    if (lang !== 'zh' && lang !== 'en') lang = 'zh';
    localStorage.setItem(LANG_KEY, lang);
    document.documentElement.lang = lang;
    applyStaticText();
    listeners.forEach(function (fn) { fn(lang); });
  }

  function toggleLang() {
    setLang(getLang() === 'zh' ? 'en' : 'zh');
  }

  /** t('key') → 当前语言的文案 */
  function t(key) {
    var lang = getLang();
    return (STRINGS[lang] && STRINGS[lang][key]) || (STRINGS.zh[key]) || key;
  }

  /** 从内容对象里按当前语言取值，兼容 {zh, en} 或纯字符串 */
  function pick(value) {
    if (value == null) return '';
    if (typeof value === 'string') return value;
    var lang = getLang();
    return value[lang] != null ? value[lang] : (value.zh != null ? value.zh : value.en || '');
  }

  /** 刷新所有带 data-i18n 的静态元素 */
  function applyStaticText() {
    var nodes = document.querySelectorAll('[data-i18n]');
    nodes.forEach(function (el) {
      el.textContent = t(el.getAttribute('data-i18n'));
    });
  }

  /** 注册语言切换回调（页面重渲染用） */
  function onChange(fn) { listeners.push(fn); }

  window.I18N = {
    getLang: getLang,
    setLang: setLang,
    toggleLang: toggleLang,
    t: t,
    pick: pick,
    applyStaticText: applyStaticText,
    onChange: onChange
  };
})();
