# Sr. Barbara's Class — Docker Configuration Changes

**Date:** 2026-04-27
**Affects:** repo root
**Reason:** Separate Adminer (developer tool) from the game stack, move
hardcoded credentials to environment variables, provide example env files
so `git clone` + `docker compose up` actually works for new users.

---

## File 1: `docker-compose.yaml` (modified)

### BEFORE

```yaml
services:
  db:
    image: docker.io/postgres:15
    ports:
      - "5432:5432"
    environment:
      POSTGRES_DB: sr_barbara
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: srbarbaradb
    volumes:
      - ./db/schema.sql:/docker-entrypoint-initdb.d/01-schema.sql
      - ./db/seed.sql:/docker-entrypoint-initdb.d/02-seed.sql
      - ./db/sentences_view.sql:/docker-entrypoint-initdb.d/03-sentences_view.sql
      - postgres_data:/var/lib/postgresql/data

  app:
    build: .
    ports:
      - "5000:5000"
    environment:
      DB_HOST: db
      DB_NAME: sr_barbara
      DB_USER: postgres
      DB_PASSWORD: srbarbaradb
    depends_on:
      - db

  adminer:
    image: adminer
    ports:
      - "8080:8080"
    depends_on:
      - db

volumes:
  postgres_data:
```

### AFTER

```yaml
# =============================================================================
# Sr. Barbara's Class — game stack
# =============================================================================
#
# Runs the Flask app and PostgreSQL database.
# Adminer is intentionally excluded — use docker-compose.dev.yml for that.
#
# First-time setup:
#   cp .env.example .env
#   edit .env and set a strong DB_PASSWORD
#   docker compose up --build
#
# =============================================================================

services:
  db:
    image: docker.io/postgres:15
    ports:
      - "5432:5432"
    environment:
      POSTGRES_DB: ${DB_NAME}
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - ./db/schema.sql:/docker-entrypoint-initdb.d/01-schema.sql
      - ./db/seed.sql:/docker-entrypoint-initdb.d/02-seed.sql
      - ./db/sentences_view.sql:/docker-entrypoint-initdb.d/03-sentences_view.sql
      - postgres_data:/var/lib/postgresql/data
    networks:
      - sr_barbara_net

  app:
    build: .
    ports:
      - "5000:5000"
    environment:
      DB_HOST: db
      DB_NAME: ${DB_NAME}
      DB_USER: ${DB_USER}
      DB_PASSWORD: ${DB_PASSWORD}
    depends_on:
      - db
    networks:
      - sr_barbara_net

volumes:
  postgres_data:

networks:
  sr_barbara_net:
    driver: bridge
```

### Why

- Hardcoded password removed — credentials come from `.env` now, consistent
  with how `app.py` already reads them via `python-dotenv`.
- Adminer service removed — it's a developer tool, not part of the game.
- Explicit named network defined (`sr_barbara_net`) so `docker-compose.dev.yml`
  can join it as an external network.

---

## File 2: `docker-compose.dev.yml` (new file)

```yaml
# =============================================================================
# Sr. Barbara's Class — developer tools overlay
# =============================================================================
#
# Adds hardened Adminer to the running game stack.
#
# Usage:
#   docker compose -f docker-compose.yaml -f docker-compose.dev.yml up
#
# Requires .env.dev — copy from .env.dev.example and fill in values:
#   cp .env.dev.example .env.dev
#
# Adminer login:
#   Server:   db
#   Username: value of DB_USER in .env
#   Password: value of DB_PASSWORD in .env
#   Database: value of DB_NAME in .env
#
# =============================================================================

services:
  adminer:
    image: adminer:latest
    container_name: adminer
    restart: unless-stopped

    ports:
      - "${ADMINER_BIND_IP}:8080:8080"
    networks:
      - sr_barbara_net

    # Filesystem hardening
    read_only: true
    tmpfs:
      - /tmp:mode=1777

    # Capability and privilege hardening
    user: "${ADMINER_UID}:${ADMINER_GID}"
    cap_drop:
      - ALL
    security_opt:
      - no-new-privileges:true

    # Resource limits
    deploy:
      resources:
        limits:
          memory: 256m
          cpus: "0.5"

networks:
  sr_barbara_net:
    external: true
```

