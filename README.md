# Longitudinal Record — RC-2026

A private tracker for a ten-year route into a digital health professorship: milestones, study consistency, finances, and written field notes.

Plain HTML, CSS and JavaScript. No build step, no dependencies, no server.

---

## Deploy on GitHub Pages

1. Create a new repository on GitHub (private works fine — Pages still serves it on paid plans; use public if you're on the free tier).
2. Upload `index.html`, `styles.css`, `app.js`, `data.js` and this `README.md` to the root of the repo.
3. Go to **Settings → Pages**.
4. Under **Source**, choose **Deploy from a branch**.
5. Pick branch `main` and folder `/ (root)`. Save.
6. Wait about a minute. Your site appears at `https://<your-username>.github.io/<repo-name>/`.

To run it locally instead, just open `index.html` in a browser. Everything works offline apart from the web fonts.

---

## Where your data lives

Your ticks, logged sessions, figures and notes are saved in that browser's `localStorage`. That means:

- Data does **not** sync between your laptop and your phone.
- Clearing site data or browsing history will erase it.
- Nothing is uploaded anywhere. Nobody else can see it.

**Use the Export button regularly** and keep the JSON file somewhere safe. Import restores everything.

---

## Editing the plan

Open `data.js`. It holds the phases, milestones, curriculum, cost lines, funding pipeline and income stages. Change the text, dates or amounts and re-upload the file.

Keep the `id` values the same when you edit an existing entry — that's what your saved progress is keyed to. New entries need new, unique ids.

`STUDY_START` at the top of the file sets Day 1 of the record.

---

## A note on the financial figures

Every amount in `data.js` is a rough placeholder, not a quote. Tuition, permit fees and proof-of-funds thresholds change frequently and vary by programme and year. Confirm each one with the institution or IRCC before making decisions on them. Nothing here is financial advice.
