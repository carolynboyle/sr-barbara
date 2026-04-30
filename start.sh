#!/usr/bin/env bash
# Sr. Barbara's Class — start the game stack
# Runs detached. Visit http://localhost:5000 to play.
set -euo pipefail
docker-compose up -d --build
echo "Game running at http://localhost:5000"