# GitHub Repo Analyzer

## Overview
This project analyzes multiple GitHub repositories and provides insights into their activity, complexity, and learning difficulty.

It is designed to help developers quickly understand how active a repository is and how difficult it might be to contribute or learn from it.

---

## Features
- Analyze multiple GitHub repositories at once  
- Fetch real-time data using GitHub API  
- Calculate activity score using a custom formula  
- Estimate repository complexity  
- Classify repositories as Beginner, Intermediate, or Advanced  
- Simple UI for input and result visualization  

---

## How It Works

### 1. Data Collection
The tool fetches the following data from GitHub:
- Stars
- Forks
- Contributors
- Commits
- Languages

---

### 2. Activity Score
Activity score is calculated using a weighted combination of:
- Commits (40%)
- Contributors (30%)
- Stars (20%)
- Forks (10%)

All values are normalized across repositories to ensure fair comparison.

---

### 3. Complexity Estimation
Complexity is estimated based on:
- Number of languages used
- Contributor count
- Basic dependency heuristic

This is a simplified approximation and not an exact measurement.

---

### 4. Difficulty Classification
Repositories are classified into:
- Beginner  
- Intermediate  
- Advanced  

Based on the computed complexity score.

---

## Example Analysis

These results are based on the current scoring logic and may vary depending on repository data.

### 1. facebook/react
- Activity Score: 1.00  
- Complexity Score: 4.0  
- Difficulty: Advanced  

### 2. vercel/next.js
- Activity Score: 0.87  
- Complexity Score: 7.5  
- Difficulty: Advanced  

### 3. axios/axios
- Activity Score: 0.81  
- Complexity Score: 3.0  
- Difficulty: Advanced  

### 4. expressjs/express
- Activity Score: 0.80  
- Complexity Score: 1.5  
- Difficulty: Intermediate  

### 5. sindresorhus/is
- Activity Score: 0.55  
- Complexity Score: 1.5  
- Difficulty: Intermediate  

---

## Assumptions
- Commits represent repository activity  
- More contributors generally indicate higher complexity  
- Language diversity contributes to complexity  

---

## Limitations
- Commit count is limited (full pagination not implemented)  
- Does not analyze code quality or architecture  
- Dependency detection is approximate  

---

## How to Run

```bash
npm install
node index.js
