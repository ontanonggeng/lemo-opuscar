# Sci-Fi Sitcom Toon Compliance — Portal Printer

Source of truth: `styles/scifi-toon/STYLE.md` from upstream `lemomo-ai/lemo-opuscar`.

| Requirement | Implementation |
|---|---|
| Uniform thick near-black outlines | Native `toon.js` screen-space strokes, 7px-class character/prop lines |
| 3-drawing line boil at 12fps | Native `toon.js` frame boil; characters and held poses step on twos |
| Flat fills; no gradients | Film source contains no Canvas gradient APIs; shadows are hard polygon fills |
| Big white eyes / tiny pupils / heavy lids | Marn and Kip use the style face grammar with character-specific lids and pupil acting |
| Distinct silhouettes | Marn = short triangular hazard-skirt silhouette; Kip = tall narrow inflatable-vest silhouette |
| Absurd costume idea | Hazard skirt; inflatable warehouse safety vest |
| Hardware as household junk | PORTA-LABEL 88 is a dented thermal label printer/cart |
| Portal is only glow | Portal uses pale electric cyan; other sets/world palettes do not use glow |
| One palette per destination | Frost Freight, Jelly Customs and deliberately bland office destination palettes |
| Dialogue-driven deadpan vs panic | Marn low/slow; Kip higher/faster; pauses and reaction cuts |
| Reaction close-up after absurd image | Frost reveal hard-cuts Kip then Marn close |
| Rule of three | 21–27s destination rejection montage |
| Suspiciously normal break | 27–32.5s portal shuts and ordinary Ohio label prints in near-silence |
| Dead-air reversal | Return-to-sender beat after apparent successful delivery |
| 12fps acting / 24fps portal & camera | Character parameters quantized in cast and lip sync; portal/camera use smooth time |
| Native subtitles | Baloo 2 heavy white text with dark outline and speaker pill |
| Copyright red lines | Entire cast, device, world sequence, story and dialogue are original; no existing-show names/designs/catchphrases |

## Deliberate differences from the library demo
- Cast never travels through the portal.
- Story takes place in a warehouse, not a lab/café run.
- Portal is integrated into a thermal printer and used to route parcels.
- Opening begins with the creature already falling out, not an empty-prop setup.
- World changes are viewed through the device while the leads stay home.
- The climax is package suction/return, not consuming a retrieved object.
- Ending is a return-to-sender workplace decision, not a portal callback to a beverage.
