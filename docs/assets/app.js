import { createCalculator, exportCsv, exportJson } from './calculator.js';

const form = document.querySelector('#cost-planner');
const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
let latest;
let calculatePlan;
const exportButtons = [...document.querySelectorAll('#export-json, #export-csv')];

function readNumber(name, nullable = false) {
  const value = form.elements[name].value;
  return nullable && value === '' ? null : Number(value);
}

function assumptions() {
  return {
    useCase: form.elements.useCase.value,
    lifecycle: form.elements.lifecycle.value,
    teamModel: form.elements.teamModel.value,
    horizonMonths: readNumber('horizonMonths'),
    knownBuildCost: readNumber('knownBuildCost', true),
    oneTime: Object.fromEntries(['discovery', 'dataPreparation', 'securityCompliance', 'licensingHardware', 'contingency', 'other'].map((key) => [key, readNumber(key)])),
    monthly: Object.fromEntries(['modelApis', 'infrastructure', 'observability', 'humanReview', 'maintenance', 'monthlyOther'].map((key) => [key === 'monthlyOther' ? 'other' : key, readNumber(key)])),
    uncertainty: Object.fromEntries(['dataReadinessUnknown', 'integrationScopeUnknown', 'trafficUnknown', 'evaluationCoverageUnknown', 'regulatedValidation', 'customTraining'].map((key) => [key, form.elements[key].checked])),
  };
}

function set(id, value) { document.querySelector(`#${id}`).textContent = value; }

function setExportEnabled(enabled) {
  for (const button of exportButtons) button.disabled = !enabled;
}

function render() {
  try {
    const input = assumptions();
    latest = { input, result: calculatePlan(input) };
    const { benchmark, itemized, crossCheck, warnings } = latest.result;
    set('source-band', `${money.format(benchmark.costLow)}–${money.format(benchmark.costHigh)}${benchmark.upperOpen ? '+' : ''}`);
    set('timeline', `Source project timeline: ${benchmark.timelineWeeksLow}–${benchmark.timelineWeeksHigh} weeks`);
    set('itemized-result-label', `Itemized selected-horizon TCO (${input.horizonMonths} months)`);
    set('itemized-tco-low', money.format(itemized.tcoLow));
    set('itemized-tco-high', `${money.format(itemized.tcoHigh)}${itemized.upperOpen ? '+' : ''}`);
    set('monthly-run-rate', money.format(itemized.monthlyRunRate));
    set('cross-check', `${money.format(crossCheck.tcoLow)}–${money.format(crossCheck.tcoHigh)}${crossCheck.upperOpen ? '+' : ''}`);
    const list = document.querySelector('#warnings');
    list.replaceChildren(...(warnings.length ? warnings : ['No qualitative exclusions selected.']).map((warning) => Object.assign(document.createElement('li'), { textContent: warning })));
    document.querySelector('#form-error').textContent = '';
    set('calculation-status', `Plan updated. Itemized TCO ${money.format(itemized.tcoLow)} to ${money.format(itemized.tcoHigh)}${itemized.upperOpen ? ' or more' : ''} for ${input.horizonMonths} months.`);
    setExportEnabled(true);
  } catch (error) {
    latest = undefined;
    document.querySelector('#form-error').textContent = error.message;
    set('calculation-status', '');
    for (const id of ['itemized-tco-low', 'itemized-tco-high', 'source-band', 'timeline', 'monthly-run-rate', 'cross-check']) set(id, 'Unavailable');
    document.querySelector('#warnings').replaceChildren();
    setExportEnabled(false);
  }
}

function download(filename, content, type) {
  const anchor = document.createElement('a');
  anchor.href = URL.createObjectURL(new Blob([content], { type }));
  anchor.download = filename;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(anchor.href), 0);
}

document.querySelector('#export-json').addEventListener('click', () => latest && download('ai-mvp-plan.json', exportJson(latest.input, latest.result), 'application/json'));
document.querySelector('#export-csv').addEventListener('click', () => latest && download('ai-mvp-plan.csv', exportCsv(latest.input, latest.result), 'text/csv'));

async function initialize() {
  setExportEnabled(false);
  try {
    const [benchmarkResponse, methodologyResponse] = await Promise.all([
      fetch('data/benchmarks.json'),
      fetch('data/methodology.json'),
    ]);
    if (!benchmarkResponse.ok || !methodologyResponse.ok) throw new Error('The versioned calculator registries could not be loaded.');
    const calculator = createCalculator({
      benchmarks: await benchmarkResponse.json(),
      methodology: await methodologyResponse.json(),
    });
    calculatePlan = calculator.calculatePlan;
    form.addEventListener('input', render);
    form.addEventListener('submit', (event) => { event.preventDefault(); render(); });
    render();
    document.querySelector('#planner-inputs').disabled = false;
  } catch (error) {
    latest = undefined;
    document.querySelector('#form-error').textContent = error.message;
    set('calculation-status', '');
    setExportEnabled(false);
  }
}

initialize();
