# AEGENTIS-X Windows Deployment Guide

Complete guide for deploying AEGENTIS-X to Windows with PRIME Kernel integration.

## Prerequisites

### System Requirements
- **OS**: Windows 10/11 Pro, Enterprise, or Education
- **RAM**: 16GB minimum (32GB recommended)
- **Disk Space**: 100GB free
- **CPU**: Intel VT-x or AMD-V virtualization

### Required Software
1. **Docker Desktop for Windows** (latest)
2. **PowerShell 7+**
3. **Git for Windows**
4. **PRIME Kernel** (pre-installed at `C:\Sovereign\AEGENTIS-X\prime-os\kernel`)

## Installation

### 1. Prepare AEGENTIS-X Directory

```powershell
# Create sovereign directory structure
New-Item -ItemType Directory -Path "C:\Sovereign\AEGENTIS-X" -Force
New-Item -ItemType Directory -Path "C:\Sovereign\AEGENTIS-X\prime-os\kernel" -Force
New-Item -ItemType Directory -Path "C:\Sovereign\AEGENTIS-X\logs" -Force
New-Item -ItemType Directory -Path "C:\Sovereign\AEGENTIS-X\data" -Force
New-Item -ItemType Directory -Path "C:\Sovereign\AEGENTIS-X\certs" -Force
```

### 2. Copy Deployment Files

```powershell
# Copy deployment scripts
Copy-Item -Path "Deploy-AEGENTIS-X-Windows.ps1" -Destination "C:\Sovereign\AEGENTIS-X\"
Copy-Item -Path "docker-compose.aegentis-workspace.yml" -Destination "C:\Sovereign\AEGENTIS-X\docker-compose.yml"
Copy-Item -Path "Dockerfile.workspace" -Destination "C:\Sovereign\AEGENTIS-X\"
```

### 3. Verify PRIME Kernel

```powershell
# Check PRIME Kernel installation
Test-Path "C:\Sovereign\AEGENTIS-X\prime-os\kernel\Invoke-PrimeKernel.ps1"

# Should return: True
```

## Deployment

### Full Deployment (Recommended)

```powershell
cd C:\Sovereign\AEGENTIS-X

# Run full deployment
.\Deploy-AEGENTIS-X-Windows.ps1 -Full

# Or with specific environment
.\Deploy-AEGENTIS-X-Windows.ps1 -Full -Environment prod
```

### Step-by-Step Deployment

```powershell
# 1. Setup environment only
.\Deploy-AEGENTIS-X-Windows.ps1

# 2. Integrate PRIME Kernel
.\Deploy-AEGENTIS-X-Windows.ps1 -IntegratePRIME

# 3. Deploy Docker services
.\Deploy-AEGENTIS-X-Windows.ps1 -DeployDocker

# 4. Run health checks
.\Deploy-AEGENTIS-X-Windows.ps1 -Full
```

## PRIME Kernel Integration

### Automatic Integration

The deployment script automatically:
1. Detects PRIME Kernel at `C:\Sovereign\AEGENTIS-X\prime-os\kernel`
2. Invokes `Invoke-PrimeKernel.ps1` with `deploy_aegentis` intent
3. Establishes sealed epoch connection
4. Verifies authorization status

### Manual PRIME Kernel Invocation

```powershell
# Direct PRIME Kernel invocation
& "C:\Sovereign\AEGENTIS-X\prime-os\kernel\Invoke-PrimeKernel.ps1" -Intent deploy_aegentis

# Check PRIME Kernel status
& "C:\Sovereign\AEGENTIS-X\prime-os\kernel\Invoke-PrimeKernel.ps1" -Intent status_check

# Reconnect REPL
& "C:\Sovereign\AEGENTIS-X\prime-os\kernel\Invoke-PrimeKernel.ps1" -Intent repl_reconnect
```

## Service Access

Once deployed, access services at:

