#!/bin/bash

# Script to initialize SSL certificates for FreelanceIT App
# Run this script on EC2 before starting the docker-compose services

DOMAIN="freelance-it.site"
EMAIL="exe.chonccgroup@gmail.com"

echo "Initializing SSL certificates for $DOMAIN..."

# Make sure nginx is running (without SSL first)
echo "Starting nginx container for certificate generation..."
docker-compose -f ../docker-compose-production.yml up -d nginx

# Wait for nginx to be ready
sleep 5

# Request initial certificate
echo "Requesting SSL certificate from Let's Encrypt..."
docker run --rm \
  -v freelanceit-app_certbot_data:/etc/letsencrypt \
  -v freelanceit-app_certbot_www:/var/www/certbot \
  certbot/certbot certonly \
  --webroot \
  --webroot-path=/var/www/certbot \
  --email $EMAIL \
  --agree-tos \
  --no-eff-email \
  -d $DOMAIN \
  -d www.$DOMAIN

if [ $? -eq 0 ]; then
  echo "SSL certificate obtained successfully!"
  echo "Restarting nginx to load SSL configuration..."
  docker-compose -f ../docker-compose-production.yml restart nginx
else
  echo "Failed to obtain SSL certificate. Please check:"
  echo "1. Domain DNS is pointing to this server"
  echo "2. Ports 80 and 443 are open in security group"
  echo "3. Nginx is accessible on port 80"
fi

