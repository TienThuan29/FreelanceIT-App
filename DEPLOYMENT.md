# Production Deployment Guide for EC2

This guide explains how to deploy the FreelanceIT application on AWS EC2 using Docker Compose with Nginx as a reverse proxy.

## Prerequisites

- AWS EC2 instance (Ubuntu 20.04+ recommended)
- Domain name pointing to your EC2 instance
- Docker and Docker Compose installed
- SSL certificate (Let's Encrypt recommended)

## Step 1: Prepare EC2 Instance

### Install Docker and Docker Compose

```bash
# Update system
sudo apt-get update

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Add user to docker group (optional, to run without sudo)
sudo usermod -aG docker $USER
newgrp docker
```

### Configure Firewall

```bash
# Allow HTTP, HTTPS, and SSH
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

## Step 2: Clone and Setup Project

```bash
# Clone your repository
git clone <your-repo-url>
cd FreelanceIT-App

# Create production environment file
cp .env.production.example .env.production
nano .env.production  # Edit with your production values
```

## Step 3: SSL Certificate Setup (Let's Encrypt)

### Install Certbot

```bash
sudo apt-get update
sudo apt-get install certbot python3-certbot-nginx -y
```

### Get SSL Certificate

```bash
# Stop nginx if running
sudo systemctl stop nginx

# Request certificate (replace with your domain)
sudo certbot certonly --standalone -d freelance-it.site -d www.freelance-it.site

# Certificates will be stored in:
# /etc/letsencrypt/live/freelance-it.site/fullchain.pem
# /etc/letsencrypt/live/freelance-it.site/privkey.pem
```

### Copy Certificates to Project Directory

```bash
# Create SSL directory
mkdir -p nginx/ssl/live/freelance-it.site

# Copy certificates (adjust paths as needed)
sudo cp /etc/letsencrypt/live/freelance-it.site/fullchain.pem nginx/ssl/live/freelance-it.site/
sudo cp /etc/letsencrypt/live/freelance-it.site/privkey.pem nginx/ssl/live/freelance-it.site/

# Set proper permissions
sudo chown -R $USER:$USER nginx/ssl
```

### Setup Auto-renewal

```bash
# Test renewal
sudo certbot renew --dry-run

# Add to crontab (runs twice daily)
sudo crontab -e
# Add this line:
0 0,12 * * * certbot renew --quiet --deploy-hook "docker compose -f /path/to/docker-compose-production.yml restart nginx"
```

## Step 4: Update Nginx Configuration

Edit `nginx/nginx.conf` and update the `server_name` to match your domain:

```nginx
server_name your-domain.com www.your-domain.com;
```

## Step 5: Build and Deploy

```bash
# Build and start all services
docker compose -f docker-compose-production.yml up -d --build

# View logs
docker compose -f docker-compose-production.yml logs -f

# Check service status
docker compose -f docker-compose-production.yml ps
```

## Step 6: Verify Deployment

1. **Check Health Endpoints:**
   ```bash
   curl http://localhost/health
   curl https://your-domain.com/health
   ```

2. **Check Service Logs:**
   ```bash
   docker compose -f docker-compose-production.yml logs backend
   docker compose -f docker-compose-production.yml logs frontend
   docker compose -f docker-compose-production.yml logs nginx
   ```

3. **Test API:**
   ```bash
   curl https://your-domain.com/api/v1/health
   ```

## Service Management

### Start Services
```bash
docker compose -f docker-compose-production.yml up -d
```

### Stop Services
```bash
docker compose -f docker-compose-production.yml down
```

### Restart a Service
```bash
docker compose -f docker-compose-production.yml restart backend
docker compose -f docker-compose-production.yml restart frontend
docker compose -f docker-compose-production.yml restart nginx
```

### View Logs
```bash
# All services
docker compose -f docker-compose-production.yml logs -f

# Specific service
docker compose -f docker-compose-production.yml logs -f backend
```

### Rebuild After Code Changes
```bash
docker compose -f docker-compose-production.yml up -d --build
```

## Architecture

```
Internet
   ↓
EC2 Instance (Port 80/443)
   ↓
Nginx (Reverse Proxy)
   ├──→ Backend (Port 5000, internal)
   ├──→ Frontend (Port 3000, internal)
   └──→ Redis (Port 6379, internal)
```

## Security Considerations

1. **Environment Variables:**
   - Never commit `.env.production` to version control
   - Use strong, unique secrets for production
   - Rotate credentials regularly

2. **Firewall:**
   - Only expose ports 80, 443, and 22
   - Backend and frontend are not directly accessible from outside

3. **SSL/TLS:**
   - Always use HTTPS in production
   - Keep certificates updated (auto-renewal configured)

4. **Docker:**
   - Run containers as non-root users (already configured)
   - Keep Docker and images updated
   - Use specific image tags instead of `latest`

## Monitoring

### Health Checks
- Backend: `https://your-domain.com/health`
- Frontend: `https://your-domain.com`
- Nginx: Built-in health check

### Logs Location
- Backend logs: `./servers/logs/`
- Nginx logs: Docker volume `nginx_logs`

### Resource Monitoring
```bash
# Container stats
docker stats

# Disk usage
docker system df
```

## Troubleshooting

### Services Not Starting
```bash
# Check logs
docker compose -f docker-compose-production.yml logs

# Check container status
docker compose -f docker-compose-production.yml ps
```

### SSL Certificate Issues
```bash
# Verify certificate
sudo certbot certificates

# Renew manually
sudo certbot renew
```

### Port Conflicts
```bash
# Check what's using ports
sudo netstat -tulpn | grep :80
sudo netstat -tulpn | grep :443
```

### Nginx Configuration Errors
```bash
# Test nginx config
docker compose -f docker-compose-production.yml exec nginx nginx -t

# Reload nginx
docker compose -f docker-compose-production.yml exec nginx nginx -s reload
```

## Backup

### Redis Data
```bash
# Backup Redis data
docker compose -f docker-compose-production.yml exec redis redis-cli SAVE
docker cp redis-production:/data/dump.rdb ./backup/
```

### Application Logs
```bash
# Backup logs
tar -czf logs-backup-$(date +%Y%m%d).tar.gz servers/logs/
```

## Updates and Maintenance

### Update Application
```bash
# Pull latest code
git pull

# Rebuild and restart
docker compose -f docker-compose-production.yml up -d --build
```

### Update Dependencies
```bash
# Rebuild specific service
docker compose -f docker-compose-production.yml build --no-cache backend
docker compose -f docker-compose-production.yml up -d backend
```

## Support

For issues or questions, check:
- Application logs: `docker compose -f docker-compose-production.yml logs`
- Nginx logs: `docker compose -f docker-compose-production.yml logs nginx`
- System logs: `journalctl -u docker`