| Service | URL | Port | Purpose |
|---------|-----|------|---------|
| API Gateway | http://localhost | 80 | Main entry point |
| Sovereign Prime | http://localhost:3000 | 3000 | Core sovereign system |
| Sovereign | http://localhost:3100 | 3100 | Sovereign layer |
| Kernel | http://localhost:8000 | 8000 | AEGENTIS kernel |
| Daemon | http://localhost:9000 | 9000 | Daemon service |
| Runtime | http://localhost:7000 | 7000 | Runtime environment |
| Eagle Shield VR | http://localhost:5000 | 5000 | VR integration |
| Medical Recruiting | http://localhost:4000 | 4000 | Medical platform |
| Patent Treasury | http://localhost:6000 | 6000 | Patent system |
| Observability | http://localhost:9090 | 9090 | Observability hub |
| Grafana | http://localhost:3050 | 3050 | Dashboards |
| Prometheus | http://localhost:9091 | 9091 | Metrics |
| Jaeger | http://localhost:16686 | 16686 | Tracing |
| Nexus Registry | http://localhost:8081 | 8081 | Artifact registry |

## Monitoring

### Health Checks

```powershell
# Run health checks
.\Deploy-AEGENTIS-X-Windows.ps1 -Full

# View health status
Get-Content "C:\Sovereign\AEGENTIS-X\health-check.json" | ConvertFrom-Json | Format-Table
```

### View Logs

```powershell
# Deployment logs
Get-Content "C:\Sovereign\AEGENTIS-X\logs\deployment.log" -Tail 50

# Docker logs
docker-compose -f "C:\Sovereign\AEGENTIS-X\docker-compose.yml" logs -f

# Specific service logs
docker-compose -f "C:\Sovereign\AEGENTIS-X\docker-compose.yml" logs sovereign-prime
```

### Grafana Dashboard

1. Navigate to http://localhost:3050
2. Login: admin / admin
3. Add Prometheus data source: http://prometheus:9090
4. Create dashboards or import templates

## Troubleshooting

### Docker Desktop Won't Start

```powershell
# Restart Docker service
Restart-Service -Name "Docker"

# Or manually start Docker Desktop
Start-Process "C:\Program Files\Docker\Docker\Docker Desktop.exe"

# Wait for startup
Start-Sleep -Seconds 30
```

### PRIME Kernel Connection Failed

```powershell
# Check PRIME Kernel path
Test-Path "C:\Sovereign\AEGENTIS-X\prime-os\kernel\Invoke-PrimeKernel.ps1"

# Check PRIME Kernel logs
Get-Content "C:\Sovereign\AEGENTIS-X\prime-os\kernel\*.log" -Tail 50

# Manually invoke PRIME Kernel
& "C:\Sovereign\AEGENTIS-X\prime-os\kernel\Invoke-PrimeKernel.ps1" -Intent repl_reconnect
```

### Services Not Starting

```powershell
# Check Docker containers
docker ps -a

# View container logs
docker logs <container-name>

# Restart specific service
docker-compose -f "C:\Sovereign\AEGENTIS-X\docker-compose.yml" restart <service-name>

# Rebuild images
docker-compose -f "C:\Sovereign\AEGENTIS-X\docker-compose.yml" build --no-cache
```

### Port Already in Use

```powershell
# Find process using port
netstat -ano | findstr :3000

# Kill process
Stop-Process -Id <PID> -Force

# Or change port in docker-compose.yml
```

## Configuration

### Environment Variables

Edit `C:\Sovereign\AEGENTIS-X\.env`:

```env
# Environment
NODE_ENV=production
ENVIRONMENT=prod

# Database
DATABASE_URL=postgresql://aegentis:password@postgres:5432/aegentis

# Services
KERNEL_HOST=aegentis-kernel:8000
SOVEREIGN_HOST=sovereign-prime:3000

# PRIME Kernel
PRIME_KERNEL_ENABLED=true
PRIME_KERNEL_PATH=C:\Sovereign\AEGENTIS-X\prime-os\kernel
```

### Docker Compose Customization

Edit `C:\Sovereign\AEGENTIS-X\docker-compose.yml`:

