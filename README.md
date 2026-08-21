# Afghanistan Field Intelligence (AfghanistanIntel)

A static front-end website and file collection for publishing field reports and dashboards about conditions in Afghanistan. The project is a static site (HTML/CSS/JS) intended to host report previews, an archive page, and contact/access information.

## Stack
- Languages: HTML, CSS, JavaScript (ES modules)
- Deployment: Static site (can be served by any simple web server or static hosting service)
- Notable assets: Google Fonts, Font Awesome (icons)

## Project structure (files and roles)
README.md                (this file)
index.html               Main landing page — introduction and dashboard preview
sample-report.html       Sample PDF report preview
reports-archive.html     Reports archive page (uses JavaScript for filtering/search)
contact.html             Contact / B2B access request form
main.js                  Main UI script (menu, forms, animations)
archive.js               Archive page logic and sample report handling
style.css                Primary stylesheet
dashboard.css            Styles for dashboard preview
robots.txt               Robots rules for search engines
sitemap.xml              Sitemap for SEO
sample-report.pdf        Optional sample PDF report (if included)

Note: Several HTML files reference resource paths like `css/` and `js/` (for example `css/style.css` or `js/main.js`). At the moment, those folders may not exist in the repository root — adjust the file layout or the links accordingly (see suggestions).

## Observations and quick recommendations
- This repository is a static website for the "Afghanistan Field Intelligence" content; there is no Node build pipeline or packaging (no package.json).
- JavaScript files use `export` / ES module syntax, so pages must be served over HTTP rather than opened via the file:// protocol.

Recommended structural fixes:
1. Create `css/` and `js/` directories and move `style.css`, `dashboard.css` into `css/` and `main.js`, `archive.js` (and any other scripts) into `js/` so paths like `css/style.css` and `js/main.js` work as expected.
2. If you prefer keeping files at the repository root, update the HTML files to reference `style.css` and `main.js` instead of `css/style.css` and `js/main.js`.
3. If you want easier local development, add a minimal `package.json` with a `serve` script or a small Makefile to run a static server.

## Run the site locally (quick)
Simplest approach (requires Python 3):

```bash
# from the repository root
python3 -m http.server 8000
# then open in your browser:
http://localhost:8000/index.html
```

Alternative with Node (if npx is available):

```bash
npx serve . -l 8000
```

Important: Because the scripts are ES modules (use `export` / `import`), serve the pages over HTTP — do not open them with `file://`.

## Security and legal notes
- Some page content references confidentiality (e.g., "CONFIDENTIAL" or "B2B subscribers only"). Ensure that any real or sensitive data is properly handled and that access controls are in place before publishing.
- No license file is currently present. If you'd like, I can add an open-source license such as MIT — tell me which license you prefer and I can add a LICENSE file.

## Contributing
- Open a Pull Request for small changes and describe what you changed and why.
- For bugs or feature requests, open an Issue and include a screenshot / sample / log where helpful.
- If you plan to add a server or backend, open an Issue first with an outline so maintainers can review the plan.

## Suggested tasks (I can help with any of these)
- Fix resource paths (create `css/` and `js/` directories or update HTML links) — small, low-risk change.
- Add a LICENSE file (e.g., MIT).
- Add CONTRIBUTING.md and Issue/PR templates.
- Add a minimal development script (`package.json`) with a `start` or `serve` command.

## Contact
Use the repository Issues to discuss changes or feature requests, or contact via the email address included in `contact.html` if you prefer direct email.

---

(This README was updated to accurately reflect the repository layout and practical operation notes.)
