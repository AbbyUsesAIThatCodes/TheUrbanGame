# Build Identity

## Release And Compatibility

The inherited release is **1.0.0 — River & Hearth**, matching the original Guide. This hosting adaptation keeps that release and its version-1 JSON saves. It adds no game mechanics and does not change save fields or the `nch-urban-game-v1` storage key. The codename remains stable for this recovered release. Future agreed game changes use major.minor.patch according to save and gameplay compatibility.

The preserved artifact's original build time and source revision are unknown. Its permanent identity is SHA-256 `708817d6ae8951fe0504bc2636ff87d2ca5bd47d164659bb41c8b1dbfae8dc25` at preservation commit `e6da06846c3c4102163656ddbd799e1fe6df6316`. No new identity is retroactively injected into it or its portable download.

## Hosted Build Identity

The authoritative release record is `build/release.json`. `tools/prepare_pages.py` captures UTC once, reserves an ordinal in `build/ledger.json`, computes a build-input fingerprint, and generates an immutable manifest. There is no PR for this authorized direct hosting change, so the allocator uses explicit `main` scope. An exclusive lock serializes builds by rejecting concurrent invocations; failed reservations remain recorded and ordinals are never reset.

The canonical ID is `<version>_<codename-slug>_main_build-<ordinal>_<UTC>_g<revision>[_dirty-<fingerprint>]_github-pages`. The manifest records the full source revision, dirty flag, exact input paths, full fingerprint, timestamp, and target. The initial hosted builds truthfully record dirty source inputs based on the preservation commit because the hosting script was new at build time.

## Location Inventory

| Surface | Location | Verification |
| --- | --- | --- |
| Original files | `originals/` | `preservation/checksums.json`; byte-for-byte protected |
| Release record | `build/release.json` | Inherited version and codename |
| Ordinal allocator | `tools/prepare_pages.py`, `build/ledger.json` | Reserve before output; reject concurrent allocator |
| Local console | `tools/prepare_pages.py` | Same ID at BUILD and SUCCESS/FAILURE |
| Versioned output | `.builds/<full-ID>/` | Exact distribution copied to `docs/`; ignored by Git |
| Hosted manifest | `docs/build-manifest.json` | Canonical manifest |
| Embedded manifest | `docs/index.html`, `#urban-build-manifest` | Same ID and manifest |
| Visible UI | `docs/index.html`, `#buildIdentity` footer | Full, wrapping, selectable ID |
| Current report | `build/current.json` | Same ID and payload SHA-256 hashes |
| Validation report | `documentation/VALIDATION.md` | Tests and scope limitations |
| Portable download | `docs/Urban-Game.html` | Original bytes and identity retained |
| CI / IDE build entry points | None introduced | GitHub Pages deploys prebuilt static files |

Two sequential real builds were checked for different ordinals and IDs. Reusing the second payload preserves its ID. The lock's rejection path is checked without reserving an artifact. Hosted manifests, console IDs, output directory, footer, and current report are compared end to end. Future PR-producing builds must allocate a new PR-scoped identity; do not relabel existing artifacts.

## Separate Local 3D Review

The accepted deployed 1.0.0 River & Hearth build above remains unchanged. The owner-approved next local milestone is **1.1.0 A Town Takes Shape**, status `local-prototype`, target `3d-review`, playable setup through Round 5. It is not a published release. The authoritative release record is `prototype-3d/release.json`; package metadata mirrors its version.

The existing durable ledger continues without resetting ordinals. From the 1.1.0 milestone onward, its stable scope is `local-3d-review`; earlier `local-3d-round-1` artifacts and their identifiers remain unchanged. No PR number is invented. The latest identity is authoritative in `prototype-3d/current-build.json`; a later local check-in may record the same tested dirty-input artifact without rebuilding it.

The owner explicitly replaced the persistent full identifier with the compact **version codename BuildNNN** header format. This later instruction supersedes the earlier display convention for this local review. The generated manifest's `display_label` drives the header. The complete canonical identifier, fixed UTC timestamp, full source revision, and dirty-input fingerprint remain available in the manifest; Guide's About This Build shows the full identifier, UTC time, and revision.

| Review Surface | Location |
| --- | --- |
| Release authority | `prototype-3d/release.json`; package version mirrors it |
| Build entry point and full console ID | `prototype-3d/build.py`; `npm run build` |
| Durable ordinal allocator | `prototype-3d/build-ledger.json`; exclusive `.build.lock` |
| Versioned distribution | `prototype-3d/.builds/<full-ID>/` |
| Stable local preview | `prototype-3d/dist/`; `npm run serve` |
| Full manifest | `dist/build-manifest.json` and embedded `#review-build-manifest` |
| Compact visible label | `dist/index.html`, `#buildIdentity` in the upper-left title banner |
| Full identity in UI | Guide → About This Build, `#buildDetails` |
| Current report and payload hashes | `prototype-3d/current-build.json` |
| Test evidence | `prototype-3d/VALIDATION.md`; ignored browser/camera result files |
| Earlier accepted reviews | Build 006 and 008 immutable distributions, local baseline branches, and sibling QA evidence folders |
| Contributor instructions | `AGENTS.md`, `prototype-3d/README.md` |
| CI / PR / remote deployment | Inapplicable to this local-only review; no PR or deployment created |

The core original game state stays at save version 1. The 1.1.0 review wrapper uses version 2, imports earlier version-1 review saves, and stores them under a separate browser key. This is a compatible import path; earlier artifacts and their earlier saves remain available.

The build never writes to the repository's accepted `docs/` payload. It reserves an ordinal before output; failed attempts retain their reservation. Retesting and reopening an artifact preserve its identity. Full metadata and source fingerprints remain fixed at build time rather than being generated on page load. The focused consistency check compares the compact label to the authoritative fields and validates the full manifest, all payload hashes, source fingerprint, immutable distribution, and allocator lock.
