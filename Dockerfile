FROM node:24-slim

WORKDIR /app

# Install SSH client & Git
# RUN apt-get update && apt-get install -y openssh-client git bash && rm -rf /var/lib/apt/lists/*

COPY . .

EXPOSE 3000
