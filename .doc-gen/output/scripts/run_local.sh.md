# run_local.sh

**Path:** scripts/run_local.sh
**Syntax:** bash
**Generated:** 2026-04-27 16:01:34

```bash
#!/bin/bash
# Run Sr. Barbara's Class locally with containerized PostgreSQL

# Start just the database container
podman-compose up -d db

# Wait for postgres to be ready
echo "Waiting for PostgreSQL to start..."
sleep 3

# Export environment variables for local Flask
export DB_HOST=localhost
export DB_NAME=sr_barbara
export DB_USER=postgres
export DB_PASSWORD=srbarbaradb

# Run Flask locally
echo "Starting Flask app at http://localhost:5000"
python app.py

```
