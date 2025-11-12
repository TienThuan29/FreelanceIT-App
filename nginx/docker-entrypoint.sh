#!/bin/sh
set -e

# Copy the mounted config to a writable location
cp /etc/nginx/nginx.conf /etc/nginx/nginx-working.conf

# Check if SSL certificates exist
if [ ! -f "/etc/letsencrypt/live/freelance-it.site/fullchain.pem" ] || \
   [ ! -f "/etc/letsencrypt/live/freelance-it.site/privkey.pem" ]; then
    echo "SSL certificates not found. Starting nginx in HTTP-only mode..."
    echo "Please obtain SSL certificates using certbot, then restart nginx."
    
    # Create a temporary HTTP-only config
    cat > /etc/nginx/nginx-working.conf << 'EOF'
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log warn;
pid /var/run/nginx.pid;

events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;
    
    access_log /var/log/nginx/access.log;
    
    sendfile on;
    tcp_nopush on;
    keepalive_timeout 65;
    client_max_body_size 50M;
    
    upstream backend {
        server backend:5000;
    }
    
    upstream frontend {
        server frontend:3000;
    }
    
    # HTTP Server (temporary - for certificate generation)
    server {
        listen 80;
        server_name freelance-it.site www.freelance-it.site;
        
        # Let's Encrypt challenge
        location /.well-known/acme-challenge/ {
            root /var/www/certbot;
        }
        
        # API Routes
        location /api/ {
            proxy_pass http://backend;
            proxy_http_version 1.1;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
        
        # Socket.IO
        location /socket.io/ {
            proxy_pass http://backend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
            proxy_set_header Host $host;
        }
        
        # Frontend
        location / {
            proxy_pass http://frontend;
            proxy_http_version 1.1;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}
EOF
    
    # Use temporary config (already written to nginx-working.conf)
else
    echo "SSL certificates found. Using full SSL configuration."
    # Use the original config (already copied to nginx-working.conf)
fi

# Test nginx configuration with working config
nginx -t -c /etc/nginx/nginx-working.conf

# Start nginx with working config
exec nginx -g "daemon off;" -c /etc/nginx/nginx-working.conf

