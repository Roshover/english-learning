/**
 * speech.js — 基于浏览器原生 Web Speech API 的朗读封装
 * 免费、无需 API key、无需联网第三方服务。
 * 支持：单句朗读、单词朗读、整段连读、语速调节、英/美音切换。
 */
(function () {
  'use strict';

  var synth = window.speechSynthesis;
  var supported = !!synth && typeof window.SpeechSynthesisUtterance === 'function';

  var state = {
    rate: 0.9,          // 语速 0.5 - 1.2
    accent: 'US',       // 'US' | 'UK'
    voices: [],
    queue: [],          // 连读队列
    playingAll: false,
    onSentenceStart: null,   // 连读时高亮回调 (index)
    onAllDone: null
  };

  function loadVoices() {
    if (!supported) return;
    state.voices = synth.getVoices() || [];
  }
  if (supported) {
    loadVoices();
    // 部分浏览器语音表是异步加载的
    if (typeof synth.onvoiceschanged !== 'undefined') {
      synth.onvoiceschanged = loadVoices;
    }
  }

  /** 按口音挑选英语语音，挑不到就用系统默认英语 */
  function pickVoice() {
    if (!state.voices.length) loadVoices();
    var wantUK = state.accent === 'UK';
    var langPref = wantUK ? 'en-GB' : 'en-US';

    var byLang = state.voices.filter(function (v) { return v.lang === langPref; });
    if (byLang.length) return byLang[0];

    var byPrefix = state.voices.filter(function (v) {
      return v.lang && v.lang.toLowerCase().indexOf(wantUK ? 'en-gb' : 'en-us') === 0;
    });
    if (byPrefix.length) return byPrefix[0];

    var anyEn = state.voices.filter(function (v) { return v.lang && v.lang.toLowerCase().indexOf('en') === 0; });
    return anyEn.length ? anyEn[0] : null;
  }

  function makeUtterance(text) {
    var u = new SpeechSynthesisUtterance(text);
    u.rate = state.rate;
    u.pitch = 1;
    u.lang = state.accent === 'UK' ? 'en-GB' : 'en-US';
    var v = pickVoice();
    if (v) u.voice = v;
    return u;
  }

  /** 朗读单段文本（会打断当前朗读） */
  function speak(text) {
    if (!supported || !text) return;
    stop();
    synth.speak(makeUtterance(text));
  }

  /** 连读一组句子，每句开始时回调高亮 */
  function speakSequence(sentences, onSentenceStart, onAllDone) {
    if (!supported || !sentences || !sentences.length) return;
    stop();
    state.playingAll = true;
    state.onSentenceStart = onSentenceStart;
    state.onAllDone = onAllDone;

    var i = 0;
    function next() {
      if (!state.playingAll || i >= sentences.length) {
        state.playingAll = false;
        if (state.onAllDone) state.onAllDone();
        return;
      }
      var idx = i;
      var u = makeUtterance(sentences[idx]);
      u.onstart = function () {
        if (state.onSentenceStart) state.onSentenceStart(idx);
      };
      u.onend = function () { i++; next(); };
      u.onerror = function () { i++; next(); };
      synth.speak(u);
    }
    next();
  }

  function stop() {
    if (!supported) return;
    state.playingAll = false;
    synth.cancel();
  }

  function setRate(r) { state.rate = r; }
  function setAccent(a) { state.accent = (a === 'UK') ? 'UK' : 'US'; }
  function getRate() { return state.rate; }
  function getAccent() { return state.accent; }
  function isSupported() { return supported; }

  window.Speech = {
    speak: speak,
    speakSequence: speakSequence,
    stop: stop,
    setRate: setRate,
    setAccent: setAccent,
    getRate: getRate,
    getAccent: getAccent,
    isSupported: isSupported
  };
})();
