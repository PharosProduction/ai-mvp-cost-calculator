import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import {
  createCalculator,
  exportCsv,
  exportJson,
} from '../docs/assets/calculator.js';
import { evaluateReleaseGate } from '../docs/assets/release-gate.js';

const root = new URL('../', import.meta.url);
const benchmarksData = JSON.parse(await readFile(new URL('data/benchmarks.json', root), 'utf8'));
const methodologyData = JSON.parse(await readFile(new URL('data/methodology.json', root), 'utf8'));
const claimsData = JSON.parse(await readFile(new URL('data/claims.json', root), 'utf8'));
const sourcesData = JSON.parse(await readFile(new URL('data/sources.json', root), 'utf8'));
const { calculatePlan, lookupBenchmark } = createCalculator({
  benchmarks: benchmarksData,
  methodology: methodologyData,
});

const baseline = {
  useCase: 'rag',
  lifecycle: 'mvp',
  horizonMonths: 12,
  knownBuildCost: null,
  oneTime: {
    discovery: 5_000,
    dataPreparation: 0,
    securityCompliance: 0,
    licensingHardware: 0,
    other: 0,
  },
  monthly: {
    modelApis: 1_000,
    infrastructure: 0,
    observability: 0,
    humanReview: 0,
    maintenance: 0,
    other: 0,
  },
  uncertainty: {
    dataReadinessUnknown: false,
    integrationScopeUnknown: false,
    regulatedValidation: false,
    customTraining: false,
  },
};

test('RAG MVP lookup preserves the source lifecycle band and timeline', () => {
  const benchmark = lookupBenchmark('rag', 'mvp');
  assert.deepEqual(
    {
      costLow: benchmark.costLow,
      costHigh: benchmark.costHigh,
      upperOpen: benchmark.upperOpen,
      timelineWeeksLow: benchmark.timelineWeeksLow,
      timelineWeeksHigh: benchmark.timelineWeeksHigh,
    },
    {
      costLow: 25_000,
      costHigh: 50_000,
      upperOpen: false,
      timelineWeeksLow: 10,
      timelineWeeksHigh: 20,
    },
  );
  assert.equal(benchmark.claimId, 'CLAIM-BENCHMARK-TABLE');
  assert.equal(benchmark.midpoint, null, 'published bands do not establish an expected project cost');
});

test('all runtime bands are built from the canonical registry with shared provenance', () => {
  for (const row of benchmarksData.rows) {
    for (const lifecycle of benchmarksData.lifecycles) {
      const benchmark = lookupBenchmark(row.useCase, lifecycle);
      assert.deepEqual([benchmark.costLow, benchmark.costHigh], row[lifecycle]);
      assert.equal(benchmark.sourceId, benchmarksData.sourceId);
      assert.equal(benchmark.sourceVersion, benchmarksData.sourceVersion);
      assert.equal(benchmark.claimId, benchmarksData.claimId);
      assert.equal(benchmark.upperOpen, lifecycle === 'enterprise' && row.enterpriseUpperOpen === true);
    }
  }
});

test('bottom-up worksheet adds explicit extras and run rate without hidden multipliers', () => {
  const result = calculatePlan(baseline);
  assert.equal(result.itemized.oneTimeExtras, 5_000);
  assert.equal(result.itemized.monthlyRunRate, 1_000);
  assert.equal(result.itemized.operatingCost, 12_000);
  assert.equal(result.itemized.tcoLow, 42_000);
  assert.equal(result.itemized.tcoHigh, 67_000);
  assert.equal(result.itemized.formulaId, 'FORMULA-ITEMIZED-V1');
});

test('hidden-cost cross-check uses share of total spend, not uplift on build', () => {
  const result = calculatePlan({ ...baseline, knownBuildCost: 42_000 });
  assert.equal(result.crossCheck.tcoLow, 58_333);
  assert.equal(result.crossCheck.tcoHigh, 72_414);
  assert.equal(result.crossCheck.hiddenAmountLow, 16_333);
  assert.equal(result.crossCheck.hiddenAmountHigh, 30_414);
  assert.equal(result.crossCheck.base, null);
  assert.equal(result.crossCheck.formulaId, 'FORMULA-HIDDEN-SHARE-V1');
});

test('aggregate cross-check and itemized worksheet remain separate result modes', () => {
  const result = calculatePlan(baseline);
  assert.equal(result.itemized.includesCrossCheck, false);
  assert.equal(result.crossCheck.includesItemizedCosts, false);
  assert.notEqual(result.itemized.tcoLow, result.crossCheck.tcoLow);
});

