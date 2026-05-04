# adminer-stop.sh

**Path:** adminer-stop.sh
**Syntax:** bash
**Generated:** 2026-05-03 16:07:45

```bash
#!/usr/bin/env bash
# Sr. Barbara's Class — stop Adminer
set -euo pipefail

# Regenerate .env.combined if it was cleaned up or never created
if [ ! -f .env.combined ]; then
    if [ ! -f .env ] || [ ! -f .env.dev ]; then
        echo "ERROR: .env or .env.dev not found. Cannot stop Adminer cleanly."
        echo "Try: docker stop adminer"
        exit 1
    fi
    cat .env .env.dev > .env.combined
fi

docker-compose --env-file .env.combined \
    -f docker-compose.yaml \
    -f docker-compose.dev.yml \
    stop adminer

# Clean up the combined env file
rm -f .env.combined

echo "Adminer stopped."
```
