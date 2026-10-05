# Local Review Validation

Validated artifact: **1.1.0 A Town Takes Shape Build011**.

Full identity: `1.1.0_A-Town-Takes-Shape_local-3d-review_build-011_20261005T003126Z_g698cddb5b049_dirty-5c7f7532b83e_3d-review`.

This is a local prototype with explicitly recorded source revision and dirty-input fingerprint. It has not been published. The later local commit records the same tested inputs without rebuilding the artifact. GitHub main and accepted Pages remain at `5059061dea9c106de5f70d25a6e238629ac76217`.

## Source Fidelity And Preserved Reviews

- All four original files retain their original sizes and SHA-256 hashes.
- All 53 slide texts match the two PowerPoints when whitespace is ignored. Both source narratives for every playable round were checked in the browser.
- The rule script and both original artwork PNGs remain byte-identical to the recovered originals.
- All 14 payload files in each accepted build 006 and 008 remain unchanged. Their original QA evidence and local source branches are preserved.
- The camera and pointer-handler source blocks are byte-identical to accepted build 008. Existing models and permanent original illustrations remain; the factory is the only new building model.
- [Rounds 2–5 Audit](../documentation/ROUNDS_2_TO_5_REVIEW.md) records exact additions, placement rules, source wording differences, bridge interpretation, and reflection boundaries.

## Rules, Models, And Saves

All **12 rule/model/save tests** passed. They cover rule provenance; original setup and Round 1; normal progression through Round 5; totals of 40 houses and 52 structures; commons protection and opening; the Round 3 nice house remaining inside the former commons; river-only factory power; optional roads/bridges and the second-crossing limit; earlier-save migration; incomplete-progress preservation; rejection of later rounds or invalid completion flags; and every model's footprint.

Round progression uses no teacher overrides. Round 5 completion stays at Round 5 and leaves the original game's `finished` flag false. There is no Round 6 UI or final reflection prompt.

## Gameplay Browser Checks

All **19 Chromium gameplay checks** passed:

- Prepared village, original rule engine, compact label, and full embedded identity load.
- Pan and rotation change the view without modifying the village.
- North-up overhead view, frame reset, and zoom controls.
- Close inspection, enlarged original artwork, and collapsible floating panels.
- Both original Round 1 narratives are shown verbatim.
- Protected commons, manor placement, undo, and redo use original requirements.
- Complete Round 1 through normal UI with no override and begin Round 2.
- Round 2: exact narratives, year, normal additions, constraints, boundary save/reopen, and completion.
- Round 3: exact narratives, year, normal additions, constraints, boundary save/reopen, and completion.
- Round 4: exact narratives, year, normal additions, constraints, boundary save/reopen, and completion.
- Round 5: exact narratives, year, normal additions, constraints, boundary save/reopen, and completion.
- Round 5 stops the milestone, saves reopen in a fresh context, and unsupported Round 6 imports preserve the village.
- Repeated house placement recovers from outside release, pointer cancel, lost capture, and focus-loss signal.
- Escape, tool switching, cemetery placement, repeated houses, and context-menu cancellation leave UI responsive.
- Blank setup can be built completely through the 3D UI and advances normally.
- Accepted 2D save key is never changed.
- Build 006 and 008 browser saves migrate automatically, continue to Round 2, and preserve both earlier save keys.
- Narrow viewport defaults to a clear board with collapsed panels.
- No JavaScript errors or failed network requests.

Round-boundary saves were downloaded, reloaded, and reopened for Rounds 2, 3, 4, and 5, with an additional Round 4 save after placing the factory. A completed Round 5 save also opened in a fresh browser context. Build 006 and 008 browser saves migrated into the new storage key, continued into Round 2, survived reload, and left both the earlier 3D value and accepted 2D sentinel unchanged.

## Camera And Header Checks

All **8 camera/header check groups** passed:

- 27 pan measurements match pointer pixels across three orientations, three zooms, and both axes, with no release drift.
- Middle-button horizontal orbit works while building, preserves tilt and state, suppresses browser defaults, and leaves wheel zoom working.
- Overhead remains north-up and rotation-locked with middle-button input.
- 12 interrupted pan/orbit cases recover: cancel, lost capture, focus-loss signal, Escape, outside release, and missing buttons; placement and keyboard undo still work.
- Low-angle extreme panning keeps a grounded orbit pivot and camera above the board, respects navigation bounds, and Frame Village restores the center.
- Split header shows the compact label, year, round, and actions without a footer or overlaps at 1600, 1000, 720, and 390 pixels.
- A build 006 review save migrates without losing progress and can continue into Round 2.
- No JavaScript errors during camera or header checks.

The 27 pan measurements span three orientations, three zoom levels, and horizontal, vertical, and diagonal drags; each matches the requested distance within 0.001 pixels and stops without drift. Twelve interrupted pan/orbit cases recover with working Guide, wheel zoom, placement, and keyboard undo. Extreme low-angle travel stays above the board and within the navigation boundary.

The compact label was checked at widths 1600, 1000, 720, and 390. Guide's About This Build contains the full canonical identifier, exact UTC time, and complete source revision. Desktop, factory inspection, completed Round 5, mobile, header, and About screenshots were visually reviewed.

## Build And Test Evidence

`tests/verify_build.py` passed: release/package/manifest agreement, compact label derivation, full embedded manifest, all 14 payload hashes, immutable distribution, source fingerprint, distinct build ordinals, and allocator-lock rejection without mutation. The committed inputs were compared with the tested source bytes before handoff. Accepted `originals/`, `docs/`, and root `README.md` have no changes.

Evidence lives in ignored `test-output/browser-results.json`, `test-output/camera-results.json`, saved round-boundary JSON files, and screenshots. Baseline preservation evidence also exists in the sibling workspace file `3d-accepted-baseline-verification.json`.

## Limits

Browser tests used isolated Chromium with software WebGL on this Windows machine. Actual touch gestures, other engines, school-device restrictions, and hardware performance remain untested. Focus-loss tests dispatch a signal rather than physically switching applications. The owner's Vivaldi session and storage were not accessed.

The original 2D freeze was not diagnosed or changed. Original historical wording is preserved as supplied, and inherited placement interpretations remain documented rather than silently replaced. No new economy, scoring, historical event, later round, or intermediate reflection is introduced. No prototype content has been pushed or deployed; no billing, spending, Actions artifacts, or private Site settings were changed.
