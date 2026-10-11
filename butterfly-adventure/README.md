# Zoey's Little Wonders

Twelve English/Chinese games built as dependency-free static pages inside this Hugo blog. The butterfly lifecycle is adapted from the supplied reference; the other worlds, learning games, characters, and ingredients use original vector artwork.

## Open

```sh
python3 -m http.server 8080 --directory static
```

Open `/butterfly-adventure/` for the separate game selection page. Each door opens `play.html?game=garden|zoo|sea|clock|market|icecream|traffic|counting|letters|seedling|connect|match` (`game=kitchen` still opens the ice cream shop). The old `/butterfly-adventure.html` alias still points to the club. Each game fills the available viewport with a fixed body, safe-area padding, and responsive controls. Browser Fullscreen API is an optional explicit button on supported devices; CSS full-viewport layout is always the default. Only Zoo/Sea worlds and their friend index pan. There is no scrollable page behind the game.

The whole folder can be downloaded and served without internet. A hosted copy needs a connection to load its assets; it is not a service-worker offline cache.

## Games

- **Garden:** continuous hatching, growing, hanging in a J, forming/opening the chrysalis, unfolding/drying wings, flight, flowers, and an ordering game shown in an overlay. The articulated SVG Zoey watches, feeds, cheers, and waves.
- **Zoo:** 34 familiar animals laid out like a real zoo map rather than a grid. `world-maps.js` draws an entrance plaza and gate, a looping tour path with spurs, a lake, shaded trees and signed zones inspired by the Singapore Zoo (Frozen Tundra, Reptile Garden, Primate Kingdom, Fragile Forest, Australasia, Elephants of Asia, KidzWorld, Wild Africa). The visit starts at the gate and the animals sit in their zone. Every animal has a visible English name under it. Ten animals (tiger, elephant, otter, kangaroo, flamingo, rhino, frog, cow, gorilla, fox) were redrawn from species features, the giraffe has a much longer neck, and ten more common animals (orangutan, polar bear, camel, koala, sheep, pig, peacock, tortoise, snake and lemur) were added in `zoo-animals.js`, together with refreshed zebra, horse, hippo and crocodile drawings. Native two-dimensional touch panning, mouse/pen dragging, four directional controls, keyboard arrows, a horizontal position slider, and a friend index. Each animal has three characteristic actions; another tap chooses a different action. Every introduction is written for that animal (what it looks like, eats or does), then the sound. The 24 original zoo animals keep their recorded or crafted call after the introduction; the 10 added zoo animals and the sea animals have no call effect, so their spoken introduction says the sound or a fact instead.
- **Sea:** 26 friends, including seal, sea turtle, seahorse, dolphin, shrimp, pufferfish, starfish, manta ray, swordfish, lobster, narwhal, orca, moray eel, squid, hermit crab, sea otter and a storybook mermaid. The sea turtle, shrimp, seahorse and dolphin were redrawn. Instead of a grid, the ocean is laid out by habitat and depth: sunny surface, coral reef, open ocean, kelp forest, twilight deep and sandy seabed, each with a sign, with English names under every friend. Routes vary in direction, distance, and timing, and every animal returns. Fish turn to face their routes; turtles paddle, rays flap, octopuses pulse/jet, jellyfish pulse vertically, seahorses stay upright, crabs scuttle, starfish crawl along the sand, and shrimp/lobsters flick backward.
- **Clock Cottage:** eight routines at 08:00, 10:00, 12:00, 15:00, 16:00, 18:00, 20:00 and 21:00. The minute hand remains at 12. Drag/tap the short hand or use keyboard arrows and Enter. It snaps to twelve integer positions. A large numeral and activity picture show the next hour; 15:00 maps to 3 and 21:00 to 9. Incorrect hours get a gentle reminder. Correct hours reveal their activity, including mermaid swimming and a princess story.
- **Market:** three shopping lists of fruit and vegetables. Tap or drag items into the basket; incorrect and surplus items return to the shelf. Once the list is complete, add exactly one coin per item. Coins can also be dragged and removed from the tray. Six large shelf choices, a picture list and empty coin slots make the task readable without words. Payment is accepted only when item and coin counts match; tap the cashier or the large green check to pay. The cashier thanks the child and automatically starts a fresh list.
- **Zoey's Ice Cream Shop:** friends from a pool of 22 animals line up at the window and ask for an ice cream with a picture bubble (and Zoey says the order in English). Scoop the flavours from six tubs (vanilla, chocolate, strawberry, mint chip, blueberry, mango), add toppings from the jars (cherry, sprinkles, wafer) and ring the bell. A dashed ring marks where the next piece goes. The order matters: the second scoop cannot go first and a wrong tub just gets a gentle "not that one". Level 1 is one scoop in a ready cone; level 2 is two scoops (and sometimes a topping); level 3 has two or three scoops, a topping, and the child also picks the cone or the cup. Three customers make one shift; the ice cream flies to the customer, who eats it and says thank you, and the last customer earns a confetti party. All scooping, the bell and the crunch have their own synthesized sounds.

