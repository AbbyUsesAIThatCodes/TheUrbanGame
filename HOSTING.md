# GitHub Pages Hosting

The Pages payload is the `docs/` folder on `main`. It contains the playable game, two extracted PNGs, the original portable download, build metadata, and a `.nojekyll` marker. The original PowerPoints and board PDF remain in `originals/`, outside the Pages payload.

`docs/Urban-Game.html` is a byte-for-byte copy of `originals/Urban-Game.html`, required by the existing **Download portable game** button. The hosted `docs/index.html` replaces exactly two embedded PNG data URLs with relative asset paths. Chromium rejected these multi-megabyte data URLs as CSS custom-property values, leaving the original toolbar artwork and banner blank; the extracted PNG bytes are identical to the embedded originals. A build manifest and visible footer identify this hosted artifact. Gameplay scripts, rules, historical wording, save format, storage keys, and artwork bytes are unchanged.

The original source was preserved first in commit `e6da06846c3c4102163656ddbd799e1fe6df6316`. An independent fresh clone from GitHub verified all four original files by SHA-256, Git blob ID, file size, and direct byte comparison before the hosting files were created. The original repository README was retained unchanged.

The original and downloadable HTML SHA-256 is `708817d6ae8951fe0504bc2636ff87d2ca5bd47d164659bb41c8b1dbfae8dc25`. The hosted payload's hashes and exact build ID are in [Current Build](build/current.json). See [Original Source Preservation](preservation/README.md), [Build Identity](documentation/BUILD_IDENTITY.md), and [Validation](documentation/VALIDATION.md).

Run `python tools/prepare_pages.py` to produce a new hosted artifact. Each invocation reserves a new main-scoped ordinal in `build/ledger.json`, prints its full ID, writes a versioned `.builds/<ID>/` distribution, then copies that identical payload to `docs/`. Do not rebuild simply to change the source SHA after committing generated output. Deploying or retesting the same payload keeps its identity.

Use GitHub Pages **Deploy from a branch**, with `main` and `/docs`. No custom Actions workflow or remote build is needed. GitHub may run its managed Pages deployment internally; a quota failure must be reported rather than changing billing settings or deleting artifacts.

To preview the project path locally, serve the repository's parent directory with `python -m http.server` and open `/TheUrbanGame/docs/`. The browser game saves to the current origin's local storage. To move an existing village from another host or the portable file, use **Download save** on that copy and **Open save** on the new host.

The separate editable project ZIP was not among the supplied local files. This deployment reuses the complete portable game and does not reconstruct or claim to recover that missing package.
