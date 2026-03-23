# GitHub Repo Analyzer

## Overview

This project is a simple tool that analyzes GitHub repositories and provides a quick overview of their activity, complexity, and learning difficulty.

The idea behind this project is to help developers understand how active a repository is and whether it might be easy or difficult to explore or contribute to.

---

## What this tool does

- Accepts multiple GitHub repository URLs  
- Fetches repository data using the GitHub API  
- Calculates an activity score based on engagement  
- Estimates repository complexity using basic heuristics  
- Classifies repositories as Beginner, Intermediate, or Advanced  
- Displays results in a clean and readable interface  

---

## How it works

### Activity Score

The activity score is calculated using a combination of:
- Commits  
- Contributors  
- Stars  
- Forks  

These values are normalized across repositories so that large projects don’t dominate unfairly.

---

### Complexity Estimation

Complexity is estimated based on:
- Number of programming languages  
- Number of contributors  
- A simple dependency-related heuristic  

This is not a perfect measure, but it gives a reasonable approximation.

---

### Difficulty Classification

Based on the complexity score, repositories are categorized as:

- **Beginner** → easy to understand  
- **Intermediate** → moderate complexity  
- **Advanced** → complex or large-scale projects  

---

## Example Analysis

The following results were generated using the tool and may vary slightly depending on repository updates.

### facebook/react
- Activity Score: 1.00  
- Complexity Score: 4.0  
- Difficulty: Advanced  

### vercel/next.js
- Activity Score: 0.87  
- Complexity Score: 7.5  
- Difficulty: Advanced  

### axios/axios
- Activity Score: 0.81  
- Complexity Score: 3.0  
- Difficulty: Advanced  

### expressjs/express
- Activity Score: 0.80  
- Complexity Score: 1.5  
- Difficulty: Intermediate  

### sindresorhus/is
- Activity Score: 0.55  
- Complexity Score: 1.5  
- Difficulty: Intermediate  

---

## Live Demo

You can try the project here:

👉 https://github-repo-analyzer-n80v.onrender.com/

---

## How to run locally

Clone the repository and install dependencies:

```bash
npm install
