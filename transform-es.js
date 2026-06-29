#!/usr/bin/env node
/*
 * Transform Spanish phonetic field (`es`).
 *
 * Decisions (approved by user):
 *   - Long /ɯː/ marked as "üu" (length shown by doubling)
 *   - Tone mark goes directly on the "ü" when present
 *   - Consonant variation preserved (keep bp, dt, ch, etc.)
 *   - Only aspirated stops (ph/th/kh) get simplified
 *   - Hard g preserved: gi→gui, ge→gue
 *
 * Usage: node transform-es.js [--apply]
 */

const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, 'data.js');

const TONE_MARK = {
  m: '',
  l: '̀', // combining grave
  h: '́', // combining acute
  f: '̂', // combining circumflex
  r: '̌'  // combining caron
};

// Precomposed ü + tone mark (avoids double-stacking visually)
const U_TONE = {
  l: 'ǜ', // ü + grave
  h: 'ǘ', // ü + acute
  r: 'ǚ', // ü + caron
  // f has no precomposed; use ü + combining circumflex (handled inline)
};

const VOWELS = 'aeiouüAEIOUÜ';
const COMBINING = /[̀-ͯ]/g;

function stripMarks(s) {
  return s.normalize('NFD').replace(COMBINING, '');
}

/**
 * Transform a single syllable token.
 */
function transformSyllable(syl) {
  let s = stripMarks(syl);
  const isCap = /^[A-Z]/.test(s);

  // === VOWELS — order matters! Longer/more specific patterns first ===

  // 1) /ɯa/ triphthong (for เนื้อ, เครื่อง, เดื่อ, เพื่อน, เดือน etc.)
  s = s.replace(/uea/g, 'üa');
  s = s.replace(/ʉa/g, 'üa');
  s = s.replace(/ɯa/g, 'üa');

  // 2) /ɯː/ long (render as "üu") — must come BEFORE the short /ɯ/ rule
  // Sources: eu (kheun), ueu (súeu), uue (chûue), ʉu, ʉ̂u, ɯu
  s = s.replace(/uue/g, 'üu');
  s = s.replace(/ueu/g, 'üu');
  s = s.replace(/ʉuu/g, 'üu');
  s = s.replace(/ʉu/g, 'üu');
  s = s.replace(/ɯu/g, 'üu');
  s = s.replace(/eu/g, 'üu');

  // 3) /ɯ/ short → "ü"
  // Handles "ue" + consonant pattern (e.g., "nueng" for หนึ่ง, "dùuem" for ดื่ม)
  s = s.replace(/ue/g, 'ü');
  s = s.replace(/ʉ/g, 'ü');
  s = s.replace(/ɯ/g, 'ü');

  // 4) Other vowels
  s = s.replace(/ɛɛ/g, 'e').replace(/ɛ/g, 'e');
  s = s.replace(/ɔɔ/g, 'o').replace(/ɔ/g, 'o');
  s = s.replace(/ə/g, 'a');
  // Keep length markers (user wants length marked)
  s = s.replace(/ŋ/g, 'ng');

  // === ASPIRATED STOPS (Spanish has no aspiration) ===
  s = s.replace(/ph/g, 'p').replace(/th/g, 't').replace(/kh/g, 'k');

  // === SPANISH HARD G ===
  s = s.replace(/g([ie])/g, 'gu$1');

  if (isCap) {
    s = s.charAt(0).toUpperCase() + s.slice(1);
  }
  return s;
}

/**
 * Apply tone mark to a syllable. Tone prefers 'ü' over other vowels.
 * Handles the fact that NFD decomposes ü into u + combining diaeresis.
 */
