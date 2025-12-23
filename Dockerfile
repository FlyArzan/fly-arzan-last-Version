# Multi-stage build for optimized production image
# Stage 1: Build the application
FROM node:22-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production=false

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Production image with only built files
FROM node:22-alpine AS production

# Set working directory
WORKDIR /app

# Install serve globally (lightweight static server)
RUN npm install -g serve

# Copy only the built dist folder from builder stage
COPY --from=builder /app/dist ./dist

# Expose port
EXPOSE 5173

# Start the application
CMD ["serve", "-s", "dist", "-l", "5173"]
