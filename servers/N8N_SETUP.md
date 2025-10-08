# n8n Docker Setup Guide

This guide explains how to set up and configure n8n using Docker Compose for your FreelanceIT application. n8n is a powerful workflow automation tool that can help automate various tasks in your freelancing platform.

## Prerequisites

- Docker and Docker Compose installed
- Basic understanding of Docker containers
- Access to your server/development environment

## Configuration

### 1. Environment Variables

Add the following variables to your `.env` file:

```env
# n8n Configuration
N8N_ENCRYPTION_KEY=your-secure-encryption-key-here
N8N_BASIC_AUTH_USER=admin
N8N_BASIC_AUTH_PASSWORD=your-secure-password
WEBHOOK_URL=http://localhost:5678
N8N_HOST=localhost
```

### 2. Docker Compose Setup

The `docker-compose.yml` file includes:

- **n8n Service**: Main workflow automation service
- **Redis Service**: Caching and session storage
- **Persistent Volumes**: Data persistence across container restarts
- **Network**: Internal communication between services

## Installation and Usage

### 1. Start the Services

```bash
# Navigate to your servers directory
cd /home/tienthuan29/workspaces/projects/FreelanceIT-App/servers

# Start all services
docker-compose up -d

# Check service status
docker-compose ps
```

### 2. Access n8n

Once the services are running, you can access n8n at:
- **URL**: http://localhost:5678
- **Username**: admin (or your configured username)
- **Password**: admin123 (or your configured password)

### 3. Verify Installation

```bash
# Check if n8n is running
curl http://localhost:5678/healthz

# View logs
docker-compose logs n8n

# View Redis logs
docker-compose logs redis
```

## n8n Features for FreelanceIT

### 1. Workflow Automation

n8n can help automate various freelancing platform tasks:

- **Project Notifications**: Automatically notify developers when new projects match their skills
- **Application Processing**: Process and route project applications
- **Payment Reminders**: Send automated payment reminders
- **Report Generation**: Generate weekly/monthly reports
- **Email Campaigns**: Automated marketing emails

### 2. Integration Capabilities

n8n supports 400+ integrations including:

- **Email Services**: Gmail, Outlook, SendGrid
- **Communication**: Slack, Discord, Telegram
- **Project Management**: Trello, Asana, Jira
- **Payment**: Stripe, PayPal, Square
- **Database**: PostgreSQL, MongoDB, MySQL
- **APIs**: REST, GraphQL, Webhooks

### 3. Custom Workflows

Create custom workflows for your FreelanceIT platform:

#### Example: Project Application Workflow
```json
{
  "nodes": [
    {
      "name": "Webhook Trigger",
      "type": "n8n-nodes-base.webhook",
      "parameters": {
        "path": "project-application",
        "httpMethod": "POST"
      }
    },
    {
      "name": "Process Application",
      "type": "n8n-nodes-base.function",
      "parameters": {
        "functionCode": "// Process application data\nreturn items;"
      }
    },
    {
      "name": "Send Notification",
      "type": "n8n-nodes-base.emailSend",
      "parameters": {
        "toEmail": "{{ $json.clientEmail }}",
        "subject": "New Project Application",
        "message": "A developer has applied to your project"
      }
    }
  ]
}
```

## Advanced Configuration

### 1. Database Integration

To use PostgreSQL instead of SQLite:

```yaml
n8n:
  environment:
    - DB_TYPE=postgresdb
    - DB_POSTGRESDB_DATABASE=n8n
    - DB_POSTGRESDB_HOST=postgres
    - DB_POSTGRESDB_PORT=5432
    - DB_POSTGRESDB_USER=n8n
    - DB_POSTGRESDB_PASSWORD=n8n_password
    - DB_POSTGRESDB_SCHEMA=public
  depends_on:
    - postgres

postgres:
  image: postgres:15
  environment:
    - POSTGRES_DB=n8n
    - POSTGRES_USER=n8n
    - POSTGRES_PASSWORD=n8n_password
  volumes:
    - postgres_data:/var/lib/postgresql/data
```

### 2. Custom Domain Setup

For production deployment:

```yaml
n8n:
  environment:
    - WEBHOOK_URL=https://your-domain.com
    - N8N_HOST=your-domain.com
    - N8N_PROTOCOL=https
    - N8N_PORT=443
```

### 3. SSL/TLS Configuration

Add SSL support with reverse proxy:

