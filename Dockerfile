# Base image with Node.js and Playwright dependencies
FROM mcr.microsoft.com/playwright:v1.56.1-noble

# Set working directory
WORKDIR /app

# Set environment variables
ENV NODE_ENV=local
ENV CI=true

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

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
