# Sovereign System - One-Click Deployment Guide

**Version:** 1.0.0  
**Target:** Manusspace (Manus Cloud Infrastructure)  
**Status:** Production-Ready

---

## 🚀 Quick Start - Local Development

### Prerequisites
- Docker & Docker Compose (v2.0+)
- Git
- 8GB RAM minimum
- 20GB disk space

### One-Command Startup

```bash
# Clone the repository
git clone https://github.com/shalominattii-us/Sovereign-System.git
cd Sovereign-System/sovereign-system-portal

# Start entire stack
docker-compose up -d

# Verify all services are running
docker-compose ps

# View logs
docker-compose logs -f
```

### Access Points

| Service | URL | Credentials |
|---------|-----|-------------|
| **Portal** | http://localhost:5173 | - |
| **Kernel API** | http://localhost:9999 | - |
| **Grafana** | http://localhost:3000 | admin/admin |
| **Kibana** | http://localhost:5601 | - |
| **Prometheus** | http://localhost:9090 | - |
| **PostgreSQL** | localhost:5432 | sovereign/sovereign_pass |
| **Redis** | localhost:6379 | - |
| **SpiderFoot** | http://localhost:5001 | - |
| **PhoneInfoga** | http://localhost:8080 | - |

---

## 🛑 Stop Services

```bash
# Stop all services
docker-compose down

# Stop and remove volumes (WARNING: deletes data)
docker-compose down -v
```

---

## 📊 Health Checks

```bash
# Check all services
docker-compose ps

# Check specific service logs
docker-compose logs sovereign-kernel
docker-compose logs portal

# Test Portal health
curl http://localhost:5173

# Test Kernel health
curl http://localhost:9999/health

# Test Database
docker-compose exec postgres pg_isready -U sovereign

# Test Redis
docker-compose exec redis redis-cli ping
```

---

## 🔧 Configuration

### Environment Variables

Create `.env` file in project root:

```env
# Database
DATABASE_URL=postgresql://sovereign:sovereign_pass@postgres:5432/sovereign

# Redis
REDIS_URL=redis://redis:6379/0

# Portal
VITE_API_URL=http://localhost:9999
VITE_APP_TITLE=Sovereign System Portal

# Kernel
LOG_LEVEL=INFO
ENVIRONMENT=development
```

### Modify Docker Compose

Edit `docker-compose.yml` to:
- Change port mappings
- Adjust resource limits
- Add/remove services
- Configure volumes

---

## 📈 Scaling

### Add More Replicas

```bash
# Scale kernel service to 3 replicas
docker-compose up -d --scale sovereign-kernel=3

# Scale portal to 2 replicas
docker-compose up -d --scale portal=2
```

### Resource Limits

Edit `docker-compose.yml`:

```yaml
services:
  sovereign-kernel:
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G
        reservations:
          cpus: '1'
          memory: 1G
```

---

## 🔍 Monitoring

### View Metrics

1. Open Grafana: http://localhost:3000
2. Login: admin/admin
3. Add Prometheus data source: http://prometheus:9090
4. Create dashboards

### View Logs

1. Open Kibana: http://localhost:5601
2. Create index pattern: `logs-*`
3. View logs in Discover

### Real-Time Logs

```bash
# Follow all logs
docker-compose logs -f

# Follow specific service
docker-compose logs -f sovereign-kernel

# Last 100 lines
docker-compose logs --tail=100
```

---

## 🐛 Troubleshooting

### Service Won't Start

```bash
# Check logs
docker-compose logs <service-name>

# Rebuild image
docker-compose build --no-cache <service-name>

# Restart service
docker-compose restart <service-name>
```

### Port Already in Use

```bash
# Find what's using the port
lsof -i :5173

# Change port in docker-compose.yml
# Or kill the process
kill -9 <PID>
```

### Database Connection Issues

```bash
# Check database is running
docker-compose exec postgres pg_isready -U sovereign

# Check database exists
docker-compose exec postgres psql -U sovereign -l

# View database logs
docker-compose logs postgres
```

### Out of Disk Space

```bash
# Clean up Docker
docker system prune -a

# Remove unused volumes
docker volume prune

# Check disk usage
docker system df
```

---

## 🚀 Production Deployment

### Deploy to Kubernetes

```bash
# Build images
docker build -f Dockerfile.portal -t sovereign-portal:1.0.0 .
docker build -f sovereign-backend/Dockerfile -t sovereign-kernel:1.0.0 ./sovereign-backend

# Push to registry
docker push sovereign-portal:1.0.0
docker push sovereign-kernel:1.0.0

# Deploy to Kubernetes
kubectl apply -f k8s/production/
```

### Deploy with Terraform

```bash
# Initialize Terraform
cd terraform/production
terraform init

# Plan deployment
terraform plan -var-file=production.tfvars

# Apply deployment
terraform apply -var-file=production.tfvars
```

### Deploy to Manusspace

```bash
# Using Manus CLI
manus deploy --manifest SOVEREIGN-MANIFEST.json

# Or using GitHub Actions (automatic on push to main)
git push origin main
# Watch deployment at: https://github.com/shalominattii-us/Sovereign-System/actions
```

---

## 📋 Deployment Checklist

- [ ] All services running (`docker-compose ps`)
- [ ] Portal accessible (http://localhost:5173)
- [ ] Kernel API responding (http://localhost:9999/health)
- [ ] Database initialized (check PostgreSQL)
- [ ] Redis cache working (redis-cli ping)
- [ ] Monitoring active (Prometheus, Grafana)
- [ ] Logs aggregating (Kibana)
- [ ] OSINT services running (SpiderFoot, PhoneInfoga)

---

## 🔐 Security Notes

### Development Only
- Default credentials (admin/admin)
- No authentication enabled
- Insecure environment variables

### Before Production
- [ ] Change all default passwords
- [ ] Enable authentication
- [ ] Use secrets management (Vault, AWS Secrets Manager)
- [ ] Configure network policies
- [ ] Enable SSL/TLS
- [ ] Set up firewall rules
- [ ] Enable audit logging

---

## 📚 Additional Resources

- [Full Deployment Architecture](./DEPLOYMENT_ARCHITECTURE.md)
- [Docker Compose Reference](./docs/docker-compose.md)
- [Kubernetes Deployment](./docs/kubernetes.md)
- [Terraform Configuration](./docs/terraform.md)
- [API Integration Guide](./docs/api-integration.md)
- [Monitoring & Logging](./docs/monitoring.md)

---

## 🆘 Support

### Get Help

```bash
# View service logs
docker-compose logs <service-name>

# Check service status
docker-compose ps

# Inspect running container
docker-compose exec <service-name> sh

# Check network connectivity
docker-compose exec <service-name> ping <other-service>
```

### Common Issues

**Q: Portal won't connect to Kernel**
- A: Check `VITE_API_URL` environment variable
- A: Verify kernel is running: `docker-compose ps sovereign-kernel`
- A: Check network: `docker-compose exec portal ping sovereign-kernel`

**Q: Database migration failed**
- A: Check logs: `docker-compose logs postgres`
- A: Verify database exists: `docker-compose exec postgres psql -U sovereign -l`
- A: Reinitialize: `docker-compose down -v && docker-compose up`

**Q: Out of memory errors**
- A: Increase Docker memory allocation
- A: Scale down replicas
- A: Check memory usage: `docker stats`

---

**Status:** 🟢 **READY FOR PRODUCTION**

For questions, open an issue on GitHub or contact the DevOps team.
