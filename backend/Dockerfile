# Use an official Python runtime as a parent image
FROM python:3.13.3-alpine

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
WORKDIR /app

COPY . /app/

RUN pip install --upgrade pip

RUN pip install -r requirements.txt

EXPOSE 5001

CMD ["python", "main.py"]