/**
 * check-content.mjs — 内容自检脚本
 * 加完/改完场景后运行：node tools/check-content.mjs
 * 检查清单与场景文件是否一致、字段是否齐全、roleKey 是否合法等。
 * 有错误时退出码为 1（方便 CI / 提交前拦截）。
 */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SCENES_DIR = path.join(ROOT, 'data', 'scenes');

const errors = [];
const warnings = [];
const err = (m) => errors.push(m);
const warn = (m) => warnings.push(m);

// 在一个带 window 的沙箱里执行数据文件
const sandbox = { window: {}, console };
vm.createContext(sandbox);
function run(file) {
  const code = fs.readFileSync(file, 'utf8');
  vm.runInContext(code, sandbox, { filename: file });
}

// 1) 载入清单
const indexFile = path.join(ROOT, 'data', 'scenes-index.js');
if (!fs.existsSync(indexFile)) { console.error('✗ 缺少 data/scenes-index.js'); process.exit(1); }
run(indexFile);
const index = sandbox.window.RTE_INDEX;
if (!index || !Array.isArray(index.categories)) {
  console.error('✗ data/scenes-index.js 未正确定义 window.RTE_INDEX.categories');
  process.exit(1);
}

// 2) 校验分类，收集登记的 sceneIds
const registered = [];
index.categories.forEach((c, i) => {
  const where = `分类[${i}]${c && c.key ? '(' + c.key + ')' : ''}`;
  if (!c.key) err(`${where}: 缺少 key`);
  if (!c.name || !c.name.zh || !c.name.en) err(`${where}: name 需要 {zh,en}`);
  if (!c.icon) warn(`${where}: 建议加 icon`);
  if (!Array.isArray(c.sceneIds)) { err(`${where}: sceneIds 必须是数组`); return; }
  c.sceneIds.forEach((id) => {
    if (registered.includes(id)) warn(`场景 id "${id}" 在清单里重复登记`);
    registered.push(id);
  });
});

// 3) 逐个加载并校验登记的场景
const KNOWN_ROLE_RIGHT = ['guest', 'me', 'self'];
registered.forEach((id) => {
  const file = path.join(SCENES_DIR, id + '.js');
  if (!fs.existsSync(file)) { err(`场景 "${id}": 找不到文件 data/scenes/${id}.js（文件名需与 id 一致）`); return; }
  try { run(file); } catch (e) { err(`场景 "${id}": 文件执行出错 —— ${e.message}`); return; }
  const s = (sandbox.window.RTE_SCENES || {})[id];
  if (!s) { err(`场景 "${id}": 文件里没有 window.RTE_SCENES['${id}']（检查文件内的 id 是否与文件名一致）`); return; }

  const P = `场景 "${id}"`;
  if (s.id !== id) err(`${P}: 内部 id "${s.id}" 与文件名/清单 "${id}" 不一致`);
  if (!s.title || !s.title.zh || !s.title.en) err(`${P}: title 需要 {zh,en}`);
  if (!s.scene || !s.scene.zh || !s.scene.en) err(`${P}: scene 需要 {zh,en}`);
  if (!s.icon) warn(`${P}: 建议加 icon`);
  if (s.minutes != null && typeof s.minutes !== 'number') warn(`${P}: minutes 建议为数字`);

  if (!Array.isArray(s.vocabulary)) err(`${P}: vocabulary 必须是数组`);
  else s.vocabulary.forEach((v, i) => {
    if (!v.word) err(`${P}: vocabulary[${i}] 缺少 word`);
    if (!v.meaning || (typeof v.meaning === 'object' && !v.meaning.zh && !v.meaning.en))
      err(`${P}: vocabulary[${i}] (${v.word || '?'}) 缺少 meaning{zh,en}`);
  });

  if (!Array.isArray(s.dialogue)) err(`${P}: dialogue 必须是数组`);
  else {
    let realLines = 0;
    s.dialogue.forEach((d, i) => {
      if (d.divider) {
        if (!d.divider.zh || !d.divider.en) warn(`${P}: dialogue[${i}] divider 建议 {zh,en}`);
        return;
      }
      realLines++;
      if (!d.roleKey) err(`${P}: dialogue[${i}] 缺少 roleKey`);
      if (!d.role || !d.role.zh || !d.role.en) err(`${P}: dialogue[${i}] role 需要 {zh,en}`);
      if (!d.en) err(`${P}: dialogue[${i}] 缺少英文台词 en`);
      if (!d.zh) warn(`${P}: dialogue[${i}] 缺少中文翻译 zh`);
      if (d.roleKey && !KNOWN_ROLE_RIGHT.includes(d.roleKey)) {
        // 合法，但提示它会显示在左侧
      }
    });
    if (!realLines) err(`${P}: dialogue 里没有任何对话行`);
  }
});

// 4) 检查 data/scenes/ 下未被清单登记的“孤儿”文件
const files = fs.readdirSync(SCENES_DIR).filter((f) => f.endsWith('.js') && !f.startsWith('_'));
files.forEach((f) => {
  const id = f.replace(/\.js$/, '');
  if (!registered.includes(id)) warn(`data/scenes/${f} 未在 scenes-index.js 里登记，不会显示`);
});

// 输出结果
console.log(`\n检查了 ${registered.length} 个已登记场景。`);
warnings.forEach((w) => console.log('  ⚠️  ' + w));
if (errors.length) {
  errors.forEach((e) => console.log('  ✗  ' + e));
  console.log(`\n✗ 发现 ${errors.length} 个错误，请修复后再提交。\n`);
  process.exit(1);
}
console.log(`\n✓ 内容检查通过${warnings.length ? '（有 ' + warnings.length + ' 条提醒）' : ''}。\n`);
