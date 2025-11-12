# Docker Production Setup Guide

This guide explains how to build and deploy the application using Docker in production.

## Prerequisites

- Docker 20.10+
- Docker Compose 2.0+
- Environment variables configured (see `.env.production.example`)

## Project Structure

```
.
├── servers/              # Backend (Node.js/Express/TypeScript)
│   ├── Dockerfile       # Production Dockerfile for backend
│   └── .dockerignore
├── webapp/              # Frontend (Next.js)
│   ├── Dockerfile       # Production Dockerfile for frontend
│   └── .dockerignore
└── docker-compose-production.yml  # Production orchestration
```

## Quick Start

### 1. Set up Environment Variables

Create a `.env.production` file in the root directory with all required environment variables. You can use `servers/env.example` as a reference.

Key variables to set:
- `FRONTEND_URL` - Your frontend domain
- `CORS_ORIGIN` - Allowed CORS origins
- `NEXT_PUBLIC_API_URL` - Backend API URL for frontend
- All AWS, database, and third-party service credentials

### 2. Build and Start Services

```bash
# Build and start all services - production
docker-compose -f docker-compose-production.yml up -d --build

# Build and start all services - local
docker-compose -f docker-compose-local.yml up -d --build

# View logs
docker-compose -f docker-compose-production.yml logs -f

# Stop services
docker-compose -f docker-compose-production.yml down
```

### 3. Individual Service Management

```bash
# Build only backend
docker build -t backend-production ./servers

# Build only frontend
docker build -t frontend-production ./webapp

# Run a specific service
docker-compose -f docker-compose-production.yml up -d backend
```

## Services

### Backend (servers)
- **Port**: 5000 (configurable via `BACKEND_PORT`)
- **Health Check**: `http://localhost:5000/api/v1/health`
- **Dockerfile**: Multi-stage build with Node.js 20 Alpine
- **Build Command**: `npm run build:prod`

### Frontend (webapp)
- **Port**: 3000 (configurable via `FRONTEND_PORT`)
- **Health Check**: `http://localhost:3000`
- **Dockerfile**: Multi-stage build with Next.js standalone output
- **Build Command**: `npm run build`

### Redis
- **Port**: 6379 (configurable via `REDIS_PORT`)
- **Image**: `redis:7-alpine`
- **Data Persistence**: Volume `redis_data`

## Environment Variables

### Required for docker-compose-production.yml

All environment variables should be set in your `.env.production` file or passed via environment variables:

- `BACKEND_PORT` - Backend service port (default: 5000)
- `FRONTEND_PORT` - Frontend service port (default: 3000)
- `REDIS_PORT` - Redis service port (default: 6379)
- `REDIS_PASSWORD` - Redis password (optional)
- `FRONTEND_URL` - Frontend application URL
- `CORS_ORIGIN` - CORS allowed origins
- `NEXT_PUBLIC_API_URL` - Backend API URL for frontend
- `NEXT_PUBLIC_SOCKET_URL` - Socket.IO URL for frontend
- All other variables from `servers/env.example`

## Docker Features

### Multi-stage Builds
Both Dockerfiles use multi-stage builds to:
- Reduce image size
- Separate build dependencies from runtime
- Improve security by removing build tools from production images

### Security
- Non-root user execution
- Minimal Alpine-based images
- Health checks for all services
- Proper file permissions

### Health Checks
- Backend: Checks `/api/v1/health` endpoint
- Frontend: Checks root endpoint
- Redis: Uses `redis-cli ping`

## Production Considerations

### 1. Reverse Proxy
In production, use a reverse proxy (nginx, Traefik, etc.) for:
- SSL/TLS termination
- Load balancing
- Domain routing

### 2. Environment Variables
- Never commit `.env.production` to version control
- Use secrets management (Docker secrets, AWS Secrets Manager, etc.)
- Rotate credentials regularly

### 3. Logs
- Backend logs are mounted to `./servers/logs`
- Use log aggregation tools (ELK, CloudWatch, etc.)
- Configure log rotation

### 4. Monitoring
- Set up monitoring (Prometheus, Grafana, etc.)
- Configure alerts for health check failures
- Monitor resource usage

### 5. Database Connections
Ensure your backend can connect to:
- DynamoDB (AWS)
- Redis (containerized)
- S3 (AWS)

### 6. Scaling
To scale services:
```bash
# Scale backend
docker-compose -f docker-compose-production.yml up -d --scale backend=3

# Scale frontend
docker-compose -f docker-compose-production.yml up -d --scale frontend=2
```

## Troubleshooting

### Build Failures
```bash
# Clean build (no cache)
docker-compose -f docker-compose-production.yml build --no-cache

# Check build logs
docker-compose -f docker-compose-production.yml build
```

### Service Not Starting
```bash
# Check service logs
docker-compose -f docker-compose-production.yml logs <service-name>

# Check service status
docker-compose -f docker-compose-production.yml ps

# Inspect container
docker inspect <container-name>
```

### Health Check Failures
```bash
# Manually test health endpoint
curl http://localhost:5000/api/v1/health

# Check container health
docker ps --format "table {{.Names}}\t{{.Status}}"
```

### Port Conflicts
If ports are already in use:
- Change port mappings in `docker-compose-production.yml`
- Update environment variables accordingly

## Updates and Maintenance

### Updating Services
```bash
# Pull latest code
git pull

# Rebuild and restart
docker-compose -f docker-compose-production.yml up -d --build

# Zero-downtime update (with rolling updates)
docker-compose -f docker-compose-production.yml up -d --no-deps --build <service>
```

### Backup
```bash
# Backup Redis data
docker exec redis-production redis-cli --rdb /data/dump.rdb

# Backup volumes
docker run --rm -v redis_data:/data -v $(pwd):/backup alpine tar czf /backup/redis-backup.tar.gz /data
```

## Next Steps

1. Configure reverse proxy (nginx/Traefik)
2. Set up SSL certificates
3. Configure monitoring and alerting
4. Set up CI/CD pipeline
5. Configure backup strategy
6. Set up log aggregation

## Support

For issues or questions:
- Check service logs: `docker-compose -f docker-compose-production.yml logs`
- Review Docker documentation
- Check Next.js deployment documentation

