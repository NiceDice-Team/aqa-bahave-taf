# Base image with Node.js and Playwright dependencies
ARG NODE_VERSION=24.21.0

FROM node:${NODE_VERSION}-bookworm-slim AS node-runtime

FROM mcr.microsoft.com/playwright:v1.58.0-noble

# Keep Playwright's browser/runtime image while using the current Node LTS.
COPY --from=node-runtime /usr/local/ /usr/local/

# Set working directory
WORKDIR /app

# Set environment variables
ENV NODE_ENV=local
ENV CI=true

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Make the runtime version visible in CI build logs.
RUN node --version && npm --version

# Copy application code
COPY . .

# Create directories for reports
RUN mkdir -p reports test-results .features-gen

# Set permissions
RUN chmod -R 777 reports test-results .features-gen

# Default command (can be overridden in docker-compose)
CMD ["sh", "-c", "npm run test:generate && npm run test:critical"]

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node --version || exit 1

# Expose ports for debugging (optional)
EXPOSE 9229
