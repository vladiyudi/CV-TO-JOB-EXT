# Use an official Node runtime as the parent image
FROM node:20

# Set the working directory in the container
WORKDIR /app

# ADD "https://www.random.org/cgi-bin/randbyte?nbytes=10&format=h" skipcache

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the current directory contents into the container
COPY . .

# Build the app
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html

# Install serve to run the application
RUN npm install -g serve

# Make port 8080 available to the world outside this container
# EXPOSE 8080
EXPOSE 80

# Run the app when the container launches
# CMD ["serve", "-s", "dist", "-l", "8080"]
# CMD ["/bin/sh", "-c", "VITE_API_ENDPOINT=${VITE_API_ENDPOINT} VITE_CHROME_EXTENSION_ID=${VITE_CHROME_EXTENSION_ID} serve -s dist -l 8080"]
CMD ["nginx", "-g", "daemon off;"]