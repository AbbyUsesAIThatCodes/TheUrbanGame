# Camera And Header Review

This local iteration follows the owner's successful playthrough of build 006. It changes camera input and the header only. Setup, Round 1, save fields, storage keys, source wording, models, and original artwork remain unchanged. The original 2D illustrations are permanent panel artwork; the 3D geometry is still the approved placeholder set.

## Camera Changes

The previous panning configuration projected the vertical drag onto the ground plane without compensating for foreshortening. Its visible vertical movement therefore varied with camera tilt. A pan speed of 0.8 and damping also made movement slower and continue after release.

The current orthographic controls use camera-relative screen axes, unit pan speed, and direct response. A world point follows the drag by the same pixel distance on either screen axis, away from the travel boundary. After each movement, the orbit pivot is projected along the view direction back onto the board's ground plane. This does not change the orthographic screen image; it keeps subsequent rotation and extreme low-angle panning above the board. The existing 35-unit navigation boundary and Frame Village reset remain available.

Holding the middle mouse button and dragging horizontally now orbits without switching tools or placing buildings. Rotate mode and right-drag remain available, and wheel zoom is unchanged. Overhead remains north-up and rotation-locked. The canvas suppresses the browser's middle-button autoscroll and auxiliary-click defaults.

Navigation tracks its own active pointers. Normal releases remain with OrbitControls so its touch transition is preserved. Cancellation, lost capture, focus loss, Escape, and missing mouse buttons clear an interrupted gesture through the controls' public disconnect/connect lifecycle. Placement remains a separate transaction.

## Header Changes

The title and full current build identifier occupy an upper-left banner. Year, round, Save & Open, and Guide occupy a separate upper-right panel. Both panels allow the board to remain visible between them. The build identifier wraps and can be copied. The bottom version bar is removed, and camera controls and status use the recovered space. Floating panels position themselves below the header as its height changes.

## Preserved Baseline

Build 006 is preserved in its immutable `.builds/` directory. Local branch `review/3d-build-006` points to `5965d80a4687893d77675f0efee0028e9a1926ab`; its original evidence is preserved in the sibling workspace folder `qa-3d-build-006`. A generated build 006 review save is retained as a compatibility fixture in `tests/fixtures/`.

The latest exact identity and payload checksums are in [Current Build](current-build.json). [Validation](VALIDATION.md) records the tests and their limits. No prototype changes have been pushed or deployed; accepted Pages remains at `5059061dea9c106de5f70d25a6e238629ac76217`.
