# Use an official Node.js runtime as the base image
# FROM node:20
FROM --platform=linux/amd64 node:20

# Install required dependencies for Puppeteer
RUN apt-get update && apt-get install -y \
    gconf-service \
    libasound2 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcairo2 \
    libcups2 \
    libdbus-1-3 \
    libexpat1 \
    libfontconfig1 \
    libgbm1 \
    libgcc1 \
    libgconf-2-4 \
    libgdk-pixbuf2.0-0 \
    libglib2.0-0 \
    libgtk-3-0 \
    libicu-dev \
    libjansson4 \
    libjpeg-dev \
    libnspr4 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libpng-dev \
    libsecret-1-0 \
    libstdc++6 \
    libx11-6 \
    libx11-xcb1 \
    libxcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxi6 \
    libxrandr2 \
    libxrender1 \
    libxss1 \
    libxtst6 \
    ca-certificates \
    fonts-liberation \
    libappindicator1 \
    libnss3 \
    lsb-release \
    wget \
    xdg-utils \
    chromium

# Create a non-root user
RUN useradd -m app-user

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json for both frontend and backend
COPY fe/package*.json ./fe/
COPY be/package*.json ./be/

# Change ownership of the /app directory
RUN chown -R app-user:app-user /app

# Switch to the app-user user
USER app-user

# Install dependencies for both frontend and be
RUN cd fe && npm ci
RUN cd be && npm ci

# Switch back to the root user
USER root

# Copy the frontend and be source code
COPY fe ./fe
COPY be ./be

# Build the React app
RUN cd fe && npm run build

# Set environment variables
ENV PORT=8080
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
ENV PUPPETEER_ARGS=--no-sandbox

# Expose the port the app runs on
EXPOSE 8080

# Set the working directory to the be folder
WORKDIR /app/be

# Define the command to run the app
CMD [ "node", "server.js" ]