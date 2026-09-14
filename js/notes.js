/**
 * notes.js — 逐句学习笔记（localStorage 持久化）
 * 以「场景id : 句子序号」为 key，重新打开网页也能看到。
 */
(function () {
  'use strict';
  var KEY = 'rte_notes';

  var listeners = [];
  function read() {
    try { return JSON.parse(localStorage.getItem(KEY)) || {}; }
    catch (e) { return {}; }
  }
  function write(o) { localStorage.setItem(KEY, JSON.stringify(o)); listeners.forEach(function (fn) { fn(); }); }
  function k(sceneId, idx) { return sceneId + ':' + idx; }

  function get(sceneId, idx) { return read()[k(sceneId, idx)] || ''; }
  function has(sceneId, idx) { return !!read()[k(sceneId, idx)]; }
  function set(sceneId, idx, text) {
    var o = read();
    text = String(text || '').trim();
    if (text) o[k(sceneId, idx)] = text; else delete o[k(sceneId, idx)];
    write(o);
  }
  function remove(sceneId, idx) { var o = read(); delete o[k(sceneId, idx)]; write(o); }
  function countScene(sceneId) {
    var o = read(), n = 0, pre = sceneId + ':';
    for (var key in o) if (o.hasOwnProperty(key) && key.indexOf(pre) === 0) n++;
    return n;
  }
  function count() { return Object.keys(read()).length; }
  /** 列出全部笔记：[{sceneId, index, text}]（index 为数字） */
  function all() {
    var o = read(), out = [];
    for (var key in o) {
      if (!o.hasOwnProperty(key)) continue;
      var pos = key.lastIndexOf(':');
      out.push({ sceneId: key.slice(0, pos), index: parseInt(key.slice(pos + 1), 10), text: o[key] });
    }
    return out;
  }
  function onChange(fn) { listeners.push(fn); }

  window.Notes = {
    get: get, has: has, set: set, remove: remove,
    countScene: countScene, count: count, all: all, onChange: onChange
  };
})();
