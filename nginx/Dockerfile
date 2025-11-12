FROM nginx:alpine

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy entrypoint script
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Create directories for SSL certificates and certbot
RUN mkdir -p /etc/letsencrypt/live/freelance-it.site && \
    mkdir -p /var/www/certbot && \
    mkdir -p /var/log/nginx

# Expose ports
EXPOSE 80 443

# Use entrypoint script
ENTRYPOINT ["/docker-entrypoint.sh"]

