# AI MVP Cost Benchmark Explorer 2026

A dependency-free static planning tool built from the seven-use-case benchmark table published by Pharos Production, whose methodology reports 25 projects. It keeps an itemized selected-horizon TCO worksheet separate from the 28–42% first-year aggregate hidden-share cross-check.

Codex completed the disclosed AI technical review on October 6, 2026; the user requested immediate publication once ready. `data/review.json` binds a named approval to the exact dataset, formula, claim and source scope. GitHub Pages must use **GitHub Actions** as its source; branch-based Pages publishing would bypass this boundary and is forbidden for this repository.

## Local verification

Use Node.js 22 or later.

```sh
node --test
node --check docs/assets/calculator.js
node --check docs/assets/release-gate.js
node --check docs/assets/app.js
node scripts/check-sources.js
```

Serve `docs/` with any static server for browser inspection. No build step, cookie, analytics call or server-side processing is required.

## Data contract

Canonical registries live in `data/`; byte-identical public mirrors live in `docs/data/`. Calculator results and exports retain formula and source IDs. Source bands are descriptive planning ranges, not quotes.
