# Preserved Review Builds

These static review distributions are stored on the review branch for backup. They are not GitHub Pages deployments and do not consume Actions artifact storage. Each archive contains its original build manifest and payload checksums. All payload bytes were verified after archive creation.

- Build015: full original game, before model refinements; complete walkthrough verified.
- Build017: artwork-inspired model checkpoint; validation status is recorded in the review documentation.
- Build018: fresh build from committed source 62903917e492, with runtime source inputs identical to Build017. All43 unit tests, 23 full-game browser groups and four late-action groups passed; see [Validation](../prototype-3d/VALIDATION.md).

- Build019: approved Round9 wording correction only; clean source b78f020777fa. Full validation passed, including actual Erase UI and same-origin save continuity.

## Downloads

- [Build015](1.1.0_A-Town-Takes-Shape_local-3d-review_build-015_20261005T020100Z_g70c9bf0269b4_dirty-b3056408f982_3d-review.zip) — `1.1.0_A-Town-Takes-Shape_local-3d-review_build-015_20261005T020100Z_g70c9bf0269b4_dirty-b3056408f982_3d-review`
- [Build017](1.1.0_A-Town-Takes-Shape_local-3d-review_build-017_20261005T021504Z_g9f236629e674_dirty-fe4b6b859f57_3d-review.zip) — `1.1.0_A-Town-Takes-Shape_local-3d-review_build-017_20261005T021504Z_g9f236629e674_dirty-fe4b6b859f57_3d-review`
- [Build018](1.1.0_A-Town-Takes-Shape_local-3d-review_build-018_20261005T093558Z_g62903917e492_3d-review.zip) — `1.1.0_A-Town-Takes-Shape_local-3d-review_build-018_20261005T093558Z_g62903917e492_3d-review`

- [Build019](1.1.0_A-Town-Takes-Shape_local-3d-review_build-019_20261005T231542Z_gb78f020777fa_3d-review.zip) - `1.1.0_A-Town-Takes-Shape_local-3d-review_build-019_20261005T231542Z_gb78f020777fa_3d-review`

Extract an archive, then serve its folder with a local static HTTP server. For example: `python -m http.server 8770 --bind 127.0.0.1 --directory <extracted-folder>`. Open `http://127.0.0.1:8770/`.

SHA-256 archive hashes and complete source identities are recorded in [Checksums](checksums.json).
