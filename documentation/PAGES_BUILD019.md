# Build019 Pages Promotion

The October 8, 2026 promotion deploys the existing **1.1.0 A Town Takes Shape Build019** at the repository root URL. No compilation, ordinal allocation, runtime code edit, save migration, or build metadata rewrite was performed.

## Provenance And Validation

- The immutable archive SHA-256 matches `review-builds/checksums.json`.
- All 50 extracted and promoted payload hashes match `prototype-3d/current-build.json`.
- Every manifest input equals its file at clean source `b78f020777fa12a9b66334444cd781897c204cff`. The recomputed fingerprint, including archived Three.js vendor files, matches the original manifest.
- All 43 rule, model, source, and save tests passed using the archived Three.js modules, without package installation.
- Eight isolated browser checks passed under `/TheUrbanGame/`: all payloads and JS MIME types, rendered 3D scene, Guide identity, camera controls without village changes, blank setup, normal Round 1 completion and Round 2 reload, accepted 2D storage protection, and no script/asset/HTTP errors.
- `originals/`, the initial README, and the original portable HTML remain unchanged. The prior source and deployed payload are preserved on `rollback/pages-1.0.0-before-build019`.

The browser checks used installed Chrome with a fresh temporary context and software WebGL. They did not access any owner profile or saved village. The original complete 20-round walkthrough remains historical Build019 evidence; this promotion reran focused deployment checks and all 43 unit checks.

Machine-readable records: [Local Smoke](validation/pages-build019/local-smoke.json), [Provenance](validation/pages-build019/provenance.json). Current deployment and rollback instructions: [Hosting](../HOSTING.md). GitHub's managed Pages workflow and the live HTTPS smoke test must succeed after merge before reporting publication complete.
