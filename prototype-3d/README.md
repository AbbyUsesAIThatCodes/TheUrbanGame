# The Urban Game — A Town Takes Shape

**1.1.0 A Town Takes Shape** is the approved local review of setup and Rounds 1–5. The accepted 2D Pages site, original source files, and Pages deployment folder remain unchanged. No 3D review has been pushed, merged, or deployed.

## Open The Local Review

Open **http://127.0.0.1:8770/**. The current task has already built and started the preview. To restart the same artifact from this directory, run:

```powershell
npm run serve
```

`dist/` contains the current review; `.builds/<full-build-ID>/` preserves each immutable distribution. [Current Build](current-build.json) records its exact identity and payload hashes. Reopening or retesting does not create a new build.

For a fresh source checkout, run `npm ci` and `npm run build` before serving. Each new build reserves the next ordinal. Do not rebuild merely to change a source-commit label.

## Milestone

- Full-window 3D town on the original 29 × 32 grid, with the accepted build 008 camera controls and layout.
- Pan, zoom, middle-button orbit, Rotate, north-up Overhead, Frame Village, and Focus.
- Independently collapsible floating panels and permanent original 2D illustrations in the chooser and larger inspector.
- The original setup and Round 1 remain playable. A labelled prepared village is available, as is a blank setup.
- Round 2 adds five houses; Round 3 opens the commons and adds five houses and a nice house inside them.
- Round 4 adds a river-powered factory and five houses. The new factory is a distinct 2 × 2 brick mill placeholder with a wooden waterwheel; existing models are unchanged.
- Round 5 adds 15 houses, a church, a pub, and a store, with optional roads and at most one additional bridge crossing.
- Completion stops at Round 5 in 1774 with 40 houses and 52 structures. Later rounds and final reflections are outside this milestone.

The original rule script remains byte-identical in `src/recovered/rules.js`. Both original narrative decks remain selectable. See the [Rounds 2–5 Audit](../documentation/ROUNDS_2_TO_5_REVIEW.md) for exact actions, constraints, source wording differences, and inherited interpretations, and the [Complete Source Audit](../documentation/ROUND_FIDELITY_AUDIT.md) for all 20 rounds.

## Controls

Choose a tile, then click its upper-left grid square. Drag to draw a waterway or road. Move uses two clicks; Escape ends placement or cancels a move. Undo and Redo remain available, including Ctrl/Cmd+Z and Shift+Ctrl/Cmd+Z.

Pan & Inspect follows pointer movement equally along both screen axes at every camera angle and zoom, away from the travel boundary. Hold the middle mouse button and drag horizontally to orbit without switching tools. Rotate mode and right-drag remain available. Overhead stays north-up and rotation-locked. Frame Village restores the whole board.

Navigation never changes the village. Navigation and placement recover after release, cancellation, lost capture, focus loss, and Escape. The legacy 2D drag handlers are not reused; the previously reported 2D freeze itself has not been diagnosed or changed.

## Earlier Saves

Version-1 3D review saves from builds 006 and 008 import into a version-2 wrapper. Their game state and round-start snapshot are preserved. A completed Round 1 village remains at Round 1 with a **Begin Round 2** button; incomplete setup or Round 1 progress is not advanced.

The current browser key is `nch-urban-game-3d-round5-review-v2`. When no current save exists, the app copies a valid earlier 3D save from `nch-urban-game-3d-round1-review-v1` and leaves the earlier value untouched. The accepted 2D key `nch-urban-game-v1` is never read or changed. Downloaded saves use the new wrapper; earlier builds continue to use their preserved earlier saves.

## Validation

```powershell
npm test
npm run test:browser
node tests/camera.cjs
python tests/verify_build.py
python ../tools/audit_classroom_sources.py
```

Run the browser suites one at a time. They expect the local server on port 8770 and Playwright Chromium (`npx playwright install chromium` in a fresh test environment). Results and screenshots are in ignored `test-output/`. Tests use isolated Chromium with software WebGL, never the owner's Vivaldi session. Earlier-save fixtures are generated QA villages rather than owner data. [Validation](VALIDATION.md) records the current results and limits.

## Build Identity And Preserved Reviews

The authoritative release record is `release.json`. The compact header reads **version codename BuildNNN**, as explicitly requested by the owner. Full canonical identity, fixed UTC time, source revision, and dirty-input fingerprint remain in the manifest, versioned output directory, console, current report, and Guide's **About This Build** section.

The durable allocator continues the existing ordinal sequence under stable scope `local-3d-review`; older artifacts keep their original scope and identifiers. See [Build Identity](../documentation/BUILD_IDENTITY.md) for all locations.

Accepted builds 006 and 008 remain in `.builds/`, with source branches `review/3d-build-006` and `review/3d-build-008`. Their original QA evidence is preserved in sibling workspace folders `qa-3d-build-006` and `qa-3d-build-008`. Current work is on local branch `review/3d-rounds-2-5`.
