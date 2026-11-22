# Project Reel

A sleek, minimal project gallery for Squarespace 7.1 (Fluid Engine). The section pins and a row of images slides sideways as visitors scroll down. Hover an image and a panel opens underneath it with the project's details, pulled from the blog post. On phones it becomes a swipeable row with the details showing.


## Placing it (new in v1.1)
By default the reel lives **inside the Code Block**: drag and resize the block in Fluid Engine to place it, e.g. along the bottom of the screen. The images fill the block's height (minus the caption) and slide within its width. In Edit mode the block shows a dashed "PROJECT REEL" placeholder.

| Setting | What it does |
|---|---|
| `data-fit` | `block` (default) = inside the Code Block, `section` = the old full-section overlay |
| `data-bleed` | `on` = images slide in from/off the screen edges instead of being cropped at the block's sides (first image still lines up with the block) |
| `data-height` | `fill` (default) = fill the block, or a size: `40` (% of screen height) or `320px` |
| `data-vary` | `on` = mixed image sizes, `off` = all the same |
| `data-vary-amount` | How different the sizes get (0.3 = smallest is 30% smaller) |
| `data-align` | With variation: line images up along the `bottom` (default), `top` or `center` |


## Grow into the post (new in v1.2)
Click an image and it grows from its spot to fill the screen, then the blog post opens with that same image full screen at the top and the post text scrolling up beneath it.

1. **Footer:** as above. On by default (`data-open="grow"`); set `data-open="link"` for plain links. `data-grow-speed` = how long the grow takes in ms (1400).
2. **Header** (Settings → Developer tools → Code injection → Header), so the post page is ready before it shows:

```html
<!-- Project Reel: full-screen image at the top of gallery posts -->
<script src="https://cdn.jsdelivr.net/gh/sq-assets/project-reel@v1.3.0/post.js"
  data-collections="/gallery"
  data-parallax="0.35"
  data-hide-image="on"
  data-back="on"
  data-back-text="Back"
  data-back-url="/"
  data-back-position="top-left"
  data-back-style="button"></script>
```

| Setting | What it does |
|---|---|
| `data-collections` | Which blogs get the full-screen image on their posts, comma separated |
| `data-parallax` | How much slower the image scrolls than the text (`0.35`); `off` = scrolls normally |
| `data-back` | `on` = a "← Back" button on each post. Returns visitors to the same spot in the reel if they came from it, otherwise goes to `data-back-url` |
| `data-back-text`, `data-back-url` | Button text ("Back") and where it goes (`/`) |
| `data-back-style` | `button` (default) = your site's primary button style; `text` = a small plain link (`data-back-blend="on"` makes it invert over photos) |
| `data-back-position` | `top-left` (default), `top-right`, `bottom-left`, `bottom-right`. On phones, top positions sit just below the header |
| `data-back-size` | Button size: `small` (default), `medium`, `large` |
| `data-back-offset`, `data-back-arrow` | Distance from the top in px (24); `off` hides the ← |
| `data-hide-image` | `on` = hide the post's own copy of the same image so it isn't shown twice |

Links that go elsewhere (a Source URL on another site, or `data-link-new-tab="on"`) open normally. Works best with a transparent header over the top of the page.

## Content
A blog, one post per project:
- **Thumbnail:** the image (its focal point is respected)
- **Title:** shown under the image
- **Excerpt:** the text in the hover panel
- **Categories / tags:** small label line in the panel
- **Source URL:** where the image and "View project" link go (otherwise the post itself)

## Install
**Footer** (Settings → Developer tools → Code injection → Footer):
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/sq-assets/project-reel@v1.3.0/effect.css">
<script src="https://cdn.jsdelivr.net/gh/sq-assets/project-reel@v1.3.0/effect.js"></script>
```

**Code Block** in the section (set the section to fill the screen):
```html
<div class="reel"
  data-collection="/portfolio"
  data-order="newest"
  data-max="12"
  data-height="48"
  data-y="14"
  data-gap="32"
  data-radius="10"
  data-border="1px solid #111111"
  data-info="hover"
  data-dim="0.35"
  data-numbers="on"
  data-link="on"
  data-link-text="View project"
  data-speed="1"
  data-hold="0.3">
</div>
```

## Settings
| Setting | What it does |
|---|---|
| `data-collection` | The blog to pull from |
| `data-order` | `newest` (default) or `oldest` first |
| `data-max` | How many projects (default 12) |
| `data-height` | Image height, % of screen height (default 48) |
| `data-ratio` | Image shape, e.g. `4/5` or `16/10`. `auto` (default) keeps each image's own shape |
| `data-y` | How far down the row sits, % of the section (default 14) |
| `data-gap` | Space between images in px (default 32) |
| `data-padding` | Space at the start and end of the row (default `5vw`) |
| `data-radius` / `data-border` | Corner rounding (px) and border, e.g. `1px solid #111111` |
| `data-zoom` | How much the image grows on hover (default `1.04`, `1` = none) |
| `data-info` | `hover` (default) = panel opens on hover, `always` = always open, `off` = no panel |
| `data-dim` | Opacity of the other images while one is hovered (default `0.35`, `off` = no dimming) |
| `data-captions` / `data-numbers` | `off` hides the title line / the 01, 02 numbers |
| `data-excerpt` / `data-tags` / `data-more` | `off` hides that part of the panel |
| `data-link` | `off` = images and panels don't link anywhere |
| `data-link-text` / `data-link-color` | The link wording and colour |
| `data-link-new-tab` | `on` opens links in a new tab |
| `data-text-color` | Text colour |
| `data-title-size` / `data-text-size` | Title line and panel text sizes (default `.78rem` / `.9rem`) |
| `data-font-name` | Font for the title line (default: your heading font) |
| `data-uppercase` | `off` keeps titles as typed |
| `data-speed` | Higher = the row moves faster (less scrolling) |
| `data-hold` | How long it stays pinned at the end, in screens (default 0.3) |
| `data-width-mobile` / `data-ratio-mobile` | Phone card width (% of screen, default 78) and shape (default `4/5`) |
| `data-mobile-break` | Screen width below which the phone layout is used (default 768) |

The effect steps aside in the editor so you can edit the section as normal.
