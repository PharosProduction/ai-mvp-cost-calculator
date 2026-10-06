=== GIST AUDIT: AI MVP Cost Benchmark Explorer 2026 and methodology ===
Intent/job: Help founders and technical buyers compare source budget bands, itemize operation and carry their assumptions into a scope discussion.

| # | Block | Purpose | Utility | Redundancy | Distinctiveness | Action |
|---|---|---|---|---|---|---|
| 1 | Hero and scope | Name the planning decision | High | Low | High | keep |
| 2 | Calculator and results | Compute explicit scenarios | High | Low | High | keep |
| 3 | Benchmark table and research link | Expose the 21 bands and source | High | Low | High | keep |
| 4 | Cost composition | Explain additions to the build | Medium | Medium | Medium | keep |
| 5 | Hidden-share formula | Prevent denominator confusion | High | Low | High | keep |
| 6 | Timeline and team model | Define qualitative selections | High | Medium | Medium | keep |
| 7 | Worked scenarios | Show traceable arithmetic and open upper bound | High | Medium | High | keep |
| 8 | Limitations | Bound evidence and applicability | High | Low | High | keep |
| 9 | Ownership and review | Disclose current review state | High | Low | Medium | keep-required |
| 10 | Methodology and claims | Explain provenance, count conflict and export schema | High | Low | High | keep |

Missing nodes:
- Trust: a named release reviewer is pending. The article's external reviewer does not approve this tool.
- Operational: public corrections URL is deferred until the intended GitHub repository exists.
- Implementation: default assumptions, double-counting and source timeline scope were clarified before final copy.

Competitors fetched: 3/3
Unfetched: none
Competitor map:

| Observation | Evidence (which competitors) | Implication for our page |
|---|---|---|
| Starting prices with assumptions and build/third-party boundaries | https://www.raftlabs.com/services/ai-development-cost-calculator (read2026-10-06) | Keep scope and operation visible, avoid treating a reference as a quote. |
| Wizard emphasizes platform, AI features and timeline | https://weekonelabs.com/tools/mvp-cost-calculator (read2026-10-06) | Our distinct job is provenance and independently itemized operation. |
| Downloadable lifecycle data already exists in the category | https://github.com/salttechno/ai-development-cost-benchmark-2026 (read2026-10-06) | Do not claim that CSV export or open benchmarks are unique. |

Summary source: self
A useful AI MVP budget starts with a use case and a delivery stage. This tool uses seven published use-case bands, with MVP, production and enterprise levels. The source methodology describes25 projects delivered from January2023 through March2026, while its summary uses25+. Those figures describe one provider's reported delivery sample. They do not establish an industry-wide market distribution, and no private project records are supplied.

Choose a band or enter a known build budget. Add only costs that the build budget does not already include. The itemized total adds one-time extras and the monthly operating rate multiplied by the selected horizon. In the RAG example, a25000–50000 build range plus5000 additional discovery and1000 per month produces42000–67000 over12 months. These extra amounts are illustrative, not recommendations.

A separate first-year comparison interprets hidden costs as28–42% of the total, so it divides build by one minus the share. It is never added to the itemized total and does not change with the selected operating horizon. An enterprise multi-agent upper band remains open above500000, and derived highs retain that open boundary. Timelines describe kickoff to first production deployment, not separate lifecycle promises. Team-model choices and unknown scope change context and warnings, not coefficients. JSON and CSV keep the user's assumptions and result provenance available for review. Technical release review remains pending. The tool is an aid to scope discussions, not an individual quote or guarantee.

Content units: 15 units across10 blocks.

