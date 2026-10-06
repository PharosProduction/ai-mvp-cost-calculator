const TEAM_MODELS = new Set(['not-specified', 'outsourced', 'hybrid', 'in-house']);

function fail(message, code = 'INVALID_INPUT') {
  const error = new Error(message);
  error.code = code;
  throw error;
}

function amount(value, path, { nullable = false, positive = false, integer = false } = {}) {
  if (nullable && (value === null || value === '')) return null;
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0 || (positive && parsed <= 0) || (integer && !Number.isInteger(parsed))) {
    fail(`${path} must be ${positive ? 'positive' : 'zero or greater'}${integer ? ' and an integer' : ''}`);
  }
  return parsed;
}

function safeRound(value, path) {
  if (!Number.isFinite(value) || Math.abs(value) > Number.MAX_SAFE_INTEGER) {
    fail(`${path} exceeds the supported numeric range`, 'RESULT_OVERFLOW');
  }
  return Math.round(value);
}

function sumObject(object, path) {
  if (!object || typeof object !== 'object' || Array.isArray(object)) fail(`${path} is required`);
  return Object.entries(object).reduce((total, [key, value]) => {
    const next = total + amount(value, `${path}.${key}`);
    if (!Number.isFinite(next) || next > Number.MAX_SAFE_INTEGER) fail(`${path} exceeds the supported numeric range`, 'RESULT_OVERFLOW');
    return next;
  }, 0);
}

function text(value, path) {
  if (typeof value !== 'string' || !value.trim()) fail(`${path} is required`, 'INVALID_REGISTRY');
  return value;
}

function buildRegistry(document) {
  if (!document || typeof document !== 'object') fail('Benchmark registry is required', 'INVALID_REGISTRY');
  const sourceId = text(document.sourceId, 'benchmarks.sourceId');
  const sourceVersion = text(document.sourceVersion, 'benchmarks.sourceVersion');
  const claimId = text(document.claimId, 'benchmarks.claimId');
  if (!Array.isArray(document.lifecycles) || document.lifecycles.length === 0) fail('benchmarks.lifecycles is required', 'INVALID_REGISTRY');
  if (!Array.isArray(document.rows) || document.rows.length === 0) fail('benchmarks.rows is required', 'INVALID_REGISTRY');

  const registry = new Map();
  for (const row of document.rows) {
    const useCase = text(row.useCase, 'benchmarks.rows.useCase');
    const label = text(row.label, `benchmarks.rows.${useCase}.label`);
    const timelineWeeksLow = amount(row.timelineWeeksLow, `benchmarks.rows.${useCase}.timelineWeeksLow`, { positive: true, integer: true });
    const timelineWeeksHigh = amount(row.timelineWeeksHigh, `benchmarks.rows.${useCase}.timelineWeeksHigh`, { positive: true, integer: true });
    if (timelineWeeksLow > timelineWeeksHigh) fail(`${useCase} timeline is reversed`, 'INVALID_REGISTRY');

    for (const lifecycleValue of document.lifecycles) {
      const lifecycle = text(lifecycleValue, 'benchmarks.lifecycles[]');
      const pair = row[lifecycle];
      if (!Array.isArray(pair) || pair.length !== 2) fail(`${useCase}.${lifecycle} must contain two costs`, 'INVALID_REGISTRY');
      const costLow = amount(pair[0], `${useCase}.${lifecycle}.costLow`, { positive: true });
      const costHigh = amount(pair[1], `${useCase}.${lifecycle}.costHigh`, { positive: true });
      if (costLow > costHigh) fail(`${useCase}.${lifecycle} cost band is reversed`, 'INVALID_REGISTRY');
      const upperOpen = lifecycle === 'enterprise' && row.enterpriseUpperOpen === true;
      const key = `${useCase}:${lifecycle}`;
      if (registry.has(key)) fail(`Duplicate benchmark: ${key}`, 'INVALID_REGISTRY');
      registry.set(key, Object.freeze({
        useCase,
        label,
        lifecycle,
        costLow,
        costHigh,
        upperOpen,
        midpoint: null,
        timelineWeeksLow,
        timelineWeeksHigh,
        claimId,
        sourceId,
        sourceVersion,
      }));
    }
  }
  return registry;
}

