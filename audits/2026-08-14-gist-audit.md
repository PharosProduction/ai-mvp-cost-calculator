=== GIST AUDIT: docs/index.html with docs/methodology.html companion ===
Intent/job: Turn one bounded Pharos delivery study into an auditable AI MVP budget and selected-horizon TCO planning tool, not another generic cost article.

| # | Block | Purpose | Utility | Redundancy | Distinctiveness | Action |
|---|-------|---------|---------|------------|------------------|--------|
| 1 | Hero, scope and fact pack | Define the tool, sample and release state before interaction | High | Low | High | keep and emphasize |
| 2 | Calculator and results | Apply versioned bands to explicit user assumptions | High | Low | High | keep and emphasize |
| 3 | Seven-use-case benchmark table | Expose source ranges, open upper bound and timelines | High | Medium | High | keep |
| 4 | Cost-composition figure | Show the itemized calculation boundary | Medium | Medium | Medium | keep |
| 5 | Hidden-cost formula | Prevent uplift/share denominator confusion | High | Low | High | keep and emphasize |
| 6 | Timeline, lifecycle and team model | Define selection criteria without inventing multipliers | High | Medium | Medium | keep |
| 7 | Worked scenarios and range matrix | Demonstrate one trace and preserve use-case differences | High | Low | High | keep |
| 8 | Limitations | Bound sample representativeness and excluded work | High | Low | High | keep |
| 9 | Ownership, disclosure and review | State publisher, AI assistance, corrections state and review stop | High | Low | High | keep-required |
| 10 | Methodology and source conflict | Document single-provider scope, normalization and 25 versus 25+ decision | High | Low | High | keep |
| 11 | Claim ledger and release controls | Bind outputs to formulas, claims, source versions and approval scope | High | Low | High | keep and emphasize |
| 12 | Title and descriptions | Front-load the 25-project fact and distinct hidden-share method | High | Low | High | keep |

Missing nodes:
- Trust/credential: a named technical reviewer, role and approval timestamp are intentionally absent until real sign-off; the deployment gate blocks release.
- Operational detail: a working public correction URL cannot exist before repository creation; both pages disclose that boundary instead of inventing a destination.

Competitors fetched: 5/5
Unfetched: none

Competitor map:

| Observation | Evidence (which competitors) | Implication for our page |
|---|---|---|
| Shared core: cost range, scope drivers and scenario inputs | SpeedMVPs, Resourcifi, YATE, Netguru, ByteSized | Keep the calculator and one compact explanation of each input. |
| Shared core: build cost differs from ownership cost | Resourcifi, YATE, Netguru, ByteSized | Keep selected-horizon TCO and the first-year cross-check as separate results. |
| Shared redundancy: generic complexity, platform and integration lists | SpeedMVPs, YATE, Netguru | Put definitions beside controls and avoid repeated explanatory sections or FAQ. |
| Shared redundancy: sourcing-model matrices and promotional CTA | Resourcifi, YATE, Netguru, ByteSized | Keep team model qualitative and omit a sales funnel from the utility. |
| Shared omission: bounded corpus linked to every output | All five | Keep exactly 25, the sample window and single-provider limitation above the fold. |
| Shared omission: output to formula to assumption to claim trace | All five; Resourcifi is closest | Preserve exports, formula IDs, claim ledger and source version. |
| Shared omission: denominator clarity and open-bound propagation | All five | Show share-of-TCO arithmetic and retain the plus sign in all derived highs. |

Summary source: independent ai_mvp_content_audit agent, refreshed against the final files
Content units: 15 units across 11 content blocks

