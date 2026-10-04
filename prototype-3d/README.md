# The Urban Game — 3D Round 1 Review

This is an isolated local prototype of setup and Round 1. The accepted 2D Pages site, source originals, and Pages deployment folder are unchanged. Nothing from this review has been pushed, merged, or deployed.

## Open The Local Review

From this directory:

```powershell
npm install
npm run build
npm run serve
```

Open `http://127.0.0.1:8770/`. The current task has already built and started this local preview. `dist/` contains the review artifact, and `.builds/<full-build-ID>/` retains the same versioned output. See `current-build.json` for the current ID and all payload hashes. Running the build again reserves a new ordinal; reopening or retesting the same output does not.

## Milestone

- The entire window is a 3D town on the original 29 × 32 grid.
- Pan, zoom, rotation, north-up overhead view, Frame Village, and Focus support close inspection.
- Compact floating instructions and building tools collapse independently. Original artwork is visible in the chooser and at a larger size in the inspector.
- Distinct geometric placeholders represent the setup buildings and nice house. Their geometry stays within the original one-square or 2 × 2 footprints. These are review models, not finished replacement artwork.
- A labelled prepared village satisfies the original setup without overrides. Save & Open also offers a blank setup, which can be completed normally.
- Round 1 requires the original canal, mine connection, nice house, and qualitative acknowledgement. Completion stops at Round 1; later rounds are not playable here.
- Review saves use `nch-urban-game-3d-round1-review-v1`, separate from the accepted `nch-urban-game-v1` save. Download/open controls are limited to review saves.

The unmodified original rule engine is in `src/recovered/rules.js`. The source audit covers all 20 rounds and all 53 slide texts in [Round Fidelity Audit](../documentation/ROUND_FIDELITY_AUDIT.md). The audit identifies inherited interpretations rather than claiming every paper instruction has only one possible digital interpretation.

## Controls

Choose a build tile, then click its upper-left square on the ground. Drag for a continuous waterway or road. Move uses two clicks. Escape ends a placement gesture or cancels a move. Undo and Redo preserve reversibility. Pan & Inspect lets you drag the view or click a building; Focus brings that building closer. Use Overhead for exact square placement.

Camera navigation does not mutate the village. Placement capture is explicitly released on pointer-up, cancellation, lost capture, focus loss, and Escape. The old 2D HTML drag handlers are not reused. The reported 2D freeze itself has not been diagnosed or changed.

## Validation

```powershell
npm test
npm run test:browser
python ../tools/audit_classroom_sources.py
```

The browser suite expects the local server on port 8770 and an installed Playwright Chromium browser. In a fresh environment, install that browser with `npx playwright install chromium`. This task reused the browser already available on the machine.

Browser results and screenshots are in ignored `test-output/`. See [Review Validation](VALIDATION.md) for the current tested artifact and limitations. The current check uses Chromium with software WebGL in an isolated browser context; it never attaches to the owner's Vivaldi session.

## Local Build Identity

This review retains inherited release `1.0.0 River & Hearth` and is explicitly marked `local-prototype`, not a new published release. `build.py` reserves an ordinal under `local-3d-round-1` in `build-ledger.json`, captures UTC once, fingerprints the actual source/vendor inputs, and records the source SHA and dirty state. It prints the same ID used in the versioned output directory, manifest, visible footer, and current report. The full location inventory is in [Build Identity](../documentation/BUILD_IDENTITY.md).
