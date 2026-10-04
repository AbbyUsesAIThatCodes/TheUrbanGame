# Classroom Source And Round Fidelity Audit

## Scope And Authority

This audit uses the exact two PowerPoints, board PDF, and recovered HTML in `originals/`. The full World History deck governs setup and Rounds 1–20; the second deck provides alternate original wording through Round 10. The board governs footprints and provides one version of the reflection questions. The 3D review milestone covers setup and Round 1 only. No historical wording is corrected and no economic simulation, scoring, or extra events are introduced.

All **53 slide texts** in the recovered HTML were compared with the original PowerPoint DrawingML text. All match when whitespace is ignored. The extracted rules script is byte-identical to the original HTML script, SHA-256 `3ead711e66c2e84af5bfffa65365d8d850fc7070204da95d9aa0ef63576da0d9`. Machine-readable evidence is in `prototype-3d/source-provenance.json`. This is fidelity to the supplied classroom source, not independent verification of its historical claims.

## Grid And Footprints

The original board has 29 columns and 32 complete rows. One-square symbols are houses, churches, cemeteries, stores, pubs, schools, jails, hospitals, theaters, museums, trees, and route cells. Factories, tenements, coal mines, nice houses, and parks use four squares represented as 2 × 2 footprints. The commons reserves 10 × 10 squares until Round 3. Camera position and model size never change these logical footprints.

## Required Sequence

| Stage | Full Deck Slide | Date As Supplied | Required Changes And Placement |
| --- | --- | --- | --- |
| Setup | 2, 6 | Before Round 1 | Name village; river from one edge to the opposite, no more than 3 squares wide; two 1-square roads intersect near the middle and reach all four directions; 10 houses, 1 church, 1 cemetery, 1 store, 1 pub, 1 coal mine, 1 park; reserve 10 × 10 commons. |
| 1 | 9 | 1745 | A 1-square canal near the river connecting to the coal mine; 1 nice home anywhere on the map. Commons remains protected. |
| 2 | 10 | 1750 | Add 5 houses; total 15. |
| 3 | 11 | 1760 | Commons may now be built upon; add 5 houses (20 total), and 1 nice house on the former commons. |
| 4 | 12 | 1773 | Add 1 factory on the river bank; canal water cannot power it. Add 5 houses (25). |
| 5 | 13 | 1774 | Add 15 houses (40), 1 church, 1 pub, 1 store. Additional roads and 1 additional bridge are optional. |
| 6 | 14 | No new year specified | Add 5 factories on the river bank and 15 houses (55). The existing UI's “After 1774” is a sequencing label, not a quoted date. |
| 7 | 15; images 16 | 1780 | Add 5 tenements within 5 squares of a factory. |
| 8 | 17 | 1781 | Add 1 store, 1 pub, 1 school, 1 church; place church conveniently for workers. |
| 9 | 18 | 1782 | Add 5 pubs; destroy 5 ordinary houses; add 1 jail and 4 tenements. |
| 10 | 19 | 1783 | Add 2 nice homes, 1 factory, and 15 houses. Water power still precedes steam in Round 11. |
| 11 | 20 | 1785 | Add 10 factories (17 total), 1 nice house, 5 houses (70), 1 tenement. Add 4 × 4 smoke over every factory, including existing ones. Steam allows factories away from the river. |
| 12 | 21 | 1800 | Add 1 coal mine, replace the old wooden bridge with 1 iron bridge, and add 5 houses (75). |
| 13 | 22; images 23 | 1815 | Add 1 coal mine and 1 cemetery. |
| 14 | 24 | 1820 | Add 1 continuous railroad connecting all factories and coal mines; extra railroad bridges only as needed. Add 5 houses (80). |
| 15 | 25; images 26 | 1827 | Add 2 jails, 4 pubs, 2 tenements. |
| 16 | 27; images 28 | 1838 | Add 2 hospitals and 1 cemetery. |
| 17 | 29 | 1840 | Add a second railroad crossing west to east; add 5 houses (85) and 1 tenement. |
| 18 | 30 | 1842 | Add 1 theater, 1 museum, 2 schools, 1 nice house. |
| 19 | 31; images 32 | 1845 | Add 1 cemetery, 1 jail, 1 hospital. |
| 20 | 33 | 1850 | Add 20 houses (105), 5 tenements (18), 2 stores, 1 church, 5 factories, 1 pub, 3 nice houses. |
| Closing | 34–35 | After Round 20 | Read the urbanization conclusion and answer the three final reflection questions. |

The inherited rule definitions match these numeric additions and the five-house demolition. Final computed totals are 105 houses, 22 factories, 18 tenements, 9 nice houses, 4 churches, 4 cemeteries, 5 stores, 13 pubs, 3 coal mines, 1 park, 3 schools, 4 jails, 3 hospitals, 1 theater, and 1 museum. Routes have no invented numeric score.

## Ambiguities To Keep Visible

| ID | Source Issue | Inherited Interpretation And Review Status |
| --- | --- | --- |
| A1 | “Near the middle” does not define coordinates. | Existing rules check a four-way road junction in the middle third. Retained for the local prototype and identified as an interpretation. |
| A2 | River width is stated, but winding-river measurement is not. | Existing rules limit occupied cells in each relevant cross-section to three. This can reject some winding drawings whose local width is small. No silent relaxation in this milestone. |
| A3 | “Nearby” canal and convenient churches have no numeric distance. | Existing game uses a student acknowledgement for the qualitative clause. A canal must be connected, one cell wide, and edge-touch a mine. No added distance or minimum length. |
| A4 | Setup never explicitly adds a bridge, but later slides reference an old bridge. | Existing roads crossing a river create wooden bridge cells automatically. Round 12 replaces one connected crossing. This reconciliation needs teacher review, not a rewritten setup slide. |
| A5 | “Within five squares” does not specify diagonal measurement. | Existing rules use shortest orthogonal cell distance, at most five. Review before the 3D milestone reaches Round 7. |
| A6 | “One continuous track” does not settle branching or entering building footprints. | Existing rules permit a connected branching network and count edge contact. Review before Round 14. |
| A7 | Water-power restrictions are not repeated in Round 10. | Existing rules continue river-bank placement until steam appears in Round 11. Review before Round 10. |
| A8 | Smoke at the board edge may extend off the paper. | Existing display shifts its 4 × 4 smoke region inward. No Round 11 implementation is included in this prototype. |
| A9 | Paper erasure/movement is not exhaustively specified. | Existing rules allow moving buildings and erasing current-round additions, with the special five-house demolition in Round 9. Retained; no new simulation consequences. |
| A10 | Historic dates and broad causal claims include known issues. | Original words remain visible and unchanged. Historical corrections require separate review and must never silently change a game's actions. |

## Reflection Wording

The board asks about the impacts of **industrialization** on the village and its **citizens** over time. The full deck's final slide asks about **urbanization** and its **people**. Both then ask what influenced or caused the changes and what issues remain at the end. Keep these two source wordings selectable in the eventual full game; do not collapse them into a newly authored question. Final reflections are outside this one-round prototype's completion milestone.

## One-Round Acceptance

Setup must be valid under the original rules before Round 1 begins. Round 1 must block completion until the player places exactly one 2 × 2 nice house on valid land, draws a continuous one-square canal touching the mine, and acknowledges the qualitative river proximity requirement. Completing it ends the local review milestone; it must not expose or implement Rounds 2–20. The prepared review village is a clearly labelled valid setup fixture, not extra source content. Original artwork must be available at a useful viewing size independently of the 3D placeholders.
