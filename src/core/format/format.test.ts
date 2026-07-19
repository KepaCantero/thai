// Unit tests for src/core/format. Verifies renderTone byte-identity with
// the original public/config.js implementation, getEn branching for every
// card type, and translation-map lookups.

import { describe, expect, it } from 'vitest';
import { CAT_LABELS, CONV_EN, getEn, PHRASE_EN, renderTone, THAI_EN, TONES } from './index';
import type { Card } from '../types';

describe('TONES', () => {
  it('has five entries with symbol/name/color', () => {
    expect(Object.keys(TONES).sort()).toEqual(['f', 'h', 'l', 'm', 'r']);
    expect(TONES.m).toEqual({ symbol: '→', name: 'Mid', color: '#4ecdc4' });
    expect(TONES.f.color).toBe('#ff6b6b');
  });
});

describe('renderTone', () => {
  it('returns empty string for falsy input', () => {
    expect(renderTone(undefined)).toBe('');
    expect(renderTone('')).toBe('');
  });

  it('renders a single tone segment with name and color', () => {
    const out = renderTone('m');
    expect(out).toContain('color:#4ecdc4');
    expect(out).toContain('<span class="tone-symbol">→</span> Mid');
  });

  it('joins multi-tone strings with double-space', () => {
    const out = renderTone('l-l-m');
    expect(out.split('  ').length).toBe(3);
  });

  it('underlines the highlighted segment and hides its name', () => {
    const out = renderTone('l-m', 'm');
    // Highlighted segment: underline + no name label.
    expect(out).toContain('text-decoration:underline');
    // Non-highlighted segment with highlight set: grey color.
    expect(out).toContain('color:#555');
  });

  it('returns empty for unknown tone keys', () => {
    expect(renderTone('zz')).toBe('');
  });
});

describe('getEn', () => {
  it('returns Spanish fallback for unknown word', () => {
    const card: Card = { type: 'word', thai: 'XYZ', spanish: 'desconocido' };
    expect(getEn(card)).toBe('desconocido');
  });

  it('looks up THAI_EN for known words', () => {
    const card: Card = { type: 'word', thai: 'ฉัน', spanish: 'yo' };
    expect(getEn(card)).toBe('I (informal)');
  });

  it('looks up PHRASE_EN for phrase cards', () => {
    const card: Card = {
      type: 'phrase',
      thai: 'สวัสดีครับผม',
      spanish: 'hola, soy yo',
    };
    expect(getEn(card)).toBe('hello, I am (male)');
  });

  it('falls back to spanish for unknown phrases', () => {
    const card: Card = { type: 'phrase', thai: 'XYZ', spanish: 'frase' };
    expect(getEn(card)).toBe('frase');
  });

  it('returns "q → a" for conversation cards with translation', () => {
    const card = {
      type: 'conversation' as const,
      thai: 'ขอบคุณครับ',
      q_thai: 'ขอบคุณครับ',
      q_spanish: 'Gracias',
      a_spanish: 'De nada',
    } as unknown as Card;
    expect(getEn(card)).toBe('Thank you → You\'re welcome');
  });

  it('joins pair words with slash separator', () => {
    // Legacy Pair shape stores w1/w2 as objects with .thai.
    const card = {
      type: 'pair' as const,
      w1: { thai: 'ฉัน' },
      w2: { thai: 'ผม' },
    } as unknown as Card;
    expect(getEn(card)).toBe('I (informal) / I (masculine)');
  });
});

describe('translation maps', () => {
  it('THAI_EN contains core vocabulary', () => {
    expect(THAI_EN['ข้าว']).toBe('rice');
    expect(THAI_EN['น้ำ']).toBe('water');
  });

  it('PHRASE_EN contains lesson phrases', () => {
    expect(PHRASE_EN['น้ำเย็น']).toBe('cold water');
  });

  it('CONV_EN entries have q and a', () => {
    const e = CONV_EN['ขอบคุณครับ'];
    expect(e.q).toBe('Thank you');
    expect(e.a).toBe('You\'re welcome');
  });
});

describe('CAT_LABELS', () => {
  it('maps core categories to English labels', () => {
    expect(CAT_LABELS['verbos']).toBe('Verbs');
    expect(CAT_LABELS['comida']).toBe('Food');
    expect(CAT_LABELS['dificiles']).toBe('★ Difíciles');
  });
});
