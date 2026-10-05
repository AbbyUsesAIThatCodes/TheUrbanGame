# A Town Takes Shape — Local Review Notes

The owner approved **1.1.0 A Town Takes Shape** and faithful Rounds 2–5 after accepting build 008's camera controls and layout. This review keeps those controls, the original illustrations, existing models, setup, and Round 1. It adds only the remaining actions and presentation required through Round 5.

## New Playable Rounds

Round 2 grows the village to 15 houses. Round 3 opens the commons, grows it to 20 houses, and places the new nice house within the former commons. Round 4 adds a river-powered factory and reaches 25 houses. Round 5 adds workers' homes and services, reaching 40 houses, with optional roads and one additional bridge crossing. A second crossing blocks completion until corrected.

Both decks' original narratives remain unchanged and selectable. The factory's brick mill and wooden wheel fit its original four-square footprint; no steam-era smoke is added. The commons fence disappears when building opens there, while the former area remains shaded. No economy, scoring, new historical events, or intermediate reflection prompts are introduced. See the [Focused Audit](../documentation/ROUNDS_2_TO_5_REVIEW.md) for inherited interpretations and the exact source requirements.

Placing the first factory exposed an inspector refresh issue: Focus stayed disabled until selection changed. Successful placement now refreshes the inspector immediately, so a new building can be examined at once.

## Accepted Controls And Compact Label

Build 008's screen-relative pan, middle-button orbit, low-angle camera boundary, cancellation recovery, wheel zoom, overhead view, floating panels, and split header remain in place. Original 2D illustrations are permanent panel artwork; 3D geometry remains deliberately simple.

The header now uses the owner's compact `version codename BuildNNN` format. The actual approved version and codename are used; format examples were not treated as release changes. Guide's About This Build section and the manifest retain the full canonical identifier, fixed UTC build time, and complete source revision.

## Save Compatibility And Boundaries

Earlier version-1 review saves migrate to a version-2 wrapper and a separate browser key without overwriting the original. Completed Round 1 villages can begin Round 2 normally. Incomplete progress remains in its original round. The review stops at Round 5; it does not mark the full 20-round game finished or permit Round 6 imports.

Builds 006 and 008, source branches, and their original QA evidence remain preserved. The latest exact identity is in [Current Build](current-build.json), with results in [Validation](VALIDATION.md). No 3D content has been pushed or deployed. Accepted Pages remains at `5059061dea9c106de5f70d25a6e238629ac76217`, and the private Site is unchanged.
