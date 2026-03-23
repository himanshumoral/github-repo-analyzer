const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const {
  calculateActivityScore,
  estimateComplexity,
  classifyDifficulty
} = require('./analyzer');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

if (!GITHUB_TOKEN) {
  console.warn("⚠️ GitHub token missing in .env");
}

const headers = {
  Authorization: `token ${GITHUB_TOKEN}`,
  Accept: 'application/vnd.github.v3+json'
};

// small helper to parse repo URL safely
function parseRepo(url) {
  try {
    const clean = url.replace('.git', '').replace(/\/$/, '');
    const parts = clean.split('/');
    return {
      owner: parts[3],
      repo: parts[4]
    };
  } catch {
    return {};
  }
}

// optional delay to avoid rate limit
function sleep(ms) {
  return new Promise(res => setTimeout(res, ms));
}

app.post('/analyze', async (req, res) => {
  const { urls } = req.body;

  if (!urls || urls.length === 0) {
    return res.status(400).json({ error: 'No URLs provided' });
  }

  const results = [];
  const allData = [];

  // STEP 1: fetch raw data
  for (const url of urls) {
    try {
      const { owner, repo } = parseRepo(url);

      if (!owner || !repo) {
        results.push({ url, error: 'Invalid GitHub URL' });
        continue;
      }

      const base = `https://api.github.com/repos/${owner}/${repo}`;

      const [repoRes, commitsRes, languagesRes, contributorsRes] =
        await Promise.all([
          axios.get(base, { headers }),
          axios.get(`${base}/commits?per_page=100`, { headers }).catch(() => ({ data: [] })),
          axios.get(`${base}/languages`, { headers }).catch(() => ({ data: {} })),
          axios.get(`${base}/contributors?per_page=100`, { headers }).catch(() => ({ data: [] }))
        ]);

      const repoData = repoRes.data;

      const data = {
        name: repoData.full_name,
        description: repoData.description || 'No description',
        stars: repoData.stargazers_count,
        forks: repoData.forks_count,
        openIssues: repoData.open_issues_count,
        contributors: contributorsRes.data.length,
        commits: commitsRes.data.length,
        languages: Object.keys(languagesRes.data),
        hasDependencies: repoData.size > 500, // simple heuristic
        url: repoData.html_url
      };

      allData.push({ raw: repoData, metrics: data });

      // small delay to stay safe from rate limit
      await sleep(300);

    } catch (err) {
      results.push({ url, error: err.message || 'Failed to fetch repo data' });
    }
  }

  // STEP 2: normalization (important)
  const maxValues = {
    commits: Math.max(...allData.map(d => d.metrics.commits), 1),
    stars: Math.max(...allData.map(d => d.metrics.stars), 1),
    forks: Math.max(...allData.map(d => d.metrics.forks), 1),
    contributors: Math.max(...allData.map(d => d.metrics.contributors), 1)
  };

  // STEP 3: scoring
  for (const item of allData) {
    const data = item.metrics;

    const activityScore = calculateActivityScore(data, maxValues);
    const complexityScore = estimateComplexity(data);
    const difficulty = classifyDifficulty(complexityScore);

    results.push({
      ...data,
      activityScore,
      complexityScore,
      difficulty
    });
  }

  res.json({ results });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
