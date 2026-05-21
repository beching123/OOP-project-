# 09 – Git Workflow & Team Collaboration

## Repository Setup
- Repository name: `madam-ecommerce`
- Host: GitHub (private)
- Branch protection: `main` branch protected, no direct pushes.

## Branch Model
- **`main`** – production‑ready (always deployable)
- **`develop`** – integration branch
- **Feature branches:** `feature/package-name` (e.g., `feature/model`, `feature/persistence`, `feature/service`, `feature/ui-views`)

## Team Member Instructions
1. Clone the repository.
2. `git checkout develop`
3. `git checkout -b feature/<your-package>`
4. Work **only** inside your assigned package folder.
5. Commit often with clear messages: “ProductRepo: add decrementStock with version check”.
6. Before pushing, run `mvn test` – must pass.
7. Push your branch: `git push -u origin feature/<your-package>`.
8. Open a Pull Request to `develop`. Assign the lead (you) as reviewer.

## Lead’s Integration Process
1. Review the PR: check that all protocols are followed (signatures, exception handling, no forbidden imports).
2. Merge into `develop` locally, run full test suite.
3. If tests pass and manual smoke test works, merge the PR on GitHub.
4. After all feature branches are merged, run a final round of testing, then merge `develop` into `main`.

## Conflict Resolution
- If two developers touch the same file, the lead resolves by selecting the correct version and retesting.

## Commit Message Convention
Use imperative mood: “Add UserRepo”, “Fix version check in ProductRepo”, “Refactor TradeService to use executeInTransaction”.
