# Releasing

This repo uses [Changesets](https://github.com/changesets/changesets) for versions, changelogs, and npm publishes.

You do not bump versions by hand. You describe the change; CI versions and publishes.

## How a release works

1. In a PR, run `pnpm changeset` and commit the generated file in `.changeset/`.
2. Merge the PR to `main`.
3. GitHub Actions opens a **Version packages** PR. That PR bumps `package.json`, updates `CHANGELOG.md`, and removes the consumed changeset files.
4. Merge the Version PR.
5. CI publishes to npm and creates a GitHub Release.

If there is no changeset on `main`, nothing is published.

## Choosing major / minor / patch

When you run `pnpm changeset`, pick one bump per affected package:

| Bump | When |
| --- | --- |
| **patch** | Bug fix, docs in the published package, no API change |
| **minor** | New backward-compatible API |
| **major** | Breaking change |

Until `1.0.0`, a **minor** bump is still the usual way to add features. Use **major** only when you intend to break callers.

## Commands

```bash
# After you change a publishable package
pnpm changeset

# Preview version + changelog locally (optional)
pnpm version-packages

# Do not publish from your laptop. CI does that.
```

You can add several changeset files in one PR. They are combined on the Version PR.

## What gets published

| Package | npm name | Publish? |
| --- | --- | --- |
| `packages/core` | `db-sdk` | Yes |
| Future `packages/postgres` | `@db-sdk/postgres` | Yes, when added |
| `apps/*`, `@db-sdk/ui`, `tooling/*` | — | No (`private: true`) |

Each package has its own version. A Postgres-only fix does not have to bump the core package.

## First-time npm setup

The GitHub repo is `becausify/db-sdk`. The npm org is `db-sdk`.

1. On [npmjs.com](https://www.npmjs.com), confirm you can publish `db-sdk` (unscoped) and `@db-sdk/*` (org).
2. For **Trusted publishing** (preferred, no long-lived token):
   - Package settings → **Trusted Publisher** → GitHub Actions
   - Repository: `becausify/db-sdk`
   - Workflow: `release.yml`
   - Repeat for each package you publish (`db-sdk`, later `@db-sdk/postgres`, …)
3. Fallback: create a granular npm token with publish access and add it as the repo secret `NPM_TOKEN`.
4. In the GitHub repo, allow Actions to create pull requests (Settings → Actions → General).

The first real publish happens after you merge a changeset and then merge the Version PR. Do not publish `0.0.0` until the SDK has a usable API.

## Adding a provider package later

1. Create `packages/<name>` with `"name": "@db-sdk/<name>"`, `"publishConfig": { "access": "public" }`, and a `build` script that emits `dist`.
2. Add a changeset that mentions the new package.
3. Add that package as a Trusted Publisher on npm, same workflow file.