function formulaById(methodology, id) {
  const formula = methodology?.formulas?.find((candidate) => candidate.id === id);
  if (!formula) fail(`Missing methodology formula: ${id}`, 'INVALID_REGISTRY');
  if (!Array.isArray(formula.sourceIds) || formula.sourceIds.length === 0) fail(`${id} must retain source IDs`, 'INVALID_REGISTRY');
  if (!Array.isArray(formula.claimIds) || formula.claimIds.length === 0) fail(`${id} must retain claim IDs`, 'INVALID_REGISTRY');
  return formula;
}

export function createCalculator({ benchmarks: benchmarkDocument, methodology }) {
  const registry = buildRegistry(benchmarkDocument);
  const itemizedFormula = formulaById(methodology, 'FORMULA-ITEMIZED-V1');
  const hiddenFormula = formulaById(methodology, 'FORMULA-HIDDEN-SHARE-V1');
  const hiddenLowShare = amount(hiddenFormula.lowShare, 'hiddenFormula.lowShare', { positive: true });
  const hiddenHighShare = amount(hiddenFormula.highShare, 'hiddenFormula.highShare', { positive: true });
  if (hiddenLowShare >= 1 || hiddenHighShare >= 1 || hiddenLowShare > hiddenHighShare) {
    fail('Hidden-share bounds must be ordered fractions below one', 'INVALID_REGISTRY');
  }

  function lookupBenchmark(useCase, lifecycle) {
    const match = registry.get(`${useCase}:${lifecycle}`);
    if (!match) fail(`Unknown benchmark: ${useCase}/${lifecycle}`, 'UNKNOWN_BENCHMARK');
    return { ...match };
  }

  function calculatePlan(input) {
    if (!input || typeof input !== 'object' || Array.isArray(input)) fail('Input is required');
    const benchmark = lookupBenchmark(input.useCase, input.lifecycle);
    const teamModel = input.teamModel ?? 'not-specified';
    if (!TEAM_MODELS.has(teamModel)) fail('teamModel is unknown');
    const horizonMonths = amount(input.horizonMonths, 'horizonMonths', { positive: true, integer: true });
    const knownBuildCost = amount(input.knownBuildCost, 'knownBuildCost', { nullable: true, positive: true });
    const oneTimeExtras = sumObject(input.oneTime, 'oneTime');
    const monthlyRunRate = sumObject(input.monthly, 'monthly');
    const operatingCost = safeRound(monthlyRunRate * horizonMonths, 'operatingCost');
    const buildLow = knownBuildCost ?? benchmark.costLow;
    const buildHigh = knownBuildCost ?? benchmark.costHigh;
    const upperOpen = knownBuildCost === null && benchmark.upperOpen;
    const itemized = {
      buildLow,
      buildHigh,
      oneTimeExtras,
      monthlyRunRate,
      operatingCost,
      tcoLow: safeRound(buildLow + oneTimeExtras + operatingCost, 'itemized.tcoLow'),
      tcoHigh: safeRound(buildHigh + oneTimeExtras + operatingCost, 'itemized.tcoHigh'),
      upperOpen,
      includesCrossCheck: false,
      formulaId: itemizedFormula.id,
      claimIds: [...itemizedFormula.claimIds],
    };
    const crossLow = safeRound(buildLow / (1 - hiddenLowShare), 'crossCheck.tcoLow');
    const crossHigh = safeRound(buildHigh / (1 - hiddenHighShare), 'crossCheck.tcoHigh');
    const crossCheck = {
      tcoLow: crossLow,
      tcoHigh: crossHigh,
      hiddenAmountLow: crossLow - buildLow,
      hiddenAmountHigh: crossHigh - buildHigh,
      upperOpen,
      base: null,
      includesItemizedCosts: false,
      formulaId: hiddenFormula.id,
      claimIds: [...hiddenFormula.claimIds],
    };
    const warningMap = {
      dataReadinessUnknown: 'Unknown data readiness can change scope after discovery.',
      integrationScopeUnknown: 'Unknown integration scope can change build effort.',
      trafficUnknown: 'Unmeasured traffic or token volume prevents a defensible run-rate estimate.',
      evaluationCoverageUnknown: 'An undefined evaluation set can change quality-control effort.',
      regulatedValidation: 'Regulated validation is outside the benchmark normalization.',
      customTraining: 'Custom model training may fall outside these delivered-project bands.',
    };
    const uncertainty = input.uncertainty ?? {};
    if (!uncertainty || typeof uncertainty !== 'object' || Array.isArray(uncertainty)) fail('uncertainty must be an object');
    const warnings = Object.entries(uncertainty)
      .filter(([, enabled]) => enabled)
      .map(([key]) => warningMap[key])
      .filter(Boolean);
    if (horizonMonths !== 12) warnings.unshift(`The itemized worksheet uses ${horizonMonths} months; the aggregate cross-check remains a first-year source comparison.`);
    if (upperOpen) warnings.unshift('The source enterprise upper band is open-ended; $500,000 is not a ceiling.');
    return {
      benchmark,
      itemized,
      crossCheck,
      warnings,
      assumptions: { ...structuredClone(input), teamModel },
      sourceIds: [benchmark.sourceId],
      sourceVersion: benchmark.sourceVersion,
    };
  }

  return Object.freeze({ calculatePlan, lookupBenchmark });
}

