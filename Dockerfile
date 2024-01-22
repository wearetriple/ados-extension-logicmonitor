# Use the official Node.js 16 image as the base image
FROM node:16

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY ./package*.json ./

# Install project dependencies
RUN npm install 

# Copy the rest of the project files to the working directory
COPY . .

# Start the Node.js application
CMD [ "node", "index.js" ]