### Why

- Adminer is a developer tool — players never need it.
- Joins the game's named network (`sr_barbara_net`) as an external network
  rather than defining its own, so it can reach the `db` container by name.
- Hardened config from dev-utils: read-only filesystem, all capabilities
  dropped, no-new-privileges, memory and CPU limits, interface binding via
  `ADMINER_BIND_IP`.

---

## File 3: `.env.example` (new file)

```bash
# Sr. Barbara's Class — environment variables
# Copy this file to .env and fill in your values.
# .env is excluded from git — never commit credentials.
#
#   cp .env.example .env

# PostgreSQL credentials
# These must match across db and app services.
# If you change DB_PASSWORD after first run, you must also update it
# inside the running Postgres container or destroy and recreate the volume.
DB_NAME=sr_barbara
DB_USER=postgres
DB_PASSWORD=changeme
```

### Why

`.env` is in `.gitignore` (or should be — see note below). `.env.example`
gives new users the structure they need without exposing real credentials.
The comment about volume recreation documents the gotcha that caused Adminer
login failures on first setup after the contest.

---

## File 4: `.env.dev.example` (new file)

```bash
# Sr. Barbara's Class — developer tools environment variables
# Copy this file to .env.dev and fill in your values.
# .env.dev is excluded from git — never commit credentials.
#
#   cp .env.dev.example .env.dev

# Interface Adminer binds to.
# Use 127.0.0.1 for local access only (recommended).
# Use a Tailscale IP to access from other machines on your mesh.
ADMINER_BIND_IP=127.0.0.1

# UID and GID to run Adminer as.
# Use your own user ID to avoid permission issues.
# Find yours with: id -u && id -g
ADMINER_UID=1000
ADMINER_GID=1000
```

### Why

Separates developer config from game config. `ADMINER_BIND_IP` controls
which network interface Adminer is exposed on — defaulting to `127.0.0.1`
means it's never accidentally exposed to the network. Tailscale IP option
documented for the homelab use case.

---

## Additional: `.gitignore` additions

Verify these lines exist in `.gitignore` (add if missing):

```
.env
.env.dev
```

`.env.example` and `.env.dev.example` should NOT be in `.gitignore` —
they are safe to commit and useful to other users.

---

## README update — Running with Docker section

Replace the current section with:

```markdown
## Running with Docker

### First-time setup

Copy the example environment file and set a password:

\```bash
cp .env.example .env
\```

Edit `.env` and replace `changeme` with a real password. This password is
used by both the database and the Flask app — set it once here.

### Start the game

\```bash
docker compose up --build
\```

Visit **http://localhost:5000** to play.

### Developer tools (Adminer)

Adminer is a database admin UI — useful for inspecting and editing sentence
data, not needed to play the game.

\```bash
cp .env.dev.example .env.dev
# Edit .env.dev if needed (defaults work for local use)
docker compose -f docker-compose.yaml -f docker-compose.dev.yml up
\```

Visit **http://localhost:8080** for Adminer.

**Adminer login:**
- Server: `db`
- Username: value of `DB_USER` in your `.env` (default: `postgres`)
- Password: value of `DB_PASSWORD` in your `.env`
- Database: value of `DB_NAME` in your `.env` (default: `sr_barbara`)

> **Note:** If you change `DB_PASSWORD` in `.env` after the first run,
> you must update it inside the running Postgres container or destroy
> and recreate the volume with `docker compose down -v`.
```

---

## Summary of changes

| File | Change |
|------|--------|
| `docker-compose.yaml` | Remove Adminer, remove hardcoded credentials, add named network |
| `docker-compose.dev.yml` | New — hardened Adminer overlay, joins game network externally |
| `.env.example` | New — credential template for game stack |
| `.env.dev.example` | New — config template for dev tools |
| `.gitignore` | Verify `.env` and `.env.dev` are excluded |
| `README.md` | Update Running with Docker section |
