# stop.sh

**Path:** stop.sh
**Syntax:** bash
**Generated:** 2026-05-03 21:07:47

```bash
#!/usr/bin/env bash
# Sr. Barbara's Class — stop the game stack
set -euo pipefail
docker-compose down
echo "Game stack stopped."
```
