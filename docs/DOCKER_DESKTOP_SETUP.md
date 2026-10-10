# AEGENTIS Docker Desktop Setup Guide

Complete guide for deploying AEGENTIS_WORKSPACE via Docker Desktop on Windows.

## Prerequisites

### System Requirements
- **OS**: Windows 10/11 Pro, Enterprise, or Education (with Hyper-V)
- **RAM**: Minimum 8GB (16GB recommended)
- **Disk Space**: 50GB free space
- **CPU**: Intel VT-x or AMD-V virtualization support enabled

### Required Software
1. **Docker Desktop for Windows** (latest version)
   - Download: https://www.docker.com/products/docker-desktop
   - Enable WSL2 backend during installation
   - Enable Hyper-V

2. **PowerShell 7+** (for deployment scripts)
   ```powershell
   winget install Microsoft.PowerShell
   ```

3. **Git for Windows**
   ```powershell
   winget install Git.Git
   ```

## Installation Steps

### 1. Install Docker Desktop

```powershell
# Download and install Docker Desktop
Invoke-WebRequest -Uri "https://desktop.docker.com/win/stable/Docker%20Desktop%20Installer.exe" -OutFile "$env:TEMP\DockerInstaller.exe"
& "$env:TEMP\DockerInstaller.exe" install --quiet

# Wait for installation
Start-Sleep -Seconds 60

# Verify installation
docker --version
docker-compose --version
```

### 2. Configure Docker Desktop

**Settings → General:**
- ✓ Start Docker Desktop when you log in
- ✓ Use the WSL2 based engine

**Settings → Resources:**
- CPUs: 4-8 (depending on your system)
- Memory: 8-16 GB
- Swap: 2-4 GB
- Disk image size: 100 GB

**Settings → Docker Engine:**
```json
{
  "registry-mirrors": [],
  "insecure-registries": [],
  "debug": false,
  "experimental": false,
  "features": {
    "buildkit": true
  }
}
```

### 3. Clone AEGENTIS Workspace

```powershell
cd C:\
git clone <AEGENTIS_WORKSPACE_REPO> AEGENTIS_WORKSPACE
cd AEGENTIS_WORKSPACE
```

### 4. Configure Environment

Create `.env` file in `C:\AEGENTIS_WORKSPACE`:

```env
# Environment
NODE_ENV=development
ENVIRONMENT=dev

# Database
DATABASE_URL=postgresql://aegentis:password@postgres:5432/aegentis
POSTGRES_USER=aegentis
POSTGRES_PASSWORD=password
POSTGRES_DB=aegentis

# Redis
REDIS_URL=redis://redis:6379

# Services
KERNEL_HOST=aegentis-kernel:8000
DAEMON_HOST=aegentis-daemon:9000
RUNTIME_HOST=aegentis-runtime:7000
SOVEREIGN_HOST=sovereign-prime:3000
REGISTRY_HOST=nexus-registry:8081

# Observability
PROMETHEUS_URL=http://prometheus:9090
GRAFANA_URL=http://grafana:3000
JAEGER_URL=http://jaeger:16686

# API Gateway
API_GATEWAY_PORT=80
API_GATEWAY_SECURE_PORT=443
```

## Deployment

### Full Deployment (Build + Start)

```powershell
# Navigate to workspace
cd C:\AEGENTIS_WORKSPACE

# Run full deployment
.\Deploy-AEGENTIS-Docker.ps1 -Full

# Or run step by step
.\Deploy-AEGENTIS-Docker.ps1 -BuildImages
.\Deploy-AEGENTIS-Docker.ps1 -UpServices
.\Deploy-AEGENTIS-Docker.ps1 -Health
```

### Build Docker Images

```powershell
# Build all component images
.\Deploy-AEGENTIS-Docker.ps1 -BuildImages

# Or manually
docker-compose -f docker-compose.aegentis-workspace.yml build

# Or build specific component
docker build -t aegentis/kernel:latest -f kernel/Dockerfile kernel/
```

### Start Services

```powershell
# Start all services
.\Deploy-AEGENTIS-Docker.ps1 -UpServices

# Or manually
docker-compose -f docker-compose.aegentis-workspace.yml up -d

# View startup logs
docker-compose -f docker-compose.aegentis-workspace.yml logs -f
```

### Stop Services

```powershell
# Stop all services
.\Deploy-AEGENTIS-Docker.ps1 -DownServices

# Or manually
docker-compose -f docker-compose.aegentis-workspace.yml down

# Stop and remove volumes (WARNING: deletes data)
docker-compose -f docker-compose.aegentis-workspace.yml down -v
```

## Service Access

Once deployed, services are available at:

| Service | URL | Port |
|---------|-----|------|
| API Gateway | http://localhost | 80 |
| Sovereign Prime | http://localhost:3000 | 3000 |
| Sovereign | http://localhost:3100 | 3100 |
| Kernel | http://localhost:8000 | 8000 |
| Daemon | http://localhost:9000 | 9000 |
| Runtime | http://localhost:7000 | 7000 |
| Eagle Shield VR | http://localhost:5000 | 5000 |
| Medical Recruiting | http://localhost:4000 | 4000 |
| Patent Treasury | http://localhost:6000 | 6000 |
| Observability | http://localhost:9090 | 9090 |
| Grafana | http://localhost:3050 | 3050 |
| Prometheus | http://localhost:9091 | 9091 |
| Jaeger | http://localhost:16686 | 16686 |
| Nexus Registry | http://localhost:8081 | 8081 |
| PostgreSQL | localhost:5432 | 5432 |
| Redis | localhost:6379 | 6379 |

## Health Checks

### Automated Health Check

