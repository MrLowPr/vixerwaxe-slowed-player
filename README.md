# vixerwaxe — Slowed &amp; Reverb Player

A zero-dependency, single-page web app for **9mm (Slowed)** (and 34 more slowed edits from
[@vixerwaxe](https://www.youtube.com/@vixerwaxe)).

The page hosts a **live slowed &amp; reverb player**: speed, reverb mix and bass are processed in
real time in the browser with the Web Audio API — the audio is never re-encoded, so you can keep
tweaking while it plays.

> Built for the YouTube description of `9mm (Slowed)`: the page includes a
> **ready-to-paste description** block that auto-fills the live GitHub Pages URL, so the link in
> the video description is always correct.

**Live page:** <https://mrlowpr.github.io/vixerwaxe-slowed-player/>

---

## Features

| | |
|---|---|
| **Speed** | 0.50× – 1.00× with pitch preserved (`preservesPitch`) or classic pitch-drop |
| **Gradual slowdown** | drifts from 1.00× down to the target over the first 30 s |
| **Reverb** | convolution reverb with a generated impulse response, 0 – 100 % wet mix |
| **Bass** | ± dB low-shelf at 110 Hz |
| **Visualizer** | canvas spectrum + reflection, plus a radial ring on the hero art |
| **Library** | all 35 slowed edits of the channel — 3 play locally, the rest open on YouTube |
| **Copy blocks** | one click to copy the YouTube description / page link / GitHub link |
| **Shortcuts** | `space` play · `←/→` seek · `↑/↓` speed · `M` mute |

## Run it

No build step, no dependencies. Either open `index.html` directly, or serve it:

```bash
python3 -m http.server 8080
# -> http://localhost:8080
```

## Deploy on GitHub Pages

The repo ships with `.github/workflows/pages.yml`, so **Settings → Pages → Source: GitHub Actions**
is all that is needed — every push to `main` redeploys automatically.

## Refreshing the audio

The MP3s in `audio/` are fetched from the channel's own YouTube uploads:

```bash
./scripts/fetch-audio.sh
```

Requires `yt-dlp` and `ffmpeg`. Add more tracks by appending to the `TRACKS` array in
`assets/app.js`.

## Structure

```
index.html              markup + YouTube description generator
assets/style.css        dark neon theme, responsive
assets/app.js           Web Audio graph, player, visualizer, tracklist
audio/                  mp3 files served locally (3 tracks)
scripts/fetch-audio.sh  refresh audio from YouTube
.github/workflows/      GitHub Pages deploy
```

## Credits

Original production of *9mm*: **Memphis Cult**, **Groove Dealers**, **SPLYXER**.
Slowed edit published by **@vixerwaxe**. All rights belong to their respective owners.

No copyright infringement intended.

## License

MIT for the code. The audio files in `audio/` are the channel's own uploads and remain the
property of their rights holders.
