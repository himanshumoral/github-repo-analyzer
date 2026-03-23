const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const { calculateActivityScore, estimateComplexity, classifyDifficulty } = require('./analyzer');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

const headers = {
  Authorization: `token ${GITHUB_TOKEN}`,
  Accept: 'application/vnd.github.v3+json'
};

app.post('/analyze', async (req, res) => {
  const { urls } = req.body;

  if (!urls || urls.length === 0) {
    return res.status(400).json({ error: 'No URLs provided' });
  }

  const results = [];

  for (const url of urls) {
    try {
      const parts = url.replace('https://github.com/', '').split('/');
      const owner = parts[0];
      const repo = parts[1];

      if (!owner || !repo) {
        results.push({ url, error: 'Invalid GitHub URL' });
        continue;
      }

      const [repoRes, commitsRes, languagesRes, contributorsRes] = await Promise.all([
        axios.get(`https://api.github.com/repos/${owner}/${repo}`, { headers }),
        axios.get(`https://api.github.com/repos/${owner}/${repo}/commits?per_page=100`, { headers }).catch(() => ({ data: [] })),
        axios.get(`https://api.github.com/repos/${owner}/${repo}/languages`, { headers }).catch(() => ({ data: {} })),
        axios.get(`https://api.github.com/repos/${owner}/${repo}/contributors?per_page=100`, { headers }).catch(() => ({ data: [] }))
      ]);

      const repoData = repoRes.data;
      const commitCount = commitsRes.data.length;
      const languages = languagesRes.data;
      const contributorCount = contributorsRes.data.length;

      const activityScore = calculateActivityScore(repoData, commitCount);
      const complexityScore = estimateComplexity(repoData, languages);
      const difficulty = classifyDifficulty(activityScore, complexityScore);

      results.push({
        name: repoData.full_name,
        description: repoData.description || 'No description',
        stars: repoData.stargazers_count,
        forks: repoData.forks_count,
        openIssues: repoData.open_issues_count,
        contributors: contributorCount,
        commits: commitCount,
        languages: Object.keys(languages),
        activityScore,
        complexityScore,
        difficulty,
        url: repoData.html_url
      });

    } catch (err) {
      results.push({ url, error: err.message || 'Failed to fetch repo data' });
    }
  }

  res.json({ results });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});