test('open-ended enterprise bands never invent a midpoint or closed ceiling', () => {
  const benchmark = lookupBenchmark('multi-agent', 'enterprise');
  assert.equal(benchmark.costLow, 280_000);
  assert.equal(benchmark.costHigh, 500_000);
  assert.equal(benchmark.upperOpen, true);
  assert.equal(benchmark.midpoint, null);
  assert.equal(benchmark.timelineWeeksHigh, 36);

  const derived = calculatePlan({ ...baseline, useCase: 'multi-agent', lifecycle: 'enterprise' });
  assert.equal(derived.itemized.upperOpen, true);
  assert.equal(derived.crossCheck.upperOpen, true);

  const known = calculatePlan({ ...baseline, useCase: 'multi-agent', lifecycle: 'enterprise', knownBuildCost: 420_000 });
  assert.equal(known.itemized.upperOpen, false);
  assert.equal(known.crossCheck.upperOpen, false);
});

test('qualitative uncertainty changes warnings but never the numeric result', () => {
  const normal = calculatePlan(baseline);
  const uncertain = calculatePlan({
    ...baseline,
    uncertainty: { ...baseline.uncertainty, regulatedValidation: true },
  });
  assert.deepEqual(uncertain.itemized, normal.itemized);
  assert.match(uncertain.warnings.join(' '), /regulated validation/i);
});

test('invalid numeric values and unknown benchmark IDs fail at the pure boundary', () => {
  assert.throws(
    () => calculatePlan({ ...baseline, horizonMonths: 0 }),
    (error) => error.code === 'INVALID_INPUT',
  );
  assert.throws(
    () => calculatePlan({ ...baseline, monthly: { ...baseline.monthly, modelApis: -1 } }),
    (error) => error.code === 'INVALID_INPUT',
  );
  assert.throws(
    () => lookupBenchmark('unknown', 'mvp'),
    (error) => error.code === 'UNKNOWN_BENCHMARK',
  );
  assert.throws(
    () => calculatePlan({ ...baseline, horizonMonths: 1.5 }),
    (error) => error.code === 'INVALID_INPUT',
  );
  assert.throws(
    () => calculatePlan({ ...baseline, knownBuildCost: 0 }),
    (error) => error.code === 'INVALID_INPUT',
  );
  assert.throws(
    () => calculatePlan({ ...baseline, monthly: { ...baseline.monthly, modelApis: Number.MAX_VALUE } }),
    (error) => error.code === 'RESULT_OVERFLOW',
  );
});

test('exports retain result modes, assumptions, formula IDs, and source IDs', () => {
  const result = calculatePlan(baseline);
  const json = JSON.parse(exportJson(baseline, result));
  assert.equal(json.result.itemized.formulaId, 'FORMULA-ITEMIZED-V1');
  assert.equal(json.result.crossCheck.formulaId, 'FORMULA-HIDDEN-SHARE-V1');
  assert.ok(json.result.sourceIds.includes('SOURCE-PHAROS-AI-COST-2026'));
  const csv = exportCsv(baseline, result);
  assert.match(csv, /^section,key,value\n/);
  assert.match(csv, /result,itemized_formula_id,FORMULA-ITEMIZED-V1/);
  assert.match(csv, /result,cross_check_formula_id,FORMULA-HIDDEN-SHARE-V1/);
  assert.match(csv, /assumption,known_build_cost,/);
  assert.match(csv, /assumption,uncertainty_data_readiness_unknown,false/);
  assert.match(csv, /provenance,benchmark_claim_id,CLAIM-BENCHMARK-TABLE/);
  assert.match(csv, /provenance,source_version,2026-10-04/);
  assert.match(csv, /result,itemized_upper_open,false/);
});

test('registries are mirrored, exact-counted, source-linked, and publication-safe', async () => {
  const names = ['benchmarks.json', 'claims.json', 'methodology.json', 'review.json', 'sources.json'];
  for (const name of names) {
    const [canonical, published] = await Promise.all([
      readFile(new URL(`data/${name}`, root), 'utf8'),
      readFile(new URL(`docs/data/${name}`, root), 'utf8'),
    ]);
    assert.equal(published, canonical, `${name} mirror drift`);
  }

  assert.equal(methodologyData.dataset.sampleNExact, 25);
  assert.equal(methodologyData.dataset.displayCount, 'exactly 25 projects');
  assert.ok(claimsData.every((claim) => claim.v1Status !== 'CLAIMED-ONLY'));
  assert.ok(claimsData.every((claim) => claim.sourceId));

  const pending = evaluateReleaseGate({
    review: { status: 'pending' },
    claims: claimsData,
    sources: sourcesData,
    methodology: methodologyData,
    benchmarks: benchmarksData,
  });
  assert.equal(pending.publishable, false);
  assert.ok(pending.blockers.includes('REVIEW_NOT_APPROVED'));

  const reviewScope = {
    datasetVersion: benchmarksData.schemaVersion,
    formulaVersion: methodologyData.formulaVersion,
    claimIds: claimsData.map(({ id }) => id),
    sourceIds: sourcesData.map(({ id }) => id),
  };
  const approved = evaluateReleaseGate({
    review: {
      status: 'approved',
      reviewer: { name: 'Named reviewer', role: 'Technical reviewer' },
      approvedAt: '2026-08-14T10:00:00+03:00',
      scope: reviewScope,
    },
    claims: claimsData,
    sources: sourcesData,
    methodology: methodologyData,
    benchmarks: benchmarksData,
  });
  assert.equal(approved.publishable, true);

  for (const review of [
    { status: 'approved', reviewer: null, approvedAt: '2026-08-14T10:00:00+03:00', scope: reviewScope },
    { status: 'approved', reviewer: { name: 'Named reviewer', role: 'Technical reviewer' }, approvedAt: 'not-a-date', scope: reviewScope },
    { status: 'approved', reviewer: { name: 'Named reviewer', role: 'Technical reviewer' }, approvedAt: '2026-08-14T10:00:00+03:00', scope: { ...reviewScope, claimIds: [] } },
  ]) {
    const gate = evaluateReleaseGate({ review, claims: claimsData, sources: sourcesData, methodology: methodologyData, benchmarks: benchmarksData });
    assert.equal(gate.publishable, false);
  }
});

