# Local Review Validation

Validated full-game artifact: **1.1.0 A Town Takes Shape Build015**.

Canonical identity: `1.1.0_A-Town-Takes-Shape_local-3d-review_build-015_20261005T020100Z_g70c9bf0269b4_dirty-b3056408f982_3d-review`.

The source fingerprint is `b3056408f982`; source baseline is `70c9bf0269b4` plus the exact dirty inputs in its manifest. A later local check-in preserves this tested artifact without rebuilding it.

- 43 rule, source, model and save tests passed.
- 23 full-game headless browser groups passed, covering normal Rounds 1–20, every source narrative, all served payload hashes, boundary save/reload/reopen, transport/smoke, final questions, answer persistence and text export.
- Final counts: 196 structures, 105 houses, 22 factories, 18 tenements, five demolished houses, 21 snapshots, no teacher overrides.
- All 49 payload hashes and immutable output copies match; source fingerprint and allocator lock pass.
- Four original files, 53 slide texts, 33 restored source images, the original rules and permanent illustrations retain source identity.
- Builds 006, 008 and 011 remain unchanged. Accepted camera and pointer-handler blocks remain byte-identical to Build008.
- Public Pages, original documents, root README, billing, Actions artifacts and the private Site were not changed.

Earlier focused Build011 regression covered rotated placement, duplicate actions, undo/redo, interrupted pointer flows and file imports. See [Full Game Checkpoints](../documentation/FULL_GAME_REVIEW.md), [Round Coverage](../documentation/ROUND_COVERAGE.json), and [Source Audit](../documentation/ROUND_FIDELITY_AUDIT.md).

Tests use isolated headless Chromium and software WebGL. They do not establish physical touch behavior, other browser engines or classroom-hardware performance. The owner's Vivaldi session and desktop remain undisturbed.
