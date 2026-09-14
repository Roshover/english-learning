/**
 * speech.js — 基于浏览器原生 Web Speech API 的朗读封装
 * 免费、无需 API key。核心：尽量挑选“自然/神经网络”语音，让声音更接近真人。
 *
 * 想要更像真人的声音（Mac）：
 *   系统设置 → 辅助功能 → 朗读内容 → 系统语音 → 管理语音…
 *   下载英语的「增强 / 高级 (Enhanced / Premium)」版本，例如 Ava、Zoe、Samantha、Evan。
 *   下载后刷新本页面，在“语音”下拉里即可选到。
 */
(function () {
  'use strict';

  var synth = window.speechSynthesis;
  var supported = !!synth && typeof window.SpeechSynthesisUtterance === 'function';

  var LS_VOICE = 'rte_voice';
  var LS_RATE = 'rte_rate';
  var LS_ACCENT = 'rte_accent';

  var state = {
    rate: parseFloat(localStorage.getItem(LS_RATE)) || 0.95,
    accent: localStorage.getItem(LS_ACCENT) || 'US',
    voiceName: localStorage.getItem(LS_VOICE) || '',
    voices: [],
    playingAll: false
  };

  var voicesReadyCbs = [];

  function loadVoices() {
    if (!supported) return;
    state.voices = (synth.getVoices() || []).filter(function (v) {
      return v.lang && v.lang.toLowerCase().indexOf('en') === 0; // 只保留英语语音
    });
    if (state.voices.length) {
      voicesReadyCbs.forEach(function (cb) { cb(getEnglishVoices()); });
    }
  }

  if (supported) {
    loadVoices();
    if (typeof synth.onvoiceschanged !== 'undefined') {
      synth.onvoiceschanged = loadVoices;
    }
    // 有些浏览器首帧拿不到，延迟再试
    setTimeout(loadVoices, 250);
    setTimeout(loadVoices, 1000);
  }

  // 给一个“自然度”评分，用于排序：数字越大越优先
  function naturalScore(v) {
    var n = (v.name || '').toLowerCase();
    var score = 0;
    if (/natural|neural/.test(n)) score += 100;      // Microsoft Natural / Neural
    if (/premium|enhanced/.test(n)) score += 90;      // Apple 高级/增强
    if (/online/.test(n)) score += 60;                // 云端音
    if (/google/.test(n)) score += 55;                // Google 语音较自然
    if (/siri/.test(n)) score += 50;
    // 常见较自然的 Apple 声音
    if (/ava|zoe|samantha|allison|evan|serena|daniel|kate|stephanie/.test(n)) score += 30;
    if (v.localService === false) score += 10;        // 云端通常更自然
    return score;
  }

  /** 返回排序后的英语语音列表（自然的排前面） */
  function getEnglishVoices() {
    var list = state.voices.slice();
    list.sort(function (a, b) {
      var d = naturalScore(b) - naturalScore(a);
      if (d !== 0) return d;
      return (a.name || '').localeCompare(b.name || '');
    });
    return list;
  }

  /** 挑选实际使用的语音：优先用户选的，其次按口音+自然度 */
  function pickVoice() {
    if (!state.voices.length) loadVoices();
    if (state.voiceName) {
      var chosen = state.voices.filter(function (v) { return v.name === state.voiceName; })[0];
      if (chosen) return chosen;
    }
    var wantUK = state.accent === 'UK';
    var pref = wantUK ? 'en-gb' : 'en-us';
    var byAccent = state.voices.filter(function (v) {
      return v.lang && v.lang.toLowerCase().indexOf(pref) === 0;
    });
    var pool = byAccent.length ? byAccent : state.voices;
    pool = pool.slice().sort(function (a, b) { return naturalScore(b) - naturalScore(a); });
    return pool[0] || null;
  }

  function makeUtterance(text) {
    var u = new SpeechSynthesisUtterance(text);
    u.rate = state.rate;
    u.pitch = 1;
    var v = pickVoice();
    if (v) { u.voice = v; u.lang = v.lang; }
    else { u.lang = state.accent === 'UK' ? 'en-GB' : 'en-US'; }
    return u;
  }

  function speak(text) {
    if (!supported || !text) return;
    stop();
    // Safari 有时需要先 resume
    try { synth.resume(); } catch (e) {}
    synth.speak(makeUtterance(text));
  }

  function speakSequence(sentences, onSentenceStart, onAllDone) {
    if (!supported || !sentences || !sentences.length) return;
    stop();
    state.playingAll = true;
    var i = 0;
    function next() {
      if (!state.playingAll || i >= sentences.length) {
        state.playingAll = false;
        if (onAllDone) onAllDone();
        return;
      }
      var idx = i;
      var u = makeUtterance(sentences[idx]);
      u.onstart = function () { if (onSentenceStart) onSentenceStart(idx); };
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

  function setRate(r) { state.rate = r; localStorage.setItem(LS_RATE, String(r)); }
  function setAccent(a) { state.accent = (a === 'UK') ? 'UK' : 'US'; localStorage.setItem(LS_ACCENT, state.accent); }
  function setVoiceName(name) { state.voiceName = name || ''; localStorage.setItem(LS_VOICE, state.voiceName); }
  function getRate() { return state.rate; }
  function getAccent() { return state.accent; }
  function getVoiceName() { return state.voiceName; }
  function isSupported() { return supported; }
  function onVoicesReady(cb) {
    voicesReadyCbs.push(cb);
    if (state.voices.length) cb(getEnglishVoices());
  }

  window.Speech = {
    speak: speak,
    speakSequence: speakSequence,
    stop: stop,
    setRate: setRate,
    setAccent: setAccent,
    setVoiceName: setVoiceName,
    getRate: getRate,
    getAccent: getAccent,
    getVoiceName: getVoiceName,
    getEnglishVoices: getEnglishVoices,
    onVoicesReady: onVoicesReady,
    isSupported: isSupported
  };
})();
