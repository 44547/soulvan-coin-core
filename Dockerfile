FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY tools/mining/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY tools/mining/ .

# Expose port
EXPOSE 5050

# Run the application
CMD ["python", "soulvan_mining_api.py"]
