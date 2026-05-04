# stop.sh

**Path:** stop.sh
**Syntax:** bash
**Generated:** 2026-05-03 16:07:45

```bash
#!/usr/bin/env bash
# Sr. Barbara's Class — stop the game stack
set -euo pipefail
docker-compose down
echo "Game stack stopped."
```
