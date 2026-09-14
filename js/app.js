/**
 * app.js — 极简单页应用：hash 路由 + 渲染 + 交互
 * 无框架、无构建，直接跑在浏览器里。
 */
(function () {
  'use strict';

  var app = document.getElementById('app');
  var pick = window.I18N.pick;
  var t = window.I18N.t;

  // 每个场景页面的“显示中文”开关（默认跟随界面语言：中文界面显示，英文界面隐藏）
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

  function allScenesFlat() {
    var out = [];
    (window.RTE_INDEX.categories || []).forEach(function (cat) {
      cat.sceneIds.forEach(function (id) {
        var s = getScene(id);
        if (s) out.push(s);
      });
    });
    return out;
  }

  // 把英文句子拆成“可点击的单词”节点，保留标点
  function renderClickableEnglish(text) {
    var frag = document.createDocumentFragment();
    // 用正则把单词和非单词分开
    var parts = text.match(/[A-Za-z']+|[^A-Za-z']+/g) || [text];
    parts.forEach(function (p) {
      if (/[A-Za-z']/.test(p)) {
        frag.appendChild(el('span', {
          class: 'word',
          onclick: function (e) {
            e.stopPropagation();
            window.Speech.speak(p);
          }
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
    var totalScenes = allScenesFlat().length;

    app.appendChild(el('section', { class: 'hero' }, [
      el('h1', { class: 'hero-title' }, [t('homeHeadline')]),
      el('p', { class: 'hero-sub' }, [t('homeSub')]),
      window.Speech.isSupported() ? null :
        el('p', { class: 'warn' }, ['⚠️ ' + t('speechUnsupported')])
    ]));

    app.appendChild(el('h2', { class: 'section-title' }, [t('chooseScene')]));

    (window.RTE_INDEX.categories || []).forEach(function (cat) {
      var scenes = cat.sceneIds.map(getScene).filter(Boolean);

      var cards = scenes.length
        ? scenes.map(function (s) {
            return el('a', { class: 'scene-card', href: '#/scene/' + s.id, 'data-link': '' }, [
              el('div', { class: 'scene-icon' }, [s.icon || '💬']),
              el('div', { class: 'scene-meta' }, [
                el('h3', {}, [pick(s.title)]),
                el('p', {}, [pick(s.scene)]),
                el('span', { class: 'scene-tag' }, [
                  (s.vocabulary ? s.vocabulary.length : 0) + ' 词 · ' +
                  (s.minutes || 5) + ' ' + t('minutes')
                ])
              ])
            ]);
          })
        : [el('div', { class: 'empty' }, [pick({ zh: '敬请期待…', en: 'Coming soon…' })])];

      app.appendChild(el('section', { class: 'category' }, [
        el('div', { class: 'category-head' }, [
          el('span', { class: 'category-icon' }, [cat.icon]),
          el('div', {}, [
            el('h2', {}, [pick(cat.name)]),
            el('p', { class: 'category-desc' }, [pick(cat.desc)])
          ])
        ]),
        el('div', { class: 'scene-grid' }, cards)
      ]));
    });
  }

  // ---------- 场景页 ----------
  function renderScene(id) {
    var s = getScene(id);
    if (!s) { location.hash = '#/'; return; }
    window.Speech.stop();
    clear(app);

    // 顶部返回 + 标题
    app.appendChild(el('div', { class: 'scene-top' }, [
      el('a', { class: 'btn-ghost', href: '#/', 'data-link': '' }, ['← ' + t('backHome')]),
      el('div', { class: 'scene-title-block' }, [
        el('h1', {}, [ (s.icon || '') + ' ' + pick(s.title) ]),
        el('p', { class: 'scene-desc' }, [
          el('strong', {}, [t('sceneLabel') + '：']), pick(s.scene)
        ])
      ])
    ]));

    // 词汇预习
    var vocabItems = (s.vocabulary || []).map(function (v) {
      return el('div', { class: 'vocab-card' }, [
        el('div', { class: 'vocab-head' }, [
          el('span', { class: 'vocab-word' }, [v.word]),
          v.phonetic ? el('span', { class: 'vocab-phon' }, [v.phonetic]) : null,
          v.pos ? el('span', { class: 'vocab-pos' }, [v.pos]) : null,
          el('button', {
            class: 'btn-speak', title: '朗读',
            onclick: function () { window.Speech.speak(v.word + '. ' + (v.example || '')); }
          }, ['🔊'])
        ]),
        el('div', { class: 'vocab-meaning' }, [pick(v.meaning)]),
        v.example ? el('div', { class: 'vocab-example' }, [
          el('span', { class: 'ex-label' }, [t('example') + '：']),
          el('span', { class: 'ex-en' }, [v.example])
        ]) : null
      ]);
    });

    app.appendChild(el('section', { class: 'panel' }, [
      el('div', { class: 'panel-head' }, [
        el('h2', {}, ['📘 ' + t('vocabTitle')]),
        el('span', { class: 'panel-hint' }, [t('vocabHint')])
      ]),
      el('div', { class: 'vocab-grid' }, vocabItems)
    ]));

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
      lines.appendChild(renderLine(line, i));
    });
    dialogueWrap.appendChild(lines);
    app.appendChild(dialogueWrap);

    // 保存引用给控制条用
    controls.bind(lines, s);
  }

  function renderLine(line, index) {
    var side = line.roleKey === 'guest' ? 'right' : 'left';
    var enNode = el('div', { class: 'bubble-en' });
    enNode.appendChild(renderClickableEnglish(line.en));

    var speakBtn = el('button', {
      class: 'btn-speak inline', title: '朗读整句',
      onclick: function (e) { e.stopPropagation(); window.Speech.speak(line.en); }
    }, ['🔊']);
    enNode.appendChild(speakBtn);

    var zhNode = el('div', { class: 'bubble-zh' + (showTranslation ? '' : ' hidden') }, [line.zh]);

    return el('div', { class: 'turn ' + side, 'data-index': index }, [
      el('div', { class: 'turn-role' }, [pick(line.role)]),
      el('div', {
        class: 'bubble',
        onclick: function () { window.Speech.speak(line.en); }
      }, [enNode, zhNode])
    ]);
  }

  function buildControls(scene) {
    var linesRef = null;

    var transBtn = el('button', { class: 'ctrl-btn' + (showTranslation ? ' active' : '') },
      [showTranslation ? t('hideTranslation') : t('showTranslation')]);
    transBtn.addEventListener('click', function () {
      showTranslation = !showTranslation;
      transBtn.textContent = showTranslation ? t('hideTranslation') : t('showTranslation');
      transBtn.classList.toggle('active', showTranslation);
      if (linesRef) {
        linesRef.querySelectorAll('.bubble-zh').forEach(function (n) {
          n.classList.toggle('hidden', !showTranslation);
        });
      }
    });

    // 语速
    var rateVal = el('span', { class: 'ctrl-val' }, [window.Speech.getRate().toFixed(1) + 'x']);
    var rate = el('input', { type: 'range', min: '0.5', max: '1.2', step: '0.1',
      value: String(window.Speech.getRate()), class: 'ctrl-range' });
    rate.addEventListener('input', function () {
      window.Speech.setRate(parseFloat(rate.value));
      rateVal.textContent = parseFloat(rate.value).toFixed(1) + 'x';
    });

    // 口音
    var accentBtn = el('button', { class: 'ctrl-btn' },
      [window.Speech.getAccent() === 'UK' ? t('accentUK') : t('accentUS')]);
    accentBtn.addEventListener('click', function () {
      var next = window.Speech.getAccent() === 'US' ? 'UK' : 'US';
      window.Speech.setAccent(next);
      accentBtn.textContent = next === 'UK' ? t('accentUK') : t('accentUS');
    });

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
      var sentences = (scene.dialogue || []).map(function (d) { return d.en; });
      window.Speech.speakSequence(sentences, function (idx) {
        if (!linesRef) return;
        linesRef.querySelectorAll('.turn.speaking').forEach(function (n) { n.classList.remove('speaking'); });
        var cur = linesRef.querySelector('.turn[data-index="' + idx + '"]');
        if (cur) { cur.classList.add('speaking'); cur.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
      }, resetPlay);
    });

    var node = el('div', { class: 'controls' }, [
      el('div', { class: 'ctrl-group' }, [playBtn]),
      el('div', { class: 'ctrl-group' }, [transBtn]),
      el('div', { class: 'ctrl-group' }, [
        el('span', { class: 'ctrl-label' }, [t('accent')]), accentBtn
      ]),
      el('div', { class: 'ctrl-group' }, [
        el('span', { class: 'ctrl-label' }, [t('speed')]), rate, rateVal
      ])
    ]);

    return {
      node: node,
      bind: function (lines) { linesRef = lines; }
    };
  }

  // ---------- 路由 ----------
  function router() {
    var hash = location.hash || '#/';
    window.Speech.stop();
    if (hash.indexOf('#/scene/') === 0) {
      renderScene(hash.slice('#/scene/'.length));
    } else {
      renderHome();
    }
    window.scrollTo(0, 0);
  }

  // 语言按钮
  document.getElementById('langToggle').addEventListener('click', function () {
    window.I18N.toggleLang();
  });

  // 语言切换时：更新默认翻译显示 + 重渲染当前页
  window.I18N.onChange(function (lang) {
    showTranslation = (lang === 'zh');
    router();
  });

  // 拦截 data-link 的锚点（保持 SPA 行为，其实 hash 本身就够了）
  window.addEventListener('hashchange', router);

  // 初始化
  window.I18N.applyStaticText();
  router();
})();
