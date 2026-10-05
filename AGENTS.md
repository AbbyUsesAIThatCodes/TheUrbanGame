# Urban Game Review Instructions

- Preserve `originals/`, `docs/`, and the initial root `README.md` exactly. The accepted Pages baseline is commit `5059061dea9c106de5f70d25a6e238629ac76217`.
- Active work is the local `review/3d-rounds-2-5` branch and `prototype-3d/` only. Do not deploy or merge the prototype into accepted Pages without the owner's later review and authorization.
- The approved milestone is **1.1.0 A Town Takes Shape**, covering setup and Rounds 1–5. Do not expand beyond Round 5, invent an economy or score, add historical events, or silently correct classroom wording.
- Read [Round Fidelity Audit](documentation/ROUND_FIDELITY_AUDIT.md), [Prototype Review](prototype-3d/README.md), and [Build Identity](documentation/BUILD_IDENTITY.md) before changing game behavior or build outputs.
- Keep the preserved rules script byte-identical. Any proposed rule change must identify its original source and explicit ambiguity instead of silently altering the baseline.
- Use the prototype's separate browser storage key. Do not inspect, clear, reset, or overwrite the owner's live Vivaldi village or accepted 2D save.
- Keep the original 2D illustrations as permanent panel artwork. Only the geometric 3D models are placeholders. The approved build 006 is preserved on `review/3d-build-006` and in its immutable local distribution.
- Build 008's accepted controls and layout are preserved on `review/3d-build-008`. Keep their behavior, and migrate earlier 3D saves without overwriting the old storage key or artifacts.
- Per the owner's later explicit preference, the header uses the compact `version codename BuildNNN` label. Keep full UTC/source identity in the manifest and Guide's About This Build section. Do not interpret format examples as version changes.
- Run the focused rule tests and browser interaction checks for relevant changes. Reuse the same built artifact for review; do not rebuild solely to update a commit label.
- No outreach, billing changes, Actions artifact cleanup, credentials, or self-hosted runners are authorized by this local review.