```powershell
# Run health checks
.\Deploy-AEGENTIS-Docker.ps1 -Health

# Results saved to health-check.json
Get-Content health-check.json | ConvertFrom-Json | Format-Table
```

### Manual Health Checks

```powershell
# Check all containers
docker ps

# Check specific container
docker ps -f name=aegentis-kernel

# View container logs
docker logs aegentis-kernel
docker logs -f aegentis-kernel

# Inspect container
docker inspect aegentis-kernel

# Check container stats
docker stats aegentis-kernel

# Test service endpoint
Invoke-WebRequest -Uri "http://localhost:8000/health"
```

## Monitoring & Observability

### Grafana Dashboard
1. Navigate to http://localhost:3050
2. Login with credentials: admin / admin
3. Add Prometheus data source: http://prometheus:9090
4. Import dashboards or create custom ones

### Prometheus Metrics
- Access at http://localhost:9091
- Query metrics at http://localhost:9091/api/v1/query

### Jaeger Tracing
- Access at http://localhost:16686
- View distributed traces across services

### Logs Aggregation
```powershell
# View all service logs
docker-compose -f docker-compose.aegentis-workspace.yml logs

# View specific service logs
docker-compose -f docker-compose.aegentis-workspace.yml logs sovereign-prime

# Follow logs in real-time
docker-compose -f docker-compose.aegentis-workspace.yml logs -f

# View last 100 lines
docker-compose -f docker-compose.aegentis-workspace.yml logs --tail=100
```

## Troubleshooting

### Docker Desktop Won't Start
```powershell
# Restart Docker service
Restart-Service -Name "Docker"

# Or restart Docker Desktop
Stop-Process -Name "Docker Desktop" -Force
Start-Process "C:\Program Files\Docker\Docker\Docker Desktop.exe"
```

### Port Already in Use
```powershell
# Find process using port
netstat -ano | findstr :3000

# Kill process
Stop-Process -Id <PID> -Force

# Or change port in docker-compose.yml
# Change "3000:3000" to "3001:3000"
```

### Out of Disk Space
```powershell
# Prune unused images
docker image prune -a

# Prune unused volumes
docker volume prune

# Prune unused networks
docker network prune

# Full cleanup
docker system prune -a --volumes
```

### Service Won't Start
```powershell
# Check logs
docker logs <container-name>

# Inspect container
docker inspect <container-name>

# Restart container
docker restart <container-name>

# Rebuild image
docker build -t <image-name> --no-cache .
```

### Database Connection Issues
```powershell
# Check PostgreSQL container
docker exec aegentis-postgres psql -U aegentis -d aegentis -c "SELECT 1"

# Check Redis connection
docker exec aegentis-redis redis-cli ping

# View database logs
docker logs aegentis-postgres
```

## Performance Optimization

### Increase Docker Resources
```powershell
# Edit Docker Desktop settings
# Settings → Resources → Increase CPUs and Memory
```

### Enable BuildKit
```powershell
# In Docker Desktop settings → Docker Engine
# Add: "features": { "buildkit": true }

# Or via environment variable
$env:DOCKER_BUILDKIT = 1
```

### Use .dockerignore
Create `.dockerignore` to exclude unnecessary files:
```
node_modules
npm-debug.log
.git
.gitignore
README.md
.env
.DS_Store
```

## Backup & Recovery

### Backup Data Volumes
```powershell
# Backup PostgreSQL
docker exec aegentis-postgres pg_dump -U aegentis aegentis > backup.sql

# Backup Redis
docker exec aegentis-redis redis-cli BGSAVE
docker cp aegentis-redis:/data/dump.rdb ./redis-backup.rdb

# Backup all volumes
docker run --rm -v aegentis_postgres-data:/data -v C:\backups:/backup alpine tar czf /backup/postgres-backup.tar.gz /data
```

### Restore Data Volumes
```powershell
# Restore PostgreSQL
docker exec -i aegentis-postgres psql -U aegentis aegentis < backup.sql

# Restore Redis
docker cp ./redis-backup.rdb aegentis-redis:/data/dump.rdb
docker exec aegentis-redis redis-cli BGSAVE
```

## Advanced Configuration

### Custom Docker Network
```powershell
# Create custom network
docker network create aegentis-network

# Connect container to network
docker network connect aegentis-network <container-name>
```

### Volume Management
```powershell
# List volumes
docker volume ls

# Inspect volume
docker volume inspect <volume-name>

# Remove volume
docker volume rm <volume-name>
```

### Environment-Specific Compose Files
```powershell
# Development
docker-compose -f docker-compose.dev.yml up

# Staging
docker-compose -f docker-compose.staging.yml up

# Production
docker-compose -f docker-compose.prod.yml up
```

## Next Steps

1. **Access Dashboards**: Navigate to http://localhost:3050 (Grafana)
2. **Monitor Services**: Check Prometheus at http://localhost:9091
3. **View Traces**: Access Jaeger at http://localhost:16686
4. **Deploy Applications**: Use Nexus Registry at http://localhost:8081
5. **Configure Alerts**: Set up alerting in Grafana

## Support & Documentation

- Docker Documentation: https://docs.docker.com/
- Docker Compose Reference: https://docs.docker.com/compose/
- AEGENTIS Documentation: See docs/ directory
- Troubleshooting: See logs/ directory

## Security Considerations

⚠️ **WARNING**: This setup is for development only. For production:

1. Change default passwords
2. Enable authentication
3. Use TLS/mTLS for all services
4. Implement network policies
5. Use secrets management
6. Enable audit logging
7. Regular security updates
8. Network segmentation

See `SECURITY_HARDENING.md` for production deployment guidelines.
