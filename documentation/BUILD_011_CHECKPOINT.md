# Build011 Regression Checkpoint

Build011 was preserved before extending the game. Source baseline: `2d4b7569634f2b5bcc1fa28111edf715d8f3681a`; local baseline branch: `review/3d-build-011`.

The additional headless Chromium suite passed 11 groups: each of Rounds 2-5 at three camera rotations, exact-cell placement, duplicate clicks, undo/redo, interruption recovery, repeated placement, save/reload/reopen, cancelled imports, malformed imports, two-square manor/factory placement, road-drag interruption, and bridge placement. It reported no script/network errors and preserved the accepted 2D storage sentinel. Generated boundary fixtures are committed; full results are preserved in the sibling `qa-3d-build-011` folder. No game source or Build011 payload changed during these checks.

This extends the earlier 12 rule/model/save tests, 19 gameplay browser groups, 8 camera groups, original-source audit, and build verification. Browser testing uses isolated software WebGL; physical touch input and the owner's Vivaldi session are not tested or controlled.

The owner's subsequent overnight instruction authorizes all original rounds through Round20, then improvements to selected 3D models based on the permanent illustrations. Work continues locally on `review/3d-full-game`; accepted Pages and prior reviews remain unchanged.
