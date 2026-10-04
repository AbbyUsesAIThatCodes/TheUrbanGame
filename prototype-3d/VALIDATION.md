# Local Review Validation

Validated artifact: `1.0.0_River-and-Hearth_local-3d-round-1_build-006_20261004T223540Z_ged367a7a6138_dirty-664562612c38_3d-review`.

This is a local prototype built from the checkpoint revision with explicitly recorded dirty input state and a complete source fingerprint. It has not been published. The accepted Pages commit remains `5059061dea9c106de5f70d25a6e238629ac76217`.

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

Desktop initial, close inspection, completed Round 1, and narrow-screen screenshots were visually inspected. `test-output/browser-results.json` records the current results and identity. The build consistency check compares every payload file with the versioned distribution, recomputes the source fingerprint, verifies distinct build ordinals, and confirms the lock rejects a concurrent allocator without mutation.

## Limits And Review Status

The browser run used isolated Chromium with software WebGL on this Windows machine. Actual touch gestures, other browser engines, school-device restrictions, and hardware performance were not validated. The models are distinct geometric placeholders for review, not final 3D artwork.

The reported freeze in the owner's live 2D Vivaldi tab was not reproduced or diagnosed. That tab was not refreshed, reset, or attached to, and its storage was not read or changed. The prototype reuses the rules only; its event handling is new and does not use the 2D HTML drag handlers. Cancellation checks demonstrate recovery in the prototype, not proof of the old freeze's cause.

No 3D content has been deployed, and no separate 2D hotfix was made. The remaining decision is the owner's review of this one-round prototype before further modelling or expansion.
