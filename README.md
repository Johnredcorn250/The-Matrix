# Longitudinal Record — RC-2026

A private tracker for a ten-year route into a digital health professorship: milestones, study consistency, finances and written field notes.

Installable on a phone, works offline. Plain HTML, CSS and JavaScript — no build step, no dependencies, no server.

---

## Deploy on GitHub Pages

1. Create a new repository on GitHub.
2. Upload **every file in this folder** to the root of the repo:
   `index.html`, `styles.css`, `app.js`, `data.js`, `manifest.json`, `sw.js`,
   `icon-192.png`, `icon-512.png`, `icon-maskable-512.png`, `apple-touch-icon.png`, `README.md`
3. Go to **Settings → Pages**.
4. Under **Source**, choose **Deploy from a branch**.
5. Pick branch `main` and folder `/ (root)`. Save.
6. Wait about a minute. The site appears at `https://<your-username>.github.io/<repo-name>/`.

The app must be served over `https` for offline mode and installation to work. GitHub Pages does this automatically. Opening `index.html` straight from your hard drive will show the site but not install it.

---

## Install on your phone

**Android / Chrome** — open the site, then tap **Install app** in the header. If the button is missing, use the browser menu and choose *Install app* or *Add to Home screen*.

**iPhone / Safari** — open the site, tap the **Share** button, then **Add to Home Screen**. Safari does not support one-tap install, so this manual step is required.

Once installed it opens fullscreen with its own icon, and works with no signal.

---

## Where your data lives

Everything you enter is stored on the device you entered it on. Nothing is uploaded anywhere and nobody else can see it.

**This means your phone and your laptop keep separate records.** They do not sync. That is the trade-off for having no server and no accounts.

To move data between devices:

1. On the device with the newer record, tap **Export data**.
   On a phone this opens the share sheet — send it to Drive, Files, or your own email.
2. On the other device, tap **Import data** and pick that file.

Import **replaces** everything on the receiving device, so always export from the device you have been using most, and import onto the other one. The app shows a confirmation with entry counts before overwriting anything.

The footer tracks when you last exported and turns amber after two weeks. Clearing your browser data, or deleting the installed app, erases the record on that device — the exported file is your only backup.

---

## Editing the plan

Open `data.js`. It holds the phases, milestones, curriculum, cost lines, funding pipeline and income stages. Change the text, dates or amounts, and re-upload the file to GitHub.

Keep the `id` values the same when editing an existing entry — your saved progress is keyed to them. New entries need new, unique ids.

`STUDY_START` at the top of the file sets Day 1 of the record.

Changes appear on your devices the next time the app is opened with a signal.

---

## A note on the financial figures

Every amount in `data.js` is a rough placeholder, not a quote. Tuition, permit fees and proof-of-funds thresholds change frequently and vary by programme and year. Confirm each one with the institution or IRCC before making decisions on them. Nothing here is financial advice.
