#!/usr/bin/env node
/**
 * Heals mojibake by reinterpreting current text as latin1 bytes and decoding as UTF-8,
 * iteratively, when typical artifacts are detected. Accepts optional root dir.
 *
 * Usage: node scripts/fix-encoding.js [DIR]
 */
const fs = require('fs');
const path = require('path');

const ROOT = process.argv[2] ? path.resolve(process.argv[2]) : process.cwd();
const exts = new Set(['.html', '.htm', '.js', '.mjs', '.css', '.md', '.json', '.txt']);
const suspiciousPatterns = [
  'Ã', 'Â', 'â€', 'â€“', 'â€”', 'â€œ', 'â€\u009d', 'â€˜', 'â€™', 'ðŸ', '�'
];

function isSuspicious(text) {
  return suspiciousPatterns.some(p => text.includes(p));
}

function heal(text) {
  const score = (s) => suspiciousPatterns.reduce((a, p) => a + (s.includes(p) ? 1 : 0), 0);
  let cur = text;
  let best = { s: cur, score: score(cur) };
  for (let i = 0; i < 3; i++) {
    try { cur = Buffer.from(cur, 'latin1').toString('utf8'); } catch { break; }
    const sc = score(cur);
    if (sc < best.score) best = { s: cur, score: sc };
  }
  return best.s;
}

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === '.git') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (exts.has(path.extname(entry.name).toLowerCase())) {
      try {
        const raw = fs.readFileSync(full, 'utf8');
        if (!isSuspicious(raw)) continue;
        const healed = heal(raw);
        if (healed !== raw) {
          fs.writeFileSync(full, healed, 'utf8');
          console.log('Healed:', path.relative(ROOT, full));
        }
      } catch (e) {
        console.warn('Skip (error):', full, e.message);
      }
    }
  }
}

walk(ROOT);
console.log('Done.');