- **A Little Walk:** three destinations with a pedestrian signal. Two picture arrows select left/right paths through three crossings. A car and bus approach from opposite directions while a van turns. Red means wait; green appears only after the actual vehicle motions have stopped, then Zoey walks with a grown-up. Pressing walk early never moves the characters. The green signal stays steady while the child practices; there is no rush or countdown punishment.
- **Counting Picnic:** one touch/drag corresponds to one food item. Match a picture and quantity; the exact count completes the card automatically. A piece can be removed before completion. Two levels cover 1–5 and 1–10; the animals are fictional picnic companions, not animal-feeding advice.
- **Letter Balloons:** a picture of an animal, fruit, food, vehicle or toy is shown (90 pictures in all, covering 24 starting letters) and the child pops the balloon with the letter it starts with. The picture is the question; there is no envelope or mailbox. Level 1 floats three capital-letter balloons, level 2 four lowercase balloons, level 3 six balloons mixing capitals and lowercase, with look-alike letters (b/d, p/q, m/n...) used as distractors. A wrong balloon shakes with a boing and a hint glow appears after repeated misses or a quiet moment. Popping the right one shows the big letter and the word, and Zoey says "The letter T is for... A tiger!" in English before the next picture arrives.
- **挖呀种花园 (fourth door):** an original Mandarin planting story for one 🌷 tulip. The small spade hangs high above the garden and can be tapped directly (or picked from the tray) to dig three times; then place the seed, cover it with soil and follow the four-line rhyme the child hears: the big sun brings one leaf, the little worm turns the soil for two, the soft rain makes three, and grandpa with his hoe brings all the leaves. Finally the tulip blooms. No song recording or melody is reproduced. Tool taps, drags and tapping the garden all work. Real plants are described as needing days and different growth times.

- **Connect the Pairs (fifth door):** drag a line (or tap one picture, then its partner) between the left and right columns. There are four kinds of match: *shadows* (the colour picture and its black silhouette), *colours* (a banana and a yellow swatch), *numbers* (three butterflies and a big 3, up to 9) and *missing halves* (the left half of an animal and its right half). Level 1 has three pairs of one kind, level 2 four pairs mixing two kinds, and level 3 five pairs mixing three kinds, harder silhouettes and larger numbers. A picture is never used twice on one board nor on two boards in a row. A rubber line follows the finger, a right match ties a coloured line with a check badge and its own sound (pop for shadows, splash for colours, tap-tap for counting, a click for halves), a wrong one shakes with a soft *boing*. Zoey says the picture's English word (and the colour name or the number) and, after the last pair, a cheer. After a quiet moment the two halves of one pair wiggle as a hint.
- **找朋友消消乐 (sixth door):** a board of pictures from five themes — animals, fruit, vegetables, vehicles and sea friends (56 different pictures, including 10 newly drawn fruit and vegetables and 7 new vehicles). Tap two of a kind and they sparkle, pop and disappear, with the pop rising in pitch for combos. Levels have 8, 12 or 16 tiles; clearing a board celebrates and the next board switches to another random theme. The theme chips and level dots can be changed at any time.

