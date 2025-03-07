# Use official Node.js runtime
FROM node:20

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install -g npm@11.1.0

# Copy rest of the application
COPY . .


# Expose the application port
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start"]
