# Local Review Validation

Validated artifact: `1.0.0_River-and-Hearth_local-3d-round-1_build-008_20261004T235623Z_g5965d80a4687_dirty-811f5b412d7d_3d-review`.

This is a local prototype built from the approved build 006 source commit with explicitly recorded dirty input state and a complete source fingerprint. It has not been published. The accepted Pages commit remains `5059061dea9c106de5f70d25a6e238629ac76217`. Build 006 and its evidence remain preserved; all 14 of its payload hashes were rechecked. Original models, rules, save code, illustrations, and recovered source content have no changes from that baseline.

## Source Fidelity

- All four preserved original files still match their original sizes and SHA-256 hashes.
- All 53 slide texts match the two original PowerPoints when whitespace is ignored.
- The prototype rule script is byte-identical to the recovered original script. Both original artwork PNGs are byte-identical to the preserved embedded assets.
- The audit records setup, all 20 rounds, source slide numbers, additions, placement constraints, final counts, reflection wording, and unresolved interpretations.

## Tests Passed

Six rule/model tests cover exact rule provenance, valid prepared setup without overrides, normal Round 1 completion requirements, protected commons and footprints, disconnected-canal rejection, duplicate placement limits, review-save scope, and all placeholder model bounds.

Fourteen Chromium browser checks cover:

- Initial state and agreement of embedded manifest, manifest file, and visible full build ID.
- Pan and rotation without state mutation; north-up overhead view, zoom, and frame reset.
- Larger original-art inspection, Focus, and independently collapsible panels.
- Both original Round 1 narratives rendered verbatim.
- Protected commons, normal manor placement, undo and redo.
- A complete Round 1 played through the UI without teacher overrides; progression stops at Round 1.
- Downloading, reloading, and opening a review save in a fresh context.
- Repeated house placement after release outside the viewport, pointer cancellation, lost capture, and a dispatched focus-loss signal.
- Escape during placement, cemetery/house tool switching, and context-menu cancellation, followed by working Guide controls.
- Building an entire blank setup through the UI and advancing normally into Round 1.
- Preservation of a sentinel in the accepted 2D storage key.
- Narrow-screen rendering with collapsed panels and all four board corners inside the frame.
- No JavaScript errors or failed requests.

Eight additional camera/header browser check groups cover:

- 27 measured drags across three camera orientations, three zoom levels, and horizontal, vertical, and diagonal movement. Projected movement matched requested pixel distances within 0.001 pixels, with no drift after release.
- Middle-button horizontal orbit while a building tool is selected, unchanged zoom/tilt/game state, suppressed middle-button browser defaults, and working wheel zoom afterward.
- North-up overhead rotation lock with middle-button input.
- Twelve interruption cases across left-button pan and middle-button orbit: pointer cancellation, lost capture, dispatched focus loss, Escape, outside release, and missing mouse buttons. Each recovers with working wheel zoom, Guide, building placement, and keyboard undo.
- Extreme low-angle pans keep the orbit pivot grounded and the camera above the board, respect the navigation boundary, and recover with Frame Village.
- A split header with full build identity, year, round, and actions at widths 1600, 1000, 720, and 390, with no footer or header overlaps.
- Opening a generated build 006 save in the current build.
- No JavaScript errors in the camera/header checks.

Desktop initial, close inspection, completed Round 1, narrow-screen, and split-header screenshots were visually inspected. `test-output/browser-results.json` and `test-output/camera-results.json` record the current results and identity. The build consistency check compares all 14 payload files with the versioned distribution, recomputes the source fingerprint, verifies eight distinct build ordinals, and confirms the lock rejects a concurrent allocator without mutation.

## Limits And Review Status

The browser runs used isolated Chromium with software WebGL on this Windows machine. Actual touch gestures, other browser engines, school-device restrictions, and hardware performance were not validated. The models are distinct geometric placeholders for review, not final 3D artwork. The original 2D illustrations are permanent artwork.

An initial concurrent browser run encountered a local `ERR_NO_BUFFER_SPACE` request failure. The final build's suites were run serially and both passed. No test failure was waived. Focus-loss checks dispatch a signal and do not reproduce a physical application switch or inspect the owner's browser.

The reported freeze in the owner's live 2D Vivaldi tab was not reproduced or diagnosed. That tab was not refreshed, reset, or attached to, and its storage was not read or changed. The prototype reuses the rules only; its event handling is new and does not use the 2D HTML drag handlers. Cancellation checks demonstrate recovery in the prototype, not proof of the old freeze's cause.

No 3D content has been deployed, and no separate 2D hotfix was made. The owner approved build 006's one-round playthrough; this next focused review covers the requested camera and header changes. Further modelling or round expansion remains outside this iteration.
