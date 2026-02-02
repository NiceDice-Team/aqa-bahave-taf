# Base image with Node.js and Playwright dependencies
FROM mcr.microsoft.com/playwright:v1.48.0-jammy

# Set working directory
WORKDIR /app

# Set environment variables
ENV NODE_ENV=test
ENV CI=true

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Install Playwright browsers (if not already in base image)
RUN npx playwright install --with-deps chromium firefox webkit

# Copy application code
COPY . .

# Create directories for reports
RUN mkdir -p reports test-results .features-gen

# Set permissions
RUN chmod -R 777 reports test-results .features-gen

# Default command (can be overridden in docker-compose)
CMD ["npm", "run", "test"]

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node --version || exit 1

# Expose ports for debugging (optional)
EXPOSE 9229