test('public pages expose citation-ready semantics and exactly two Pharos anchors', async () => {
  const root = new URL('../docs/', import.meta.url);
  const [index, methodologyPage, robots, sitemap, deployWorkflow, noJekyll, ogCard] = await Promise.all([
    readFile(new URL('index.html', root), 'utf8'),
    readFile(new URL('methodology.html', root), 'utf8'),
    readFile(new URL('robots.txt', root), 'utf8'),
    readFile(new URL('sitemap.xml', root), 'utf8'),
    readFile(new URL('../.github/workflows/pages.yml', root), 'utf8'),
    readFile(new URL('.nojekyll', root), 'utf8'),
    readFile(new URL('og-card.png', root)),
  ]);
  const canonical = 'https://pharosproduction.github.io/ai-mvp-cost-calculator/';
  assert.match(index, new RegExp(`<link rel="canonical" href="${canonical}"`));
  assert.match(index, /<main[^>]*>[\s\S]*?<article/);
  assert.match(index, /<form[^>]+id="cost-planner"/);
  assert.match(index, /<output[^>]+id="itemized-tco-low"/);
  assert.match(index, /<dl[^>]+class="[^"]*fact-pack/);
  assert.match(index, /<table[^>]+id="benchmark-table"[\s\S]*?<caption>/);
  assert.match(index, /<figure[^>]+id="cost-composition"[\s\S]*?<figcaption>/);
  assert.match(index, /<section[^>]+id="worked-scenarios"/);
  assert.match(index, /<section[^>]+id="limitations"/);
  assert.match(index, /<time datetime="2026-08-14">/);
  assert.match(index, /class="skip-link"/);
  assert.match(index, /id="itemized-result-label"[^>]*>Itemized selected-horizon TCO/);
  assert.match(methodologyPage, /<table[^>]+id="claim-ledger"[\s\S]*?<caption>/);
  assert.match(index, /application\/ld\+json/);
  for (const page of [index, methodologyPage]) {
    const graphs = [...page.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
    assert.ok(graphs.length > 0);
    for (const [, json] of graphs) assert.doesNotThrow(() => JSON.parse(json));
    const ids = new Set([...page.matchAll(/\sid="([^"]+)"/g)].map(([, id]) => id));
    for (const [, fragment] of page.matchAll(/href="#([^"]+)"/g)) assert.ok(ids.has(fragment), `missing fragment #${fragment}`);
    for (const [, references] of page.matchAll(/aria-labelledby="([^"]+)"/g)) {
      for (const reference of references.split(/\s+/)) assert.ok(ids.has(reference), `missing aria reference #${reference}`);
    }
  }
  assert.match(robots, /Allow: \/\s/);
  assert.match(sitemap, new RegExp(`<loc>${canonical}</loc>`));
  assert.match(deployWorkflow, /evaluateReleaseGate/);
  assert.match(deployWorkflow, /actions\/deploy-pages@v4/);
  assert.equal(noJekyll.trim(), '');
  assert.ok(ogCard.byteLength > 10_000);

  const combined = `${index}\n${methodologyPage}`;
  const pharosLinks = combined.match(/<a href="https:\/\/pharosproduction\.com(?:\/[^"]*)?"[^>]*>[^<]+<\/a>/g) ?? [];
  assert.equal(pharosLinks.length, 2);
  assert.ok(pharosLinks.some((link) => link.includes('href="https://pharosproduction.com"')));
  assert.ok(pharosLinks.some((link) => link.includes('/state-of-ai-development-costs-2026/')));
  assert.ok(pharosLinks.every((link) => !/nofollow/i.test(link)));
});

test('successful recalculation exposes one compact polite status', async () => {
  const root = new URL('../docs/', import.meta.url);
  const [index, app] = await Promise.all([
    readFile(new URL('index.html', root), 'utf8'),
    readFile(new URL('assets/app.js', root), 'utf8'),
  ]);
  assert.equal((index.match(/aria-live="polite"/g) ?? []).length, 1);
  assert.match(index, /id="calculation-status"[^>]*aria-live="polite"[^>]*aria-atomic="true"/);
  assert.match(app, /set\('calculation-status', `Plan updated\./);
  assert.match(app, /set\('calculation-status', ''\);/);
});
