# Zoey's Little Wonders

Ten English/Chinese games built as dependency-free static pages inside this Hugo blog. The butterfly lifecycle is adapted from the supplied reference; the other worlds, learning games, characters, and ingredients use original vector artwork.

## Open

```sh
python3 -m http.server 8080 --directory static
```

Open `/butterfly-adventure/` for the separate game selection page. Each door opens `play.html?game=garden|zoo|sea|clock|market|kitchen|traffic|counting|letters|seedling`. The old `/butterfly-adventure.html` alias still points to the club. Each game fills the available viewport with a fixed body, safe-area padding, and responsive controls. Browser Fullscreen API is an optional explicit button on supported devices; CSS full-viewport layout is always the default. Only Zoo/Sea worlds and their friend index pan. There is no scrollable page behind the game.

The whole folder can be downloaded and served without internet. A hosted copy needs a connection to load its assets; it is not a service-worker offline cache.

## Games

- **Garden:** continuous hatching, growing, hanging in a J, forming/opening the chrysalis, unfolding/drying wings, flight, flowers, and an ordering game shown in an overlay. The articulated SVG Zoey watches, feeds, cheers, and waves.
- **Zoo:** 24 familiar animals including hippo, rhino, otter, panda, kangaroo, penguin, crocodile, flamingo, gorilla, fox, deer, rabbit, horse, and cow. Native two-dimensional touch panning, mouse/pen dragging, four directional controls, keyboard arrows, a horizontal position slider, and a friend index. Each animal has three characteristic actions; another tap chooses a different action. Names and calls share one audio clip.
- **Sea:** 18 friends, including seal, pufferfish, starfish, manta ray, swordfish, shrimp, lobster, and a storybook mermaid. Routes vary in direction, distance, and timing, and every animal returns. Fish turn to face their routes; turtles paddle, rays flap, octopuses pulse/jet, jellyfish pulse vertically, seahorses stay upright, crabs scuttle, starfish crawl along the sand, and shrimp/lobsters flick backward.
- **Clock Cottage:** eight routines at 08:00, 10:00, 12:00, 15:00, 16:00, 18:00, 20:00 and 21:00. The minute hand remains at 12. Drag/tap the short hand or use keyboard arrows and Enter. It snaps to twelve integer positions. The routine card shows AM/PM and 24-hour equivalents; 15:00 maps to 3 and 21:00 to 9. Incorrect hours get a gentle reminder. Correct hours reveal their activity, including mermaid swimming and a princess story.
- **Market:** three shopping lists of fruit and vegetables. Tap or drag items into the basket; incorrect and surplus items return to the shelf. Once the list is complete, add exactly one coin per item. Coins can also be dragged and removed from the tray. Payment is accepted only when item and coin counts match.
- **Kitchen:** preview the final dish first. Follow the ingredient order to make a fruit boat, vegetable soup, or strawberry milk. Incorrect ingredients return to the shelf. Stir with a circular touch gesture or the stir button. Soup bubbles for a visible waiting interval; every recipe becomes its finished dish. Changing recipes cancels pending flights and timers.

- **A Little Walk:** three destinations with a pedestrian signal. Red means wait, then right–left–right observations and stopped traffic are required before Zoey walks with a grown-up. Pressing walk early never moves the characters. The green signal stays steady while the child practices; there is no rush or countdown punishment.
- **Counting Picnic:** one touch/drag corresponds to one food item. Match a picture and quantity, remove a piece to recount, and check the exact total. Two levels cover 1–5 and 1–10; the animals are fictional picnic companions, not animal-feeding advice.
- **Letter Post:** all 26 letters have picture cards and recorded letter names. Match capitals, or pair capitals and lowercase. Tap a postbox or drag the envelope. The deck visits all 26 before shuffling again; each delivery is a small success.
- **挖呀种花园:** an original Mandarin interactive planting story inspired by the idea of digging in a little garden. No song recording, melody or additional song lyrics are reproduced. Dig three times, plant 1/3/5 seeds, cover, water twice, invite sunlight, and see the flowers grow. Tool taps, drags, and tapping the garden all work. Real plants are described as needing days and different growth times.

Completed learning-game rounds, finding every friend in Zoo/Sea, and the butterfly ordering game get quiet paper confetti. It never blocks touches, cleans itself up, and becomes one static star when reduced motion is requested.

## Materials first

`materials.html` is an independent gallery of the exact assets used in games. It lets each animal's three motions run without scenery, then return to its neutral state. Food, coins, containers, dishes, and 15 new playthings also have independent movement previews. `mini-art.js` shares their SVGs and baseline motions. `art.js` provides the original SVGs; `materials.js` adds articulated animals and ingredients; `creatures.js` shares catalogs and movement profiles between the gallery and games.

The browser checks first exercise all 126 animal action variants in the gallery, then assemble and test the actual game interactions. Motion cancellation, replay, reduced motion, and interrupted recipes are covered.

## One production voice

All 170 English and Mandarin recordings use the selected `.voice-lab` **Zoey / 03-curious** fictional reference. The exact reference, prompt, transcript, checksum and pinned model revisions are versioned in `tools/voice/`. Existing and future lines use that same reference through the Base model. The build process runs locally; deployed games only load bundled AAC. There is no device TTS, runtime model, CDN, remote font, or audio service.

```sh
.voice-lab/.venv/bin/python tools/build-adventure-audio.py
.voice-lab/.venv/bin/python tools/check-adventure-audio.py --transcribe
```

Edit `audio/narration.json` when adding/changing a line. The generator fingerprints each transcript, voice configuration and call source; current clips are skipped. `audio/recording-info.json` tracks output checksums, durations, seeds and voice identity. `tools/voice/production-qa.json` records waveform and normalized ASR transcript checks.

Animal calls include licensed recordings, contributed/human imitations, and soft original crafted effects. `tools/build-animal-effects.py` regenerates the new crafted effects; it leaves licensed recordings intact. See `credits.html` for source authors, licenses and edits.

## Browser checks

Use an external Playwright installation, keeping Hugo free of Node dependencies:

```sh
npm install --prefix /tmp/zoey-check playwright
/tmp/zoey-check/node_modules/.bin/playwright install chromium webkit
NODE_PATH=/tmp/zoey-check/node_modules node tools/test-butterfly-adventure.cjs
NODE_PATH=/tmp/zoey-check/node_modules BROWSER=webkit node tools/test-butterfly-adventure.cjs
NODE_PATH=/tmp/zoey-check/node_modules node tools/test-little-learners.cjs
NODE_PATH=/tmp/zoey-check/node_modules BROWSER=webkit node tools/test-little-learners.cjs
```

Chromium exercises real dispatched touch gestures, including diagonal two-axis pan, food/coin dragging, and circular stirring. WebKit exercises native taps and pointer dragging. Both cover the complete lifecycle, 42 animal interactions, random action selection, the original three learning games, wrong choices, exact coin payments, recipe order/wait, four viewport sizes, and decoding every recording. `tools/test-little-learners.cjs` additionally covers the four new games, all 26 letters, all three garden sizes, ten-piece counting, pedestrian checks, interrupted actions, and reduced-motion celebrations. Set `BASE_URL` to test a deployed club. Screenshots and reports are written to a printed temporary directory.

These are browser/iPad simulations; physical iPad speakers and OS volume settings still require a real-device check. Sound starts with a user tap and stops on mute, page hiding, or navigation.

See [learning-notes.md](learning-notes.md) for the ten proposed activities, chosen designs and Singapore framework references.
