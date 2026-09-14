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

  // 从下载生成的大词典（ECDICT 子集）里查一个变体，含词形还原
  function matchDict(v) {
    var dict = window.RTE_DICT;
    if (!dict) return null;
    var hit = dict[v];
    if (!hit && window.RTE_DICT_FORMS && window.RTE_DICT_FORMS[v]) hit = dict[window.RTE_DICT_FORMS[v]];
    if (!hit) return null;
    // 生成格式为数组 [phonetic, translation]
    return { phonetic: hit[0] || '', meaning: { zh: hit[1] || '' } };
  }

  /** 本地查询：场景词汇 → glossary.js → common-words.js → 大词典(dict-core.js)。返回统一结构或 null */
  function lookupLocal(raw, sceneVocab) {
    var vs = variants(raw);
    var glossary = window.RTE_GLOSSARY || {};
    var common = window.RTE_COMMON || {};
    var vocabHit = null, glossHit = null, commonHit = null, dictHit = null;
    for (var i = 0; i < vs.length; i++) {
      if (!vocabHit) vocabHit = matchVocab(sceneVocab, vs[i]);
      if (!glossHit) glossHit = glossary[vs[i]] || null;
      if (!commonHit && typeof common[vs[i]] === 'string') commonHit = { meaning: { zh: common[vs[i]] } };
      if (!dictHit) dictHit = matchDict(vs[i]);
    }
    if (!vocabHit && !glossHit && !commonHit && !dictHit) return null;
    var rich = vocabHit || glossHit;
    return {
      word: (rich && rich.word) || String(raw).replace(/[^A-Za-z'-]/g, ''),
      phonetic: (rich && rich.phonetic) || (dictHit && dictHit.phonetic) || '',
      pos: (rich && rich.pos) || '',
      meaning: (rich && rich.meaning) || (commonHit && commonHit.meaning) || (dictHit && dictHit.meaning) || null,
      example: (rich && rich.example) || '',
      collocations: (glossHit && glossHit.collocations) || (vocabHit && vocabHit.collocations) || [],
      source: vocabHit ? 'vocab' : (glossHit ? 'glossary' : (commonHit ? 'common' : 'dict'))
    };
  }

  // ---- 大词典懒加载：首次点词时才加载 data/dict-core.js（若不存在则安静跳过） ----
  var dictState = 'idle'; // idle | loading | done
  var dictPromise = null;
  function ensureDict() {
    if (dictState === 'done') return Promise.resolve();
    if (dictPromise) return dictPromise;
    if (window.RTE_DICT) { dictState = 'done'; return Promise.resolve(); }
    dictState = 'loading';
    dictPromise = new Promise(function (resolve) {
      var s = document.createElement('script');
      s.src = 'data/dict-core.js';
      s.async = true;
      s.onload = function () { dictState = 'done'; resolve(); };
      s.onerror = function () { dictState = 'done'; resolve(); }; // 没生成词典文件也不报错
      document.head.appendChild(s);
    });
    return dictPromise;
  }
  function dictReady() { return dictState === 'done' || !!window.RTE_DICT; }

  // 源 1：MyMemory 翻译（免费无 key，给中文释义），支持 CORS
  function fetchChinese(w) {
    var url = 'https://api.mymemory.translated.net/get?q=' + encodeURIComponent(w) + '&langpair=en|zh-CN';
    return fetch(url).then(function (r) { return r.ok ? r.json() : null; }).then(function (d) {
      if (d && d.responseData && d.responseData.translatedText) {
        var txt = String(d.responseData.translatedText).trim();
        // 过滤掉“翻译失败/原样返回”的无效结果
        if (!txt || txt.toLowerCase() === w.toLowerCase()) return null;
        if (/NO QUERY SPECIFIED|INVALID|MYMEMORY WARNING/i.test(txt)) return null;
        return txt;
      }
      return null;
    }).catch(function () { return null; });
  }

  // 源 2：免费英文词典（音标 + 英文释义），支持 CORS
  function fetchEnglish(w) {
    var url = 'https://api.dictionaryapi.dev/api/v2/entries/en/' + encodeURIComponent(w);
    return fetch(url).then(function (r) { return r.ok ? r.json() : null; }).then(function (data) {
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
    }).catch(function () { return null; });
  }

  /** 只取一个英文例句（给本地词典命中的词补例句用）。无网/无例句返回 null */
  function fetchExample(raw) {
    var w = String(raw || '').toLowerCase().replace(/[^a-z']/g, '');
    if (!w) return Promise.resolve(null);
    return fetchEnglish(w).then(function (en) {
      if (!en || !en.defs) return null;
      var d = en.defs.filter(function (x) { return x.example; })[0];
      return d ? d.example : null;
    }).catch(function () { return null; });
  }

  /** 在线查询：并行取中文翻译 + 英文释义，合并。返回 {word,phonetic,zh,defs[]} 或 null */
  function fetchOnline(raw) {
    var w = String(raw || '').toLowerCase().replace(/[^a-z']/g, '');
    if (!w) return Promise.resolve(null);
    return Promise.all([fetchChinese(w), fetchEnglish(w)]).then(function (res) {
      var zh = res[0], en = res[1];
      if (!zh && !en) return null;
      return {
        word: (en && en.word) || w,
        phonetic: (en && en.phonetic) || '',
        zh: zh || '',
        defs: (en && en.defs) || []
      };
    }).catch(function () { return null; });
  }

  window.Dict = {
    lookupLocal: lookupLocal,
    fetchOnline: fetchOnline,
    fetchExample: fetchExample,
    ensureDict: ensureDict,
    dictReady: dictReady
  };
})();
