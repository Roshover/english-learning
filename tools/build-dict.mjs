/**
 * build-dict.mjs — 一次性构建离线词典
 *
 * 作用：下载开源词典 ECDICT（77 万词，含音标+中文+词频+词形变化），
 *       按词频过滤出最常用的一批，生成 ../data/dict-core.js。
 *       App 首次点词时会懒加载这个文件；你不用再手写单词。
 *
 * 用法（在项目根目录）：
 *     node tools/build-dict.mjs              # 默认取前 15000 高频词
 *     node tools/build-dict.mjs 30000        # 自定义词数
 *     node tools/build-dict.mjs 15000 ./ecdict.csv   # 用本地已下好的 CSV
 *
 * 需要 Node 18+（用到内置 fetch）。数据来源：github.com/skywind3000/ECDICT (MIT)。
 */
import fs from 'node:fs';
import path from 'node:path';
import https from 'node:https';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(__dirname, '../data/dict-core.js');
const CSV_URL = 'https://raw.githubusercontent.com/skywind3000/ECDICT/master/ecdict.csv';

const LIMIT = parseInt(process.argv[2], 10) || 15000;
const LOCAL_CSV = process.argv[3] || '';

function download(url) {
  return new Promise((resolve, reject) => {
    console.log('↓ 下载 ECDICT CSV（约 80MB，请稍候）…');
    const chunks = [];
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return download(res.headers.location).then(resolve, reject);
      }
      if (res.statusCode !== 200) return reject(new Error('HTTP ' + res.statusCode));
      let got = 0;
      res.on('data', (c) => { chunks.push(c); got += c.length; if (got % (8 * 1024 * 1024) < c.length) process.stdout.write('.'); });
      res.on('end', () => { console.log('\n✓ 下载完成 ' + (got / 1048576).toFixed(1) + 'MB'); resolve(Buffer.concat(chunks).toString('utf8')); });
    }).on('error', reject);
  });
}

// RFC4180 CSV 解析（生成器逐行产出）
function* parseCSV(text) {
  let field = '', row = [], i = 0, inQ = false;
  const n = text.length;
  while (i < n) {
    const c = text[i];
    if (inQ) {
      if (c === '"') { if (text[i + 1] === '"') { field += '"'; i += 2; continue; } inQ = false; i++; continue; }
      field += c; i++; continue;
    }
    if (c === '"') { inQ = true; i++; continue; }
    if (c === ',') { row.push(field); field = ''; i++; continue; }
    if (c === '\r') { i++; continue; }
    if (c === '\n') { row.push(field); yield row; row = []; field = ''; i++; continue; }
    field += c; i++;
  }
  if (field.length || row.length) { row.push(field); yield row; }
}

function cleanTranslation(t) {
  return String(t || '')
    .replace(/\\n/g, '；')      // ECDICT 用 \n 分隔多条释义
    .replace(/\s*；\s*/g, '；')
    .replace(/\s+/g, ' ')
    .replace(/；+/g, '；')
    .replace(/^；|；$/g, '')
    .trim();
}

async function main() {
  const csv = LOCAL_CSV ? fs.readFileSync(path.resolve(LOCAL_CSV), 'utf8') : await download(CSV_URL);

  console.log('⚙ 解析并按词频过滤…');
  const rows = parseCSV(csv);
  const header = rows.next().value;         // word,phonetic,definition,translation,pos,collins,oxford,tag,bnc,frq,exchange,detail,audio
  const col = {};
  header.forEach((h, idx) => { col[h.trim()] = idx; });

  const candidates = [];   // {word, phon, tr, rank, exchange}
  for (const r of rows) {
    const word = (r[col.word] || '').trim();
    if (!/^[a-zA-Z][a-zA-Z'-]*$/.test(word)) continue;     // 只要单个英文词，跳过词组/怪词
    const tr = cleanTranslation(r[col.translation]);
    if (!tr) continue;                                     // 必须有中文释义
    const bnc = parseInt(r[col.bnc], 10) || 0;
    const frq = parseInt(r[col.frq], 10) || 0;
    let rank = Math.min(bnc || Infinity, frq || Infinity);
    if (!isFinite(rank)) continue;                          // 无词频的丢弃（生僻，交给在线兜底）
    candidates.push({ word: word.toLowerCase(), phon: (r[col.phonetic] || '').trim(), tr, rank, exchange: r[col.exchange] || '' });
  }

  candidates.sort((a, b) => a.rank - b.rank);
  const picked = candidates.slice(0, LIMIT);

  const dict = {};
  const forms = {};
  const pickedSet = new Set(picked.map((p) => p.word));
  for (const p of picked) {
    if (!dict[p.word]) dict[p.word] = [p.phon, p.tr];
    // 解析词形变化 exchange： "p:did/d:done/i:doing/3:does/..." → 各变形指向原形
    if (p.exchange) {
      for (const seg of p.exchange.split('/')) {
        const m = seg.split(':');
        if (m.length === 2 && m[1]) {
          const form = m[1].trim().toLowerCase();
          if (form && form !== p.word && !pickedSet.has(form) && !forms[form]) forms[form] = p.word;
        }
      }
    }
  }

  const banner = '/* 自动生成，请勿手改。由 tools/build-dict.mjs 从 ECDICT 生成。词数：' + Object.keys(dict).length + ' */\n';
  const out = banner +
    'window.RTE_DICT=' + JSON.stringify(dict) + ';\n' +
    'window.RTE_DICT_FORMS=' + JSON.stringify(forms) + ';\n';
  fs.writeFileSync(OUT, out, 'utf8');

  const kb = (Buffer.byteLength(out) / 1024).toFixed(0);
  console.log('✓ 生成 ' + path.relative(process.cwd(), OUT));
  console.log('  词条：' + Object.keys(dict).length + '，词形映射：' + Object.keys(forms).length + '，文件：' + kb + 'KB');
  console.log('  （刷新网页，点对话里的单词即可用新词典）');
}

main().catch((e) => { console.error('✗ 构建失败：', e.message); process.exit(1); });
