# Use an official Node runtime as a parent image
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the 'tzdata' package
RUN apk --no-cache add tzdata

# Set the timezone to Asia/Kolkata
ENV TZ Asia/Kolkata

ENV REACT_APP_BACKEND_UR=$REACT_APP_BACKEND_UR
ENV PORT=$PORT
# Install app dependencies
RUN npm install

# Copy all files/source code from the project
COPY . .

# Expose port 3000 for external access
EXPOSE $PORT

# Start the application
CMD ["npm", "start"]
