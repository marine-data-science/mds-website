# 07 - GitHub Pages Deployment

## Purpose

Use this once the site builds locally. The goal is to add deployment infrastructure without letting CI/CD consume the whole demo.

This is likely better as a prepared checkpoint than a risky live endpoint.

## Copy-paste prompt

```text
Please add GitHub Pages deployment for this static site.

Requirements:
- Add the minimal GitHub Actions workflow needed to build and deploy the site to GitHub Pages.
- Configure the static-site base path correctly for a repository deployment if needed.
- Keep secrets and permissions minimal.
- Do not require external services beyond GitHub Pages.
- Document any required repository settings after the workflow is added.

Verification:
- Run the local production build.
- If possible, validate the workflow syntax or at least explain the expected trigger and output.
- Summarize exactly what a maintainer needs to enable in GitHub before deployment works.
```

## Review checkpoint

Discuss:

- Why deployment is part of the workflow, but maybe not the best live-demo risk.
- What the agent changed in config.
- Which parts would still need repository-owner action.

## Good outcome

The repo contains a clear Pages workflow and local build still passes.
