# Questeria

## Commit messages

Commits are linted with commitlint (`@commitlint/config-conventional`), enforced via a lefthook `commit-msg` hook. Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<optional scope>): <description>

<optional body>

<optional footer>
```

`type` is one of:

| Type | Use for |
|---|---|
| `feat` | A new feature or capability for the user (in this repo, this does **not** trigger a version bump) |
| `fix` | A bug fix |
| `docs` | Documentation only (README, comments, etc.) — no code behavior change |
| `style` | Formatting/whitespace/semicolons — no code meaning change (not CSS/UI styling) |
| `refactor` | Code change that neither fixes a bug nor adds a feature (renaming, restructuring) |
| `perf` | A change that improves performance |
| `test` | Adding or correcting tests |
| `build` | Changes to the build system or dependencies (e.g. yarn, Gradle, Xcode project) |
| `ci` | Changes to CI config/scripts (e.g. GitHub Actions) |
| `chore` | Other maintenance that doesn't fit above (tooling config, repo housekeeping) |
| `revert` | Reverts a previous commit |

- `description` — lowercase, imperative mood ("add" not "added"/"adds"), no trailing period
- Breaking changes — either add `!` after the type/scope (e.g. `feat!:`) or include a `BREAKING CHANGE:` footer

Examples:

```
feat(auth): add biometric login
fix: prevent crash on empty quest list
docs: document commit message rules
refactor(quests): extract quest sorting into a helper
chore: update tsconfig and eslint config
```

## Working with UI libraries

Shared UI code (e.g. `react-native-svg-pixel-ui`) lives in its own repo, published independently to npm, but is used here as a local checkout under `libraries/` so it can be developed and tested without a publish/install round trip.

`libraries/` is git-ignored in this repo — each library there is its own independent git repository with its own remote. The app links to it via a `link:` dependency in `package.json`, e.g.:

```json
"react-native-svg-pixel-ui": "link:./libraries/react-native-svg-pixel-ui"
```

### First-time setup

Running `yarn` here triggers a `preinstall` step (`scripts/setupLibraries.js`) that clones any missing libraries into `libraries/` automatically. You don't need to do this manually — just run:

```
yarn
```

### Developing a library

For fast iteration on the library itself (live reload, no build step), work inside its own repo using its scaffolded example app:

```
cd libraries/react-native-svg-pixel-ui
yarn example ios   # or android
```

### Testing library changes in this app

This app resolves the library's built output (`lib/`), not its raw source, so after editing library code, rebuild it:

```
cd libraries/react-native-svg-pixel-ui
yarn prepare
```

Since `node_modules/react-native-svg-pixel-ui` is a symlink to the local checkout, the app's Metro picks up the rebuilt output on the next reload — no reinstall needed here.

### Publishing

Commit and push library changes to its own remote from inside `libraries/<name>`. Releases (version bump, npm publish, GitHub release) are handled there via `release-it`, independent of this repo.

### Adding a new library

1. Add an entry to the `libraries` list in `scripts/setupLibraries.js` (name + repo URL).
2. Run `yarn add <package-name>@link:./libraries/<package-name>` from the app root.
