# ScriptCraft

A single-file screenwriting studio. Open `index.html` in a browser — no install, no build.

Courier Prime lives in `fonts/` next to `index.html`. Keep that folder beside the HTML file or the page falls back to a system monospace font.

## Put it on GitHub

1. Create an empty repository.
2. Upload this folder (`index.html`, `fonts/`, `favicon.svg`, this README).
3. Optional: Settings → Pages → Deploy from branch `main` / root. The site is just the HTML file.

## What’s in the page

Editor, title page, print, and PDF export use screenplay measure: Courier 12, 1.5" left margin, character and dialogue indents, transitions such as `CUT TO:` on their own line at the right. A smashed title like `THE MESSAGEFADE IN…` is split back into a title and the opening scene.

Scripts stay in the browser (local storage). Nothing is sent to a server.
