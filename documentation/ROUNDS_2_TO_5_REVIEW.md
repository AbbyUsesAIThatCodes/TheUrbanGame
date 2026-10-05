# A Town Takes Shape — Rounds 2–5

The owner approved **1.1.0 A Town Takes Shape** after playing the one-round prototype and accepting build 008's camera controls and layout. This local milestone extends normal play from setup through Round 5 only. It preserves the original rules, classroom wording, permanent 2D illustrations, and existing 3D models. Only the factory needs a new model.

## Source And Actions

Both original decks use slides 10–13 for these rounds. Their narrative text remains selectable by deck and displayed unchanged. The second deck says "framing practices" in Round 3 while the full deck says "farming practices"; neither is silently corrected. All 53 slide texts still match their original PowerPoints when whitespace is ignored; see the [Complete Source Audit](ROUND_FIDELITY_AUDIT.md).

| Round | Exact Actions And Totals | Placement And Route Constraints | Narrative And Reflections |
| --- | --- | --- | --- |
| 2 · 1750 | Add 5 one-square houses; 15 total. | Clear land; commons remain protected. No new route tool or building type. | Original slide 10 in either deck; no reflection prompt. |
| 3 · 1760 | Add 5 houses; 20 total. Add 1 nice house; 2 total. | Commons open for building. The new 2 × 2 nice house belongs entirely inside the former commons, including after later moves. Houses may stand on any otherwise valid land. The flat area remains visible while its fence is removed. | Original slide 11 in either deck, retaining the wording difference; no reflection prompt. |
| 4 · 1773 | Add 1 factory and 5 houses; 25 houses total. | The 2 × 2 factory needs river-bank edge contact. Canal-only contact, water occupancy, and dry land are rejected. Its placeholder has a wooden waterwheel; no later steam-era smoke is added. | Original slide 12 in either deck; no reflection prompt. |
| 5 · 1774 | Add 15 houses; 40 total. Add 1 church, 1 pub, and 1 store; 2 of each total. | Additional roads and one additional bridge crossing are optional. A second separate new crossing blocks completion until corrected. Current-round routes can be erased; earlier buildings remain protected from erasure. | Original slide 13 in either deck; no reflection prompt. |

No intermediate reflection questions appear in these slides. Reflection data is retained in saves; the final reflection interface belongs after Round 20 and remains outside this milestone.

## Inherited Interpretations

The unchanged rule engine interprets "on the commons" as the full footprint lying inside it, and "river bank" as orthogonal edge contact rather than a numeric distance. One additional bridge means one connected group of new crossing cells rather than one click, so a crossing may span a wider river. Roads automatically create a bridge when drawn over water. These are inherited interpretations, not newly invented rules.

The Round 5 source supplies no additional placement rules for its church, pub, or store; none are added. Additional road geometry retains the original implementation. Historical claims and dates are preserved as classroom source content rather than silently corrected or independently endorsed.

## Endpoint And Save Compatibility

At the endpoint, the expected structures are 40 houses, 2 nice houses, 1 factory, 2 churches, 2 pubs, 2 stores, 1 cemetery, 1 coal mine, and 1 park: **52 structures**. Completion stays at Round 5 without a teacher override. It does not mark the full 20-round game finished or unlock Round 6.

Earlier version-1 3D review saves from builds 006 and 008 are accepted. Their game state and starting snapshot are retained in a version-2 wrapper. A completed Round 1 village stays at Round 1, ready to begin Round 2 normally; incomplete setup or Round 1 progress is not advanced. Automatic migration copies the old 3D storage value into `nch-urban-game-3d-round5-review-v2` and leaves `nch-urban-game-3d-round1-review-v1` untouched. The accepted 2D save key is never read or changed.

Builds 006 and 008, their local source branches, and their original QA evidence remain preserved. The new review is local only; GitHub Pages and the private Site are unchanged.
