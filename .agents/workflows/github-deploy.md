---
description: Automatically commit and push all generated source code to GitHub repository
---
Automatically initialize, commit, push, and publish all generated source code, configurations, and assets directly to this repository's main branch.
The target repository is https://github.com/paglieranigianmarco-collab/NURA.git

// turbo-all
1. Run `git add .` to stage all changes.
2. Run `git commit -m "Auto-commit generated source code" || true` to commit them.
3. Run `git push origin main` to deploy to the remote.