export function exportJson(input, result) {
  return JSON.stringify({
    schemaVersion: '1.0.0',
    generatedAt: new Date().toISOString(),
    assumptions: input,
    result,
  }, null, 2);
}

function csv(value) {
  const serialized = value === null || value === undefined
    ? ''
    : typeof value === 'object' ? JSON.stringify(value) : String(value);
  return /[",\n]/.test(serialized) ? `"${serialized.replaceAll('"', '""')}"` : serialized;
}

export function exportCsv(input, result) {
  const lines = [['section', 'key', 'value']];
  lines.push(
    ['assumption', 'use_case', input.useCase],
    ['assumption', 'lifecycle', input.lifecycle],
    ['assumption', 'team_model', input.teamModel],
    ['assumption', 'horizon_months', input.horizonMonths],
    ['assumption', 'known_build_cost', input.knownBuildCost],
  );
  for (const [key, value] of Object.entries(input.oneTime ?? {})) lines.push(['assumption', `one_time_${key}`, value]);
  for (const [key, value] of Object.entries(input.monthly ?? {})) lines.push(['assumption', `monthly_${key}`, value]);
  for (const [key, value] of Object.entries(input.uncertainty ?? {})) lines.push(['assumption', `uncertainty_${key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)}`, value]);
  lines.push(
    ['provenance', 'benchmark_claim_id', result.benchmark.claimId],
    ['provenance', 'source_id', result.benchmark.sourceId],
    ['provenance', 'source_version', result.benchmark.sourceVersion],
    ['provenance', 'timeline_weeks_low', result.benchmark.timelineWeeksLow],
    ['provenance', 'timeline_weeks_high', result.benchmark.timelineWeeksHigh],
    ['provenance', 'source_band_upper_open', result.benchmark.upperOpen],
    ['result', 'itemized_tco_low', result.itemized.tcoLow],
    ['result', 'itemized_tco_high', result.itemized.tcoHigh],
    ['result', 'itemized_upper_open', result.itemized.upperOpen],
    ['result', 'itemized_formula_id', result.itemized.formulaId],
    ['result', 'cross_check_tco_low', result.crossCheck.tcoLow],
    ['result', 'cross_check_tco_high', result.crossCheck.tcoHigh],
    ['result', 'cross_check_upper_open', result.crossCheck.upperOpen],
    ['result', 'cross_check_formula_id', result.crossCheck.formulaId],
    ['result', 'warnings', result.warnings],
    ['result', 'source_ids', result.sourceIds.join('|')],
  );
  return `${lines.map((line) => line.map(csv).join(',')).join('\n')}\n`;
}
