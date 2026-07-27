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

# Mandatory QA Process

Implementation is NOT considered complete after the code compiles. Every sprint MUST go through the following QA cycle:
1. Run `npm run typecheck` and `npm run lint`. Fix every issue.
2. Launch the application on the Android emulator and verify it starts correctly.
3. Perform a complete Product QA: review visual hierarchy, typography, spacing, alignment, colors, corner radius, shadows, touch targets, accessibility, navigation, empty states, loading/error states, micro interactions, and overall emotional experience.
4. Compare the UI against the Product Vision. Simplify, remove, or improve anything that doesn't align.
5. Perform an Implementation Review listing improvements, intentional keeps, compromises, tech debt, and future recommendations.
6. Capture screenshots (Today, Planner, Journal, Quick Add, Me, Navigation, Dark Mode).
7. Generate a Product QA Report including: Overall Score, Navigation, Design Consistency, Accessibility, Performance, Motion, Visual Hierarchy, Remaining Issues, Future Suggestions, and User Review Required.
8. Perform a self-critique identifying 3 areas for improvement, 3 strengths, and 1 uncertain design decision.
9. A sprint is ONLY complete (Definition of Done) if ALL of these criteria are met.

# LifeOS Product Development Workflow

For every sprint, act as the complete LifeOS product team (Designer, Researcher, Engineer, QA, Critic, Product Owner). Follow this exact 10-step process:

1. **Understand & Question**: Understand the Product Brief. Question unclear decisions. Identify risks.
2. **Plan**: Plan implementation. Choose the simplest architecture.
3. **Implement**: Follow the Design System. Never violate the Product Vision. Optimize for the user, not just for implementation.
4. **Technical QA**: Run TypeScript, Lint, Navigation, Performance, Animations, Accessibility checks.
5. **Product QA**: Review visual hierarchy, spacing, colors, typography, interaction design, and emotional experience.
6. **Critique**: Critique your own work (Strengths, Weaknesses, Tradeoffs, Unknowns).
7. **Self-Improve**: Improve your own implementation before seeking feedback if obvious improvements exist.
8. **Capture**: Capture screenshots comparing Before/After and explain major visual improvements.
9. **Report**: Generate Sprint Closure Report (Overall, Design, Accessibility, Performance, Consistency Scores, Remaining Issues, Tech Debt, Future Recs, Confidence Level).
10. **Wait**: Wait for Product Owner approval. Never begin the next sprint automatically.
# Environment Awareness

Always verify your available capabilities before performing QA.
Never claim to have performed actions that are unavailable in the current environment (e.g., emulator interactions, ADB, Maestro).

Separate QA findings into:
- **Code Verified**: (e.g., TypeScript compilation, Jest tests, ESLint)
- **Logically Inferred**: (e.g., Layout margins, visual hierarchy derived from Tailwind classes)
- **Requires Human Visual Validation**: (e.g., Pixel-perfect alignment, animation smoothness, actual touch targets, dark mode contrast)

Be explicit about the confidence level of every conclusion. Never present assumptions as verified observations.
