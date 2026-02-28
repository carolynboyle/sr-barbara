FROM python:3.11-slim

WORKDIR /app

COPY pyproject.toml .
RUN pip install -e .

COPY . .

EXPOSE 5000

CMD ["flask", "run", "--host=0.0.0.0"]