```yaml
services:
  aegentis-kernel:
    ports:
      - "8000:8000"  # Change to different port if needed
    environment:
      NODE_ENV: production
      KERNEL_MODE: primary
```

## Backup & Recovery

### Backup Data

```powershell
# Backup PostgreSQL
docker exec aegentis-postgres pg_dump -U aegentis aegentis > "C:\Sovereign\AEGENTIS-X\backups\db-backup.sql"

# Backup Redis
docker exec aegentis-redis redis-cli BGSAVE
Copy-Item -Path "C:\Sovereign\AEGENTIS-X\data\redis\dump.rdb" -Destination "C:\Sovereign\AEGENTIS-X\backups\"

# Backup volumes
docker run --rm -v aegentis_postgres-data:/data -v "C:\Sovereign\AEGENTIS-X\backups":/backup alpine tar czf /backup/volumes-backup.tar.gz /data
```

### Restore Data

```powershell
# Restore PostgreSQL
docker exec -i aegentis-postgres psql -U aegentis aegentis < "C:\Sovereign\AEGENTIS-X\backups\db-backup.sql"

# Restore Redis
Copy-Item -Path "C:\Sovereign\AEGENTIS-X\backups\dump.rdb" -Destination "C:\Sovereign\AEGENTIS-X\data\redis\"
docker exec aegentis-redis redis-cli BGSAVE
```

## Performance Tuning

### Increase Docker Resources

1. Open Docker Desktop Settings
2. Go to Resources
3. Increase CPUs: 8-16
4. Increase Memory: 16-32 GB
5. Increase Swap: 4-8 GB

### Enable BuildKit

```powershell
# Set environment variable
$env:DOCKER_BUILDKIT = 1

# Or add to Docker Desktop settings JSON:
# "features": { "buildkit": true }
```

## Security Hardening

### Change Default Passwords

```powershell
# Edit .env file
$env:POSTGRES_PASSWORD = "your-secure-password"
$env:GRAFANA_PASSWORD = "your-secure-password"
$env:JWT_SECRET = "your-secure-jwt-secret"
```

### Enable TLS/mTLS

1. Generate certificates:
```powershell
# Place certificates in C:\Sovereign\AEGENTIS-X\certs\
```

2. Update docker-compose.yml with certificate paths

### Network Segmentation

```powershell
# Create custom network
docker network create aegentis-secure

# Connect containers
docker network connect aegentis-secure <container-name>
```

## Maintenance

### Regular Tasks

```powershell
# Check system health (daily)
.\Deploy-AEGENTIS-X-Windows.ps1 -Full

# Backup data (daily)
docker exec aegentis-postgres pg_dump -U aegentis aegentis > "C:\Sovereign\AEGENTIS-X\backups\db-$(Get-Date -Format 'yyyy-MM-dd').sql"

# Update containers (weekly)
docker-compose -f "C:\Sovereign\AEGENTIS-X\docker-compose.yml" pull
docker-compose -f "C:\Sovereign\AEGENTIS-X\docker-compose.yml" up -d

# Prune unused images (monthly)
docker image prune -a
docker volume prune
```

### Monitoring

- **Grafana**: http://localhost:3050 (dashboards)
- **Prometheus**: http://localhost:9091 (metrics)
- **Jaeger**: http://localhost:16686 (traces)
- **Logs**: `C:\Sovereign\AEGENTIS-X\logs\deployment.log`

## Support

For issues or questions:
1. Check logs: `C:\Sovereign\AEGENTIS-X\logs\`
2. Review health checks: `C:\Sovereign\AEGENTIS-X\health-check.json`
3. Consult PRIME Kernel documentation
4. Review Docker documentation: https://docs.docker.com/

## Next Steps

1. ✅ Deploy AEGENTIS-X
2. ✅ Verify all services running
3. ✅ Access Grafana dashboard
4. ✅ Configure monitoring alerts
5. ✅ Set up backup schedule
6. ✅ Implement security hardening
7. ✅ Deploy applications
8. ✅ Monitor system health

---

**Deployment Complete!** Your AEGENTIS-X system is now running with full Docker orchestration and PRIME Kernel integration.
