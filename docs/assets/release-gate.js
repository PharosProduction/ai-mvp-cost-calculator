const RELEASE_SAFE_STATUSES = new Set(['OBSERVED', 'VERIFIED', 'ASSUMPTION']);

function nonEmpty(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function validIsoInstant(value) {
  return nonEmpty(value)
    && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?(?:Z|[+-]\d{2}:\d{2})$/.test(value)
    && Number.isFinite(Date.parse(value));
}

function sameStringSet(actual, expected) {
  if (!Array.isArray(actual) || !Array.isArray(expected)) return false;
  const left = [...new Set(actual)].sort();
  const right = [...new Set(expected)].sort();
  return left.length === actual.length
    && right.length === expected.length
    && left.length === right.length
    && left.every((value, index) => value === right[index]);
}

export function evaluateReleaseGate({ review, claims, sources, methodology, benchmarks }) {
  const blockers = [];
  if (review?.status !== 'approved') blockers.push('REVIEW_NOT_APPROVED');
  if (!nonEmpty(review?.reviewer?.name) || !nonEmpty(review?.reviewer?.role)) blockers.push('REVIEWER_NOT_IDENTIFIED');
  if (!validIsoInstant(review?.approvedAt)) blockers.push('REVIEW_TIMESTAMP_INVALID');

  const claimsSafe = Array.isArray(claims)
    && claims.length > 0
    && claims.every((claim) => nonEmpty(claim?.id) && nonEmpty(claim?.sourceId) && RELEASE_SAFE_STATUSES.has(claim?.v1Status));
  if (!claimsSafe) blockers.push('CLAIMS_NOT_RELEASE_SAFE');

  const sourceIds = Array.isArray(sources) ? sources.map(({ id }) => id) : [];
  const uniqueSources = sourceIds.length > 0 && new Set(sourceIds).size === sourceIds.length && sourceIds.every(nonEmpty);
  if (!uniqueSources) blockers.push('SOURCES_NOT_RELEASE_SAFE');

  if (claimsSafe && uniqueSources && claims.some(({ sourceId }) => !sourceIds.includes(sourceId))) {
    blockers.push('CLAIM_SOURCE_UNRESOLVED');
  }

  const claimIds = claimsSafe ? claims.map(({ id }) => id) : [];
  const formulas = methodology?.formulas;
  const formulaProvenanceSafe = Array.isArray(formulas)
    && formulas.length > 0
    && formulas.every((formula) => Array.isArray(formula.sourceIds)
      && formula.sourceIds.length > 0
      && formula.sourceIds.every((id) => sourceIds.includes(id))
      && Array.isArray(formula.claimIds)
      && formula.claimIds.length > 0
      && formula.claimIds.every((id) => claimIds.includes(id)));
  if (!formulaProvenanceSafe) blockers.push('FORMULA_PROVENANCE_UNRESOLVED');

  const benchmarkProvenanceSafe = nonEmpty(benchmarks?.sourceId)
    && sourceIds.includes(benchmarks.sourceId)
    && nonEmpty(benchmarks?.sourceVersion)
    && nonEmpty(benchmarks?.claimId)
    && claimIds.includes(benchmarks.claimId);
  if (!benchmarkProvenanceSafe) blockers.push('BENCHMARK_PROVENANCE_UNRESOLVED');

  const scope = review?.scope;
  const scopeMatches = scope?.datasetVersion === benchmarks?.schemaVersion
    && scope?.formulaVersion === methodology?.formulaVersion
    && sameStringSet(scope?.claimIds, claimIds)
    && sameStringSet(scope?.sourceIds, sourceIds);
  if (!scopeMatches) blockers.push('REVIEW_SCOPE_MISMATCH');

  return { publishable: blockers.length === 0, blockers };
}
