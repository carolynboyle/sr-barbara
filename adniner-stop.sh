
#!/usr/bin/env bash
# Sr. Barbara's Class — stop Adminer
set -euo pipefail

docker-compose --env-file .env.combined \
    -f docker-compose.yaml \
    -f docker-compose.dev.yml \
    stop adminer

# Clean up the combined env file
rm -f .env.combined

echo "Adminer stopped."
```

### Why adminer-stop.sh needs .env.combined

docker-compose needs to parse the compose files to know which container
to stop, and parsing `docker-compose.dev.yml` requires the variables to
be set. If `.env.combined` doesn't exist when stop is called, generate
it first:

```bash
# If you get a variable warning on stop, run this first:
cat .env .env.dev > .env.combined
bash adminer-stop.sh