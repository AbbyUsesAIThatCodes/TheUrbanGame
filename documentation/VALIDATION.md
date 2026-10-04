# Hosting Validation

## Artifact

Validated hosted build: `1.0.0_River-and-Hearth_main_build-002_20261004T220106Z_ge6da06846c3c_dirty-5c3b918ec879_github-pages`.

Hosted `index.html` SHA-256: `c26f0aa0744213ffbca95ef03072e96efc0d7c512aa579fbe7fac74191d6d877`.

The four originals were verified from an independent GitHub clone before hosting work began. Every source SHA-256, file size, Git blob ID, and byte comparison passed. The root README is unchanged.

## Checks Passed

- Chromium startup at a nested local URL; all 36 visual assets decode.
- Extracted building and valley PNGs match their original embedded bytes; toolbar artwork and the landscape banner render.
- The four scripts containing source slide text, rules, music, and app behavior remain byte-identical. The fifth script changes only two embedded asset values to relative paths. Original CSS is unchanged.
- Incomplete setup blocks normal advancement. A village built through the UI completes setup, then the canal and manor tasks advance normally through Round 1 into Round 2.
- Building placement, undo, redo, JSON save download, reopening in a clean browser context, and autosave after reload.
- Map PNG export, reflection text export, and exact original portable HTML download.
- Existing recorded teacher rulings exercise every later round screen and the final state, yielding 21 snapshots. Both source decks retain 35 and 18 slides.
- Desktop and narrow mobile screenshots inspected; no JavaScript errors or failed requests during the browser run.
- Manifest, visible footer, current report, output directory, and logged build ID agree. Two builds receive distinct ordinals. A concurrent allocator is rejected without changing the ledger. Reusing the current artifact preserves its identity.

## Limits

This is a hosting smoke test, not a full manual 20-round playthrough. Later rounds were exercised through the game's existing teacher-ruling feature, so their full normal placement requirements were not exhaustively tested. Optional streamed music, speech voices, physical printing, other browser engines, and actual school-device policies were not tested.

The unchanged portable download retains the original oversized CSS data-URL limitation in Chromium. The hosted copy uses extracted assets to resolve that rendering issue while preserving the exact original download.

Deployment must additionally confirm the Pages build's commit, public HTTP responses, hosted content hashes, and a browser run at the public URL. Local success alone is not deployment proof. No billing changes, artifact deletions, credentials, or self-hosted runners are required or authorized by this hosting setup.
