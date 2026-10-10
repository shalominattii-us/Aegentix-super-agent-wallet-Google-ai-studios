# Docker Deployment Guide - Sovereign System Portal

## Quick Start

### 1. Prerequisites

- Docker & Docker Compose installed
- Meta Developer Account with **SovereignAE** app created
- Environment variables configured (see Section 2)

### 2. Environment Configuration

Create a `.env` file in the project root with the following variables:

```env
# Database
DATABASE_URL=mysql://sovereign:sovereignpass@mysql:3306/sovereign_portal
MYSQL_ROOT_PASSWORD=sovereignroot
MYSQL_USER=sovereign
MYSQL_PASSWORD=sovereignpass
MYSQL_DATABASE=sovereign_portal

# Auth & Security
JWT_SECRET=<generate-with-openssl-rand-base64-32>
VITE_APP_ID=<your-manus-app-id>
OAUTH_SERVER_URL=https://oauth.manus.im
VITE_OAUTH_PORTAL_URL=https://login.manus.im

# Owner
OWNER_OPEN_ID=<your-owner-id>
OWNER_NAME=Sovereign System

# Manus APIs
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=<your-forge-api-key>
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im
VITE_FRONTEND_FORGE_API_KEY=<your-frontend-api-key>

# VR & AEGENTIS
AEGENTIS_ENDPOINT=http://aegentis:8001
OLLAMA_ENDPOINT=http://ollama:11434
OLLAMA_MODEL=smollm

# Meta Horizon
META_APP_ID=SovereignAE
META_QUEST_BRIDGE_ENABLED=true
META_VISION_PRO_BRIDGE_ENABLED=true

# Observability
LOG_LEVEL=info
TRACE_ENABLED=true
METRICS_PORT=3001

# Grafana
GRAFANA_PASSWORD=<secure-password>
```

### 3. Generate JWT Secret

```bash
openssl rand -base64 32
```

Copy the output and paste it as `JWT_SECRET` in `.env`.

### 4. Build Docker Images

```bash
# Build Portal backend
docker build -t sovereign-portal:latest .

# Build AEGENTIS backend
docker build -t sovereign-aegentis:latest -f Dockerfile.aegentis .
```

### 5. Deploy Services

```bash
# Start all services
docker-compose -f docker-compose.meta-horizon.yml up -d

# Verify services are running
docker-compose -f docker-compose.meta-horizon.yml ps
```

### 6. Verify Deployment

```bash
# Check Portal health
curl http://localhost:3000/api/health

# Check AEGENTIS health
curl http://localhost:8001/health

# Check Ollama
curl http://localhost:11434/api/tags

# Check Redis
docker-compose -f docker-compose.meta-horizon.yml exec redis redis-cli ping

# View logs
docker-compose -f docker-compose.meta-horizon.yml logs -f portal-backend
```

---

## Service Endpoints

| Service | Port | URL |
|---------|------|-----|
| Portal Backend | 3000 | `http://localhost:3000` |
| Metrics | 3001 | `http://localhost:3001` |
| MySQL | 3306 | `mysql://localhost:3306` |
| AEGENTIS | 8001 | `http://localhost:8001` |
| Ollama | 11434 | `http://localhost:11434` |
| Redis | 6379 | `redis://localhost:6379` |
| Prometheus | 9090 | `http://localhost:9090` |
| Grafana | 3002 | `http://localhost:3002` |

---

## Database Setup

### Initialize Database

```bash
# Run migrations
docker-compose -f docker-compose.meta-horizon.yml exec portal-backend npm run db:push
```

### Connect to MySQL

```bash
# Access MySQL CLI
docker-compose -f docker-compose.meta-horizon.yml exec mysql mysql -u sovereign -p

# Enter password: sovereignpass

# List databases
SHOW DATABASES;

# Use sovereign_portal database
USE sovereign_portal;

# List tables
SHOW TABLES;
```

---

## Monitoring & Observability

### Grafana Dashboard

1. Navigate to `http://localhost:3002`
2. Login with:
   - Username: `admin`
   - Password: (from `GRAFANA_PASSWORD` env var)
3. Add Prometheus data source: `http://prometheus:9090`
4. Import dashboards from `monitoring/grafana/provisioning/dashboards/`

### Prometheus Metrics

- Navigate to `http://localhost:9090`
- Query metrics: `portal_requests_total`, `aegentis_commands_executed`, etc.

### View Logs

```bash
# Portal backend logs
docker-compose -f docker-compose.meta-horizon.yml logs -f portal-backend

# AEGENTIS logs
docker-compose -f docker-compose.meta-horizon.yml logs -f aegentis

# Ollama logs
docker-compose -f docker-compose.meta-horizon.yml logs -f ollama

# All services
docker-compose -f docker-compose.meta-horizon.yml logs -f
```

---

## Common Operations

### Restart Services

```bash
# Restart specific service
docker-compose -f docker-compose.meta-horizon.yml restart portal-backend

# Restart all services
docker-compose -f docker-compose.meta-horizon.yml restart
```

