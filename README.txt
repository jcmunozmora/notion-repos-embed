# Notion Repos Embed (Netlify)

This project serves a single HTML and a Netlify Function that fetches your GitHub repositories.
It is designed to be embedded inside a Notion page (works around iframe/CORS limits).

## Deploy (GitHub → Netlify)

1. Create a new GitHub repo and upload these files.
2. In Netlify: **Add new site → Import from Git** and connect the repo.
3. Netlify will auto-detect:
   - Publish directory: `.`
   - Functions directory: `netlify/functions`
4. (Optional but recommended) In **Site settings → Environment variables**, add:
   - `GITHUB_TOKEN` with a classic token or fine-grained token (read-only public repos).
5. Deploy the site.
6. Open the site URL. You should see your repositories.
7. In Notion, add an **/Embed** block and paste the site URL (or `/index.html`).

Headers in `netlify.toml` allow the site to be embedded by Notion (`frame-ancestors`).

