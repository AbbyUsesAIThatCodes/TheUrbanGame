# Review Branch Preservation

The owner authorized uploading all current Urban Game source from Abigail before departure. This upload is limited to review branches. It does not merge into main, change Pages, or deploy the prototype.

## Preservation Checkpoint

Current artifact: `1.1.0_A-Town-Takes-Shape_local-3d-review_build-017_20261005T021504Z_g9f236629e674_dirty-fe4b6b859f57_3d-review`.

All original rounds and closing reflections are implemented. The complete Build015 walkthrough passed all 20 rounds, boundary saves, source narratives, final totals and exports before any model refinements. Build015 is preserved on `review/3d-rounds-1-20` and in its immutable local artifact.

Build017 contains the cottage, manor and factory refinements. Its 43 unit/source/model tests, 19 earlier-gameplay groups, 8 camera groups, 11 rotated-placement groups and 2 model-view groups passed. The saved reports were inspected after reconnection; session56821 no longer exists. The full-round rerun still records Build015, and the authored late-actions suite has not yet run. These remaining checks are pending at this preservation commit; they are not represented as complete. Evidence is in `validation/build-017/`.

The original files, permanent illustrations, byte-identical recovered rule script, accepted camera/pointer handlers, and accepted Pages payload are unchanged. No new model enhancements are part of this upload task.

## Deployment Isolation

GitHub Pages currently uses legacy publishing from `main` at `/docs`. The review branch does not contain repository workflows. Main is preserved at `5059061dea9c106de5f70d25a6e238629ac76217`. Dependency folders, temporary browser output and local build caches are excluded from source commits. Versioned review distributions will be backed up separately on the review branch without using Actions artifact storage.