### Stop Services

```bash
# Stop all services (keep data)
docker-compose -f docker-compose.meta-horizon.yml down

# Stop and remove volumes (WARNING: deletes data)
docker-compose -f docker-compose.meta-horizon.yml down -v
```

### Update Configuration

```bash
# Edit .env file
nano .env

# Restart services to apply changes
docker-compose -f docker-compose.meta-horizon.yml restart portal-backend
```

### View Resource Usage

```bash
# Check container stats
docker stats

# Check disk usage
docker system df
```

---

## Troubleshooting

### Portal Backend Won't Start

```bash
# Check logs
docker-compose -f docker-compose.meta-horizon.yml logs portal-backend

# Common issues:
# 1. Database not ready - wait 30 seconds and retry
# 2. Port 3000 already in use - change PORT in docker-compose.yml
# 3. Missing environment variables - verify .env file
```

### Database Connection Failed

```bash
# Verify MySQL is running
docker-compose -f docker-compose.meta-horizon.yml ps mysql

# Check MySQL logs
docker-compose -f docker-compose.meta-horizon.yml logs mysql

# Test connection
docker-compose -f docker-compose.meta-horizon.yml exec mysql mysql -u sovereign -p -e "SELECT 1"
```

### AEGENTIS Not Responding

```bash
# Check AEGENTIS logs
docker-compose -f docker-compose.meta-horizon.yml logs aegentis

# Verify Ollama is running
docker-compose -f docker-compose.meta-horizon.yml exec ollama curl http://localhost:11434/api/tags

# Restart AEGENTIS
docker-compose -f docker-compose.meta-horizon.yml restart aegentis
```

### Out of Disk Space

```bash
# Clean up unused images
docker image prune -a

# Clean up unused volumes
docker volume prune

# Clean up unused networks
docker network prune

# Full cleanup
docker system prune -a
```

---

## Production Deployment

### Cloud Deployment (AWS Example)

```bash
# 1. Create ECR repository
aws ecr create-repository --repository-name sovereign-portal

# 2. Login to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com

# 3. Tag and push images
docker tag sovereign-portal:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/sovereign-portal:latest
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/sovereign-portal:latest

# 4. Deploy to ECS/EKS
# Use AWS CloudFormation or Terraform to deploy
```

### Environment-Specific Configuration

#### Development

```env
NODE_ENV=development
LOG_LEVEL=debug
TRACE_ENABLED=true
```

#### Staging

```env
NODE_ENV=staging
LOG_LEVEL=info
TRACE_ENABLED=true
```

#### Production

```env
NODE_ENV=production
LOG_LEVEL=warn
TRACE_ENABLED=false
```

---

## Scaling Configuration

### Horizontal Scaling (Multiple Instances)

```yaml
services:
  portal-backend:
    deploy:
      replicas: 3
      resources:
        limits:
          cpus: '2'
          memory: 4G
```

### Load Balancing

Use Nginx or HAProxy to distribute traffic:

```nginx
upstream portal {
    server portal-backend-1:3000;
    server portal-backend-2:3000;
    server portal-backend-3:3000;
}

server {
    listen 80;
    location / {
        proxy_pass http://portal;
    }
}
```

---

## Backup & Recovery

### Database Backup

```bash
# Backup MySQL database
docker-compose -f docker-compose.meta-horizon.yml exec mysql mysqldump -u sovereign -p sovereign_portal > backup.sql

# Restore from backup
docker-compose -f docker-compose.meta-horizon.yml exec -T mysql mysql -u sovereign -p sovereign_portal < backup.sql
```

### Volume Backup

```bash
# Backup volumes
docker run --rm -v sovereign-system-portal_mysql-data:/data -v $(pwd):/backup alpine tar czf /backup/mysql-backup.tar.gz /data

# Restore volumes
docker run --rm -v sovereign-system-portal_mysql-data:/data -v $(pwd):/backup alpine tar xzf /backup/mysql-backup.tar.gz -C /
```

---

## Security Best Practices

1. **Use strong passwords**: Generate with `openssl rand -base64 32`
2. **Rotate secrets regularly**: Update API keys and tokens
3. **Enable SSL/TLS**: Use certificates for production
4. **Restrict network access**: Use firewall rules and security groups
5. **Monitor logs**: Set up log aggregation and alerting
6. **Regular backups**: Automate database backups
7. **Keep images updated**: Regularly rebuild with latest dependencies

---

## Support

For issues or questions:
1. Check logs: `docker-compose -f docker-compose.meta-horizon.yml logs`
2. Review troubleshooting section
3. Consult documentation:
   - `META_HORIZON_INTEGRATION.md`
   - `AEGENTIS_INTEGRATION_GUIDE.md`
   - `PORTAL_EXPORT_CONFIG.md`

---

**Deployment Complete!** 🚀

Your Sovereign System Portal is now ready for Meta Horizon deployment.
