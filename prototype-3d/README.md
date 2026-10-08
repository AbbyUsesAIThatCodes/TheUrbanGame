# The Urban Game — Local 3D Review

The owner-authorized **1.1.0 A Town Takes Shape** review covers the original setup, all 20 rounds, the urbanization conclusion, and both original reflection question sets. On October 8, 2026, the owner authorized promoting this exact Build019 to [GitHub Pages](https://abbyusesaithatcodes.github.io/TheUrbanGame/). See [Hosting](../HOSTING.md) for current deployment, save separation, and preserved 1.0.0 rollback. The local review instructions below retain their original host context.

## Open The Review

The current Build019 wording review is served at **http://127.0.0.1:8770/review-build-019/**. Navigate the existing game tab to this path when ready; it uses the same origin and save key. The original root remains Build018. A separate test server serves this checkout on port8771. From `prototype-3d/`, `npm run serve` serves the current distribution on port8770 when that port is free. `current-build.json` identifies its exact build, manifest, versioned directory, and payload hashes. Build outputs are retained under `.builds/<full-ID>/`; `dist/` is the currently served copy.

For a fresh source checkout, run `npm ci`, `npm run build`, then `npm run serve`. Each real build reserves a new ordinal. Do not rebuild just to change a commit label.

## Original Classroom Content

The original 29×32 board, building footprints, required additions, constraints, dates, demolition, bridge replacement, smoke shading, and two railway layers remain governed by the byte-identical recovered rule engine. All 53 narrative slide texts and 33 supplemental images match their original sources. No economy, score, extra historical events, or silent historical corrections are introduced.

The full World History deck supplies all 20 rounds. The alternate original deck remains selectable through Round 10; its Round 8–10 slide numbers differ from the full deck and are mapped by their actual round headings. Later rounds visibly use the full deck. Original source images are available in the Chronicle at their relevant rounds.

Round 11 applies the original 4×4 smoke shading to every factory, shifted inward at board edges. Round 12 replaces one connected wooden crossing with iron. Round 14 requires one connected network touching every factory and coal mine. Round 17 adds a separate west-to-east railway. The original interpretations and qualitative acknowledgements are documented in the [Source Audit](../documentation/ROUND_FIDELITY_AUDIT.md).

After Round 20, read the exact original conclusion and choose either the board or slide reflection wording. Answers save automatically, remain in downloaded review saves, and export as text. Finishing adds the final history snapshot once. The expected normal-game totals include 105 houses, 22 factories, 18 tenements and 196 structures overall, with five ordinary houses demolished during Round 9.

## Controls And Illustrations

Build by selecting a tile and clicking its upper-left grid square. Drag for a continuous route. Move uses two clicks; Escape ends a gesture or cancels a move. Undo/Redo and Ctrl/Cmd+Z remain available. Erase This Round removes current-round additions. In Round9, Destroy House performs the required five-house removal; nice houses do not count.

The accepted controls and layout are preserved: screen-relative Pan & Inspect, middle-button orbit, right-drag rotation, Rotate mode, wheel zoom, north-up Overhead, Frame Village, Focus, and independently collapsible panels. The compact title banner reads **version codename BuildNNN**. Guide → About This Build retains the canonical ID, fixed UTC timestamp and source revision.

The original 2D illustrations are permanent chooser and inspector artwork. The cottage, nice house and factory now use detailed geometry based on the inspected atlas: limestone courses, terracotta/slate tiles, framed windows, manor balcony and stairs, and the brick mill’s arched facades, roof lantern and era-appropriate wheel or chimney. Shared geometry and vertex colors keep repeated buildings economical to render. The 3D models are separate geometric representations with the same logical footprints. Navigation and model appearance do not change the village data.

## Earlier Saves And Preserved Builds

The version 3 review wrapper imports version 1 Round 1 and version 2 Round 5 review saves, preserving the core state and round-start snapshot without advancing automatically. Earlier completed milestones wait for their normal next-round action. Version 3 saves record their review limit so completed intermediate local reviews can also continue in later builds.

The current browser key is `nch-urban-game-3d-full-review-v3`. If absent, the app copies a valid save first from `nch-urban-game-3d-round5-review-v2`, then from `nch-urban-game-3d-round1-review-v1`. Both earlier values remain untouched. The accepted 2D key `nch-urban-game-v1` is never read or written.

Builds 006, 008, 011 and the complete-game Build015 remain in immutable distributions, local baseline branches, and sibling QA folders. The wording correction continues on `review/3d-round9-wording`; `review/3d-full-game` preserves Build018. The owner authorized review-branch uploads for preservation. The earlier source and immutable Builds015/017/018 are preserved; Build019 adds the approved wording correction; see [Review Downloads](../review-builds/README.md). The original review did not authorize deployment; the October 8 authorization and current hosting are documented above.

## Validation

Run the browser suites serially against the selected local server. `URBAN_REVIEW_URL` defaults to `http://127.0.0.1:8770/`; set it to the current Build019 URL or the isolated port8771 server when testing this checkout:

```powershell
$env:URBAN_REVIEW_URL='http://127.0.0.1:8771/'
npm test
npm run test:browser
npm run test:camera
node tests/placement-regression.cjs
node tests/late-actions.cjs
node tests/round9-wording.cjs
node tests/model-visuals.cjs
$env:START_ROUND='1'
npm run test:full-browser
python tests/verify_build.py
python ../tools/audit_classroom_sources.py
```

Tests use isolated headless Chromium with software WebGL, not the owner's Vivaldi session. Test saves contain generated QA villages. Full-round browser checks verify every served payload hash, original narratives/images, normal UI actions, incomplete-round blocking, every boundary save/reload/reopen, rendered transport/smoke, final question wording, answer persistence and text exports. The source-mapped simulation independently verifies every original round without teacher overrides.

Physical touch devices, other browser engines and classroom hardware performance remain outside automated coverage. See [Validation](VALIDATION.md), [Extension Checkpoints](../documentation/FULL_GAME_REVIEW.md), and [Build Identity](../documentation/BUILD_IDENTITY.md) for exact evidence and limitations.