Every game starts with its pictures ready for interaction. The browser tries to play bundled narration immediately; if autoplay requires a gesture, one large ▶ unlocks sound. Words remain available to screen readers but children follow pictures, numerals, highlighted objects and voices. Success gives a short confetti pause followed by the next round automatically. A small star ring shows the pause; its timer stops while the tab is hidden, and changing a recipe or mode cancels it.

Completed rounds in every learning game, finding every friend in Zoo/Sea, and the butterfly ordering game get a full-screen party: five waves over about seven seconds (two corner cannons, a shower from the top, a big burst from the middle with a golden star, cannons from both sides, and a last streamer shower with twinkles). It is one canvas (`celebration.js`), never blocks touches, cleans itself up, and becomes one still scatter with a star when reduced motion is requested.

## Sound effects

`sfx.js` synthesizes every effect with Web Audio, so nothing extra is downloaded: tap/pick/drop/deal, a three-note chime for a link, a bubble pop plus sparkle for a match, a soft boing for a mistake, themed link sounds (chomp, siren, sizzle, splash, twinkle, flutter, bounce, moo), ice-cream scoops, a shop bell, sprinkles and a wafer crunch, confetti cannon pops and a fanfare. A compressor keeps overlaps from clipping, effects obey the same mute button as Zoey's voice, they use the iOS "playback" audio session so the silent switch does not hide them, and the first touch wakes the audio. `SoundFX.render(name)` renders any effect offline, which `tools/test-puzzle-games.cjs` uses to prove each one is audible, unclipped and short.

## Materials first

`materials.html` is an independent gallery of the exact assets used in games. It lets each animal's three motions run without scenery, then return to its neutral state. All 155 materials are redrawn in the same soft palette. Food, coins, containers, dishes, 45 playthings (including the worm, rain cloud, grandpa and tulip growth stages, plus the new fruit, vegetables, vehicles and friends from `puzzle-art.js`, and the sundae, ice cream tub and shop bell from `icecream-art.js`), lifecycle stages, Zoey, the grown-up, cashier/register, buildings, vehicles and icon controls also have independent movement previews. `mini-art.js` shares their SVGs and baseline motions. `art.js` provides the lifecycle and character SVGs; `materials.js` adds articulated animals and ingredients; `creatures.js` shares catalogs and movement profiles between the gallery and games.

The browser checks first exercise all 180 animal action variants in the gallery, then assemble and test the actual game interactions. Motion cancellation, replay, reduced motion, and interrupted recipes are covered.

The mermaid uses a curved torso, continuous tapered tail trunk, and two overlapping flukes. The giraffe, zebra, deer, and horse now have a continuous back/shoulder/neck silhouette. Animated SVG groups specify their actual joint with `data-motion-origin="x y"` in viewBox coordinates; the flamingo's head, beak, and neck move together at its shoulder. New articulated assets should define their own pivot and overlap the fixed body at that joint, rather than inheriting a fish's tail pivot.

The animal review preserves species identity instead of reusing one rounded fish shape: clownfish bands, a dolphin's beak and arched back, a shark's pointed snout/gills/tall dorsal fin, a whale's large head/throat grooves, a sea turtle with two big front flippers and a rear flipper, eight independently moving octopus arms, a pulsing jellyfish bell, curled seahorse tail, crab eye stalks, and a segmented lobster/shrimp. Manta rays have broad swept wings and curled head fins; stingrays have a kite silhouette and long thin tail. Each has its own palette and articulated motion. The [Monterey Bay Aquarium octopus exhibit](https://www.montereybayaquarium.org/visit/exhibits/giant-pacific-octopus/) and [NOAA manta ray reference](https://www.fisheries.noaa.gov/species/giant-manta-ray) were consulted for these features; the drawings remain original and load no external resources.

