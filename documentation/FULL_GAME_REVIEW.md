# Full Game Extension Checkpoints

The owner authorized all original rounds, then selected 3D model improvements. Public Pages remains at the accepted baseline. No historical claims, economy, scoring, or additional game events are introduced. The original rule engine remains byte-identical.

## Build012 — Rounds 6–10

- Source baseline: `3b5e7e193822` plus manifest-recorded dirty input fingerprint `ebc4f240cc16`.
- Canonical build: `1.1.0_A-Town-Takes-Shape_local-3d-review_build-012_20261005T015139Z_g3b5e7e193822_dirty-ebc4f240cc16_3d-review`.
- Added normal advancement through Round10, tenement/school/jail models, Round9 demolition, exact round-based narrative lookup, and all 33 original slide images.
- Version3 wrapper imports earlier Round1/Round5 saves without changing their core state or advancing automatically. Current storage is `nch-urban-game-3d-full-review-v3`; both earlier keys remain untouched.
- 12 inherited regression tests and 26 source/model/simulation tests passed. The source simulation verifies all20 rounds independently of the currently exposed review limit.
- Headless browser passed Build011 migration and normal UI actions, source text, completion gates, and download/reload/reopen for each Round6–10. No script/network errors; accepted 2D sentinel unchanged.
- Build verification passed all48 payloads, immutable distribution, source fingerprint and allocator lock. Original audit passed four files, 53 slide texts, rule script and permanent artwork.

## Source Interpretations Retained

Orthogonal tenement distance remains at most five; Round10 retains river power; the qualitative church placement acknowledgement remains manual. The shorter deck's Round8–10 narratives are slides16–18, while the full deck uses17–19. Rounds11 onward use the full deck. These preserve the original recovered implementation and documented classroom ambiguities.

Automated browser evidence uses isolated Chromium/software WebGL. It does not establish physical touch or classroom-device performance, and never controls the owner's Vivaldi session.

## Build013 — Rounds 11–15

Canonical build: `1.1.0_A-Town-Takes-Shape_local-3d-review_build-013_20261005T015409Z_g8f919aa33711_dirty-39be003c3139_3d-review`.

Added steam-era factory chimneys and exact original 4×4 smoke shading, wood/iron crossing rendering, and connected rail rendering with water bridges. All factories, including earlier ones, receive shading from Round11. The short source deck is visibly unavailable after Round10. Corrected two stale static scope labels left in Build012; gameplay and manifest scope had already been correct.

The 28 source/model/simulation tests passed. Headless Chromium completed every Round11–15 action, checked original text/images, blocked incomplete rounds, verified rendered smoke/iron/rail counts, and downloaded/reloaded/reopened each boundary save. It reported no script/network errors and preserved accepted 2D storage. Build verification passed all49 payload files and unchanged original/Pages baselines.

The first browser run stopped at a test assertion: Playwright's disabled-state query did not report the disabled option. DOM inspection confirmed the native `disabled` attribute and property; the corrected property assertion passed. No gameplay change was needed for that test issue.


## Build015 — Complete Original Game

Canonical build: `1.1.0_A-Town-Takes-Shape_local-3d-review_build-015_20261005T020100Z_g70c9bf0269b4_dirty-b3056408f982_3d-review`.

All20 rounds, final source conclusion, both original question sets, automatic answer saving and text export are implemented. The complete fresh headless walkthrough passed all23 groups, including a SHA-256 check of every served payload, normal placement and advancement through each round, every boundary save/reload/reopen, both railway layers, smoke and iron rendering, and final reflections. It finishes with196 structures,105 houses,22 factories,18 tenements, five demolished houses and21 snapshots, without teacher overrides. The machine-readable mapping is `ROUND_COVERAGE.json`.

All43 unit/source/model/save tests passed. Build verification passed49 payloads; four originals,53 slide texts,33 restored source images, original artwork and the rule engine retain their source identities. Builds006/008/011 and accepted camera/pointer source blocks are unchanged.

Build014 exposed a theater column extending0.0085 grid units past its footprint; Build015 fixes it. A cross-context test comparison was normalized correctly. The earlier fast-navigation browser run also recorded one unfinished image request; the complete rerun waits for image decoding, verifies all asset hashes, and records navigation cancellations separately. It passed with 0 cancelled requests and no script or asset failures. Build014 remains identifiable but is not the validated review.

The complete-game artifact and its QA evidence were preserved before any artwork-inspired model refinements.
