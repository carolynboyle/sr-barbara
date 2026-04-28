# Dockerfile

**Path:** Dockerfile
**Syntax:** text
**Generated:** 2026-04-27 16:01:34

```
# Sr. Barbara's Class - Flask Container
FROM python:3.11-slim

WORKDIR /app

# Install dependencies
RUN pip install --no-cache-dir flask psycopg2-binary python-dotenv

# Copy application files
COPY app.py .
COPY templates/ templates/
COPY static/ static/

# Flask needs to bind to 0.0.0.0 to be accessible outside container
ENV FLASK_HOST=0.0.0.0
ENV FLASK_PORT=5000

EXPOSE 5000

CMD ["python", "-c", "from app import app; app.run(host='0.0.0.0', port=5000, debug=False)"]

```
