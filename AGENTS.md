# AI Agent Instructions for Pathfinders

> **Note:** This is the primary agent instructions file. The following files are symlinks to this file:
> - `CLAUDE.md` - Claude Code / Claude AI
> - `CODEX.md` - OpenAI Codex
> - `GEMINI.md` - Google Gemini
> - `OPENCODE.md` - OpenCode
> - `.github/copilot-instructions.md` - GitHub Copilot
> - `CURSOR.md` - Cursor AI
> - `WINDSURF.md` - Windsurf/Codeium
> - `AIDER.md` - Aider

## Project Overview

This is a GitHub Pages website containing reports and documentation for the Pathfinders project.

## Core Rules

### 1. Commit and Push All Changes

**All changes must be committed and pushed to GitHub.**

- Make atomic commits with clear, descriptive messages
- Use conventional commit format when possible (e.g., `feat:`, `fix:`, `docs:`)
- Never leave uncommitted changes
- **Always push to GitHub immediately after committing**
- Run `git push origin main` after every commit

### 2. Report Creation

**Each new report must have its own HTML file.**

When creating a new report:

1. Create a new HTML file in the `reports/` directory
2. Use the naming convention: `reports/<slug>.html` (e.g., `reports/quarterly-analysis.html`)
3. Add a link to the new report in `index.html` within the `.reports-list` section
4. Follow this format for the index entry:
   ```html
   <li>
       <a href="reports/<filename>.html">Report Title</a>
       <span class="report-date">Month Day, Year</span>
   </li>
   ```
5. Remove or hide the empty state if this is the first report

### 3. Testing Requirements

**All changes must have corresponding tests.**

- Every new feature, report, or bug fix must include corresponding tests
- Every modification to existing code must update or add tests
- Place tests in the `tests/` directory
- Test files should mirror the structure they're testing (e.g., `reports/attendance-sheets.html` → `tests/attendance-sheets.test.js`)
- Run all tests before committing: `npm test`
- All tests must pass before committing
- Tests should verify:
  - HTML validity and structure
  - Links are not broken
  - Required elements are present
  - JavaScript functionality works correctly
  - Accessibility standards are met
  - CSS classes and styles are defined
  - Print styles are properly configured

## File Structure

```
Pathfinders/
├── index.html              # Main page with report listing
├── reports/                # Individual report HTML files
│   └── *.html
├── tests/                  # Test files
│   └── *.test.js
├── AGENTS.md               # This file (primary)
├── CLAUDE.md               # Symlink → AGENTS.md
├── CODEX.md                # Symlink → AGENTS.md
├── GEMINI.md               # Symlink → AGENTS.md
├── OPENCODE.md             # Symlink → AGENTS.md
├── CURSOR.md               # Symlink → AGENTS.md
├── WINDSURF.md             # Symlink → AGENTS.md
├── AIDER.md                # Symlink → AGENTS.md
└── .github/
    └── copilot-instructions.md  # Symlink → ../AGENTS.md
```

## Report Template

Use this template when creating new reports:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Report Title - Pathfinders</title>
    <link rel="stylesheet" href="../styles/report.css">
</head>
<body>
    <nav>
        <a href="../index.html">← Back to Reports</a>
    </nav>
    <article>
        <header>
            <h1>Report Title</h1>
            <time datetime="YYYY-MM-DD">Month Day, Year</time>
        </header>
        <main>
            <!-- Report content here -->
        </main>
    </article>
</body>
</html>
```

## Workflow Summary

1. **Create** the report HTML file in `reports/`
2. **Update** `index.html` to include the new report link
3. **Write** tests for the new report
4. **Run** tests to verify everything works
5. **Commit** all changes with a descriptive message
6. **Push** to the repository

## Questions?

If instructions are unclear, prioritize:
1. Committing and pushing all changes to GitHub
2. Creating separate HTML files for reports
3. Ensuring tests exist for new functionality
