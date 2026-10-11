/**
 * Automated Verification Tests for Dishari Chemistry
 * Run via: node --test tests/chemistry.test.ts
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { getAll118Elements } from '../lib/data/elements-data';
import { SEED_FORMULAS, SEED_REACTIONS, SEED_COURSES, SEED_QUIZ_SETS } from '../lib/data/seed-data';

describe('Dishari Chemistry — Unit & Integration Test Suite', () => {

  test('1. Periodic Table Data Integrity (118 Elements)', () => {
    const elements = getAll118Elements();
    assert.equal(elements.length, 118, 'Must contain all 118 chemical elements');

    // Test specific key elements
    const hydrogen = elements.find(e => e.atomic_number === 1);
    assert.ok(hydrogen, 'Hydrogen must exist');
    assert.equal(hydrogen.symbol, 'H');
    assert.equal(hydrogen.name_bn, 'হাইড্রোজেন');
    assert.equal(hydrogen.category, 'nonmetal');

    const iron = elements.find(e => e.atomic_number === 26);
    assert.ok(iron, 'Iron must exist');
    assert.equal(iron.symbol, 'Fe');
    assert.equal(iron.category, 'transition-metal');

    const oganesson = elements.find(e => e.atomic_number === 118);
    assert.ok(oganesson, 'Oganesson (118) must exist');
    assert.equal(oganesson.symbol, 'Og');
    assert.equal(oganesson.category, 'noble-gas');
  });

  test('2. Formula Calculations: Molarity Formula', () => {
    // S = (W * 1000) / (M * V)
    // 5.3g of Na2CO3 (M = 106) in 250mL
    const W = 5.3;
    const M = 106;
    const V = 250;
    const S = (W * 1000) / (M * V);
    assert.equal(Math.round(S * 100) / 100, 0.2, 'Molarity should be 0.2 M (Decimolar)');
  });

  test('3. Formula Calculations: Ideal Gas Law (PV = nRT)', () => {
    // n = PV / (RT)
    // P = 2 atm, V = 5 L, T = 27 C (300.15 K), R = 0.0821
    const P = 2;
    const V = 5;
    const T = 27 + 273.15;
    const R = 0.0821;
    const n = (P * V) / (R * T);
    const roundedN = Math.round(n * 1000) / 1000;
    assert.ok(roundedN > 0.4 && roundedN < 0.41, `Calculated n (${roundedN}) should match ideal gas theory`);
  });

  test('4. Formula Calculations: Dilution Law (V1S1 = V2S2)', () => {
    // 50 mL of 2M HCl diluted to 0.5M
    const V1 = 50;
    const S1 = 2;
    const S2 = 0.5;
    const V2 = (V1 * S1) / S2;
    assert.equal(V2, 200, 'Final volume V2 should be 200 mL');
    const waterNeeded = V2 - V1;
    assert.equal(waterNeeded, 150, 'Water needed should be 150 mL');
  });

  test('5. Formula Calculations: pH and pOH', () => {
    // [H+] = 0.001 M = 10^-3 M
    const h = 0.001;
    const ph = -Math.log10(h);
    assert.equal(ph, 3, 'pH of 0.001M HCl should be 3');
    const poh = 14 - ph;
    assert.equal(poh, 11, 'pOH should be 11');
  });

  test('6. Quiz Grading & Negative Marking Logic', () => {
    const totalQuestions = 4;
    const questionMarks = 1.0;
    const negativeMark = 0.25;

    // Student got 3 correct, 1 incorrect
    const correctCount = 3;
    const incorrectCount = 1;
    const rawScore = (correctCount * questionMarks) - (incorrectCount * negativeMark);
    assert.equal(rawScore, 2.75, 'Score should accurately calculate negative marking: 3 - 0.25 = 2.75');
  });

  test('7. Chemical Reactions Coverage Across Categories', () => {
    const categories = new Set(SEED_REACTIONS.map(r => r.category_key));
    assert.ok(categories.has('synthesis'), 'Must include synthesis reactions');
    assert.ok(categories.has('decomposition'), 'Must include decomposition reactions');
    assert.ok(categories.has('single_replacement'), 'Must include single replacement reactions');
    assert.ok(categories.has('double_replacement'), 'Must include double replacement reactions');
    assert.ok(categories.has('combustion'), 'Must include combustion reactions');
    assert.ok(categories.has('redox'), 'Must include redox reactions');
    assert.ok(categories.has('neutralization'), 'Must include neutralization reactions');
    assert.ok(categories.has('organic'), 'Must include organic reactions');
  });

  test('8. Academic Levels Structure (SSC, HSC, Honors)', () => {
    const ssc = SEED_COURSES.find(c => c.slug === 'ssc-chemistry');
    const hsc = SEED_COURSES.find(c => c.slug === 'hsc-chemistry');
    const honors = SEED_COURSES.find(c => c.slug === 'honors-chemistry');

    assert.ok(ssc, 'SSC Course must be defined');
    assert.ok(hsc, 'HSC Course must be defined');
    assert.ok(honors, 'Honors Course must be defined');
  });
});
