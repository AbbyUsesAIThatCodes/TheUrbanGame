# Review Branch Preservation

Current source, immutable Builds015/017/018 and validation evidence are preserved on [review/3d-full-game](https://github.com/AbbyUsesAIThatCodes/TheUrbanGame/tree/review/3d-full-game). The owner authorized this backup before departure; main and Pages remain unchanged.

## Verified Uploads

- Source preservation: `62903917e492f31ce81214bd04367dd0ad4fefe1`.
- Immutable build archives: `fe717b8dd16b7cb6218e440cd4e8cbf1664e372a`. Remote Git blob IDs and sizes match local archives. Every archive SHA-256 and uncompressed payload checksum was verified; see [Remote Preservation](REMOTE_PRESERVATION.json).
- Complete game before model refinements: `review/3d-rounds-1-20` at `9f236629e674405d0246a68f9e117af111aa08a7`, with immutable Build015.
- Model checkpoint: `review/3d-build-017` at `62903917e492f31ce81214bd04367dd0ad4fefe1`, with immutable Build017.

## Completed Validation

Current artifact: `1.1.0_A-Town-Takes-Shape_local-3d-review_build-018_20261005T093558Z_g62903917e492_3d-review`. It was built from clean committed source `62903917e492f31ce81214bd04367dd0ad4fefe1`; all runtime source inputs match Build017 exactly.

Build018 passed 43 unit tests, 23 complete-walkthrough groups and four late-action groups, including all 20 rounds, final reflections, saves/reopening, exports, undo/redo and interrupted railway drawing. All 50 payloads, original sources and accepted baselines verified. Build017's 19 earlier-gameplay, eight camera, 11 placement and two model-view groups remain recorded under their actual Build017 identity. See [Validation](../prototype-3d/VALIDATION.md) for evidence and test limits.

At the initial source-preservation commit, the full-round rerun and late-action suite were honestly marked pending. Both have now passed on Build018. No further model enhancements were made during the upload task.

## Deployment Isolation

GitHub Pages uses legacy publishing from `main` at `/docs`; main remains `5059061dea9c106de5f70d25a6e238629ac76217`. The repository has no workflow files. GitHub's dynamic Pages workflow is the only configured workflow, and no runs were recorded for the review branch after upload. There was no merge, prototype deployment, billing change, artifact deletion or new runner.

The [review archives](../review-builds/README.md) are ordinary Git files, outside the Pages payload and Actions artifact storage. Dependencies, transient browser output and local build caches remain excluded from source commits. The private Site and accepted 2D save are unchanged.
