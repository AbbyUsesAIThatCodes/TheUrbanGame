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

The accepted deployed build above remains unchanged. The separate review target is **1.0.0 River & Hearth**, status `local-prototype`, target `3d-review`, scope `local-3d-round-1`. It is not a published release or a retrofit of the accepted Pages artifact. Its latest review identity is authoritative in `prototype-3d/current-build.json`; its source commit may differ from the local commit that later records generated metadata. Dirty inputs are explicitly fingerprinted and labelled.

| Review Surface | Location |
| --- | --- |
| Build entry point and console ID | `prototype-3d/build.py`; `npm run build` |
| Durable ordinal allocator | `prototype-3d/build-ledger.json`; exclusive `.build.lock` |
| Versioned distribution | `prototype-3d/.builds/<full-ID>/` |
| Stable local preview | `prototype-3d/dist/`; `npm run serve` |
| Manifest | `dist/build-manifest.json` and embedded `#review-build-manifest` |
| Visible full ID | `dist/index.html`, `#buildIdentity` footer |
| Current report and payload hashes | `prototype-3d/current-build.json` |
| Test evidence | `prototype-3d/VALIDATION.md`, ignored `test-output/browser-results.json` |
| Contributor instructions | `AGENTS.md`, `prototype-3d/README.md` |
| CI / PR / remote deployment | Inapplicable to this local-only review; no PR or deployment created |

The build never writes to the repository's accepted `docs/` payload. Each build reserves its local ordinal before output; failed attempts keep their reservation. Retesting and reopening one distribution preserve its identity. No source timestamp is invented for the recovered original assets or rules.
