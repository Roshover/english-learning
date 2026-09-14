/**
 * dict.js — 单词查询
 * lookupLocal：先查场景词汇，再查通用词库（离线、即时）。
 * fetchOnline：本地查不到时，调用免费词典 API（HTTPS、无需 key）补英文释义。
 */
(function () {
  'use strict';

  // 把一个词还原成几个可能的原形，用于匹配词库
  function variants(raw) {
    var w = String(raw || '').toLowerCase().replace(/[^a-z']/g, '');
    if (!w) return [];
    var arr = [w];
    if (w.length > 3 && /ies$/.test(w)) arr.push(w.slice(0, -3) + 'y');
    if (w.length > 3 && /(ches|shes|xes|ses|zes)$/.test(w)) arr.push(w.slice(0, -2));
    if (w.length > 2 && /s$/.test(w) && !/ss$/.test(w)) arr.push(w.slice(0, -1));
    if (w.length > 3 && /ed$/.test(w)) { arr.push(w.slice(0, -2)); arr.push(w.slice(0, -1)); }
    if (w.length > 4 && /ing$/.test(w)) { arr.push(w.slice(0, -3)); arr.push(w.slice(0, -3) + 'e'); }
    // 去重
    return arr.filter(function (v, i, a) { return v && a.indexOf(v) === i; });
  }

  function matchVocab(sceneVocab, v) {
    if (!sceneVocab) return null;
    for (var i = 0; i < sceneVocab.length; i++) {
      var word = (sceneVocab[i].word || '').toLowerCase();
      if (word === v || word.split(' ')[0] === v) return sceneVocab[i];
    }
    return null;
  }

  /** 本地查询：返回统一结构或 null */
  function lookupLocal(raw, sceneVocab) {
    var vs = variants(raw);
    var glossary = window.RTE_GLOSSARY || {};
    var vocabHit = null, glossHit = null;
    for (var i = 0; i < vs.length; i++) {
      if (!vocabHit) vocabHit = matchVocab(sceneVocab, vs[i]);
      if (!glossHit) glossHit = glossary[vs[i]] || null;
    }
    if (!vocabHit && !glossHit) return null;
    return {
      word: (vocabHit && vocabHit.word) || (glossHit && glossHit.word) || String(raw),
      phonetic: (vocabHit && vocabHit.phonetic) || (glossHit && glossHit.phonetic) || '',
      pos: (vocabHit && vocabHit.pos) || (glossHit && glossHit.pos) || '',
      meaning: (vocabHit && vocabHit.meaning) || (glossHit && glossHit.meaning) || null,
      example: (vocabHit && vocabHit.example) || (glossHit && glossHit.example) || '',
      collocations: (glossHit && glossHit.collocations) || (vocabHit && vocabHit.collocations) || [],
      source: vocabHit ? 'vocab' : 'glossary'
    };
  }

  /** 在线查询（英文释义）：返回 {word, phonetic, defs:[{pos,def,example}]} 或 null */
  function fetchOnline(raw) {
    var w = String(raw || '').toLowerCase().replace(/[^a-z']/g, '');
    if (!w) return Promise.resolve(null);
    var url = 'https://api.dictionaryapi.dev/api/v2/entries/en/' + encodeURIComponent(w);
    return fetch(url).then(function (r) {
      if (!r.ok) return null;
      return r.json();
    }).then(function (data) {
      if (!Array.isArray(data) || !data.length) return null;
      var e = data[0];
      var phon = e.phonetic || '';
      if (!phon && Array.isArray(e.phonetics)) {
        var p = e.phonetics.filter(function (x) { return x && x.text; })[0];
        if (p) phon = p.text;
      }
      var defs = [];
      (e.meanings || []).forEach(function (m) {
        (m.definitions || []).slice(0, 1).forEach(function (d) {
          defs.push({ pos: m.partOfSpeech || '', def: d.definition || '', example: d.example || '' });
        });
      });
      return { word: e.word || w, phonetic: phon, defs: defs.slice(0, 3) };
    }).catch(function () {
      return null; // 离线或出错：安静失败，卡片会提示“未收录”
    });
  }

  window.Dict = { lookupLocal: lookupLocal, fetchOnline: fetchOnline };
})();
