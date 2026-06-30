# 04 - GitHub Pages Deployment

## Purpose

Use this after the website builds locally. This is the final implementation step for the demo: add CI/CD, show the deployment path, and then show the finished result.

This prompt should be smaller and more operational than the website build prompt.

## Copy-paste prompt

```text
Please add GitHub Pages deployment for the completed Astro website.

Before making changes, inspect:

- `AGENTS.md`
- `docs/architecture.md`
- `docs/adr/`
- current `package.json`
- current Astro config
- current build output expectations

Requirements:

- Add the minimal GitHub Actions workflow needed to build and deploy the static Astro site to GitHub Pages.
- Trigger deployment only when relevant changes are pushed to the `main` branch. Do not deploy from every branch.
- Configure the Astro base/site settings correctly for repository-based GitHub Pages deployment if needed.
- Deploy only the generated static build output, most likely the Astro `dist/` directory. Do not upload the full repository as the Pages artifact.
- Keep permissions and secrets minimal.
- Do not introduce deployment services beyond GitHub Pages.
- Do not publish `3 - prepared prompts/`.
- Do not publish source-only folders such as `1 - content/`, `2 - styling/`, `docs/`, or `3 - prepared prompts/` except insofar as their processed assets/content are included in the generated build output.
- Preserve the existing source-boundary decisions.
- Document any required GitHub repository settings after adding the workflow.

Verification:

- Run the local production build.
- If possible, run any available typecheck or tests.
- Inspect the generated workflow for correct `main` branch trigger, permissions, artifact upload, and deploy step.
- Confirm that the Pages artifact points at the static build output directory rather than the repository root.
- Summarize what a maintainer needs to enable in GitHub before deployment works.

End with:

- files changed
- verification results
- expected GitHub Pages behavior
- manual repository settings still required
- URL of the publicly created Github Page
```

## Review checkpoint

Discuss:

- Why CI/CD is part of the full workflow.
- Which config decisions are specific to GitHub Pages.
- What the agent can automate and what still requires repository-owner action.
- Why deployment is a good final prepared checkpoint rather than the riskiest live moment.

## Good outcome

The repo contains a clear GitHub Pages workflow, local build passes, and the deployment steps are explainable to the audience.
