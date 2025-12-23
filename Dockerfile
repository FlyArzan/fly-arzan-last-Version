# Multi-stage build for optimized production image
# Stage 1: Build the application
FROM node:22-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Production image
FROM node:22-alpine AS production

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies (including serve from package.json)
RUN npm ci --only=production

# Copy built dist folder from builder stage
COPY --from=builder /app/dist ./dist

# Expose port
EXPOSE 5173

# Start the application using npm start
CMD ["npm", "run", "start"]
