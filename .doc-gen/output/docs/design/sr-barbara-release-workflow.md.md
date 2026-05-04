# sr-barbara-release-workflow.md

**Path:** docs/design/sr-barbara-release-workflow.md
**Syntax:** markdown
**Generated:** 2026-05-03 21:07:47

```markdown
# Sr. Barbara's Class — Changeset: GitHub Actions Release Workflow
**Date:** 2026-05-03
**Affects:** `.github/workflows/release.yml` (new file)
**Reason:** Automate the build and GitHub Release process. A version bump
in `pyproject.toml` triggers the workflow, which builds `sr_barbara.html`
and attaches it as a release asset — no manual `srb-build` run needed.

---

## File: `.github/workflows/release.yml` (new file)

See attached `release.yml`.

Place at: `.github/workflows/release.yml`
(Create `.github/workflows/` directories if they don't exist.)

---

## How it works

**Trigger:** Push to `main` that touches `pyproject.toml`. Any other
push (sentence data, CSS, JS, docs) does not trigger a release.

**The version bump is the release signal.** When you're ready to cut
a release:
1. Increment `version` in `pyproject.toml`
2. Commit and push to `main`
3. The workflow runs automatically

**What the runner does:**
1. Checks out the repo
2. Installs Python 3.11 and the `sr_barbara_scripts` package via `pip install -e .`
3. Runs `srb-build` — produces `dist/sr_barbara.html`
4. Reads the version string from `pyproject.toml` using `tomllib` (stdlib, Python 3.11+)
5. Creates a GitHub Release tagged `v{version}` with `sr_barbara.html` as the asset

**Permissions:** The workflow needs `contents: write` to create releases
and upload assets. This is set explicitly in the workflow file.

---

## Notes

**`tomllib` is stdlib in Python 3.11+** — no extra dependency needed to
read the version from `pyproject.toml`.

**`softprops/action-gh-release@v2`** is the standard community action
for creating GitHub Releases. It handles tag creation, release creation,
and asset upload in one step.

**`fail_on_unmatched_files: true`** — the workflow fails loudly if
`dist/sr_barbara.html` wasn't produced. Prevents silent releases with
no asset attached.

**`psycopg2-binary` installs but is unused in CI** — `srb-export` needs
it but `srb-build` does not. The binary wheel installs cleanly on the
Ubuntu runner; this is harmless.

---

## First run

After placing the file and pushing, the workflow will appear under the
Actions tab in the GitHub repo. It will not run until the next push that
touches `pyproject.toml`.

To trigger the first release immediately, bump the version:

```toml
version = "0.1.1"
```

Commit with:
```
chore: bump version to 0.1.1 — trigger first automated release
```

Then check the Actions tab to watch it run.

---

## Suggested commit message

```
ci: add GitHub Actions release workflow
```

```
