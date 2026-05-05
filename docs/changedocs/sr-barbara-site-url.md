# Sr. Barbara's Class — Site URL Config
**Changeset doc**
**Feature:** Move hardcoded update checker URL into `sr_barbara.yaml`

---

## Overview

The update checker in `ui.js` had `https://carolynboyle.github.io/sr-barbara/`
hardcoded. This moves it to `sr_barbara.yaml` as `site.url`, exposes it via
`ProjectConfig`, injects it as a `SITE_URL` JS constant in `ConfigRenderer`,
and updates `ui.js` to use the constant.

---

## File 1: `sr_barbara.yaml`

### BEFORE
```yaml
game:
  default_difficulty: medium
```

### AFTER
```yaml
game:
  default_difficulty: medium

site:
  url: https://carolynboyle.github.io/sr-barbara/
```

### Why
Project infrastructure config belongs in `sr_barbara.yaml`. If the site
moves (custom domain, etc.), one line changes here and the build picks it up.

---

## File 2: `scripts/src/sr_barbara_scripts/config.py`

### BEFORE
```python
    @property
    def game(self) -> dict:
        """Game defaults block from sr_barbara.yaml."""
        return self._config['game']
```

### AFTER
```python
    @property
    def game(self) -> dict:
        """Game defaults block from sr_barbara.yaml."""
        return self._config['game']

    @property
    def site(self) -> dict:
        """Site block from sr_barbara.yaml."""
        return self._config['site']
```

### Why
Follows the existing pattern — each top-level YAML block gets a
corresponding property on `ProjectConfig`.

---

## File 3: `scripts/src/sr_barbara_scripts/build_game.py`

### BEFORE (ConfigRenderer.render — after GITHUB_REPO line)
```python
            '// GitHub repo — used by the update checker',
            'const GITHUB_REPO = "carolynboyle/sr-barbara";',
            '',
```

### AFTER
```python
            '// GitHub repo — used by the update checker',
            'const GITHUB_REPO = "carolynboyle/sr-barbara";',
            '',
            '// Site URL — used by the update checker',
            f'const SITE_URL = "{self._cfg.site["url"]}";',
            '',
```

### Why
`SITE_URL` joins `VERSION` and `GITHUB_REPO` as build-time injected
constants. All three are consumed by `ui.js` at runtime.

---

## File 4: `static/js/ui.js`

### BEFORE
```javascript
            if (isNewerVersion(latest, current)) {
                document.getElementById('update-indicator').classList.remove('hidden');
                updateNotice.querySelector('a').href = data.html_url;
            }
```

### AFTER
```javascript
            if (isNewerVersion(latest, current)) {
                document.getElementById('update-indicator').classList.remove('hidden');
                updateNotice.querySelector('a').href = SITE_URL;
            }
```

### Why
`SITE_URL` is injected at build time by `ConfigRenderer`. Removing the
hardcoded URL means the destination is controlled by config, not code.

---

## Build and verify

```bash
srb-build
```

Open `dist/sr_barbara.html`, edit `VERSION` down one patch to trigger
the update checker, reload, click the lightbulb — confirm the link
goes to `https://carolynboyle.github.io/sr-barbara/` not GitHub releases.

Restore version, bump to v0.1.5, commit, push.
