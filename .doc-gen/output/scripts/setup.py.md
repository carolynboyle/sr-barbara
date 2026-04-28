# setup.py

**Path:** scripts/setup.py
**Syntax:** python
**Generated:** 2026-04-27 16:01:34

```python
#!/usr/bin/env python3
"""
Sr. Barbara's Class - Setup Script
Run after: git clone https://github.com/carolynboyle/sr-barbara.git

Works on Windows, macOS, and Linux.
Requires: podman, podman-compose
"""

import subprocess
import sys
import time
import webbrowser


def run(cmd, check=True):
    """Run a command and return success status."""
    try:
        subprocess.run(cmd, shell=True, check=check)
        return True
    except subprocess.CalledProcessError:
        return False


def command_exists(cmd):
    """Check if a command is available."""
    check_cmd = f"where {cmd}" if sys.platform == "win32" else f"command -v {cmd}"
    return run(check_cmd, check=False)


def main():
    print()
    print("╔═══════════════════════════════════════════════════════════╗")
    print("║           Sr. Barbara's Class - Setup                     ║")
    print("║       Reed-Kellogg Sentence Diagramming Game              ║")
    print("╚═══════════════════════════════════════════════════════════╝")
    print()

    # Check for podman
    if not command_exists("podman"):
        print("❌ Podman is not installed.")
        print("   Install it from: https://podman.io/getting-started/installation")
        sys.exit(1)

    # Check for podman-compose
    if not command_exists("podman-compose"):
        print("❌ podman-compose is not installed.")
        print("   Install with: pip install podman-compose")
        sys.exit(1)

    print("✓ Podman and podman-compose found")
    print()

    # Stop any existing containers
    print("Cleaning up any existing containers...")
    run("podman-compose down", check=False)

    # Build and start
    print()
    print("Building and starting containers...")
    print("(This may take a minute on first run)")
    print()

    if not run("podman-compose up -d --build"):
        print()
        print("❌ Failed to start containers. Check logs with:")
        print("   podman-compose logs")
        sys.exit(1)

    # Wait for services to be ready
    print()
    print("Waiting for database to initialize...")
    time.sleep(3)

    # Check if web container is running
    result = subprocess.run(
        "podman ps", shell=True, capture_output=True, text=True
    )
    
    if "sr-barbara-web" in result.stdout:
        print()
        print("╔═══════════════════════════════════════════════════════════╗")
        print("║  ✓ Sr. Barbara's Class is ready!                         ║")
        print("║                                                           ║")
        print("║  Open in your browser: http://localhost:5000              ║")
        print("║                                                           ║")
        print("║  To stop:  podman-compose down                            ║")
        print("║  To reset: podman-compose down -v && python setup.py      ║")
        print("╚═══════════════════════════════════════════════════════════╝")
        print()

        response = input("Open in browser now? (Y/n) ").strip().lower()
        if response != 'n':
            webbrowser.open("http://localhost:5000")
    else:
        print()
        print("❌ Something went wrong. Check logs with:")
        print("   podman-compose logs")
        sys.exit(1)


if __name__ == "__main__":
    main()

```
