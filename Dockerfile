# Use an official Node.js runtime as the base image
FROM node:19-alpine3.16

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json
COPY package*.json ./

# Install the dependencies
RUN npm install -g npm@9.3.0
RUN npm install

# Copy the application source code
COPY . .

# Expose the port the application runs on
EXPOSE 3000

# Run the command to start the application
CMD ["npm", "run", "dev"]