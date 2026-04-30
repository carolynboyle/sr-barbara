# Sr. Barbara's Class — Changeset: Mount static and templates as volumes
**Date:** 2026-04-30
**Affects:** `docker-compose.yaml`
**Reason:** Edits to `static/` and `templates/` files on the host don't
reach the running container — those directories are only copied into the
image at build time. Every CSS/JS/HTML edit currently requires a full
`--build` to take effect, which is slow and easy to forget. Mounting them
as volumes makes edits visible immediately on browser refresh.

---

## File: `docker-compose.yaml`

### BEFORE

```yaml
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
```

### AFTER

```yaml
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
    volumes:
      - ./static:/app/static
      - ./templates:/app/templates
    networks:
      - sr_barbara_net
```

### Why

The Dockerfile uses `COPY static/ static/` and `COPY templates/ templates/`
to bake those directories into the image at build time. Without a volume
mount, the container is always serving the snapshot taken at the last
`docker-compose up --build`.

Mounting `./static` and `./templates` as volumes makes the host
directories the source of truth at runtime. The bind mount overlays the
copied files, so any edit on the host is visible immediately to Flask.
A browser refresh is enough to pick up CSS, JS, or template changes —
no rebuild, no restart.

This matches the standard Flask development workflow and matches what
other containers in this stack already do (the database mounts its
schema and seed files the same way).

---

## After applying

Restart the stack so docker-compose picks up the new mounts:

```bash
docker-compose down
docker-compose up -d --build
```

The `--build` is needed once because the image still has stale files
from the last build; after that, edits to `static/` and `templates/`
will be visible on browser refresh without any docker commands.

To verify the mount is working after restart, check that the file inside
the container matches the file on the host:

```bash
md5sum static/js/game.js
docker exec sr-barbara_app_1 md5sum /app/static/js/game.js
```

The two hashes should match. After editing `game.js`, both should still
match without rebuilding.
