=== SEMANTIC HTML AUDIT: rendered docs/index.html with methodology companion ===
Capture: rendered
Mode: full
Skipped: none
Page type: Cost calculator - Commercial pages - confidence high
Secondary type: Overview hub
Classification signals: primary form has fieldset, legend, label, input, select, output and buttons; visible formulas and worked arithmetic; seven-row benchmark table; methodology article and claim ledger
Primary intent: Help a product decision-maker create and inspect a bounded AI MVP budget and TCO planning range.
Primary entity: AI MVP Cost Calculator 2026; the source study remains a supporting evidence entity rather than a competing offer.
Key facts: exactly 25 delivered projects; Jan 2023-Mar 2026 sample window; seven use cases; 6-36 week source timelines; 28-42% first-year hidden-cost share; itemized and cross-check formulas remain separate; enterprise multi-agent high is open above $500K; technical review is pending
Summary: The rendered page presents one interactive cost calculator as the central entity. A fact pack establishes the sample, time window, use-case count and review state before the form. Native controls collect source scope, selected horizon, user costs and qualitative uncertainty, while output elements expose two separate result modes. Tables, figures, formula cards, a worked example and limitations provide readable mirrors around the interaction. The methodology companion adds dataset boundaries, source conflict handling, a claim ledger and release controls. No critical fact exists only inside an unlabeled visual or hidden interaction.

Semantic map:
| # | Zone | Present | Marked up as | Verdict | Note |
|---|------|---------|--------------|---------|------|
| 1 | Page header | yes | header.site-header | strong | Site identity and route navigation are separated from the calculator article. |
| 2 | Navigation | yes | nav with an unlabeled list of links and aria-label | strong | Calculator, benchmark and methodology destinations remain visible on mobile. |
| 3 | main | yes | main#main-content | strong | The skip link targets the single primary content landmark. |
| 4 | Hero or entity intro | yes | article > header.hero with h1 and lede | strong | The entity, job, caveat and sample facts appear before interaction. |
| 5 | Entity listing | yes | select options and benchmark table rows | strong | Seven solution entities share one source-bound vocabulary. |
| 6 | The central entity | yes | section#calculator with form and results | strong | Parameters and outputs have explicit semantic boundaries. |
| 7 | Facts and specifications | yes | dl.fact-pack, fieldsets, output and formula cards | strong | Sample, versions, assumptions and results are machine-readable or plainly labeled. |
| 8 | Narrative description | yes | retrieval-intent sections with h2 and paragraphs | strong | Cost composition, hidden spend, lifecycle, scenarios and limits are clean chunks. |
| 9 | Tabular data | yes | two table elements with caption, thead, tbody and th | strong | Benchmark and claim-ledger relationships are true two-dimensional data. |
| 10 | FAQ or help | no | not present | not applicable | Repeated FAQ answers were intentionally excluded because body sections answer the relevant questions. |
| 11 | Trust blocks | yes | limitations section, authorship dl, time and methodology article | strong | Ownership, AI assistance, source scope, review status and update date remain visible. |
| 12 | Related and aside blocks | yes | aside.note and methodology links | strong | The pending-review boundary is separate from primary explanatory prose. |
| 13 | Footer and legal blocks | yes | footer.site-footer | strong | Formula/data versions and privacy boundary close the document. |

Strengths:
- The form uses native fieldsets, legends, labels, numeric inputs, selects and outputs -> parameters remain extractable and usable without a div-based control model -> the calculator type is explicit.
- The hero fact pack uses dl/dt/dd -> stable sample and review attributes are separated from prose -> answer engines can lift a compact fact block.
- Benchmark and claim data use captioned tables -> row and column relationships survive styling and horizontal scrolling -> cost and evidence comparisons remain quotable.
- Three SVG figures carry title, description and figcaption plus visible prose mirrors -> visual evidence does not become an extraction dead end -> mobile scrolling costs no factual loss.
- The rendered DOM exposes current results while source HTML retains table, formula, scenario and limitation fallbacks -> the page remains meaningful before or without calculation -> citation does not depend on one UI state.
- JSON-LD reuses the canonical Pharos organization ID and separates WebPage, WebApplication, Dataset and TechArticle -> machine entities do not compete or invent a second publisher -> knowledge-graph identity stays consistent.

Critical issues: no critical issues

