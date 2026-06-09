---
description: Finish and ship — build, commit all changes, and push to GitHub main
---

When /f is invoked, run this sequence:

1. `git status` — see what has changed
2. `git diff HEAD` — understand the changes
3. `npm run build` — verify build passes (fix any errors before continuing)
4. Stage specific changed files with `git add <file> <file> ...` — never use `git add -A` or `git add .`
5. Write ONE short commit message line (no body, no co-author email, no sensitive info)
6. `git commit -m "short message here"`
7. `git push origin main`
8. Report the commit hash and which files were pushed

Commit message rules (always enforce):
- One line only, under 72 characters
- No `Co-Authored-By:` line
- No Anthropic email
- No sensitive info (tokens, keys, credentials)
- Start with a conventional prefix: feat:, fix:, chore:, docs:, style:
