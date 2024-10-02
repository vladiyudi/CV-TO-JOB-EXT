# Use an official Node.js runtime as the base image
FROM node:20

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

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Change ownership of the /app directory
RUN chown -R app-user:app-user /app

# Switch to the app-user user
USER app-user

# Install the application dependencies using npm ci
RUN npm ci

# Switch back to the root user
USER root

# Copy the rest of the application code to the working directory
COPY . .

# ENV PORT=8080
# ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
# ENV PUPPETEER_ARGS=--no-sandbox
# ENV OPENAI_API_KEY = ${OPENAI_API_KEY}
# ENV MONGODB_URI = ${MONGODB_URI}
# ENV GOOGLE_CLIENT_ID = ${GOOGLE_CLIENT_ID}
# ENV GOOGLE_CLIENT_SECRET = ${GOOGLE_CLIENT_SECRET}
# ENV CHROME_EXTENSION_ID = ${CHROME_EXTENSION_ID}
# ENV BACKEND_URL = ${BACKEND_URL}
# ENV SESSION_SECRET = ${SESSION_SECRET}


EXPOSE 8080

CMD [ "node", "server.js" ]