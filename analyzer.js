function calculateActivityScore(repo, commits) {
  const stars = repo.stargazers_count || 0;
  const forks = repo.forks_count || 0;
  const issues = repo.open_issues_count || 0;
  const commitCount = commits || 0;

  const score = (commitCount * 3) + (stars * 2) + (forks * 2) + (issues * 1);
  return Math.min(score, 1000);
}

function estimateComplexity(repo, languages) {
  const langCount = Object.keys(languages || {}).length;
  const hasPackageJson = repo.size > 500;
  const sizeScore = Math.min(repo.size / 100, 50);

  return Math.round(sizeScore + (langCount * 10));
}

function classifyDifficulty(activityScore, complexityScore) {
  const total = activityScore + complexityScore;
  if (total < 100) return 'Beginner';
  if (total < 400) return 'Intermediate';
  return 'Advanced';
}

module.exports = { calculateActivityScore, estimateComplexity, classifyDifficulty };