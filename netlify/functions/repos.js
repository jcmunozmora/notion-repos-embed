// netlify/functions/repos.js
// Uses global fetch (Node 18+) — no dependencies required.
const USER = process.env.GITHUB_USER || 'jcmunozmora';

exports.handler = async function() {
  try {
    const headers = {
      'Accept': 'application/vnd.github+json',
      'User-Agent': 'jcmunozmora-notion-embed'
    };
    if (process.env.GITHUB_TOKEN) {
      headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    let page = 1, all = [];
    while (true) {
      const url = `https://api.github.com/users/${USER}/repos?per_page=100&sort=updated&page=${page}`;
      const res = await fetch(url, { headers });
      if (!res.ok) {
        const detail = await res.text();
        return {
          statusCode: res.status,
          headers: { 'Access-Control-Allow-Origin': '*' },
          body: JSON.stringify({ error: 'GitHub API error', status: res.status, detail })
        };
      }
      const items = await res.json();
      all = all.concat(items);
      if (items.length < 100 || page > 9) break;
      page++;
    }

    const payload = all.map(r => ({
      id: r.id,
      name: r.name,
      html_url: r.html_url,
      description: r.description,
      language: r.language,
      license: r.license,
      archived: r.archived,
      stargazers_count: r.stargazers_count,
      updated_at: r.updated_at
    }));

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=0, s-maxage=900'
      },
      body: JSON.stringify(payload)
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Server error', detail: String(err) })
    };
  }
};
