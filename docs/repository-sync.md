# Repository-backed sync (multiple authorized DMs)

Status: **implementation prepared on a feature branch; not deployed or enabled on the production dashboard**.

## What changes

The dashboard now has a **Repository Sync** toolbar with **Configure / Sign in**, **Load**, **Save to GitHub**, and **Sign out**. The existing browser save and JSON backup still work. Repository updates are **manual**, not automatic. The Cloudflare Worker validates GitHub OAuth sign-in, an exact GitHub username allowlist, and write access to the data repository. Concurrent updates use the GitHub file SHA: a stale save returns **409** rather than replacing another editor's work.

## Required setup by the repository owner

1. **Create a separate private GitHub repository for DM records**, for example `grahamnick75-sketch/a-requiem-for-life-dm-data`. Do not write secrets or DM-only NPC information to the existing public GitHub Pages repository. Grant each DM **Write** permission to the private data repository. Public players should not be collaborators.
2. In GitHub developer settings, register a **GitHub OAuth App**. Homepage URL: `https://grahamnick75-sketch.github.io/a-requiem-for-life/`; Authorization callback URL: `https://<your-worker>.workers.dev/auth/callback`. You will receive a Client ID and Client Secret. The worker requests `repo read:user` scopes; those scopes are broad because GitHub OAuth Apps do not offer per-repository fine-grained scopes. Only invite trusted editors and revoke access when needed.
3. Create a **Cloudflare Worker** using `worker/src/index.js` and a KV namespace named `SESSIONS`. Deploy to a Workers URL. Bind the KV namespace as `SESSIONS`. Set Worker environment variables:
   - `REPO` = the exact **private** repository, `owner/repo`.
   - `STATE_PATH` = `editor-state.json` (optional; defaults to `private-data/editor-state.json`).
   - `DASHBOARD_ORIGIN` = `https://grahamnick75-sketch.github.io` (origin, **no path or trailing slash**).
   - `DASHBOARD_URL` = `https://grahamnick75-sketch.github.io/a-requiem-for-life/` (full deployed project URL).
   - `EDITORS` = comma-separated approved GitHub **login names** (start with your own).
   - `GITHUB_CLIENT_ID` = the OAuth App's Client ID.
   - Add `GITHUB_CLIENT_SECRET` as a **Cloudflare Worker secret**, never checked into a repository.
4. Merge/deploy the dashboard feature branch only after the Worker and private repo are ready. Confirm `campaign-update-v8.js` is included by `index.html` on the deployed site.
5. In the dashboard, select **Configure / Sign in**, enter the Worker HTTPS origin, and approve GitHub access. After redirecting back, select **Load**. On the first run this reports that there is no shared state; choose **Save to GitHub** to initialize the private repository. Have an authorized second editor sign in, load, modify a test NPC, and save. Reload on the first editor to verify it appears.

## QA / acceptance checks

- Approved collaborator + allowed username: sign-in, load, and save all succeed.
- Another collaborator absent from `EDITORS`: sign-in denied.
- Approved username without repository Write access: sign-in denied.
- Save from editor A after editor B saved first: expected conflict; A must reload and manually reconcile local changes rather than silently overwrite B.
- No network / expired session: local browser saves still work and toolbar reports a sync error.
- Sign out: server-side session is invalidated. Current session token lives only in the tab's `sessionStorage`; GitHub OAuth token stays server-side in KV, never inside dashboard JavaScript.
- JSON export before the first remote load: preserves existing browser edits.
- Avoid using the dashboard's *player mode* as a security boundary; DM-only secrets belong in the private repository, and exposing them to the browser still requires restricting player access to the DM site.

## Known limitations before production use

- The current sync feature transmits **all editable collections** as one JSON snapshot, not record-level changes. That is safe against stale overwrites but requires manual conflict resolution. Deletion and migrations should be regression-tested before broader DM collaboration.
- Snapshot size limit is approximately 1 MB. Image uploading and resizing **are not implemented** here. Portrait files still use GitHub's existing `assets/portraits/*.webp` system.
- This is a **private DM dashboard** feature: do not share the editor session or the OAuth App client secret. Because GitHub Pages is public, importing private data into its JavaScript exposes it to anybody using that authenticated DM browser session, even if the player-mode UI hides it.
- This code has **not** undergone a live Cloudflare/GitHub OAuth end-to-end test. Do not merge until the setup and QA steps above pass.
