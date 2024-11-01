# Use the official Node.js image for building
FROM node:18 AS builder

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies with increased memory limit
RUN NODE_OPTIONS="--max-old-space-size=4096" npm install

# Copy the source code
COPY . .

# Build the TypeScript code with increased memory limit
RUN NODE_OPTIONS="--max-old-space-size=4096" npm run build

# Use a smaller base image for the final image
FROM node:18-slim

# Set the working directory
WORKDIR /usr/src/app

# Copy only the necessary files from the builder stage
COPY --from=builder /usr/src/app/build ./build
COPY package.json package-lock.json ./
COPY .env ./

# Install only production dependencies
RUN npm install --only=production

# Expose the necessary port
EXPOSE 5000

# Start the application
CMD ["node", "build/index.js"]