Bear and panda feet are painted in front of the belly with visible toe/heel pads, and stay planted while the arms/head move. Gorilla uses its own broad body and knuckle hands. Rabbit hind feet, monkey foot placement, crocodile splayed legs and frog webbed toes are distinct. Four-legged animals use overlapping near/far legs, with paws, split hooves, solid hooves or column-like elephant feet as appropriate.

These remain original SVG drawings in the club's palette. The [FreeSVG giraffe silhouette](https://freesvg.org/giraffe-2d) was consulted for the neck/shoulder shape; no external illustration is loaded by the game.

`tools/test-creature-joints.cjs` rasterizes 900 intermediate poses of all 60 animals, checks connected silhouettes, fixed pivots, species limb counts, visible bear/panda foot pads, planted feet, cancellation and reduced motion. It then taps all 60 animals twice, checks native two-axis panning and automatic progression, and verifies phone and both iPad orientations. Run with the same `NODE_PATH` as the other checks; use `BROWSER=webkit` for Safari's engine or `BASE_URL` for production.

## One production voice

All 335 English and Mandarin recordings use the selected `.voice-lab` **Zoey / 03-curious** fictional reference. The exact reference, prompt, transcript, checksum and pinned model revisions are versioned in `tools/voice/`. Existing and future lines use that same reference through the Base model. The build process runs locally; deployed games only load bundled AAC. There is no device TTS, runtime model, CDN, remote font, or audio service.

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
NODE_PATH=/tmp/zoey-check/node_modules node tools/test-picture-play.cjs
NODE_PATH=/tmp/zoey-check/node_modules BROWSER=webkit node tools/test-picture-play.cjs
NODE_PATH=/tmp/zoey-check/node_modules node tools/test-creature-joints.cjs
NODE_PATH=/tmp/zoey-check/node_modules BROWSER=webkit node tools/test-creature-joints.cjs
NODE_PATH=/tmp/zoey-check/node_modules node tools/test-picture-audio.cjs
NODE_PATH=/tmp/zoey-check/node_modules node tools/test-puzzle-games.cjs
NODE_PATH=/tmp/zoey-check/node_modules BROWSER=webkit node tools/test-puzzle-games.cjs
```

Chromium exercises real dispatched touch gestures, including diagonal two-axis pan, food/coin dragging, ice cream scooping and balloon popping. WebKit exercises native taps and pointer drags. Both cover 155 material previews, the continuous lifecycle, all 60 animal interactions, eight hours, three cashier lists, three ice cream shifts, left/right routes to three destinations, the full 1–10 number deck, all 24 starting letters in the balloon game, the one-tulip rhyme garden, automatic progression (`test-puzzle-games.cjs` covers the two puzzles: random shadow/colour/number/half boards, drag/tap/reverse-drag/keyboard linking, refusals, all five matching themes and three levels, clearing boards, all 23 sound effects rendered offline, mute, and the five-wave full-screen confetti with its reduced-motion version), interrupted actions, visibility pause/resume, five viewport sizes, reduced motion and decoding all 335 recordings. `test-creature-joints.cjs` additionally validates 900 rasterized animal poses; `test-picture-audio.cjs` checks actual AAC playback, the spoken ice cream order and the next customer after narration. The previous two browser-test entry points forward to the new picture-interaction suite. Set `BASE_URL` to test a deployed club. Screenshots and reports are written to a printed temporary directory.

`tools/check-picture-deployment.py` compares live versioned assets and new voice recordings against the checkout, so a cached page cannot masquerade as a verified deployment.

These are browser/iPad simulations; physical iPad touch and speaker behavior still require a real-device check. Audio stops on mute, page hiding, or navigation.

See [learning-notes.md](learning-notes.md) for the ten proposed activities, chosen designs and Singapore framework references.
