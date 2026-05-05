"""
Loads and exposes project configuration for Sr. Barbara's Class pipeline scripts.
Reads sr_barbara.yaml, data/queries.yaml, and pyproject.toml.
"""
# =============================================================================
# Sr. Barbara's Class — config.py
# Loads and exposes all project configuration for pipeline scripts.
#
# Usage:
#   from sr_barbara_scripts.config import ProjectConfig
#   config = ProjectConfig(repo_root)
#
# Reads:  sr_barbara.yaml (project config)
#         data/queries.yaml (SQL queries)
#         pyproject.toml (project version)
# =============================================================================

import re
from pathlib import Path

import yaml


class ProjectConfig:
    """Loads and exposes all project configuration for pipeline scripts."""

    def __init__(self, repo_root: Path):
        self._repo_root = repo_root
        self._config    = self._load_yaml(repo_root / 'sr_barbara.yaml')
        self._queries   = self._load_yaml(repo_root / 'data' / 'queries.yaml')
        self._version   = self._read_version()

    # -------------------------------------------------------------------------
    # Public properties
    # -------------------------------------------------------------------------

    @property
    def version(self) -> str:
        """Project version as major.minor (e.g. '0.1')."""
        return self._version

    @property
    def paths(self) -> dict:
        """Paths block from sr_barbara.yaml."""
        return self._config['paths']

    @property
    def database(self) -> dict:
        """Database block from sr_barbara.yaml."""
        return self._config['database']

    @property
    def game(self) -> dict:
        """Game defaults block from sr_barbara.yaml."""
        return self._config['game']

    @property
    def site(self) -> dict:
        """Site block from sr_barbara.yaml."""
        return self._config['site']

    @property
    def queries(self) -> dict:
        """Full queries dict from data/queries.yaml."""
        return self._queries

    @property
    def repo_root(self) -> Path:
        """Absolute path to the repository root."""
        return self._repo_root

    # -------------------------------------------------------------------------
    # Internal helpers
    # -------------------------------------------------------------------------

    def _load_yaml(self, path: Path) -> dict:
        with path.open(encoding='utf-8') as f:
            return yaml.safe_load(f)

    def _read_version(self) -> str:
        """Read version from pyproject.toml and return major.minor only."""
        toml_path = self._repo_root / 'pyproject.toml'
        text = toml_path.read_text(encoding='utf-8')
        match = re.search(r'^version\s*=\s*"([^"]+)"', text, re.MULTILINE)
        if not match:
            raise RuntimeError(f"Could not find version in {toml_path}")
        full_version = match.group(1)
        return '.'.join(full_version.split('.')[:2])