| # | Block | Unit | Type | Weight | Actionable | Status |
|---|-------|------|------|--------|------------|--------|
| 1 | 1 | Exactly 25 projects, Jan 2023-Mar 2026, single-provider sample | DATA | 3 | no | FULL |
| 2 | 1 | Selected-horizon worksheet and first-year cross-check have separate jobs | CONCLUSION | 3 | no | FULL |
| 3 | 2 | Interactive calculator with user-controlled assumptions and exports | MULTIMODAL | 3 | yes | ABSENT |
| 4 | 3 | Seven use-case cost bands plus 6-36 week timelines | DATA | 3 | no | DEGRADED |
| 5 | 4 | Build-to-operation cost flow figure | MULTIMODAL | 2 | no | ABSENT |
| 6 | 5 | Hidden-share formula uses build divided by one minus share | DATA | 3 | yes | FULL |
| 7 | 5 | Cross-check is never added to the itemized worksheet | CONCLUSION | 3 | no | FULL |
| 8 | 6 | Lifecycle selection criteria and nonnumeric team-model treatment | CONCLUSION | 2 | yes | MISSING |
| 9 | 7 | RAG worked arithmetic from source band to selected-horizon TCO | DATA | 2 | yes | ABSENT |
| 10 | 7 | Four-scenario range matrix | MULTIMODAL | 2 | no | ABSENT |
| 11 | 8 | Market-representativeness and workload exclusions | DATA | 2 | no | FULL |
| 12 | 9 | Pending review, AI assistance and correction-state disclosure | CONCLUSION | 2 | no | DEGRADED |
| 13 | 10 | Conservative resolution of the source's 25 versus 25+ conflict | DATA | 3 | no | ABSENT |
| 14 | 11 | Claim-to-source ledger | DATA | 3 | no | ABSENT |
| 15 | 11 | Runtime registries, full provenance export and scoped deploy gate | FIRSTHAND | 3 | yes | ABSENT |

Dominant value type: DATA
Actionable share: 5/15

Claim evidence: Pharos source-of-record retrieved 2026-08-14, versioned registries, executable tests and five fixed competitor extracts
Claims: 8 positioning and quantified claims

| # | Block | Claim | Role | Status | Evidence | Disposition |
|---|-------|-------|------|--------|----------|-------------|
| 1 | 1 | The aggregated sample contains exactly 25 delivered projects | PRIMARY | OBSERVED | Source methodology, CLAIM-SAMPLE-25 and visible scope conflict note | KEEP |
| 2 | 3 | The source supplies seven use-case bands and 6-36 week timelines | PRIMARY | OBSERVED | SOURCE-PHAROS-AI-COST-2026 and benchmark registry v1.0.0 | KEEP |
| 3 | 5 | Hidden cost represents 28-42% of first-year total spend | PRIMARY | OBSERVED | Source text and CLAIM-HIDDEN-28-42 | KEEP |
| 4 | 5 | TCO equals build divided by one minus hidden share for this cross-check | PRIMARY | OBSERVED | Denominator wording, FORMULA-HIDDEN-SHARE-V1 and unit contract | KEEP |
| 5 | 7 | The default RAG worksheet yields $42K-$67K | SUPPORTING | OBSERVED | Visible arithmetic and calculator test | KEEP |
| 6 | 2 | Unknown qualitative scope changes warnings, not numeric outputs | SUPPORTING | OBSERVED | Calculator implementation and unchanged-numeric test | KEEP |
| 7 | 3 | The enterprise multi-agent upper boundary remains open above $500K | SUPPORTING | OBSERVED | Source table, registry flag, UI and export contract | KEEP |
| 8 | 9 | Technical review is pending and publication is blocked | SUPPORTING | OBSERVED | Visible disclosure, review.json and evaluateReleaseGate | KEEP |

Replaceability verdict: PASS - five competitors share cost guidance, but none reproduces the bounded corpus, correct denominator, open-bound propagation and output-to-claim trace together.
Summary-coverage verdict: PASS - SCS 44% - the independent summary cannot carry the interactive calculator, worked trace, claim ledger or executable release controls.
Claim-grounding verdict: PASS - every primary quantitative claim is observed in the source, registry or executable contract; no primary claim is claim-only or contradicted.
Meta fields: selected the exactly 25-project corpus for the primary title and the 28-42% first-year denominator for the companion description; both facts are visible and source-bound.
gist_lint: exit 0, 0 findings
