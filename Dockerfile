# Use an official Node runtime as a parent image
FROM node:16-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy all files/source code from the project
COPY . .

# Expose port 3000 for external access
EXPOSE 3000

# Start the application
CMD ["npm", "start"]