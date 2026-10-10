# Sovereign System - Deployment Runbook

**Version:** 1.0.0  
**Audience:** DevOps, SRE, Platform Engineers  
**Last Updated:** 2026-05-05

---

## 📋 Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Local Development Deployment](#local-development-deployment)
3. [Staging Deployment](#staging-deployment)
4. [Production Deployment](#production-deployment)
5. [Rollback Procedures](#rollback-procedures)
6. [Incident Response](#incident-response)
7. [Monitoring & Alerts](#monitoring--alerts)
8. [Troubleshooting](#troubleshooting)

---

## Pre-Deployment Checklist

### Code Quality
- [ ] All tests passing: `pnpm check`
- [ ] No TypeScript errors: `pnpm check`
- [ ] Code review approved by 2+ reviewers
- [ ] Security scanning passed (Trivy, Snyk)
- [ ] Dependency vulnerabilities resolved

### Infrastructure
- [ ] Target environment available and healthy
- [ ] Database backups completed
- [ ] Sufficient disk space (>20GB)
- [ ] Network connectivity verified
- [ ] Secrets configured in target environment

### Documentation
- [ ] Deployment plan documented
- [ ] Rollback plan documented
- [ ] Team notified of deployment window
- [ ] Runbook reviewed and updated

### Monitoring
- [ ] Monitoring dashboards ready (Grafana)
- [ ] Alert rules configured (Prometheus)
- [ ] Log aggregation ready (Kibana)
- [ ] On-call team assigned

---

## Local Development Deployment

### Quick Start

```bash
# 1. Clone repository
git clone https://github.com/shalominattii-us/Sovereign-System.git
cd Sovereign-System/sovereign-system-portal

# 2. Start all services
docker-compose up -d

# 3. Verify services
docker-compose ps

# 4. Check logs
docker-compose logs -f
```

### Access Services

| Service | URL | Purpose |
|---------|-----|---------|
| Portal | http://localhost:5173 | Frontend UI |
| Kernel API | http://localhost:9999 | Backend API |
| Grafana | http://localhost:3000 | Metrics (admin/admin) |
| Kibana | http://localhost:5601 | Logs |
| Prometheus | http://localhost:9090 | Metrics DB |

### Health Verification

```bash
# Check all services
docker-compose ps

# Test Portal
curl http://localhost:5173

# Test Kernel
curl http://localhost:9999/health

# Test Database
docker-compose exec postgres pg_isready -U sovereign

# Test Redis
docker-compose exec redis redis-cli ping
```

### Cleanup

```bash
# Stop services
docker-compose down

# Remove volumes (WARNING: deletes data)
docker-compose down -v

# Clean up Docker
docker system prune -a
```

---

## Staging Deployment

### Prerequisites

```bash
# Install Terraform
terraform --version  # v1.0+

# Install kubectl
kubectl version --client

# Install Helm
helm version

# Configure AWS credentials
aws configure
```

### Deployment Steps

#### 1. Plan Infrastructure

```bash
cd terraform

# Initialize Terraform
terraform init

# Plan staging deployment
terraform plan -var-file=staging.tfvars -out=staging.plan

# Review plan output
cat staging.plan
```

#### 2. Apply Infrastructure

```bash
# Apply Terraform configuration
terraform apply staging.plan

# Wait for completion (typically 15-20 minutes)
# Monitor progress in AWS Console
```

#### 3. Deploy Applications

```bash
# Get kubeconfig
aws eks update-kubeconfig --name sovereign-cluster --region us-east-1

# Verify cluster access
kubectl cluster-info

# Deploy to Kubernetes
kubectl apply -f k8s/staging/

# Wait for rollout
kubectl rollout status deployment/sovereign-portal -n default
kubectl rollout status deployment/sovereign-kernel -n default

# Verify pods are running
kubectl get pods -n default
```

#### 4. Verify Deployment

```bash
# Check service endpoints
kubectl get svc -n default

# Port forward to test
kubectl port-forward svc/sovereign-portal 5173:5173 &
kubectl port-forward svc/sovereign-kernel 9999:9999 &

# Test endpoints
curl http://localhost:5173
curl http://localhost:9999/health

# Check logs
kubectl logs -f deployment/sovereign-portal
kubectl logs -f deployment/sovereign-kernel
```

#### 5. Run Smoke Tests

```bash
# Run integration tests
pnpm test:integration

# Check monitoring
# - Grafana: http://localhost:3000
# - Prometheus: http://localhost:9090
# - Kibana: http://localhost:5601
```

### Rollback Staging

```bash
# Rollback Kubernetes
kubectl rollout undo deployment/sovereign-portal
kubectl rollout undo deployment/sovereign-kernel

# Or rollback Terraform
terraform apply -var-file=staging.tfvars -refresh=true
```

---

## Production Deployment

### Pre-Production Checklist

- [ ] Staging deployment successful
- [ ] All tests passing in staging
- [ ] Performance benchmarks acceptable
- [ ] Security audit completed
- [ ] Disaster recovery tested
- [ ] Team trained on new features
- [ ] Communication plan executed

### Deployment Steps

#### 1. Create Release

```bash
# Create git tag
git tag -a v1.0.0 -m "Release v1.0.0"

# Push tag (triggers GitHub Actions)
git push origin v1.0.0

# Monitor CI/CD pipeline
# GitHub Actions will automatically:
# - Run tests
# - Build Docker images
# - Push to registry
# - Deploy to production
```

#### 2. Monitor Deployment

```bash
# Watch GitHub Actions
# https://github.com/shalominattii-us/Sovereign-System/actions

# Monitor Kubernetes
kubectl get pods -n production -w
kubectl get svc -n production

# Check logs
kubectl logs -f deployment/sovereign-portal -n production
kubectl logs -f deployment/sovereign-kernel -n production
```

#### 3. Verify Production

```bash
# Test endpoints
curl https://sovereign.manusspace.com
curl https://api.sovereign.manusspace.com/health

# Check metrics
# - Grafana: https://grafana.sovereign.manusspace.com
# - Prometheus: https://prometheus.sovereign.manusspace.com

# Check logs
# - Kibana: https://kibana.sovereign.manusspace.com

# Run smoke tests
./scripts/smoke-tests.sh production
```

#### 4. Post-Deployment

```bash
# Update documentation
# - Release notes
# - Deployment log
# - Known issues

# Notify stakeholders
# - Send deployment summary
# - Highlight new features
# - Document any issues

# Schedule post-mortem if issues found
```

---

## Rollback Procedures

### Immediate Rollback (if critical issue)

```bash
# Kubernetes rollback (fastest)
kubectl rollout undo deployment/sovereign-portal -n production
kubectl rollout undo deployment/sovereign-kernel -n production

# Verify rollback
kubectl rollout status deployment/sovereign-portal -n production
kubectl rollout status deployment/sovereign-kernel -n production

# Test endpoints
curl https://sovereign.manusspace.com
```

### Terraform Rollback

```bash
cd terraform/production

# Rollback to previous state
terraform apply -var-file=production.tfvars -refresh=true

# Or rollback specific resources
terraform destroy -target=aws_eks_node_group.sovereign -var-file=production.tfvars
terraform apply -var-file=production.tfvars
```

### Database Rollback

```bash
# If database schema changed
# Restore from backup
aws rds restore-db-cluster-from-snapshot \
  --db-cluster-identifier sovereign-cluster-restored \
  --snapshot-identifier <snapshot-id>

# Update connection string
# Verify data integrity
```

### Full System Rollback

```bash
# If complete rollback needed
# 1. Rollback Kubernetes
kubectl apply -f k8s/production/previous-version/

# 2. Rollback database
aws rds restore-db-cluster-from-snapshot ...

# 3. Rollback infrastructure
terraform apply -var-file=production.tfvars -refresh=true

# 4. Verify all services
./scripts/smoke-tests.sh production
```

---

## Incident Response

### Service Down

**Severity:** CRITICAL

```bash
# 1. Assess situation
kubectl get pods -n production
kubectl describe pod <pod-name> -n production
kubectl logs <pod-name> -n production

# 2. Immediate action
# Option A: Restart pod
kubectl delete pod <pod-name> -n production

# Option B: Scale deployment
kubectl scale deployment sovereign-kernel --replicas=3 -n production

# Option C: Rollback
kubectl rollout undo deployment/sovereign-kernel -n production

# 3. Monitor recovery
kubectl get pods -n production -w
curl https://api.sovereign.manusspace.com/health

# 4. Investigate root cause
kubectl logs <pod-name> -n production --previous
# Check metrics in Prometheus
# Check logs in Kibana
```

### Database Connection Issues

**Severity:** CRITICAL

```bash
# 1. Check database status
aws rds describe-db-clusters --db-cluster-identifier sovereign-cluster

# 2. Check connectivity
kubectl exec -it <pod-name> -n production -- \
  psql -h <rds-endpoint> -U sovereign -d sovereign

# 3. Check network policies
kubectl get networkpolicies -n production

# 4. Check security groups
aws ec2 describe-security-groups --group-ids <sg-id>

# 5. Restart connection pool
kubectl restart deployment/sovereign-kernel -n production
```

### High Memory Usage

**Severity:** HIGH

```bash
# 1. Check memory usage
kubectl top pods -n production

# 2. Identify memory leak
kubectl logs <pod-name> -n production | grep -i memory

# 3. Restart pod
kubectl delete pod <pod-name> -n production

# 4. Scale up resources
kubectl set resources deployment/sovereign-kernel \
  -n production \
  --limits=memory=4Gi,cpu=2 \
  --requests=memory=2Gi,cpu=1

# 5. Monitor memory
kubectl top pods -n production -w
```

### Performance Degradation

**Severity:** MEDIUM

```bash
# 1. Check metrics
# - CPU usage: kubectl top nodes
# - Memory: kubectl top pods
# - Disk: df -h

# 2. Check logs for errors
kubectl logs -f deployment/sovereign-kernel -n production

# 3. Check database queries
# Connect to RDS and check slow query log

# 4. Scale up if needed
kubectl scale deployment/sovereign-kernel --replicas=5 -n production

# 5. Monitor improvement
kubectl top pods -n production -w
```

---

## Monitoring & Alerts

### Key Metrics to Monitor

| Metric | Threshold | Action |
|--------|-----------|--------|
| Pod CPU | >80% | Scale up replicas |
| Pod Memory | >85% | Restart pod, investigate leak |
| Database CPU | >75% | Scale up RDS instance |
| Database Connections | >80% | Increase connection pool |
| API Response Time | >1s | Check logs, scale up |
| Error Rate | >1% | Investigate errors |
| Disk Usage | >80% | Clean up, expand volume |

### Alert Rules

```yaml
# CPU Alert
- alert: HighCPUUsage
  expr: rate(container_cpu_usage_seconds_total[5m]) > 0.8
  for: 5m
  annotations:
    summary: "High CPU usage detected"

# Memory Alert
- alert: HighMemoryUsage
  expr: container_memory_usage_bytes / container_spec_memory_limit_bytes > 0.85
  for: 5m
  annotations:
    summary: "High memory usage detected"

# Error Rate Alert
- alert: HighErrorRate
  expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.01
  for: 5m
  annotations:
    summary: "High error rate detected"
```

### Dashboards

- **Overview Dashboard**: System health, key metrics
- **Portal Dashboard**: Frontend performance, user metrics
- **Kernel Dashboard**: API performance, request rates
- **Database Dashboard**: Query performance, connections
- **Infrastructure Dashboard**: Node health, resource usage

---

## Troubleshooting

### Common Issues

#### Portal Won't Load

```bash
# 1. Check pod status
kubectl get pods -n production | grep portal

# 2. Check logs
kubectl logs deployment/sovereign-portal -n production

# 3. Check service
kubectl get svc sovereign-portal -n production

# 4. Test connectivity
kubectl exec -it <pod-name> -n production -- curl http://localhost:5173

# 5. Restart pod
kubectl delete pod <pod-name> -n production
```

#### API Returns 500 Errors

```bash
# 1. Check kernel logs
kubectl logs deployment/sovereign-kernel -n production

# 2. Check database connectivity
kubectl exec -it <pod-name> -n production -- \
  psql -h <rds-endpoint> -U sovereign -d sovereign -c "SELECT 1"

# 3. Check Redis connectivity
kubectl exec -it <pod-name> -n production -- \
  redis-cli -h <redis-endpoint> ping

# 4. Restart kernel
kubectl restart deployment/sovereign-kernel -n production
```

#### Database Slow Queries

```bash
# 1. Connect to database
aws rds describe-db-clusters --db-cluster-identifier sovereign-cluster

# 2. Check slow query log
SELECT * FROM pg_stat_statements ORDER BY mean_time DESC LIMIT 10;

# 3. Analyze query plan
EXPLAIN ANALYZE SELECT ...;

# 4. Create indexes if needed
CREATE INDEX idx_name ON table(column);

# 5. Restart database if needed
aws rds reboot-db-instance --db-instance-identifier <instance-id>
```

#### Out of Disk Space

```bash
# 1. Check disk usage
df -h

# 2. Identify large files
du -sh /* | sort -rh

# 3. Clean up logs
kubectl logs --all-containers=true --all-namespaces=true --tail=0 > /dev/null

# 4. Clean Docker
docker system prune -a

# 5. Expand volume if needed
# AWS: Modify RDS storage
# Kubernetes: Edit PVC storage
```

---

## Emergency Contacts

- **On-Call Engineer**: [Phone/Slack]
- **DevOps Lead**: [Phone/Slack]
- **Platform Lead**: [Phone/Slack]
- **Security Team**: [Phone/Slack]

---

## Additional Resources

- [Deployment Architecture](./DEPLOYMENT_ARCHITECTURE.md)
- [Deployment Quick Start](./DEPLOYMENT_QUICKSTART.md)
- [API Integration Guide](./API_INTEGRATION.md)
- [Monitoring & Logging](./MONITORING.md)
- [Security Guidelines](./SECURITY.md)

---

**Status:** 🟢 **PRODUCTION READY**

For questions or updates, contact the DevOps team.
