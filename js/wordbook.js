/**
 * wordbook.js — 生词本（localStorage 持久化）
 * 每条：{ word, phonetic, meaning(中文字符串), scene, ts }
 */
(function () {
  'use strict';
  var KEY = 'rte_wordbook';
  var listeners = [];

  function read() {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; }
    catch (e) { return []; }
  }
  function write(arr) {
    localStorage.setItem(KEY, JSON.stringify(arr));
    listeners.forEach(function (fn) { fn(arr); });
  }
  function norm(w) { return String(w || '').trim().toLowerCase(); }

  function list() { return read(); }
  function count() { return read().length; }
  function has(word) {
    var k = norm(word);
    return read().some(function (e) { return norm(e.word) === k; });
  }
  function add(entry) {
    if (!entry || !entry.word) return;
    var arr = read();
    if (arr.some(function (e) { return norm(e.word) === norm(entry.word); })) return;
    arr.unshift({
      word: entry.word,
      phonetic: entry.phonetic || '',
      meaning: entry.meaning || '',
      scene: entry.scene || '',
      ts: Date.now()
    });
    write(arr);
  }
  function remove(word) {
    var k = norm(word);
    write(read().filter(function (e) { return norm(e.word) !== k; }));
  }
  /** 收藏/取消收藏，返回操作后的收藏状态 */
  function toggle(entry) {
    if (has(entry.word)) { remove(entry.word); return false; }
    add(entry); return true;
  }
  function onChange(fn) { listeners.push(fn); }

  window.WordBook = {
    list: list, count: count, has: has,
    add: add, remove: remove, toggle: toggle, onChange: onChange
  };
})();
