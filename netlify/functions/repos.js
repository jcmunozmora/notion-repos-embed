// netlify/functions/repos.js
// Fetch all public repositories for a user and return as JSON.
// Supports optional GITHUB_TOKEN env var to raise rate limits.
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const USER = 'jcmunozmora';

exports.handler = async function(event, context) {
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
        const text = await res.text();
        return {
          statusCode: res.status,
          headers: {
            'Access-Control-Allow-Origin': '*'
          },
          body: JSON.stringify({ error: 'GitHub API error', status: res.status, detail: text })
        };
      }
      const items = await res.json();
      all = all.concat(items);
      if (items.length < 100 || page > 9) break;
      page++;
    }

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
        // Cache for 15 minutes at the edge/CDN
        'Cache-Control': 'public, max-age=0, s-maxage=900'
      },
      body: JSON.stringify(all.map(r => ({
        id: r.id,
        name: r.name,
        html_url: r.html_url,
        description: r.description,
        language: r.language,
        license: r.license,
        archived: r.archived,
        stargazers_count: r.stargazers_count,
        updated_at: r.updated_at
      })))
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: {'Access-Control-Allow-Origin': '*'},
      body: JSON.stringify({ error: 'Server error', detail: String(err) })
    };
  }
};
