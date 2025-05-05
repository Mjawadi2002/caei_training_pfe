# Use official Node.js image
FROM node:22-slim

# Set working directory in the container
WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app files
COPY . .

# Expose the backend port (adjust if you're using a different one)
EXPOSE 4000

# Start the app
CMD ["npm", "start"]