| # | Block | Unit | Type | Weight | Actionable | Status |
|---|---|---|---|---|---|---|
| 1 | 1 | Source methodology reports25 projects, Jan2023–Mar2026 | DATA | 3 | no | FULL |
| 2 | 2 | Interactive scenario editing and downloadable assumptions | MULTIMODAL | 3 | yes | ABSENT |
| 3 | 2 | Additional costs must exclude costs already in build | CONCLUSION | 2 | yes | FULL |
| 4 | 3 | Seven use cases and all21 lifecycle bands | DATA | 3 | no | DEGRADED |
| 5 | 4 | Visual cost composition | MULTIMODAL | 2 | no | ABSENT |
| 6 | 5 | Share-of-total formula at28% and42% | DATA | 3 | yes | FULL |
| 7 | 5 | Cross-check remains first-year and separate from itemized | CONCLUSION | 2 | no | FULL |
| 8 | 6 | Timeline boundary and qualitative team model | CONCLUSION | 2 | yes | FULL |
| 9 | 7 | RAG worked example42000–67000 | DATA | 2 | yes | FULL |
| 10 | 7 | Enterprise500000+ preserved in derived highs | DATA | 3 | yes | FULL |
| 11 | 8 | Single-provider data and no project-level distribution | DATA | 3 | no | FULL |
| 12 | 9 | Review pending, AI assistance, creation/update history | DATA | 2 | no | DEGRADED |
| 13 | 10 | 25 versus25+ conflict and conservative use | DATA | 3 | no | DEGRADED |
| 14 | 10 | Claim ledger and exact export provenance | DATA | 3 | yes | MISSING |
| 15 | 10 | Measured no-JS and midpoint defect repairs | FIRSTHAND | 3 | yes | ABSENT |

Dominant value type: DATA
Actionable share: 8/15

Claim evidence: Source report viewed2026-10-06, source-verification.json, canonical registries, calculator tests and browser-checks.json
Claims: Nine quantitative or positioning claims.

| # | Block | Claim | Role | Status | Evidence | Disposition |
|---|---|---|---|---|---|---|
| 1 | 1 | Methodology reports25 projects | PRIMARY | OBSERVED | Source methodology; competing25+ wording disclosed | NARROW |
| 2 | 3 | 21 bands across7 use cases; source timelines6–36 weeks | PRIMARY | OBSERVED | All seven source table rows checked against registry | KEEP |
| 3 | 3 | Median42000 and p90 180000 are source sample statements | SUPPORTING | OBSERVED | Source executive summary, not independently audited records | KEEP |
| 4 | 5 | Hidden costs are28–42% of total first-year spend | PRIMARY | OBSERVED | Source hidden-cost section and algebraic derivation | KEEP |
| 5 | 7 | Illustrative RAG itemized42000–67000 and cross-check34722–86207 | SUPPORTING | OBSERVED | Unit tests and browser default scenario | KEEP |
| 6 | 7 | Enterprise500000+ remains open | SUPPORTING | OBSERVED | Source row, registry flag, browser and export tests | KEEP |
| 7 | 2 | Team and uncertainty flags do not alter numeric output | SUPPORTING | OBSERVED | Calculation code, unit test, browser warning scenario | KEEP |
| 8 | 2 | No native form submission of assumptions | SUPPORTING | OBSERVED | Disabled default fieldset, CSP form-action none, no-JS browser check | KEEP |
| 9 | 9 | Release review remains pending | SUPPORTING | OBSERVED | Unchanged review.json and exact-scope gate | KEEP |

Replaceability verdict: PROVISIONAL PASS - three public page extracts support distinct source/formula/open-bound utility, but competitor wizard states were not exercised.
Summary-coverage verdict: PROVISIONAL PASS - SCS 63% - self-summary cannot reproduce the interactive worksheet, exports or full claim ledger.
Claim-grounding verdict: PASS - primary numbers resolve to the cited source; the count claim is explicitly attributed rather than independently verified.
Meta fields: the requested2026 Explorer name and seven-use-case/formula description; no market-ranking or unique-data claim.
gist_lint: exit 0, 0 findings
Locale-differentiation verdict: SKIPPED (single variant)
