# Docker Guide for NiceDice Test Automation

## Overview

This project supports multiple deployment modes:
- **Staging/Production:** Test against remote URLs
- **Local Docker:** Test against containerized services
- **Hybrid:** Test from Docker against external services

---

## Quick Start

### 1. Test Against Staging (Current Setup)

```bash
# Uses existing .env with remote URLs
npm run test
```

### 2. Run Tests in Docker Against Staging

```bash
# Build and run tests in container, targeting staging
docker-compose up --build playwright-tests
```

### 3. Full Local Docker Setup (with mock services)

```bash
# Copy Docker environment
cp .env.docker .env

# Start all services including mocks
docker-compose --profile local-only up --build

# Run tests interactively
docker-compose exec playwright-tests npm run test
```

---

## Docker Commands

### Build and Run

```bash
# Build the test container
docker-compose build playwright-tests

# Run tests once
docker-compose run --rm playwright-tests npm run test

# Run specific feature
docker-compose run --rm playwright-tests npm run test -- checkout

# Run in watch mode
docker-compose run --rm playwright-tests npm run test -- --watch
```

### Interactive Mode

```bash
# Start container in interactive mode
docker-compose up playwright-tests

# In another terminal, execute commands
docker-compose exec playwright-tests bash
docker-compose exec playwright-tests npm run test
docker-compose exec playwright-tests npx playwright test --ui
```

### Cleanup

```bash
# Stop all containers
docker-compose down

# Remove volumes
docker-compose down -v

# Clean everything
docker-compose down -v --rmi all
```

---

## Configuration Options

### Environment Variables Priority

1. Docker Compose environment section
2. `.env` file (mounted in container)
3. Default values in `config/environment.ts`

### URL Configuration

**Option 1: Full URLs (recommended for staging/production)**
```env
API_BASE_URL=https://bgshop.work.gd
FRONTEND_BASE_URL=https://team-challange-front.vercel.app
```

**Option 2: Host + Port (recommended for Docker)**
```env
API_HOST=api
API_PORT=1080
API_PROTOCOL=http
```

The system automatically builds URLs from host+port if `*_BASE_URL` is not provided.

---

## Service Profiles

### Default Profile
- `playwright-tests` - Test runner (always active)

### Local-Only Profile
- `api` - Mock API server
- `frontend` - Mock frontend server

Activate with:
```bash
docker-compose --profile local-only up
```

---

## Network Configuration

### Docker Network
- Network name: `nicedice-network`
- Services communicate via service names
- Example: `http://api:1080`, `http://frontend:80`

### Port Mapping
- API: Host `3000` → Container `1080`
- Frontend: Host `3001` → Container `80`
- Playwright Debug: `9229` (optional)

---

## Volume Mounts

### Persistent Volumes
- `./reports` - Test reports (shared with host)
- `./test-results` - Test results (shared with host)
- `./.features-gen` - Generated test specs

### Development
- Source code mounted as volume for live updates
- `node_modules` excluded (uses container's version)

---

## Resource Limits

Default limits in `docker-compose.yml`:
- CPU: 2 cores max, 1 core reserved
- Memory: 4GB max, 2GB reserved

Adjust for your needs:
```yaml
deploy:
  resources:
    limits:
      cpus: '4'
      memory: 8G
```

---

## Testing Strategies

### 1. Local Development (without Docker)
```bash
# Standard local testing
npm run test
```

### 2. Docker Testing Against Staging
```bash
# Test in Docker but against real staging
docker-compose up playwright-tests
```

### 3. Full Isolated Docker Testing
```bash
# Use mock services
cp .env.docker .env
docker-compose --profile local-only up --build
docker-compose exec playwright-tests npm run test
```

### 4. CI/CD Mode
```bash
# Run tests once and exit
docker-compose run --rm \
  -e HEADLESS=true \
  -e PARALLEL_WORKERS=4 \
  playwright-tests npm run test
```

---

## Debugging

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f playwright-tests

# Last 100 lines
docker-compose logs --tail=100 playwright-tests
```

### Access Container Shell
```bash
docker-compose exec playwright-tests bash

# Inside container
npx playwright test --debug
npx playwright test --ui
```

### Inspect Network
```bash
# List running containers
docker-compose ps

# Inspect network
docker network inspect nicedice-network

# Test connectivity from container
docker-compose exec playwright-tests curl http://api:1080
```

---

## Common Issues

### Issue: Tests can't reach API
**Solution:** Check service names match in `.env`:
```env
API_HOST=api  # Must match service name in docker-compose.yml
```

### Issue: Permission denied on reports
**Solution:** Fix permissions:
```bash
docker-compose exec playwright-tests chmod -R 777 reports test-results
```

### Issue: Container keeps restarting
**Solution:** Check logs and environment variables:
```bash
docker-compose logs playwright-tests
docker-compose config  # Validate compose file
```

### Issue: Slow test execution
**Solution:** Adjust parallel workers:
```env
PARALLEL_WORKERS=4
HEADLESS=true
```

---

## Production Recommendations

### CI/CD Pipeline
```yaml
# Example GitHub Actions
- name: Run Tests in Docker
  run: |
    docker-compose run --rm \
      -e HEADLESS=true \
      -e PARALLEL_WORKERS=4 \
      playwright-tests npm run test
    
- name: Upload Reports
  uses: actions/upload-artifact@v3
  with:
    name: test-reports
    path: reports/
```

### Environment-Specific Configs

Create multiple env files:
- `.env.local` - Local development
- `.env.docker` - Docker local
- `.env.staging` - Staging tests
- `.env.production` - Production tests

Switch between them:
```bash
cp .env.staging .env
docker-compose up playwright-tests
```

---

## Next Steps

1. ✅ Configure your `.env` file
2. ✅ Run tests locally to verify setup
3. ✅ Try Docker execution
4. ✅ Set up CI/CD pipeline
5. ✅ Configure mock services (optional)

For more details, see [README.md](README.md) and [COVERAGE_SUMMARY.md](COVERAGE_SUMMARY.md).