Dimension audit: A. Document landmarks use html lang, page header, nav, main, article, aside and footer, with no SD01-SD03 candidates; B. Entity boundaries isolate the calculator, scenario articles, figures and methodology article; C. Thematic structure uses one h1 and intent-named h2/h3 chunks, with no SS01-SS03 candidates; D. Facts and attributes use dl, table, ul, time, code, figure, figcaption and output, with no SF01-SF02 candidates; E. AI-extractability and citation readiness come from the fact pack, benchmark table, formula pair, worked arithmetic, limitations and claim ledger.

Missed opportunities:
- Named reviewer / authorship block / add Person markup only after a real name, role and timestamp enter review.json / strengthens expertise without fabricating approval.
- Public correction destination / authorship and methodology trust blocks / replace pending text with the created repository issue URL at release / makes correction handling actionable.
- Dataset download discovery / benchmark section / retain visible JSON and CSV links beside the table / lets machines and analysts reach the exact registry without inspecting JSON-LD.
- Review binding visibility / methodology controls / print the approved dataset and formula versions beside the future reviewer / makes post-release scope drift obvious to readers.
- No-JavaScript state / calculator section / retain the noscript explanation and readable benchmark/formula fallbacks / prevents an empty-tool interpretation when scripting is unavailable.

Recommendations:
- Review trust block / Current pattern: explicit pending owner and no Person / Target pattern: named reviewer dl row plus matching Person JSON-LD after approval / Priority: high / Effort: low / Expected effect: verifiable expertise and exact release accountability.
- Correction path / Current pattern: honest pending repository URL / Target pattern: crawlable issue URL once the public repository exists / Priority: high / Effort: low / Expected effect: actionable correction policy.
- Approved scope / Current pattern: machine-readable review.json only / Target pattern: visible dataset version, formula version and approval time in the trust dl / Priority: medium / Effort: low / Expected effect: human-readable version binding.
- Diagram mobile affordance / Current pattern: horizontally scrollable wide SVG / Target pattern: visible scroll cue before each wide figure on small screens / Priority: low / Effort: low / Expected effect: discoverable access to readable labels.
- Methodology breadcrumb / Current pattern: return link and header navigation / Target pattern: two-item BreadcrumbList and visible local breadcrumb / Priority: low / Effort: low / Expected effect: clearer companion-page hierarchy.

Page-type upgrades:
- Keep every numeric parameter inside the existing fieldset and label structure; do not move assumptions into unlabeled cards.
- Keep the selected-horizon result and first-year cross-check in distinct result cards with distinct formula IDs.
- Preserve one fully worked RAG example because it makes the pure formula inspectable without manipulating the form.
- Preserve the claim ledger and visible download links as the calculator's evidence layer rather than expanding generic explanatory copy.
- Add reviewer identity and approved version scope only in the same release commit that changes review.json to approved.

Implementation plan:
- Quick fixes: after approval, replace the two pending trust rows with reviewer name, role, timestamp and public correction URL; update matching JSON-LD.
- Medium: add a visible mobile scroll cue to wide figures if user testing shows that clipped labels are not discovered.
- Deep refactor: none; the current dependency-free semantic skeleton fits the cost-calculator page type.

Repackaging examples:
- none needed

Checks:
| Check | Severity | Candidates | Adjudicated | Note |
|-------|----------|------------|-------------|------|
| SD01 | FAIL | 0 | 0 | Rendered pages retain html, head and body structure. |
| SD02 | FAIL | 0 | 0 | Rendered pages contain one main landmark. |
| SD03 | FLAG | 0 | 0 | Header, nav, aside and footer landmarks are correctly separated. |
| SS01 | FLAG | 0 | 0 | Heading levels remain ordered. |
| SS02 | FLAG | 0 | 0 | Sections carry explicit headings. |
| SS03 | FLAG | 0 | 0 | Heading labels describe distinct retrieval jobs. |
| SF01 | FLAG | 0 | 0 | Tables, lists, dl blocks and output facts match their data shapes. |
| SF02 | FLAG | 0 | 0 | Figures carry accessible descriptions and captions. |

Findings by family: SD 0 - SS 0 - SF 0
Findings by severity: FAIL 0 - FLAG 0
Semantic verdict: PASS - rendered index and methodology pages expose the central tool, facts, formulas, evidence and trust boundaries with no surviving mechanical or judgment blocker.
semantic_lint: exit 0, 0 findings
