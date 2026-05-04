# sr_barbara.yaml

**Path:** sr_barbara.yaml
**Syntax:** yaml
**Generated:** 2026-05-03 21:07:47

```yaml
# =============================================================================
# Sr. Barbara's Class — project configuration
# =============================================================================
#
# Consumed by all pipeline scripts (pg_export, build_slingcode, etc.).
# Each script loads this file first — no script hardcodes paths or assumptions.
#
# Version lives in pyproject.toml, not here.
# Credentials live in .env, not here.
#
# =============================================================================

paths:
  sentences_yaml:      data/sentences.yaml
  sentences_schema:    data/sentences.schema.json
  standalone_template: templates/index.standalone.html
  build_output:        dist/sr_barbara.html

database:
  env_file: .env
  host:     localhost
  port:     5432

game:
  default_difficulty: medium

```
