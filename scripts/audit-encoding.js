#!/usr/bin/env node
/*
 Audita problemas de codificação:
 - Arquivos não UTF-8 válidos
 - Presença de BOM (EF BB BF)
 - Padrões típicos de mojibake (Ã, Â, â€…)
 - HTML sem <meta charset="utf-8">
 - CSS sem @charset "UTF-8";

 Uso:
   node scripts/audit-encoding.js [DIR]
   (se DIR não for passado, usa o diretório atual)
*/

const fs = require('fs');
const path = require('path');

const ROOT = process.argv[2] ? path.resolve(process.argv[2]) : process.cwd();

const exts = new Set(['.html', '.htm', '.css', '.js', '.mjs', '.ts', '.jsx', '.tsx', '.json', '.md', '.txt']);
const skipDirs = new Set(['node_modules', '.git', 'dist', 'build', '.next', '.cache']);

const suspicious = [
  'Ã', 'Â', 'â€', 'â€“', 'â€”', 'â€œ', 'â€', 'â€˜', 'â€™', 'ðŸ', '�'
];

function hasBOM(buf) {
  return buf.length >= 3 && buf[0] === 0xEF && buf[1] === 0xBB && buf[2] === 0xBF;
}

function isValidUTF8(buf) {
  try {
    new TextDecoder('utf-8', { fatal: true }).decode(buf);
    return true;
  } catch {
    return false;
  }
}

function readUtf8(buf) {
  try {
    return new TextDecoder('utf-8', { fatal: false }).decode(buf);
  } catch {
    return buf.toString('utf8');
  }
}

function htmlHasCharset(text) {
  const headStart = text.slice(0, 4096).toLowerCase();
  return headStart.includes('<meta charset="utf-8"') || headStart.includes('charset=utf-8');
}

function cssHasCharset(text) {
  const start = text.slice(0, 512);
  return /@charset\s+"?utf-8"?\s*;?/i.test(start);
}

function countSuspicious(text) {
  let count = 0;
  for (const s of suspicious) if (text.includes(s)) count++;
  return count;
}

const issues = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (skipDirs.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full);
    } else if (exts.has(path.extname(entry.name).toLowerCase())) {
      try {
        const buf = fs.readFileSync(full);
        const ext = path.extname(entry.name).toLowerCase();
        const fileIssues = [];
        const bom = hasBOM(buf);
        if (bom) fileIssues.push('hasBOM');
        const valid = isValidUTF8(buf);
        if (!valid) fileIssues.push('invalidUTF8');
        const text = readUtf8(buf);
        const susp = countSuspicious(text);
        if (susp > 0) fileIssues.push(`mojibakeMarkers:${susp}`);
        if (ext === '.html' || ext === '.htm') {
          if (!htmlHasCharset(text)) fileIssues.push('htmlMissingCharset');
        }
        if (ext === '.css') {
          if (!cssHasCharset(text)) fileIssues.push('cssMissingCharset');
        }
        if (fileIssues.length) {
          issues.push({ file: path.relative(ROOT, full), issues: fileIssues });
        }
      } catch (e) {
        issues.push({ file: path.relative(ROOT, full), issues: ['readError:' + e.message] });
      }
    }
  }
}

walk(ROOT);

if (!issues.length) {
  console.log('Nenhum problema de codificação encontrado em', ROOT);
  process.exit(0);
}

// Ordena por severidade simples
const order = (arr) => arr.sort((a, b) => b.issues.length - a.issues.length);
for (const { file, issues: list } of order(issues)) {
  console.log(file + ' -> ' + list.join(', '));
}

console.log('\nTotal de arquivos com alerta:', issues.length);

