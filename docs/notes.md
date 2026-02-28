# Sr. Barbara's Class - Setup Notes

## New VM Setup

1. Created new VM (clone from golden image)
2. Created ~/projects/sr-barbara folder
3. Generated SSH key and added to GitHub

## Git Setup
```bash
git config --global user.name "Your Name"
git config --global user.email "your-email@example.com"
```

## Clone and Virtual Environment
```bash
cd ~/projects
git clone git@github.com:carolynboyle/sr-barbara.git
cd sr-barbara
python3 -m venv .venv
source .venv/bin/activate
```

## Fixed pyproject.toml

Added to pyproject.toml to prevent setuptools package discovery error:
```toml
[tool.setuptools]
py-modules = []
packages = []
```

## Install Dependencies
```bash
pip install -e .
```

## Next Steps

- Create .env file with database credentials
- Create database: `createdb sr_barbara`
- Load schema: `psql sr_barbara < db/schema.sql`
