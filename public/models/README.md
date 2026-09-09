# Spacecraft assets

These files are source assets required by the application. Copy `public/models`
and `public/spacecraft` when moving the source to another host.

## ISS

- Author: NASA Visualization Technology Applications and Development (VTAD).
- Reference: https://science.nasa.gov/resource/international-space-station-3d-model/
- Original: https://assets.science.nasa.gov/content/dam/science/psd/solar/2023/09/i/ISS_stationary.glb
- This is the published reference configuration, not a live configuration of the station.
- Optimized with glTF Transform 4.5.0: `optimize input.glb iss.glb --compress meshopt --simplify-ratio 0.45 --simplify-error 0.0005 --texture-size 1024 --texture-compress webp --instance false`.

## Hubble

- Source: NASA 3D Resources, Hubble Space Telescope (A).
- Reference: https://science.nasa.gov/3d-resources/hubble-space-telescope-a/
- Original: https://assets.science.nasa.gov/content/dam/science/cds/3d/resources/model/hubble-space-telescope-(a)/Hubble%20Space%20Telescope%20(A).glb
- Optimized with glTF Transform 4.5.0: `optimize input.glb hubble.glb --compress meshopt --simplify-ratio 0.6 --simplify-error 0.0005 --texture-size 1024 --texture-compress webp --instance false`.

NASA describes its 3D resource collection as free and without copyright:
https://github.com/nasa/NASA-3D-Resources
Media guidance: https://www.nasa.gov/nasa-brand-center/images-and-media/
Attribution does not imply NASA endorsement of this application.

## Tiangong

Reconstructed in `app/spacecraft-models.ts` from CMSA's three-module T-shaped
2022 configuration: https://www.cmse.gov.cn/fxrw/mengtian/mtjj/202211/t20221106_51285.html
The model preserves the broad proportions of Tianhe, Wentian and Mengtian,
with four large laboratory solar wings and the original pair of Tianhe arrays.
It omits visiting spacecraft and simplifies small equipment; it is not official CAD.

## Rendering

`loadSpacecraft()` uses the local GLBs and Three.js's bundled Meshopt decoder.
No CDN or runtime NASA request is required. Assemblies are uniformly normalized
to a maximum extent of four model units, then enlarged by the scene's display scale.
All three `public/spacecraft/*.webp` thumbnails are renders of these same models.
Thumbnail lighting is a studio presentation; orbital positions and spacecraft
attitudes remain illustrative.
