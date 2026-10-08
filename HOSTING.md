# GitHub Pages Hosting

The owner authorized publishing **1.1.0 A Town Takes Shape Build019** on October 8, 2026. The site is https://abbyusesaithatcodes.github.io/TheUrbanGame/. GitHub Pages deploys `main:/docs` using its managed Pages workflow, with HTTPS enforced.

## Exact Artifact Promotion

`docs/` contains the unchanged Build019 archive payload. All 50 checksummed files, the embedded manifest, compact title, UTC build time, source revision, and storage keys are identical to the reviewed artifact. Deployment does not allocate a new ordinal or relabel its original review status, scope, or target.

- Build source: `b78f020777fa12a9b66334444cd781897c204cff`.
- Source/archive/evidence checkpoint: `e371296120a6ef49475758083a28fa22e9526bfc`.
- Archive SHA-256: `4da0424da7234da53cbf3cd1c057d134541ded6d91e33102eb48a0b2a6a8cd3c`.
- Deployment identity and payload hashes: [Current Build](build/current.json).
- Identity inventory: [Build Identity](documentation/BUILD_IDENTITY.md).

JS, CSS, Three.js modules, and images use relative URLs under `/TheUrbanGame/`. The existing `.nojekyll` marker and original portable game at `Urban-Game.html` remain available. `originals/` and the initial repository README are unchanged.

Do not run `tools/prepare_pages.py` for this 3D promotion: that historical entrypoint builds the 2D version. Do not rebuild Build019 to refresh metadata. Future promotion must verify the selected immutable archive, retain its identity, and update the deployment record and current documentation.

## Saves And Verification

The 3D game uses `nch-urban-game-3d-full-review-v3`; it does not read or write the accepted 2D key `nch-urban-game-v1`. Localhost and HTTPS Pages have separate storage. Transferring a village is an explicit owner action using **Download Review Save** and **Open Review Save**. Deployment and tests do not transfer, clear, or inspect owner saves.

Use an isolated browser context to check the repository base path, all payload hashes, the rendered scene, Guide identity, camera controls, blank setup, and normal Round 1 advancement. Historical full-game evidence remains in [Build019 Validation](prototype-3d/VALIDATION.md).

## Rollback

The previous **1.0.0 River & Hearth Build002** and its complete source are preserved on `rollback/pages-1.0.0-before-build019` at `5059061dea9c106de5f70d25a6e238629ac76217`. Its current-build report is preserved as [Previous Pages Build](build/previous-pages.json). The original portable HTML retains SHA-256 `708817d6ae8951fe0504bc2636ff87d2ca5bd47d164659bb41c8b1dbfae8dc25`.

For a later authorized rollback, prepare a normal PR restoring the exact `docs/` tree and `build/current.json` from that reference, update current hosting documentation, and pass normal deployment checks. Keep the 3D source and archives. Do not reset or force-push `main`, or rebuild the old artifact. Verify the managed Pages workflow and live manifest after merging.
