# Build stage
FROM node:22-bullseye-slim AS builder

WORKDIR /app

# Install dependencies for better-sqlite3 compatibility
RUN apt-get update && apt-get install -y \
  python3 \
  make \
  g++ \
  gcc \
  musl-dev \
  libstdc++6 \
  sqlite3 \
  libgcc-s1

# Create a non-root user and set permissions
RUN groupadd -r appgroup && useradd -r -g appgroup appuser && \
    mkdir -p /home/appuser && \
    chown -R appuser:appgroup /home/appuser && \
    chown appuser:appgroup /app

# Switch to non-root user
USER appuser

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps && \
    npm rebuild better-sqlite3 --build-from-source

# Copy source code with correct ownership
COPY --chown=appuser:appgroup ./src ./src
COPY --chown=appuser:appgroup tsconfig.json ./
COPY --chown=appuser:appgroup .env* ./

# Build the application
RUN npm run build

# Production stage
FROM node:22-bullseye-slim

WORKDIR /app

# Install only production dependencies
RUN apt-get update && apt-get install -y \
  sqlite3 \
  libstdc++6 \
  libgcc-s1

# Create a non-root user
RUN groupadd -r appgroup && useradd -r -g appgroup appuser && \
    mkdir -p /home/appuser && \
    chown -R appuser:appgroup /home/appuser && \
    chown appuser:appgroup /app

# Copy only necessary files from builder
COPY --from=builder --chown=appuser:appgroup /app/dist ./dist
COPY --from=builder --chown=appuser:appgroup /app/node_modules ./node_modules
COPY --from=builder --chown=appuser:appgroup /app/package*.json ./

# Switch to non-root user
USER appuser

# Set production environment
ENV NODE_ENV=production

# Start the application
CMD ["npm", "run", "build"]
