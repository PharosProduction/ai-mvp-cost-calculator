import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const names = ['benchmarks.csv', 'benchmarks.json', 'claims.json', 'methodology.json', 'review.json', 'sources.json'];
for (const name of names) {
  const [canonical, published] = await Promise.all([readFile(new URL(`../data/${name}`, import.meta.url), 'utf8'), readFile(new URL(`../docs/data/${name}`, import.meta.url), 'utf8')]);
  assert.equal(published, canonical, `${name}: published mirror differs`);
}

const sources = JSON.parse(await readFile(new URL('../data/sources.json', import.meta.url), 'utf8'));
const required = sources.filter(({ id }) => id === 'SOURCE-PHAROS-AI-COST-2026');
assert.equal(required.length, 1, 'exactly one required source must be checked');
for (const source of required) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8_000);
  try {
    const response = await fetch(source.url, { signal: controller.signal, headers: { 'user-agent': 'ai-mvp-cost-source-check/1.0' } });
    assert.ok(response.ok, `${source.id}: HTTP ${response.status}`);
    const body = await response.text();
    assert.match(body, /25 Pharos Production AI projects/i, `${source.id}: exact sample wording not found`);
    assert.match(body, /28.?42% of first-year total spend/i, `${source.id}: first-year hidden-share denominator not found`);
  } finally { clearTimeout(timer); }
}
console.log(`source-check: ${required.length} required source reachable; ${names.length} mirrors exact`);
