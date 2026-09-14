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
          onclick: function (e) { e.stopPropagation(); window.Speech.speak(p); }
        }, [p]));
      } else {
        frag.appendChild(document.createTextNode(p));
      }
    });
    return frag;
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
  function renderScene(id) {
    var s = getScene(id);
    if (!s) { location.hash = '#/'; return; }
    window.Speech.stop();
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

    // 控制条
    var controls = buildControls(s);
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
      el('div', { class: 'bubble', onclick: function () { window.Speech.speak(line.en); } },
        [enNode, zhNode])
    ]);
  }

  function buildControls(scene) {
    var linesRef = null;

    // 连读 / 停止
    var playBtn = el('button', { class: 'ctrl-btn primary' }, ['▶ ' + t('playAll')]);
    var playing = false;
    function resetPlay() {
      playing = false;
      playBtn.textContent = '▶ ' + t('playAll');
      playBtn.classList.remove('active');
      if (linesRef) linesRef.querySelectorAll('.turn.speaking').forEach(function (n) { n.classList.remove('speaking'); });
    }
    playBtn.addEventListener('click', function () {
      if (playing) { window.Speech.stop(); resetPlay(); return; }
      playing = true;
      playBtn.textContent = '■ ' + t('stop');
      playBtn.classList.add('active');
      // 只朗读真正的对话行，跳过分节标题
      var sentences = (scene.dialogue || []).filter(function (d) { return d.en; }).map(function (d) { return d.en; });
      // 建立“朗读序号 → dialogue 原始 index”的映射用于高亮
      var map = [];
      (scene.dialogue || []).forEach(function (d, i) { if (d.en) map.push(i); });
      window.Speech.speakSequence(sentences, function (seqIdx) {
        if (!linesRef) return;
        linesRef.querySelectorAll('.turn.speaking').forEach(function (n) { n.classList.remove('speaking'); });
        var cur = linesRef.querySelector('.turn[data-index="' + map[seqIdx] + '"]');
        if (cur) { cur.classList.add('speaking'); cur.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
      }, resetPlay);
    });

    // 显示/隐藏中文
    var transBtn = el('button', { class: 'ctrl-btn' + (showTranslation ? ' active' : '') },
      [showTranslation ? t('hideTranslation') : t('showTranslation')]);
    transBtn.addEventListener('click', function () {
      showTranslation = !showTranslation;
      transBtn.textContent = showTranslation ? t('hideTranslation') : t('showTranslation');
      transBtn.classList.toggle('active', showTranslation);
      if (linesRef) linesRef.querySelectorAll('.bubble-zh').forEach(function (n) { n.classList.toggle('hidden', !showTranslation); });
    });

    // 语音选择器
    var voiceSel = el('select', { class: 'ctrl-select', title: t('voice') });
    function fillVoices(list) {
      clear(voiceSel);
      if (!list || !list.length) {
        voiceSel.appendChild(el('option', { value: '' }, [pick({ zh: '默认语音', en: 'Default voice' })]));
        return;
      }
      var cur = window.Speech.getVoiceName();
      list.forEach(function (v) {
        var label = v.name.replace(/ - .*/, '') + ' · ' + v.lang;
        var opt = el('option', { value: v.name }, [label]);
        if (v.name === cur) opt.selected = true;
        voiceSel.appendChild(opt);
      });
      // 若用户没选过，默认选中排第一（最自然的那个）并写入
      if (!cur && list[0]) { window.Speech.setVoiceName(list[0].name); voiceSel.value = list[0].name; }
    }
    window.Speech.onVoicesReady(fillVoices);
    voiceSel.addEventListener('change', function () { window.Speech.setVoiceName(voiceSel.value); });

    // 语速
    var rateVal = el('span', { class: 'ctrl-val' }, [window.Speech.getRate().toFixed(1) + 'x']);
    var rate = el('input', { type: 'range', min: '0.5', max: '1.2', step: '0.05',
      value: String(window.Speech.getRate()), class: 'ctrl-range' });
    rate.addEventListener('input', function () {
      window.Speech.setRate(parseFloat(rate.value));
      rateVal.textContent = parseFloat(rate.value).toFixed(1) + 'x';
    });

    var node = el('div', { class: 'controls' }, [
      el('div', { class: 'ctrl-row' }, [
        playBtn, transBtn
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

    return { node: node, bind: function (lines) { linesRef = lines; } };
  }

  // ---------- 路由 ----------
  function router() {
    var hash = location.hash || '#/';
    window.Speech.stop();
    if (hash.indexOf('#/scene/') === 0) renderScene(hash.slice('#/scene/'.length));
    else renderHome();
    window.scrollTo(0, 0);
  }

  document.getElementById('langToggle').addEventListener('click', function () { window.I18N.toggleLang(); });
  window.I18N.onChange(function (lang) { showTranslation = (lang === 'zh'); router(); });
  window.addEventListener('hashchange', router);

  window.I18N.applyStaticText();
  router();
})();
