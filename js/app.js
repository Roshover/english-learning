/**
 * app.js — 极简单页应用：hash 路由 + 渲染 + 交互
 * 无框架、无构建，直接跑在浏览器里。
 */
(function () {
  'use strict';

  var app = document.getElementById('app');
  var pick = window.I18N.pick;
  var t = window.I18N.t;

  // 首页状态
  var activeTab = 'all';               // 'all' 或分类 key
  var searchTerm = '';

  // 场景页：是否显示中文（默认跟随界面语言）
  var showTranslation = window.I18N.getLang() === 'zh';

  // 当前场景页的逐句播放器（由 buildControls 创建）
  var player = null;
  // 当前场景（供单词卡片查词汇用）
  var currentScene = null;

  // ---------- 工具 ----------
  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        if (k === 'class') node.className = attrs[k];
        else if (k === 'html') node.innerHTML = attrs[k];
        else if (k.indexOf('on') === 0 && typeof attrs[k] === 'function') {
          node.addEventListener(k.slice(2).toLowerCase(), attrs[k]);
        } else if (attrs[k] != null) {
          node.setAttribute(k, attrs[k]);
        }
      });
    }
    (children || []).forEach(function (c) {
      if (c == null) return;
      node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    });
    return node;
  }
  function clear(n) { while (n.firstChild) n.removeChild(n.firstChild); }
  function getScene(id) { return (window.RTE_SCENES || {})[id]; }
  function categories() { return (window.RTE_INDEX.categories || []); }

  function scenesOfCategory(cat) {
    return cat.sceneIds.map(getScene).filter(Boolean);
  }
  function allScenesWithCat() {
    var out = [];
    categories().forEach(function (cat) {
      scenesOfCategory(cat).forEach(function (s) { out.push({ cat: cat, scene: s }); });
    });
    return out;
  }

  // 英文句子 → 可点击单词
  function renderClickableEnglish(text) {
    var frag = document.createDocumentFragment();
    var parts = text.match(/[A-Za-z']+|[^A-Za-z']+/g) || [text];
    parts.forEach(function (p) {
      if (/[A-Za-z']/.test(p)) {
        frag.appendChild(el('span', {
          class: 'word',
          onclick: function (e) { e.stopPropagation(); showWordCard(this, p); }
        }, [p]));
      } else {
        frag.appendChild(document.createTextNode(p));
      }
    });
    return frag;
  }

  // ---------- 单词释义卡片 ----------
  var wordCardEl = null;
  var wordCardAnchor = null;

  function closeWordCard() {
    if (!wordCardEl) return;
    if (wordCardEl.parentNode) wordCardEl.parentNode.removeChild(wordCardEl);
    wordCardEl = null; wordCardAnchor = null;
    document.removeEventListener('click', onDocClickForCard, true);
    window.removeEventListener('scroll', repositionCard, true);
    window.removeEventListener('resize', repositionCard);
  }
  function onDocClickForCard(e) {
    if (wordCardEl && !wordCardEl.contains(e.target) && !(e.target.classList && e.target.classList.contains('word'))) {
      closeWordCard();
    }
  }
  function positionCard() {
    if (!wordCardEl || !wordCardAnchor) return;
    var r = wordCardAnchor.getBoundingClientRect();
    var cw = Math.min(320, window.innerWidth - 24);
    wordCardEl.style.width = cw + 'px';
    var ch = wordCardEl.offsetHeight;
    var top = r.bottom + 8;
    if (top + ch > window.innerHeight - 10) {
      var above = r.top - 8 - ch;
      top = above > 10 ? above : Math.max(10, window.innerHeight - 10 - ch);
    }
    var left = r.left;
    if (left + cw > window.innerWidth - 12) left = window.innerWidth - 12 - cw;
    if (left < 12) left = 12;
    wordCardEl.style.top = top + 'px';
    wordCardEl.style.left = left + 'px';
  }
  function repositionCard() { positionCard(); }

  function collocationRow(c) {
    var en = c.en || c;
    return el('div', { class: 'wc-collo', onclick: function () { window.Speech.speak(en); } }, [
      el('span', { class: 'wc-collo-en' }, [en]),
      c.zh ? el('span', { class: 'wc-collo-zh' }, [c.zh]) : null,
      el('span', { class: 'wc-collo-spk' }, ['🔊'])
    ]);
  }

  function showWordCard(anchorEl, rawWord) {
    closeWordCard();
    var vocab = currentScene ? currentScene.vocabulary : null;
    var displayWord = rawWord.replace(/^[^A-Za-z'-]+/, '').replace(/[^A-Za-z'-]+$/, '');

    var card = el('div', { class: 'word-card' });
    var phonSpan = el('span', { class: 'wc-phon' }, ['']);

    // 收藏用的条目（查到释义后会更新 meaning/phonetic）
    var entry = { word: displayWord, phonetic: '', meaning: '', scene: currentScene ? pick(currentScene.title) : '' };
    var starBtn = el('button', { class: 'wc-star', title: t('addFav') }, ['☆']);
    function updateStar() {
      var on = window.WordBook.has(entry.word);
      starBtn.textContent = on ? '★' : '☆';
      starBtn.classList.toggle('on', on);
      starBtn.title = on ? t('remFav') : t('addFav');
    }
    starBtn.addEventListener('click', function (e) { e.stopPropagation(); window.WordBook.toggle(entry); updateStar(); });
    updateStar();

    card.appendChild(el('div', { class: 'wc-head' }, [
      el('span', { class: 'wc-word' }, [displayWord]),
      phonSpan,
      el('button', { class: 'btn-speak', title: '朗读', onclick: function (e) { e.stopPropagation(); window.Speech.speak(displayWord); } }, ['🔊']),
      starBtn,
      el('button', { class: 'wc-close', title: '关闭', onclick: function (e) { e.stopPropagation(); closeWordCard(); } }, ['×'])
    ]));
    var body = el('div', { class: 'wc-body' });
    card.appendChild(body);

    var loading = el('div', { class: 'wc-meaning wc-loading' }, [pick({ zh: '查询中…', en: 'Looking up…' })]);
    body.appendChild(loading);

    document.body.appendChild(card);
    wordCardEl = card; wordCardAnchor = anchorEl;
    positionCard();
    setTimeout(function () {
      document.addEventListener('click', onDocClickForCard, true);
      window.addEventListener('scroll', repositionCard, true);
      window.addEventListener('resize', repositionCard);
    }, 0);

    function clearBody() { clear(body); }

    function renderLocal(local) {
      clearBody();
      if (local.phonetic) phonSpan.textContent = local.phonetic;

      // 词性标签：glossary/词汇自带 pos；ECDICT/common 则从中文释义开头解析（如 "n. 有效性…"）
      var meaningText = local.meaning ? pick(local.meaning) : '';
      var posText = local.pos || '';
      if (!posText && meaningText) {
        var m = /^([a-zA-Z]{1,5}\.)\s*/.exec(meaningText);
        if (m) { posText = m[1]; meaningText = meaningText.slice(m[0].length); }
      }
      if (posText) body.appendChild(el('span', { class: 'wc-pos' }, [posText]));
      if (meaningText) body.appendChild(el('div', { class: 'wc-meaning' }, [meaningText]));

      if (local.collocations && local.collocations.length) {
        body.appendChild(el('div', { class: 'wc-sub' }, [pick({ zh: '常用搭配', en: 'Common collocations' })]));
        body.appendChild(el('div', { class: 'wc-collos' }, local.collocations.map(collocationRow)));
      }
      if (local.example) {
        body.appendChild(el('div', { class: 'wc-example' }, [
          el('span', { class: 'ex-label' }, [t('example') + '：']),
          el('span', { class: 'ex-en' }, [local.example])
        ]));
      } else {
        // ECDICT 无例句：有网时自动补一个例句（无网静默跳过）
        window.Dict.fetchExample(rawWord).then(function (ex) {
          if (wordCardEl !== card || !ex) return;
          body.appendChild(el('div', { class: 'wc-example' }, [
            el('span', { class: 'ex-label' }, [t('example') + '：']),
            el('span', { class: 'ex-en' }, [ex])
          ]));
          positionCard();
        });
      }
      entry.phonetic = local.phonetic || entry.phonetic;
      entry.meaning = meaningText || (local.meaning ? pick(local.meaning) : entry.meaning);
      positionCard();
    }

    function renderOnline() {
      window.Dict.fetchOnline(rawWord).then(function (res) {
        if (wordCardEl !== card) return; // 卡片已关闭或被替换
        clearBody();
        if (!res || (!res.zh && (!res.defs || !res.defs.length))) {
          body.appendChild(el('div', { class: 'wc-meaning' }, [pick({ zh: '没查到该词，点 🔊 可听发音。（若是双击 file:// 打开则无法联网，请用本地服务器或线上访问）', en: 'Not found. Tap 🔊 to hear it. (Opening via file:// blocks network — use a local server or the hosted site.)' })]));
          positionCard();
          return;
        }
        if (res.phonetic) phonSpan.textContent = res.phonetic;
        if (res.zh) body.appendChild(el('div', { class: 'wc-meaning' }, [res.zh]));
        (res.defs || []).forEach(function (d) {
          body.appendChild(el('div', { class: 'wc-onlinedef' }, [
            d.pos ? el('span', { class: 'wc-pos' }, [d.pos]) : null,
            el('div', { class: 'wc-meaning' }, [d.def]),
            d.example ? el('div', { class: 'wc-example' }, [el('span', { class: 'ex-en' }, ['“' + d.example + '”'])]) : null
          ]));
        });
        body.appendChild(el('div', { class: 'wc-tip' }, [t('onlineHint')]));
        entry.phonetic = entry.phonetic || res.phonetic || '';
        entry.meaning = res.zh || (res.defs[0] && res.defs[0].def) || entry.meaning;
        positionCard();
      });
    }

    // 1) 先用已加载的词库（场景/glossary/common/已缓存的大词典）即时查
    var eager = window.Dict.lookupLocal(rawWord, vocab);
    if (eager) { renderLocal(eager); return; }

    // 2) 没命中 → 懒加载大词典再查 → 仍没有则联网兜底
    window.Dict.ensureDict().then(function () {
      if (wordCardEl !== card) return;
      var local = window.Dict.lookupLocal(rawWord, vocab);
      if (local) renderLocal(local);
      else renderOnline();
    });
  }

  // ---------- 首页 ----------
  function renderHome() {
    clear(app);

    app.appendChild(el('section', { class: 'hero' }, [
      el('h1', { class: 'hero-title' }, [t('homeHeadline')]),
      el('p', { class: 'hero-sub' }, [t('homeSub')]),
      window.Speech.isSupported() ? null : el('p', { class: 'warn' }, ['⚠️ ' + t('speechUnsupported')])
    ]));

    // 搜索框
    var search = el('input', {
      class: 'search-input', type: 'search',
      placeholder: pick({ zh: '搜索场景，如“酒店”“会议”…', en: 'Search scenarios…' }),
      value: searchTerm
    });
    search.addEventListener('input', function () {
      searchTerm = search.value.trim().toLowerCase();
      renderSceneList(listWrap);
    });
    app.appendChild(el('div', { class: 'search-wrap' }, [
      el('span', { class: 'search-icon' }, ['🔍']), search
    ]));

    // 分类 tab
    var tabs = el('div', { class: 'tabs' });
    var tabDefs = [{ key: 'all', name: { zh: '全部', en: 'All' }, icon: '✨' }].concat(
      categories().map(function (c) { return { key: c.key, name: c.name, icon: c.icon }; })
    );
    tabDefs.forEach(function (td) {
      var count = td.key === 'all'
        ? allScenesWithCat().length
        : scenesOfCategory(categories().filter(function (c) { return c.key === td.key; })[0] || { sceneIds: [] }).length;
      var tab = el('button', { class: 'tab' + (activeTab === td.key ? ' active' : '') }, [
        el('span', {}, [td.icon + ' ' + pick(td.name)]),
        el('span', { class: 'tab-count' }, [String(count)])
      ]);
      tab.addEventListener('click', function () {
        activeTab = td.key;
        tabs.querySelectorAll('.tab').forEach(function (n) { n.classList.remove('active'); });
        tab.classList.add('active');
        renderSceneList(listWrap);
      });
      tabs.appendChild(tab);
    });
    app.appendChild(tabs);

    var listWrap = el('div', { class: 'scene-list' });
    app.appendChild(listWrap);
    renderSceneList(listWrap);
  }

  function sceneMatchesSearch(s) {
    if (!searchTerm) return true;
    var hay = (pick(s.title) + ' ' + pick(s.scene) + ' ' + s.title.en + ' ' +
      (s.vocabulary || []).map(function (v) { return v.word; }).join(' ')).toLowerCase();
    return hay.indexOf(searchTerm) !== -1;
  }

  function renderSceneList(wrap) {
    clear(wrap);
    var items = allScenesWithCat().filter(function (x) {
      var inTab = activeTab === 'all' || x.cat.key === activeTab;
      return inTab && sceneMatchesSearch(x.scene);
    });

    if (!items.length) {
      wrap.appendChild(el('div', { class: 'empty-state' }, [
        el('div', { class: 'empty-emoji' }, ['🗂️']),
        el('p', {}, [pick({ zh: '这个分类还没有场景，敬请期待…', en: 'No scenarios here yet — coming soon.' })])
      ]));
      return;
    }

    var grid = el('div', { class: 'scene-grid' });
    items.forEach(function (x) {
      var s = x.scene;
      grid.appendChild(el('a', { class: 'scene-card', href: '#/scene/' + s.id }, [
        el('div', { class: 'scene-icon' }, [s.icon || '💬']),
        el('div', { class: 'scene-meta' }, [
          el('div', { class: 'scene-catline' }, [x.cat.icon + ' ' + pick(x.cat.name)]),
          el('h3', {}, [pick(s.title)]),
          el('p', {}, [pick(s.scene)]),
          el('div', { class: 'scene-tags' }, [
            el('span', { class: 'scene-tag' }, ['📘 ' + (s.vocabulary ? s.vocabulary.length : 0) + ' ' + pick({ zh: '词', en: 'words' })]),
            el('span', { class: 'scene-tag' }, ['💬 ' + (s.dialogue || []).filter(function (d) { return d.en; }).length + ' ' + pick({ zh: '句', en: 'lines' })]),
            el('span', { class: 'scene-tag' }, ['⏱ ' + (s.minutes || 5) + ' ' + t('minutes')]),
            s.level ? el('span', { class: 'scene-tag level' }, [pick(s.level)]) : null
          ])
        ])
      ]));
    });
    wrap.appendChild(grid);
  }

  // ---------- 场景页 ----------
  function renderScene(id, lineIndex) {
    var s = getScene(id);
    if (!s) { location.hash = '#/'; return; }
    window.Speech.stop();
    closeWordCard();
    currentScene = s;
    clear(app);

    app.appendChild(el('div', { class: 'scene-top' }, [
      el('a', { class: 'btn-ghost', href: '#/' }, ['← ' + t('backHome')]),
      el('div', { class: 'scene-title-block' }, [
        el('h1', {}, [(s.icon || '') + ' ' + pick(s.title)]),
        s.level ? el('span', { class: 'scene-level-badge' }, [pick(s.level)]) : null,
        el('p', { class: 'scene-desc' }, [pick(s.scene)])
      ])
    ]));

    // 词汇预习（可折叠）
    app.appendChild(buildVocabPanel(s));

    // 控制条（含逐句播放器）
    var controls = buildControls(s);
    player = controls.player;
    app.appendChild(controls.node);

    // 对话
    var dialogueWrap = el('section', { class: 'panel' }, [
      el('div', { class: 'panel-head' }, [
        el('h2', {}, ['💬 ' + t('dialogueTitle')]),
        el('span', { class: 'panel-hint' }, [t('tapWordHint')])
      ])
    ]);
    var lines = el('div', { class: 'dialogue' });
    (s.dialogue || []).forEach(function (line, i) {
      if (line.divider) {
        lines.appendChild(el('div', { class: 'dialogue-divider' }, [
          el('span', {}, [pick(line.divider)])
        ]));
      } else {
        lines.appendChild(renderLine(line, i));
      }
    });
    dialogueWrap.appendChild(lines);
    app.appendChild(dialogueWrap);

    controls.bind(lines, s);

    // 从复习中心「去该句」跳转过来：滚动到该句并闪一下
    if (lineIndex != null && lineIndex !== '') {
      setTimeout(function () {
        var target = lines.querySelector('.turn[data-index="' + lineIndex + '"]');
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'center' });
          target.classList.add('flash');
          setTimeout(function () { target.classList.remove('flash'); }, 1600);
        }
      }, 60);
    }
  }

  function buildVocabPanel(s) {
    var body = el('div', { class: 'vocab-grid' }, (s.vocabulary || []).map(function (v) {
      return el('div', { class: 'vocab-card' }, [
        el('div', { class: 'vocab-head' }, [
          el('span', { class: 'vocab-word' }, [v.word]),
          v.phonetic ? el('span', { class: 'vocab-phon' }, [v.phonetic]) : null,
          v.pos ? el('span', { class: 'vocab-pos' }, [v.pos]) : null,
          el('button', { class: 'btn-speak', title: '朗读',
            onclick: function () { window.Speech.speak(v.word + '. ' + (v.example || '')); } }, ['🔊'])
        ]),
        el('div', { class: 'vocab-meaning' }, [pick(v.meaning)]),
        v.example ? el('div', { class: 'vocab-example' }, [
          el('span', { class: 'ex-label' }, [t('example') + '：']),
          el('span', { class: 'ex-en' }, [v.example])
        ]) : null
      ]);
    }));

    var panel = el('section', { class: 'panel collapsible open' });
    var chevron = el('span', { class: 'chevron' }, ['▾']);
    var head = el('button', { class: 'panel-head collapsible-head' }, [
      el('h2', {}, ['📘 ' + t('vocabTitle') + ' ',
        el('span', { class: 'count-badge' }, [String((s.vocabulary || []).length)])]),
      el('span', { class: 'collapsible-right' }, [
        el('span', { class: 'panel-hint' }, [t('vocabHint')]), chevron
      ])
    ]);
    head.addEventListener('click', function () { panel.classList.toggle('open'); });
    panel.appendChild(head);
    panel.appendChild(el('div', { class: 'collapsible-body' }, [body]));
    return panel;
  }

  function renderLine(line, index) {
    var side = line.roleKey === 'guest' ? 'right' : 'left';
    var enNode = el('div', { class: 'bubble-en' });
    enNode.appendChild(renderClickableEnglish(line.en));
    enNode.appendChild(el('button', { class: 'btn-speak inline', title: '朗读整句',
      onclick: function (e) { e.stopPropagation(); window.Speech.speak(line.en); } }, ['🔊']));

    var zhNode = el('div', { class: 'bubble-zh' + (showTranslation ? '' : ' hidden') }, [line.zh]);

    return el('div', { class: 'turn ' + side, 'data-index': index }, [
      el('div', { class: 'turn-role' }, [pick(line.role)]),
      el('div', { class: 'bubble', onclick: function () {
        if (player) player.playDialogueIdx(index); else window.Speech.speak(line.en);
      } }, [enNode, zhNode]),
      buildNoteSection(currentScene.id, index)
    ]);
  }

  // 逐句笔记：按钮 + 展示 + 内联编辑器（存 localStorage，刷新仍在）
  function buildNoteSection(sceneId, index) {
    var wrap = el('div', { class: 'note-wrap' });
    var toggleBtn = el('button', { class: 'note-btn' }, []);
    var display = el('div', { class: 'note-display' });
    var editor = el('div', { class: 'note-editor hidden' });
    var ta = el('textarea', { class: 'note-textarea', rows: '3', placeholder: t('notePlaceholder') });

    function refresh() {
      var text = window.Notes.get(sceneId, index);
      clear(display);
      if (text) {
        display.classList.remove('hidden');
        display.appendChild(el('div', { class: 'note-label' }, ['📝 ' + t('myNote')]));
        display.appendChild(el('div', { class: 'note-text' }, [text]));
        toggleBtn.textContent = '✏️ ' + t('editNote');
      } else {
        display.classList.add('hidden');
        toggleBtn.textContent = '📝 ' + t('addNote');
      }
    }
    function updateEditorButtons() {
      var hasText = ta.value.trim().length > 0;
      saveBtn.classList.toggle('hidden', !hasText);              // 有输入才显示保存
      delBtn.classList.toggle('hidden', !window.Notes.has(sceneId, index)); // 有已存笔记才显示删除
    }
    function openEditor(e) {
      if (e) e.stopPropagation();
      ta.value = window.Notes.get(sceneId, index);
      editor.classList.remove('hidden');
      display.classList.add('hidden');
      toggleBtn.classList.add('hidden');
      updateEditorButtons();
      ta.focus();
    }
    function closeEditor() {
      editor.classList.add('hidden');
      toggleBtn.classList.remove('hidden');
      refresh();
    }

    toggleBtn.addEventListener('click', openEditor);
    display.addEventListener('click', openEditor);

    var saveBtn = el('button', { class: 'note-save' }, [t('save')]);
    saveBtn.addEventListener('click', function (e) { e.stopPropagation(); window.Notes.set(sceneId, index, ta.value); closeEditor(); });
    var delBtn = el('button', { class: 'note-del' }, [t('del')]);
    delBtn.addEventListener('click', function (e) { e.stopPropagation(); window.Notes.remove(sceneId, index); closeEditor(); });
    var cancelBtn = el('button', { class: 'note-cancel' }, [t('cancel')]);
    cancelBtn.addEventListener('click', function (e) { e.stopPropagation(); closeEditor(); });

    ta.addEventListener('input', updateEditorButtons);

    editor.appendChild(ta);
    editor.appendChild(el('div', { class: 'note-actions' }, [saveBtn, delBtn, cancelBtn]));

    wrap.appendChild(toggleBtn);
    wrap.appendChild(display);
    wrap.appendChild(editor);
    refresh();
    return wrap;
  }

  function buildControls(scene) {
    var linesRef = null;

    // 可朗读的对话行（跳过分节标题）在 dialogue 中的原始下标
    var playable = [];
    (scene.dialogue || []).forEach(function (d, i) { if (d.en) playable.push(i); });

    // ---- 逐句练习播放器状态 ----
    var pos = 0;              // 指向 playable 的下标（第几句）
    var loopOne = false;     // 单句循环开关
    var gen = 0;             // 代际守卫：新操作让旧的播放回调失效
    var singlePlaying = false;
    var playLineBtn;         // 前置声明，updateLineBtn 会用到

    function highlight(dialogueIdx, speaking) {
      if (!linesRef) return;
      linesRef.querySelectorAll('.turn.speaking').forEach(function (n) { n.classList.remove('speaking'); });
      linesRef.querySelectorAll('.turn.current').forEach(function (n) { n.classList.remove('current'); });
      var cur = linesRef.querySelector('.turn[data-index="' + dialogueIdx + '"]');
      if (cur) {
        cur.classList.add('current');
        if (speaking) cur.classList.add('speaking');
        cur.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }

    function updateLineBtn() {
      if (!playLineBtn) return;
      playLineBtn.textContent = singlePlaying ? ('⏹ ' + t('stopLine')) : ('▶ ' + t('playLine'));
      playLineBtn.classList.toggle('active', singlePlaying);
    }

    function playCurrent() {
      if (!playable.length) return;
      resetPlayAll();                 // 与“连读全部”互斥
      gen++; var myGen = gen; singlePlaying = true; updateLineBtn();
      var di = playable[pos];
      highlight(di, true);
      window.Speech.speak(scene.dialogue[di].en, function () {
        if (myGen !== gen) return;    // 已被新操作取代，忽略
        if (loopOne) {
          setTimeout(function () { if (myGen === gen) playCurrent(); }, 500);
        } else {
          singlePlaying = false; highlight(di, false); updateLineBtn();
        }
      });
    }
    function stopSingle() { gen++; singlePlaying = false; window.Speech.stop(); updateLineBtn(); }
    function toggleSingle() { if (singlePlaying) stopSingle(); else playCurrent(); }
    function goPrev() { if (pos > 0) pos--; playCurrent(); }
    function goNext() { if (pos < playable.length - 1) pos++; playCurrent(); }
    function playDialogueIdx(di) { var p = playable.indexOf(di); if (p >= 0) { pos = p; playCurrent(); } }

    // ---- 连读全部 ----
    var playAllBtn = el('button', { class: 'ctrl-btn primary' }, ['▶ ' + t('playAll')]);
    var playingAll = false;
    function resetPlayAll() {
      playingAll = false;
      playAllBtn.textContent = '▶ ' + t('playAll');
      playAllBtn.classList.remove('active');
    }
    playAllBtn.addEventListener('click', function () {
      if (playingAll) { window.Speech.stop(); resetPlayAll(); return; }
      stopSingle();
      playingAll = true;
      playAllBtn.textContent = '⏹ ' + t('stop');
      playAllBtn.classList.add('active');
      var sentences = playable.map(function (i) { return scene.dialogue[i].en; });
      window.Speech.speakSequence(sentences, function (seqIdx) {
        pos = seqIdx;                 // 让“上一句/下一句”从当前进度接续
        highlight(playable[seqIdx], true);
      }, function () {
        resetPlayAll();
        var di = playable[pos]; if (di != null) highlight(di, false);
      });
    });

    // ---- 显示/隐藏中文 ----
    var transBtn = el('button', { class: 'ctrl-btn' + (showTranslation ? ' active' : '') },
      [showTranslation ? t('hideTranslation') : t('showTranslation')]);
    transBtn.addEventListener('click', function () {
      showTranslation = !showTranslation;
      transBtn.textContent = showTranslation ? t('hideTranslation') : t('showTranslation');
      transBtn.classList.toggle('active', showTranslation);
      if (linesRef) linesRef.querySelectorAll('.bubble-zh').forEach(function (n) { n.classList.toggle('hidden', !showTranslation); });
    });

    // ---- 逐句练习：上一句 / 本句 / 下一句 / 单句循环 ----
    var prevBtn = el('button', { class: 'ctrl-btn icon', title: t('prevLine') }, ['⏮']);
    prevBtn.addEventListener('click', goPrev);
    playLineBtn = el('button', { class: 'ctrl-btn' }, ['▶ ' + t('playLine')]);
    playLineBtn.addEventListener('click', toggleSingle);
    var nextBtn = el('button', { class: 'ctrl-btn icon', title: t('nextLine') }, ['⏭']);
    nextBtn.addEventListener('click', goNext);
    var loopBtn = el('button', { class: 'ctrl-btn' }, ['🔁 ' + t('loopOne')]);
    loopBtn.addEventListener('click', function () {
      loopOne = !loopOne;
      loopBtn.classList.toggle('active', loopOne);
      if (loopOne && !singlePlaying) playCurrent();   // 打开时立即开始循环当前句
    });

    // ---- 语音选择器 ----
    var voiceSel = el('select', { class: 'ctrl-select', title: t('voice') });
    function fillVoices(list) {
      clear(voiceSel);
      if (!list || !list.length) {
        voiceSel.appendChild(el('option', { value: '' }, [pick({ zh: '默认语音', en: 'Default voice' })]));
        return;
      }
      var cur = window.Speech.getVoiceName();
      var curStillValid = false;
      list.forEach(function (v) {
        var label = v.name.replace(/ - .*/, '').replace(/^Google /, '') + ' · ' + v.lang;
        var opt = el('option', { value: v.name }, [label]);
        if (v.name === cur) { opt.selected = true; curStillValid = true; }
        voiceSel.appendChild(opt);
      });
      // 没选过、或之前选的已被过滤掉：默认选第一（最自然的）
      if ((!cur || !curStillValid) && list[0]) { window.Speech.setVoiceName(list[0].name); voiceSel.value = list[0].name; }
    }
    window.Speech.onVoicesReady(fillVoices);
    voiceSel.addEventListener('change', function () { window.Speech.setVoiceName(voiceSel.value); });

    // ---- 语速 ----
    var rateVal = el('span', { class: 'ctrl-val' }, [window.Speech.getRate().toFixed(2) + 'x']);
    var rate = el('input', { type: 'range', min: '0.5', max: '1.2', step: '0.05',
      value: String(window.Speech.getRate()), class: 'ctrl-range' });
    rate.addEventListener('input', function () {
      window.Speech.setRate(parseFloat(rate.value));
      rateVal.textContent = parseFloat(rate.value).toFixed(2) + 'x';
    });

    var node = el('div', { class: 'controls' }, [
      el('div', { class: 'ctrl-row' }, [playAllBtn, transBtn]),
      el('div', { class: 'ctrl-row secondary' }, [
        el('span', { class: 'ctrl-label' }, ['🎧 ' + t('practice')]),
        prevBtn, playLineBtn, nextBtn, loopBtn
      ]),
      el('div', { class: 'ctrl-row secondary' }, [
        el('div', { class: 'ctrl-group grow' }, [
          el('span', { class: 'ctrl-label' }, ['🎙 ' + t('voice')]), voiceSel
        ]),
        el('div', { class: 'ctrl-group' }, [
          el('span', { class: 'ctrl-label' }, [t('speed')]), rate, rateVal
        ])
      ])
    ]);

    return {
      node: node,
      bind: function (lines) { linesRef = lines; },
      player: { playDialogueIdx: playDialogueIdx }
    };
  }

  // ---------- 复习中心（生词本 + 笔记） ----------
  var reviewTab = 'words'; // 'words' | 'notes'

  function renderReview() {
    closeWordCard();
    currentScene = null;
    clear(app);

    app.appendChild(el('div', { class: 'scene-top' }, [
      el('a', { class: 'btn-ghost', href: '#/' }, ['← ' + t('backHome')]),
      el('div', { class: 'scene-title-block' }, [el('h1', {}, ['📚 ' + t('reviewCenter')])])
    ]));

    var body = el('div', { class: 'review-body' });

    var tabs = el('div', { class: 'tabs review-tabs' });
    [
      { key: 'words', label: '⭐ ' + t('tabWords'), count: window.WordBook.count() },
      { key: 'notes', label: '📝 ' + t('tabNotes'), count: window.Notes.count() }
    ].forEach(function (td) {
      var tab = el('button', { class: 'tab' + (reviewTab === td.key ? ' active' : '') }, [
        el('span', {}, [td.label]),
        el('span', { class: 'tab-count' }, [String(td.count)])
      ]);
      tab.addEventListener('click', function () {
        reviewTab = td.key;
        tabs.querySelectorAll('.tab').forEach(function (n) { n.classList.remove('active'); });
        tab.classList.add('active');
        renderReviewBody(body);
      });
      tabs.appendChild(tab);
    });

    app.appendChild(tabs);
    app.appendChild(body);
    renderReviewBody(body);
  }

  function renderReviewBody(body) {
    clear(body);
    if (reviewTab === 'notes') renderNotesList(body);
    else renderWordList(body);
  }

  function renderWordList(body) {
    var items = window.WordBook.list();
    if (!items.length) {
      body.appendChild(el('div', { class: 'empty-state' }, [
        el('div', { class: 'empty-emoji' }, ['⭐']),
        el('p', {}, [t('wordbookEmpty')])
      ]));
      return;
    }
    var listEl = el('div', { class: 'wb-list' });
    items.forEach(function (e) {
      var row = el('div', { class: 'wb-item' }, [
        el('div', { class: 'wb-main' }, [
          el('div', { class: 'wb-word-line' }, [
            el('span', { class: 'wb-word' }, [e.word]),
            e.phonetic ? el('span', { class: 'wb-phon' }, [e.phonetic]) : null,
            el('button', { class: 'btn-speak', title: '朗读', onclick: function () { window.Speech.speak(e.word); } }, ['🔊'])
          ]),
          e.meaning ? el('div', { class: 'wb-meaning' }, [e.meaning]) : null,
          e.scene ? el('div', { class: 'wb-scene' }, [t('fromScene') + ' ' + e.scene]) : null
        ]),
        el('button', { class: 'wb-remove', title: t('removeWord'), onclick: function () {
          window.WordBook.remove(e.word);
          renderReviewBody(body);
        } }, ['🗑'])
      ]);
      listEl.appendChild(row);
    });
    body.appendChild(listEl);
  }

  function renderNotesList(body) {
    var items = window.Notes.all();
    if (!items.length) {
      body.appendChild(el('div', { class: 'empty-state' }, [
        el('div', { class: 'empty-emoji' }, ['📝']),
        el('p', {}, [t('notesEmpty')])
      ]));
      return;
    }
    // 按场景归组
    items.sort(function (a, b) { return a.sceneId === b.sceneId ? a.index - b.index : a.sceneId.localeCompare(b.sceneId); });

    var listEl = el('div', { class: 'wb-list' });
    items.forEach(function (n) {
      var scene = getScene(n.sceneId);
      var line = scene && scene.dialogue ? scene.dialogue[n.index] : null;
      var row = el('div', { class: 'nb-item' }, [
        scene ? el('div', { class: 'nb-scene' }, [(scene.icon || '') + ' ' + pick(scene.title)]) : el('div', { class: 'nb-scene' }, [n.sceneId]),
        line && line.en ? el('div', { class: 'nb-line' }, [
          el('span', { class: 'nb-en' }, [line.en]),
          el('button', { class: 'btn-speak', title: '朗读', onclick: function () { window.Speech.speak(line.en); } }, ['🔊'])
        ]) : null,
        line && line.zh ? el('div', { class: 'nb-zh' }, [line.zh]) : null,
        el('div', { class: 'nb-note' }, [el('span', { class: 'nb-note-label' }, ['📝 ']), n.text]),
        el('div', { class: 'nb-actions' }, [
          el('a', { class: 'nb-link', href: '#/scene/' + n.sceneId + '/' + n.index }, ['→ ' + t('goToLine')]),
          el('button', { class: 'wb-remove', title: t('removeWord'), onclick: function () {
            window.Notes.remove(n.sceneId, n.index);
            renderReviewBody(body);
          } }, ['🗑'])
        ])
      ]);
      listEl.appendChild(row);
    });
    body.appendChild(listEl);
  }

  // ---------- 路由 ----------
  function router() {
    var hash = location.hash || '#/';
    window.Speech.stop();
    closeWordCard();
    if (hash.indexOf('#/scene/') === 0) {
      var rest = hash.slice('#/scene/'.length).split('/');
      renderScene(rest[0], rest[1]);
    } else if (hash.indexOf('#/review') === 0 || hash.indexOf('#/wordbook') === 0) {
      renderReview();
    } else {
      renderHome();
    }
    window.scrollTo(0, 0);
  }

  document.getElementById('langToggle').addEventListener('click', function () { window.I18N.toggleLang(); });
  window.I18N.onChange(function (lang) { showTranslation = (lang === 'zh'); router(); });
  window.addEventListener('hashchange', router);

  // 复习中心数量角标（生词 + 笔记）
  function updateReviewCount() {
    var n = document.getElementById('reviewCount');
    if (n) n.textContent = String(window.WordBook.count() + window.Notes.count());
  }
  window.WordBook.onChange(updateReviewCount);
  window.Notes.onChange(updateReviewCount);
  updateReviewCount();

  window.I18N.applyStaticText();
  router();
})();