function applyToneMark(syl, tone) {
  if (!tone || !TONE_MARK[tone] || tone === 'm') return syl;

  const decomp = syl.normalize('NFD');

  // 1) Look for "u + combining diaeresis" (= ü) without additional mark
  for (let i = 0; i < decomp.length; i++) {
    if (decomp[i].toLowerCase() !== 'u') continue;
    if (decomp[i + 1] !== '̈') continue; // combining diaeresis
    // Check if there's already a tone mark after the diaeresis
    const next2 = decomp[i + 2];
    if (next2 && /[̀-ͯ]/.test(next2)) continue;
    // Use precomposed if available (grave, acute, caron)
    if (U_TONE[tone]) {
      const cap = decomp[i] === 'U';
      const precomposed = cap ? U_TONE[tone].toUpperCase() : U_TONE[tone];
      return (decomp.slice(0, i) + precomposed + decomp.slice(i + 2)).normalize('NFC');
    }
    // Otherwise insert combining mark after the diaeresis (circumflex case)
    return (decomp.slice(0, i + 2) + TONE_MARK[tone] + decomp.slice(i + 2)).normalize('NFC');
  }

  // 2) Look for plain vowels (a, e, i, o, u) without combining mark
  for (const target of ['a', 'e', 'i', 'o', 'u']) {
    for (let i = 0; i < decomp.length; i++) {
      const ch = decomp[i].toLowerCase();
      if (ch !== target) continue;
      const next = decomp[i + 1];
      if (next && /[̀-ͯ]/.test(next)) continue;
      return (decomp.slice(0, i + 1) + TONE_MARK[tone] + decomp.slice(i + 1)).normalize('NFC');
    }
  }
  return syl;
}

function tokenizePhonetic(phonetic) {
  const tokens = [];
  const re = /[\p{L}]+|[\s\-_,\."]+/gu;
  let m;
  while ((m = re.exec(phonetic)) !== null) {
    tokens.push(m[0]);
  }
  return tokens;
}

function phoneticToEs(phonetic, tone) {
  if (!phonetic) return phonetic;
  const tokens = tokenizePhonetic(phonetic);
  const tones = tone ? tone.split(/[\s,\-]+/).filter(Boolean) : [];
  let toneIdx = 0;
  let out = '';
  for (const tok of tokens) {
    if (/^[\p{L}]+$/u.test(tok)) {
      let s = transformSyllable(tok);
      if (toneIdx < tones.length) {
        s = applyToneMark(s, tones[toneIdx]);
        toneIdx++;
      }
      out += s;
    } else {
      out += tok;
    }
  }
  return out.normalize('NFC');
}

// ===== Apply =====

let src = fs.readFileSync(FILE, 'utf8');
let changes = 0;
const samples = [];

const objRe = /\{[^{}]*\}/g;
src = src.replace(objRe, (objText) => {
  const prefixes = ['', 'q_', 'a_'];
  let modified = objText;

  for (const prefix of prefixes) {
    const phonRe = new RegExp(`${prefix}phonetic:\\s*"([^"]*)"`);
    const esRe = new RegExp(`(${prefix}es:\\s*")([^"]*)(")`);
    const toneRe = new RegExp(`${prefix}tone:\\s*"([^"]*)"`);

    const phonMatch = modified.match(phonRe);
    const esMatch = modified.match(esRe);
    const toneMatch = modified.match(toneRe);

    if (!phonMatch || !esMatch || !toneMatch) continue;

    const phonetic = phonMatch[1];
    const oldEs = esMatch[2];
    const tone = toneMatch[1];

    const newEs = phoneticToEs(phonetic, tone);
    if (newEs.normalize('NFC') !== oldEs.normalize('NFC')) {
      modified = modified.replace(esRe, (full, pre, _old, post) => pre + newEs + post);
      if (samples.length < 80) {
        samples.push({ prefix, phonetic, oldEs, newEs, tone });
      }
      changes++;
    }
  }
  return modified;
});

console.log(`Total changes: ${changes}`);
console.log('\nAll samples:');
for (const s of samples.slice(0, 80)) {
  console.log(`  [${s.prefix || 'w'}] phon: "${s.phonetic}"  tone: "${s.tone}"`);
  console.log(`     OLD: "${s.oldEs}"`);
  console.log(`     NEW: "${s.newEs}"`);
}

if (process.argv.includes('--apply')) {
  fs.writeFileSync(FILE, src, 'utf8');
  console.log(`\nApplied to ${FILE}`);
} else {
  console.log('\n(dry run — pass --apply to write)');
}
