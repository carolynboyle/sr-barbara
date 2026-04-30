#!/usr/bin/env bash
# Sr. Barbara's Class — stop the game stack
set -euo pipefail
docker-compose down
echo "Game stack stopped."