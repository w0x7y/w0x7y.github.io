# Profolio

My personal portfolio site — a single-page site built with plain HTML, CSS, and JavaScript (no frameworks, no build step). Soft claymorphism visuals, light/dark mode, and a few playful interactions.

**Live areas:**
- **Home** — intro, tech stack, socials
- **About** — a short timeline of how I got into development
- **Projects** — featured projects, with a "view more" popup for the full list
- **Contact** — email, location, status, and social links

## Tech stack

- HTML5 + CSS3 (custom properties, no preprocessor)
- Vanilla JavaScript (no dependencies)
- [Fontsource Maple Mono](https://fontsource.org/fonts/maple-mono) loaded via CDN

## Features

- **Claymorphism design** — soft inset/outset shadows throughout, defined once as CSS custom properties (`--clay-shadow-outer`, `--clay-shadow-inner`) so light/dark mode stay consistent
- **Light/dark mode** — toggled via a `data-theme` attribute on `<html>`, no page reload
- **Projects modal** — a "view more" popup with a project list on the left and full details on the right
- **Scroll-triggered animations** — sections, cards, and lists fade/rise into view as you scroll, using `IntersectionObserver`
- **Scroll-spy navigation** — the nav bar highlights whichever section is currently in view
- **Cursor-tilt profile card** — the avatar card tilts subtly toward the cursor on desktop
- **Back-to-top button** — appears after scrolling down
- **Copy-to-clipboard** contact email button
- **Reduced-motion support** — all animations are disabled if the user has `prefers-reduced-motion` set
- **Skip-to-content link** for keyboard users

## Running locally

No build step — just open `index.html` in a browser, or serve the folder with any static server, e.g.:

```bash
python3 -m http.server
```

## Project structure

```
├── index.html      # all markup, single page
├── style.css       # all styles
├── script.js       # theme toggle, project rendering, modal, animations
├── assets/         # favicon and other static assets
└── README.md
```

## Adding projects

Projects live in the `projects` array at the top of `script.js`. Only the first two show in the Projects section; the "View more" popup shows all of them.

```js
{
  tag: "Client work",           // small label shown above the title
  title: "Project Name",
  description: "Short summary shown on the card.",
  longDescription: "Optional longer summary shown in the popup detail view. Falls back to `description` if omitted.",
  stack: ["React", "Node.js"],
  imageUrl: "",                 // optional; leave empty for a placeholder thumbnail
  repoUrl: "#",
  createdDate: "2025",
}
```

## TODO

- [ ] Swap the placeholder project entries in `script.js` for real projects (descriptions, tech stack, live `repoUrl`, and optionally `imageUrl`/`longDescription`)
- [ ] Add a real X (Twitter) link in the contact section, or remove the link if not applicable
- [ ] Optional: add `robots.txt` and `sitemap.xml` once the site has a real domain, for SEO
- [ ] Optional: self-host the Maple Mono font instead of loading it from a CDN, for perf/reliability
