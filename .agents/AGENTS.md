# Git Workflow Policy for LifeOS

1. Never leave completed work uncommitted.
2. At the end of every successfully completed development phase:
   - Review all modified files.
   - Verify the application builds successfully.
   - Ensure there are no TypeScript, Python, or build errors.
   - Ensure no secrets, .env files, cache files, or unnecessary artifacts are included.
   - Run the appropriate verification commands.
   - Create a Git tag whenever a major milestone is completed (e.g., `v1.0.0-frontend`, `v1.1.0-auth`, `v2.0.0-beta`, etc.).
3. If everything passes:
   - Stage only the relevant files.
   - Create a clean, professional Git commit.
   - Push the commit and tags to the GitHub repository.
4. Use Conventional Commit messages (e.g., `feat: initialize Django backend architecture`).
5. Never create huge commits containing unrelated changes. Each commit should represent one logical feature or completed milestone.
6. Before every push verify: builds successfully, tests pass, clean status, no conflicts, no secrets, docs updated.
7. After every successful push provide a report including:
   - Commit hash
   - Commit message
   - Files changed
   - GitHub branch
   - Push status
   - Short summary of what was completed
8. If a phase is only partially complete, do NOT commit it unless explicitly asked.
9. Never rewrite Git history, force push, or squash commits unless specifically requested.
10. Follow this workflow for every future phase until the project is complete.
