#!/usr/bin/env bash
# Sr. Barbara's Class — start Adminer (developer database UI)
# Requires the game stack to be running first: bash start.sh
# Visit http://localhost:8080 to use Adminer.
#
# Login:
#   Server:   db
#   Username: value of DB_USER in .env
#   Password: value of DB_PASSWORD in .env
#   Database: value of DB_NAME in .env
set -euo pipefail

if [ ! -f .env ]; then
    echo "ERROR: .env not found. Copy .env.example to .env and fill in values."
    exit 1
fi

if [ ! -f .env.dev ]; then
    echo "ERROR: .env.dev not found. Copy .env.dev.example to .env.dev and fill in values."
    exit 1
fi

# Merge env files — docker-compose on this machine only accepts one --env-file
cat .env .env.dev > .env.combined
# Remove stale adminer container if it exists
docker rm -f adminer 2>/dev/null || true
docker-compose --env-file .env.combined \
    -f docker-compose.yaml \
    -f docker-compose.dev.yml \
    up -d

echo "Adminer running at http://localhost:8080"