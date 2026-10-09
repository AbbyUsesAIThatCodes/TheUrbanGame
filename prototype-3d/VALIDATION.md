# Review Validation

This records the original Build019 review validation. The October 8, 2026 owner-authorized Pages promotion reuses the exact artifact without rebuilding. See [Hosting](../HOSTING.md) and [Current Build](../build/current.json) for current deployment and rollback. Host URLs and main/Pages state in the historical handoff section below describe the original review, not the later publication.

Current wording-fix artifact: **1.1.0 A Town Takes Shape Build019**.

Canonical identity: `1.1.0_A-Town-Takes-Shape_local-3d-review_build-019_20261005T231542Z_gb78f020777fa_3d-review`.

Built at `2026-10-05T23:15:42.626832+00:00` from clean source `b78f020777fa12a9b66334444cd781897c204cff`. Source fingerprint: `9399ffc60f30988e9d7d35b0618fe126f9d29ad7dbc68a244257710108df20a0`. Documentation and evidence commits retain this artifact without rebuilding or relabeling it.

## Approved Correction

The 3D interface uses **Erase This Round** and **Destroy House**. Its Round9 hint uses the same tool name. Erasing an older ordinary house in Round9, while fewer than five houses have been removed, now says: “To remove an older house, select Destroy House in Build Your Village.” Other targets, completed demolition quotas and other rounds retain the original rule rejection. This changes display text only; the rule engine, classroom sources, game state and export format remain unchanged. Export-metadata issue #1 is separate.

The classroom instruction remains “Destroy 5 houses” in full-deck slide18 and shorter-deck slide17. The preserved source is not rewritten to match interface wording.

## Results

- 43 unit, rule, source, model and save tests passed.
- Seven new UI regression groups passed: actual Erase button and contextual guidance; ordinary versus nice/non-house targets; current-round erasure; five-house limit; Undo/Redo; download/reload/reopen; protection in Rounds8/10. Labels fit 1600px and 390px views.
- Four late-action groups passed, covering demolition, iron replacement and both railway layers.
- 23 complete-game browser groups passed through all20 rounds, every boundary save/reload/reopen, source narratives and images, final questions, answer persistence and text export. No script errors, asset failures or cancelled requests occurred.
- Three preview-handoff checks passed: navigation from Build018 to Build019 on the same browser origin retained an exact generated Round9 save; all50 payload hashes and relative URLs at the delivered path matched; returning to Build018 retained the same save.
- Build consistency, source fingerprint, immutable output and allocator-lock checks passed. Four originals, 53 slide texts, source artwork and recovered rules remain byte-identical.
- All Build018 preview and immutable payloads and all earlier archived builds retain their hashes. Accepted camera and pointer-handler blocks remain byte-identical to Build008.

Reports, unit output and screenshots are in [Build019 Evidence](../documentation/validation/build-019/). Earlier Build017 and Build018 reports remain historical evidence under their actual identities; they are not described as reruns on this changed source.

## Local Review And Preservation

Review: **http://127.0.0.1:8770/review-build-019/**. Build018 remains available at **http://127.0.0.1:8770/**. The new path uses the same origin and storage key. Navigate the existing game tab to the new path when ready, so its latest progress is saved before the new page loads. No automation read or changed the owner's browser or saved village.

The isolated test server is `http://127.0.0.1:8771/`. The active source checkout is `TheUrbanGame-round9-wording` on `review/3d-round9-wording`; its ledger continues with ordinal19, without resetting. Build018's original checkout is preserved. See [Review Downloads](../review-builds/README.md).

Main and Pages remain at `5059061dea9c106de5f70d25a6e238629ac76217`; no merge or public deployment occurred. The private Site is unchanged.

Browser coverage uses isolated headless Chromium/software WebGL. Physical touch devices, other browser engines and classroom-device performance remain unverified.
