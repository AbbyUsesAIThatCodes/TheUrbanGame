# Review Validation

Validated current artifact: **1.1.0 A Town Takes Shape Build018**.

Canonical identity: `1.1.0_A-Town-Takes-Shape_local-3d-review_build-018_20261005T093558Z_g62903917e492_3d-review`.

Built at `2026-10-05T09:35:58.253054+00:00` from clean source `62903917e492f31ce81214bd04367dd0ad4fefe1`. Source fingerprint: `fe4b6b859f57cd353b901afd9b672e4efbf50facc11bf220ffce2e27a4792138`. Later documentation commits preserve this same tested artifact; its identity is not relabeled.

## Current Build Results

- 43 unit, rule, source, model and save tests passed.
- 23 full-game browser groups passed: all original Rounds 1-20 through normal UI actions, incomplete-round gates, source narratives and decoded images, every boundary save/reload/reopen, rendered smoke and both railway layers, final questions, answer persistence and text export.
- Four late-action groups passed: Round9 demolition limits and undo/redo; Round12 iron replacement and repeated clicks; Round14 rail dragging, grouped undo and cancellation recovery; Round17 separate west-to-east rail saving and reopening.
- No script errors, asset failures or navigation-cancelled requests occurred in the complete walkthrough. The accepted 2D storage sentinel was unchanged.
- Final village: 196 structures, including 105 houses, 22 factories and 18 tenements; five demolished houses, 21 snapshots and no teacher overrides.
- All 50 payload hashes match the served and immutable copies. Source fingerprint, compact header, full manifest and allocator lock pass.
- Four original files, 53 slide texts, 33 source images, the recovered rules and permanent illustrations retain their source identity. Accepted Pages, originals and the root README remain unchanged.
- Immutable Builds006, 008, 011 and 015 pass their checksums. Accepted camera and pointer-handler source blocks remain byte-identical to Build008.

Machine-readable reports, unit output, build/source/baseline checks and final screenshots are in [Build018 Evidence](../documentation/validation/build-018/).

## Earlier Focused Evidence

Build017 passed 19 early-gameplay groups, eight camera/header groups, 11 deep placement/import groups and two model-view groups. These include 27 pan measurements, 12 gesture interruptions, header widths from 390 to 1600 pixels, earlier-save migration, rotated placement, duplicate actions, undo/redo, malformed imports, four focused model views and complete-city reopening. The reports and selected model screenshots are in [Build017 Evidence](../documentation/validation/build-017/).

These focused suites ran on Build017. Build018 has the exact same runtime source fingerprint, so the results remain applicable; they are not presented as Build018 reruns. Build018's own walkthrough and build checks verify its new identity and payloads.

## Preservation And Limits

Source and immutable Builds015, 017 and 018 are backed up on `review/3d-full-game`. See [Review Upload](../documentation/REVIEW_UPLOAD.md), [Downloads](../review-builds/README.md) and [Remote Archive Verification](../documentation/REMOTE_PRESERVATION.json). No merge or prototype deployment was performed. Main remains `5059061dea9c106de5f70d25a6e238629ac76217`; Pages still publishes `main:/docs`. The private Site, billing and Actions artifacts are unchanged.

Automated browser checks use isolated headless Chromium with software WebGL. Physical touch devices, other browser engines and classroom-hardware performance remain unverified. The owner's Vivaldi session and desktop were not controlled.
