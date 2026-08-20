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
| `packages/postgres` | `@db-sdk/postgres` | Yes |
| `packages/supabase` | `@db-sdk/supabase` | Yes |
| `apps/*`, `@db-sdk/ui`, `tooling/*` | — | No (`private: true`) |

Each package has its own version. A Postgres-only fix does not have to bump the core package.

The npm **org** is [`db-sdk`](https://www.npmjs.com/org/db-sdk) (scoped `@db-sdk/*`). The unscoped name `db-sdk` is separate — claim/publish it under the same npm user/org admin account.

## First-time npm setup

The GitHub repo is `becausify/db-sdk`. The npm org is [`db-sdk`](https://www.npmjs.com/org/db-sdk) (for `@db-sdk/*`).

1. Confirm your npm user can publish under the `db-sdk` org, and that the unscoped name `db-sdk` is available (or owned by you).
2. Create a **granular npm access token** with read/write for the org (and permission to publish `db-sdk` if unscoped). Add it as the GitHub repo secret `NPM_TOKEN`.
3. After the first publish (or once empty package placeholders exist), prefer **Trusted publishing**:
   - Each package on npm → **Trusted Publisher** → GitHub Actions
   - Repository: `becausify/db-sdk`
   - Workflow: `release.yml`
   - Packages: `db-sdk`, `@db-sdk/postgres`, `@db-sdk/supabase`
4. In the GitHub repo, allow Actions to create pull requests (Settings → Actions → General).

### First release checklist

1. Land the SDK work on `main` (CI green: lint, types, test, build).
2. Ensure a changeset exists under `.changeset/` (e.g. initial minor for all three packages).
3. Merge to `main` → wait for the **Version packages** PR → review (expect `0.0.0` → `0.1.0`) → merge it.
4. Release workflow publishes to npm. Install in Becausify:

```bash
pnpm add db-sdk @db-sdk/postgres @db-sdk/supabase
```

Until that lands, test Becausify with a local `link:` / workspace path to this repo.

## Adding a provider package later

1. Create `packages/<name>` with `"name": "@db-sdk/<name>"`, `"publishConfig": { "access": "public" }`, and a `build` script that emits `dist`.
2. Add a changeset that mentions the new package.
3. Add that package as a Trusted Publisher on npm, same workflow file.
