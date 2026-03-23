function normalize(value, max) {
  if (!max) return 0;
  return value / max;
}

function calculateActivityScore(data, maxValues) {
  const commits = normalize(data.commits, maxValues.commits);
  const stars = normalize(data.stars, maxValues.stars);
  const forks = normalize(data.forks, maxValues.forks);
  const contributors = normalize(data.contributors, maxValues.contributors);

  // simple weighted score based on activity signals
  const score =
    0.4 * commits +
    0.3 * contributors +
    0.2 * stars +
    0.1 * forks;

  return Number(score.toFixed(3));
}

function estimateComplexity(data) {
  const languageCount = data.languages?.length || 0;

  // basic heuristic: more languages + contributors = more complexity
  let complexity = languageCount * 0.5;

  if (data.contributors > 5) {
    complexity += 0.5;
  }

  if (data.hasDependencies) {
    complexity += 0.5;
  }

  return Number(complexity.toFixed(2));
}

function classifyDifficulty(complexity) {
  if (complexity < 1.5) return "Beginner";
  if (complexity < 3) return "Intermediate";
  return "Advanced";
}

module.exports = {
  calculateActivityScore,
  estimateComplexity,
  classifyDifficulty,
};
