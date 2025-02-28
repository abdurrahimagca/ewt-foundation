# Build stage
FROM node:22-bullseye-slim AS builder

# Set the working directory
WORKDIR /app

# Install dependencies for better-sqlite3 compatibility in one layer
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    gcc \
    musl-dev \
    libstdc++6 \
    sqlite3 \
    libgcc-s1 \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Create a non-root user and set permissions
RUN groupadd -r appgroup && useradd -r -g appgroup appuser && \
    mkdir -p /home/appuser/.npm && \
    chown -R appuser:appgroup /home/appuser && \
    chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

# Set npm cache directory to avoid permission issues
ENV NPM_CONFIG_CACHE=/home/appuser/.npm

# Copy package files and install dependencies
COPY --chown=appuser:appgroup package*.json ./
COPY --chown=appuser:appgroup vite.config.js ./

# Install dependencies and rebuild better-sqlite3
RUN npm ci --legacy-peer-deps --frozen-lockfile --no-cache && \
    npm rebuild better-sqlite3 --build-from-source

# Copy source code
COPY --chown=appuser:appgroup ./src ./src
COPY --chown=appuser:appgroup index.ts ./
COPY --chown=appuser:appgroup tsconfig.json ./
COPY --chown=appuser:appgroup .env* ./

# Build frontend and backend
RUN npm run build

# Production stage
FROM node:22-bullseye-slim

WORKDIR /app

# Install only the necessary production dependencies
RUN apt-get update && apt-get install -y \
    sqlite3 \
    libstdc++6 \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Create and use non-root user
RUN groupadd -r appgroup && useradd -r -g appgroup appuser

# Create necessary directories
RUN mkdir -p /app/dist/src/data && \
    chown -R appuser:appgroup /app/dist/src/data

# Create and set permissions for .npm cache directory
RUN mkdir -p /home/appuser/.npm && \
    chown -R appuser:appgroup /home/appuser/.npm

# Set the correct ownership for /app
RUN chown -R appuser:appgroup /app

# Copy only the necessary files from builder stage
COPY --from=builder --chown=appuser:appgroup /app/dist ./dist
COPY --from=builder --chown=appuser:appgroup /app/html ./html
COPY --from=builder --chown=appuser:appgroup /app/package*.json ./

# Set npm cache directory to avoid permission issues
ENV NPM_CONFIG_CACHE=/home/appuser/.npm

# Switch to non-root user
USER appuser

# Install only production dependencies
RUN npm ci --only=production --legacy-peer-deps

# Run the application
CMD ["node", "dist/index.js"]
