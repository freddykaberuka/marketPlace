# Use the official Node.js image with the desired version
FROM --platform=linux/amd64 node:18

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package.json package-lock.json ./

# Install dependencies using npm
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application (if you have a build step)
RUN npm run build

# Start the application
CMD ["npm", "start"]