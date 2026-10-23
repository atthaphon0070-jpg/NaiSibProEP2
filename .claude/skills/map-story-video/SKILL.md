---
name: map-story-video
description: Build a NaiSibPro vertical (9:16, ≤2 min) map-storytelling video. It zooms from space down to a country, region or Thai province, draws animated borders and routes, fills the area with colour and labels it, all in sync with the supplied narration. Use when an episode needs a map, a "zoom into a country or province" shot, Google Earth or satellite footage, route lines, or a colour-filled region.
---

# Map-story video (แนวแผนที่เล่าเรื่อง)

This skill extends the existing NaiSibPro pipeline (`shared/`, see `shared/README.md`) instead of replacing it. The rules stay the same: audio-first timing, deterministic `renderAt(t)`, headless Chromium frame capture and `shared/tools/build_episode.sh`.

## The trend: what viewers expect
- **Space → target zoom (the hook, under 3 s):** start on the globe and dive into the country, then the province. Big Thai title on screen.
- **Border "draw-on":** the outline is drawn by an animated stroke (dash-offset), then the area fills with a colour (fill-opacity 0 → 0.45) and gets a soft outer glow.
- **Dim the rest:** everything outside the target is darkened or desaturated, so the eye goes to the highlighted area.
- **Routes:** a line grows along a path (trade route, migration, army march, travel), with a moving dot or icon at its tip and an optional dashed trail.
- **Pins and callouts:** a pin drops, a label card shows the name, and a number counts up (population, area, year).
- **Compare overlays:** for example "Thailand vs. France size", where one shape is dragged on top of the other at true scale.
- **Camera always moving:** slow push-in or drift, never a dead still frame. Cut or re-frame every 2–4 s to match the narration's phrases.
- **Look:** dark satellite or "dark atlas" basemap, neon accent colour (brand palette from `engine.css`), subtle grain or vignette. Burned-in Thai captions, because most viewers watch muted.

## Two ways to get the map picture
**A. Vector map (works today, no extra setup).** Use Natural Earth boundaries, rendered with D3-geo / canvas or SVG inside `renderAt(t)`. It is fully deterministic and needs no licence beyond public domain. Zoom is done with an orthographic projection (globe) that blends into a Mercator projection (country). It looks like a clean "infographic map".

**B. Real satellite / Google Earth look (needs the owner's input).**
1. **Google Earth Studio** (earth.google.com/studio, a browser tool signed in to a Google account). The owner builds the fly-to camera there, using Quick Start → Fly To / Zoom To. They export:
   - the JPEG frame sequence, at 1080×1920 and 30 fps, and
   - **3D tracking data** (the "Export 3D camera data" option, which gives a JSON file), with *track points* added at the places to annotate.
   I then composite the borders, fills and routes over those frames, using the tracking data so the overlays stick to the ground. The video must show the attribution "Google Earth" (and the data credits that Earth Studio shows) on screen for the whole time that imagery is visible.
   I cannot operate Google Earth myself: it needs the owner's signed-in browser and a GPU WebGL session.
2. **Satellite tile basemap** (Esri World Imagery, EOX Sentinel-2 cloudless, Mapbox Satellite, MapTiler Satellite) rendered with MapLibre GL in headless Chromium. It needs network access to those tile hosts, and usually an API key (Mapbox / MapTiler). Check each provider's terms for monetised video: EOX s2cloudless 2016 is CC BY 4.0, while later years are CC BY-NC-SA 4.0, which means no commercial use.

## Data sources
| Need | Source | Status in this cloud env |
|---|---|---|
| Countries | Natural Earth `ne_10m_admin_0_countries` / 50m / 110m (raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/) | ✅ reachable |
| Provinces / states (incl. all 77 Thai provinces, `adm0_a3 == "THA"`) | Natural Earth `ne_10m_admin_1_states_provinces.geojson` (~40 MB, so cache it and slice per country) | ✅ verified that it has 77 THA features. There is no `name_th`, so keep a Thai name table in the episode |
| Districts (อำเภอ) | GADM 4.1 or geoBoundaries ADM2 | ❌ host blocked, so the owner downloads it and puts it in `shared/geo/` |
| npm libs (d3-geo, topojson-client, world-atlas, maplibre-gl) | registry.npmjs.org | ✅ |
| Satellite tiles / Google | Esri, EOX, Mapbox, Google | ❌ blocked by the network policy unless the owner allows those hosts |

Keep the slices small: export only the features that the episode uses, as GeoJSON in `EPxx/source/geo/`. Simplify them (`mapshaper -simplify 10%`) so that frames render fast.

## Implementation pattern (inside `EPxx/source/index.html`)
- Projection: `d3.geoOrthographic()` for the globe, then interpolate `rotate`/`scale` toward the target's `geoCentroid`. Then cross-fade (or use `d3.geoInterpolate` with the scale) to `d3.geoMercator().fitExtent(...)` for the close-up.
- Camera keyframes are a list of `{t, center:[lon,lat], scale, rotate}`. Use the same easing as `engine.js` (`easeInOutCubic`). The time of each keyframe comes from the narration phrase cues produced by `audio_prep.py`.
- Border draw-on: build a path → `getTotalLength()` → `stroke-dasharray = L`, `stroke-dashoffset = L*(1-p)`. On canvas, use `ctx.setLineDash`.
- Region fill: fill-opacity animated with `life()`, plus a blurred copy of the stroke underneath for the glow. Darken the rest with a full-frame dark rect that has the region cut out (`evenodd` clip).
- Routes: a great-circle path with `d3.geoInterpolate(a,b)`, drawn up to fraction `p`, with an icon at `interp(p)` rotated to the heading.
- Every frame must be a pure function of `t`. No `Date.now()`, no network fetches at render time (inline the GeoJSON or load it from local files), and the fonts come from `shared/fonts`.
- Register SFX cues (whoosh on each zoom, a "pop" on pins, a soft riser before the reveal) through the engine's SFX registry, so that `audio_mix.py` places them.

## What to ask the owner for at the start of each episode
1. Narration MP3s in order (01_hook …), the same as previous episodes.
2. A script or shot list with the place names (Thai and English), years and numbers, so the map beats can be matched to the phrases.
3. For the satellite look: the Earth Studio frame export plus the 3D-tracking JSON for each fly-to shot, or approval to allow the tile hosts or an API key.
4. Any photos or footage they own or have licensed. Never pull random images from the web without a clear licence.

## Accuracy and sensitivity
- Check every border, name and date against the script, and say which Natural Earth version was used.
- Where a border is disputed, follow the narration's framing and avoid making political claims on screen.