```yaml
nginx:
  image: nginx:alpine
  ports:
    - "80:80"
    - "443:443"
  volumes:
    - ./nginx.conf:/etc/nginx/nginx.conf
    - ./ssl:/etc/nginx/ssl
  depends_on:
    - n8n
```

## Security Considerations

### 1. Authentication

- **Change Default Credentials**: Always change the default admin credentials
- **Use Strong Passwords**: Implement strong password policies
- **Enable 2FA**: Use two-factor authentication when available

### 2. Network Security

- **Firewall Rules**: Restrict access to n8n port (5678)
- **VPN Access**: Use VPN for remote access
- **IP Whitelisting**: Restrict access to specific IP addresses

### 3. Data Protection

- **Encryption**: Use strong encryption keys
- **Backup**: Regular backups of workflow data
- **Access Control**: Implement role-based access control

## Monitoring and Maintenance

### 1. Health Checks

```bash
# Check service health
docker-compose ps

# Monitor resource usage
docker stats

# View service logs
docker-compose logs -f n8n
```

### 2. Backup Strategy

```bash
# Backup n8n data
docker run --rm -v n8n_data:/data -v $(pwd):/backup alpine tar czf /backup/n8n-backup.tar.gz -C /data .

# Restore n8n data
docker run --rm -v n8n_data:/data -v $(pwd):/backup alpine tar xzf /backup/n8n-backup.tar.gz -C /data
```

### 3. Updates

```bash
# Update n8n to latest version
docker-compose pull n8n
docker-compose up -d n8n

# Update to specific version
docker-compose down
# Edit docker-compose.yml to specify version
docker-compose up -d
```

## Troubleshooting

### Common Issues

1. **Port Conflicts**
   ```bash
   # Check if port 5678 is in use
   netstat -tulpn | grep 5678
   
   # Change port in docker-compose.yml if needed
   ports:
     - "8080:5678"  # Use port 8080 instead
   ```

2. **Permission Issues**
   ```bash
   # Fix volume permissions
   sudo chown -R 1000:1000 ./n8n_data
   ```

3. **Memory Issues**
   ```bash
   # Increase Docker memory limit
   # In Docker Desktop: Settings > Resources > Memory
   ```

4. **Network Issues**
   ```bash
   # Check network connectivity
   docker network ls
   docker network inspect menv-network
   ```

### Debug Mode

Enable debug logging:

```yaml
n8n:
  environment:
    - N8N_LOG_LEVEL=debug
    - N8N_LOG_OUTPUT=console
```

## Integration with FreelanceIT

### 1. Webhook Endpoints

Create webhook endpoints in n8n to receive data from your FreelanceIT application:

```typescript
// In your FreelanceIT API
app.post('/webhook/n8n/project-created', async (req, res) => {
  const projectData = req.body;
  
  // Send to n8n webhook
  await fetch('http://localhost:5678/webhook/project-created', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(projectData)
  });
  
  res.json({ success: true });
});
```

### 2. API Integration

Use n8n's HTTP Request node to call your FreelanceIT API:

```json
{
  "name": "Get Projects",
  "type": "n8n-nodes-base.httpRequest",
  "parameters": {
    "url": "http://your-freelanceit-api.com/api/projects",
    "method": "GET",
    "headers": {
      "Authorization": "Bearer your-api-token"
    }
  }
}
```

### 3. Database Operations

Connect n8n to your database for automated data processing:

```json
{
  "name": "Update Project Status",
  "type": "n8n-nodes-base.postgres",
  "parameters": {
    "operation": "update",
    "table": "projects",
    "updateKey": "id",
    "columns": "status",
    "values": "completed"
  }
}
```

## Best Practices

1. **Workflow Design**
   - Keep workflows simple and focused
   - Use error handling nodes
   - Test workflows thoroughly
   - Document workflow purposes

2. **Performance**
   - Use batch processing for large datasets
   - Implement rate limiting
   - Monitor resource usage
   - Optimize database queries

3. **Maintenance**
   - Regular backups
   - Monitor logs
   - Update regularly
   - Clean up old executions

The n8n service is now integrated into your Docker Compose setup and ready to automate workflows for your FreelanceIT platform! 🚀

## Quick Start Commands

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# Restart n8n only
docker-compose restart n8n

# View logs
docker-compose logs -f n8n

# Access n8n
open http://localhost:5678
```
