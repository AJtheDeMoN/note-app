# backend/Dockerfile

# 1. Use a modern, slim Python base image
FROM python:3.11-slim

# 2. Set the working directory to a neutral location
WORKDIR /code

# 3. Copy only the requirements file first to leverage Docker's build cache
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 4. Copy your application code into a subdirectory named 'app'
# This makes 'app' a discoverable Python package.
COPY . ./app

# 5. The new CMD: Run uvicorn as a module, pointing to app.main
# This is the Docker equivalent of the 'python -m uvicorn backend.main:app' command that worked locally.
CMD ["python", "-m", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]