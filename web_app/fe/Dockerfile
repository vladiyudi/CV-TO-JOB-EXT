# Use an official Node runtime as the parent image
FROM node:20

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the current directory contents into the container
COPY . .

# Build the app
RUN npm run build

# Install serve to run the application
RUN npm install -g serve

# Make port 5000 available to the world outside this container
# EXPOSE 8080
EXPOSE 5000

ENV VITE_CHROME_EXTENSION_ID=ajdickjmjicigipdjgfoecgibjfiannn
# ENV VITE_API_ENDPOINT=https://supercvbackend-47779369171.europe-west3.run.app
ENV VITE_API_ENDPOINT=http://localhost:8080

# Run the app when the container launches
CMD ["serve", "-s", "dist", "-l", "8080"]
# CMD ["serve", "-s", "dist", "-l", "5000"]