/**
 * wordstore.js — 用户自定义单词详情（localStorage 持久化）
 * 存储用户为每个单词手动添加的义项、例句、常用短语等。
 */
(function () {
  'use strict';
  var KEY = 'rte_wordstore';
  var listeners = [];

  function read() {
    try { return JSON.parse(localStorage.getItem(KEY)) || {}; }
    catch (e) { return {}; }
  }
  function write(o) {
    localStorage.setItem(KEY, JSON.stringify(o));
    listeners.forEach(function (fn) { fn(); });
  }

  /** 获取一个单词的完整数据，返回 {word, phonetic, zh, entries[]} 或 null */
  function get(word) { return read()[word.toLowerCase()] || null; }

  function has(word) { return !!read()[word.toLowerCase()]; }

  /** 保存/更新一个单词的完整数据 */
  function save(word, data) {
    var o = read();
    var key = word.toLowerCase();
    data.word = word;
    data.updatedAt = Date.now();
    if (!data.createdAt) {
      var old = o[key];
      data.createdAt = (old && old.createdAt) || Date.now();
    }
    o[key] = data;
    write(o);
  }

  function remove(word) {
    var o = read();
    delete o[word.toLowerCase()];
    write(o);
  }

  function count() { return Object.keys(read()).length; }

  /** 列出全部已保存的单词，按更新时间倒序 */
  function all() {
    var o = read();
    var arr = [];
    for (var key in o) {
      if (o.hasOwnProperty(key)) arr.push(o[key]);
    }
    arr.sort(function (a, b) { return (b.updatedAt || 0) - (a.updatedAt || 0); });
    return arr;
  }

  function onChange(fn) { listeners.push(fn); }

  window.WordStore = {
    get: get, has: has, save: save, remove: remove,
    count: count, all: all, onChange: onChange
  };
})();
