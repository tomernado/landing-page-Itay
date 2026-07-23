# Video Showcase Section — Design

## Purpose

A new section directly after the Hero, showcasing 4 vertical event clips (NEWS, BIRTHDAY,
LONDON, TIKTOK — in that order, NEWS first/centered on load). Reinforces the Hero's "1000+
events" claim with real footage.

## Placement

`src/components/VideoShowcase.jsx`, mounted in `App.jsx` between `<Hero />` and the existing
`<SectionDivider /><Features />` block:

```
<Hero />
<SectionDivider />
<VideoShowcase />
<SectionDivider />
<Features />
...
```

## Interaction model (matches the existing `ReviewsCarousel` 3-card stage)

- Center card: the active video. Autoplays **muted**, `playsInline`, no native loop —
  on `ended`, auto-advances to the next video (wraps around after TIKTOK → NEWS).
- Prev/next cards: peek at reduced scale to the sides, blurred (`filter: blur`) and dimmed
  (reduced opacity), exactly like `PhoneFrame`'s inactive state today. They show a **static
  poster frame only — they do not play.** This is a deliberate simplification: decoding 3
  vertical videos at once on a phone is wasteful, and the blur hides the fact that it's a
  still. Clicking a side card brings it to center (same `go(idx)` pattern as reviews).
- Arrows + dot indicators below the stage, styled identically to `ReviewsCarousel`.
- Swipe/drag on the center card to move prev/next, same as reviews.
- No auto-advance timer independent of video playback — advancing is driven entirely by the
  video's `ended` event, not a fixed interval (unlike the image carousel's 4.5s timer).

## Sound control

- Starts fully muted — no audio plays until the user acts (matches the original ask and
  browser autoplay policy: audible autoplay is blocked regardless of volume level unless
  `muted` is `false`, so there is no safe way to "ease in" volume before an explicit tap).
- A small mic-icon button sits in the top-left corner of the **center card only** (mirrors
  where `ReviewsCarousel`'s magnifier button sits on its active card). Tapping it flips
  `muted` off and sets `video.volume = 0.75` (a comfortable level, not full blast). Tapping
  again re-mutes.
- Switching the centered video (nav/swipe/auto-advance) always resets to muted — no carry-over
  of the unmuted state to the next clip.

## Fullscreen expand

- A second small icon, top-right corner of the center card, expands that video into an
  in-page overlay — **not** the native `Fullscreen` API (iOS Safari's native video fullscreen
  has inconsistent, hard-to-style behavior across devices).
- Overlay follows the existing `Lightbox` pattern in `ReviewsCarousel.jsx`: fixed, full
  viewport, blurred dark backdrop, close via an X button, click-outside, or Escape.
- Implementation: a **second `<video>` element** in the overlay (not a shared-layout DOM
  reparent — simpler and avoids `position: fixed` containing-block issues under the carousel's
  `transform`-animated wrapper). On open: read `currentTime`/`muted` from the inline video,
  pause it, seed the overlay video from the same `currentTime`, autoplay unmuted with native
  `controls`. On close: read the overlay's `currentTime` back into the inline video, resume it
  muted, unmount the overlay.

## Assets & transcoding

Source files (`public/IMG/NEWS.MOV`, `BIRTHDAY.MOV`, `LONDON.MOV`, `TIKTOK.MOV`) are HEVC,
2028–2160px × 3840px, 75–260MB each — unusable on the web as-is (poor HEVC decode support in
Chrome/Firefox, and the page would ship ~800MB of video).

Per video, ffmpeg produces exactly two output files (no separate low-quality variant needed —
side cards use a still, not a video):

- `public/videos/<name>.mp4` — H.264, scaled to 720px width (height auto, even), CRF 26,
  `veryslow`-ish preset acceptable given one-time processing, AAC audio 96kbps, `yuv420p`,
  `+faststart`. Target ballpark 4–8MB for the ~40–56s clips — prioritizes small/fast per your
  answer, not maximum fidelity.
- `public/videos/<name>-poster.jpg` — a representative frame at the same 720px width, used as
  the `poster` attribute (fast first paint) and as the static image for the blurred side cards.

## Section copy (draft, in the site's existing voice)

- Badge: `🎥 מאחורי הקלעים`
- Heading: `תראו את זה בעצמכם` / gradient line: `רגעים אמיתיים מהבמה`
- Subtitle: `קטעים נבחרים מתוך אירועים אמיתיים — כי סרטון אחד שווה יותר מכל תיאור.`

## Out of scope (deliberately, to keep this focused)

- Volume slider — binary mute/unmute at a fixed comfortable level is enough for a single
  showcased clip; a slider is unjustified extra UI/complexity.
- Playing multiple videos simultaneously in the background.
- Native Fullscreen API.
