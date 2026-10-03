# Little Wonders

An English interactive picture book adapted from the supplied `butterfly-adventure.html`. It is a dependency-free static page inside this Hugo blog.

## Open

From the repository root:

```sh
python3 -m http.server 8080 --directory static
```

Visit `http://localhost:8080/butterfly-adventure/`. A Hugo build publishes the same page at `/butterfly-adventure/`, with an alias at `/butterfly-adventure.html`. You can also open `index.html` directly; use the whole folder so its scripts and audio stay together. After downloading the folder, it does not require an internet connection. This is not a service-worker offline cache: a hosted copy needs a connection to load its files.

## Interactions

- Garden: three actions per chapter, plus a continuous transition into the next chapter. The egg splits before the caterpillar crawls out; a grown caterpillar climbs, hangs in a J, and reveals a chrysalis; the chrysalis opens before the folded butterfly emerges; wings expand and dry before flight. Tap a flower after takeoff to invite the butterfly for nectar. Chapter buttons allow revisiting any stage. The ordering game remains available after the final chapter.
- Zoey: animated SVG with articulated arms, head, and blinking eyes. Zoey leans in to observe, offers leaves, cheers, and waves at story events. Tap Zoey for a greeting.
- Zoo: ten animal friends, native horizontal touch scrolling with momentum, a scene position slider, arrow buttons, keyboard arrows, English names followed by animal calls, individual actions, and discovery progress.
- Sea: ten ocean friends, native horizontal touch scrolling, a scene position slider, English names, swim-away-and-return animations, and discovery progress. The jellyfish floats and pulses rather than walking.
- Audio: bundled English female-voice (Samantha) AAC/MP3 clips, started by a user tap. No `speechSynthesis`, runtime TTS, remote fonts, CDNs, or audio services. A single playback channel prevents overlapping narration. The name and zoo call are in the same clip, avoiding Safari's restrictions on starting a second audio element after the first ends. Mute and page visibility stop playback.
- Touch: Native touch pan and pinch zoom with vertical page scrolling; Pointer Events handle mouse/pen dragging only. Horizontal, diagonal, and animal-started swipes are supported, with cancellation cleanup and click suppression after drags. No hover-dependent controls. Controls meet the 44-pixel touch target minimum. Browser zoom is allowed.
- Reduced motion: suppresses ambient motion and resolves story transitions immediately while preserving their final states and text.

## Check

`tools/test-butterfly-adventure.cjs` runs a local server and browser integration checks. It requires Playwright to be installed in an external environment, keeping the Hugo project free of Node dependencies.

```sh
npm install --prefix /tmp/little-wonders-check playwright
/tmp/little-wonders-check/node_modules/.bin/playwright install chromium webkit
NODE_PATH=/tmp/little-wonders-check/node_modules node tools/test-butterfly-adventure.cjs
```

Set `BROWSER_EXECUTABLE` to use an existing Chromium executable, or `BROWSER=webkit` to run the WebKit iPad simulation. Screenshots and reports go to a temporary directory printed by the script. The checks cover the full life cycle, intermediate transition frames, repeated taps, interruption and replay, the ordering game, all animal interactions, touch dragging versus tapping, keyboard controls, audio loading/decoding, mute, reduced motion, responsive layout, and discovery progress.

Browser simulations cannot verify physical iPad speakers or OS volume settings; a real-device pass remains useful. Safari requires a user gesture for sound, so the book never attempts background autoplay.

## Audio maintenance

`audio/narration.json` contains every English recording's transcript. `tools/build-adventure-audio.py` can regenerate narration and name/call clips on macOS with `say -v Samantha` and `afconvert`. Those tools are **build-time only**. They are not required to run or serve the book. If story text changes, update the transcripts and regenerate the bundled clips.

See `credits.html` for recording sources, authors, licenses, and edits. The monkey clip is a human imitation; the owl hoot and tiger growl are crafted effects. Bear and duck calls are recordings, and the frog sound is a contributed ribbit effect. The giraffe and duck clips retain their respective share-alike licenses. Audio credits include sources for the new calls.
