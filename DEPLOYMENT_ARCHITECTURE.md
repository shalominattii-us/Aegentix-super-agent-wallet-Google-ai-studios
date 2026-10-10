# Sovereign System - Production Deployment Architecture

**Version:** 1.0.0  
**Target:** Manusspace (Manus Cloud Infrastructure)  
**Status:** Production-Ready  
**Last Updated:** 2026-05-05

---

## 🏗️ System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     MANUSSPACE DEPLOYMENT                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │          SOVEREIGN SYSTEM PORTAL (Frontend)              │  │
│  │  - React 19 + Tailwind 4 + shadcn/ui                    │  │
│  │  - Tiered Agent System UI                               │  │
│  │  - Orchestration Dashboard                              │  │
│  │  - Real-time Log Viewer                                 │  │
│  │  - Deployment Manager                                   │  │
│  └──────────────────────────────────────────────────────────┘  │
│                           ↓ (API Calls)                         │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │        SOVEREIGN OS KERNEL (Backend)                     │  │
│  │  - Async Kernel with Subsystem Management               │  │
│  │  - Agentic Framework (Autonomous Agents)                │  │
│  │  - Mesh Networking (P2P Communication)                  │  │
│  │  - Governance Engine (Policy Enforcement)               │  │
│  │  - Identity & Authentication                            │  │
│  └──────────────────────────────────────────────────────────┘  │
│                           ↓                                      │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │         SUPPORTING SERVICES & INFRASTRUCTURE             │  │
│  │  - PostgreSQL Database                                  │  │
│  │  - Redis Cache & Message Queue                          │  │
│  │  - OSINT Fleet (Docker Services)                        │  │
│  │  - Monitoring & Logging (Prometheus, ELK)              │  │
│  │  - Overwatch Health Monitor                             │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📦 Deployment Layers

### Layer 1: Container Orchestration
- **Docker Compose** – Local development (single-host)
- **Kubernetes** – Production (multi-node, auto-scaling)
- **Container Registry** – GitHub Container Registry (GHCR)

### Layer 2: Infrastructure as Code
- **Terraform** – AWS/Azure/GCP provisioning
- **Helm Charts** – Kubernetes package management
- **CloudFormation** – AWS-native IaC

### Layer 3: CI/CD Pipeline
- **GitHub Actions** – Automated testing, building, deployment
- **Artifact Storage** – GitHub Packages, Docker Hub
- **Release Management** – Semantic versioning, automated releases

### Layer 4: Monitoring & Observability
- **Prometheus** – Metrics collection
- **Grafana** – Metrics visualization
- **ELK Stack** – Centralized logging
- **Jaeger** – Distributed tracing

---

## 🐳 Docker Compose Services

```yaml
Services:
├── portal              # React frontend (port 5173)
├── sovereign-kernel    # FastAPI backend (port 9999)
├── postgres            # Database (port 5432)
├── redis               # Cache & queue (port 6379)
├── osint-spiderfoot    # OSINT service (port 5001)
├── osint-phoneinfoga   # OSINT service (port 8080)
├── prometheus          # Metrics (port 9090)
├── grafana             # Dashboard (port 3000)
├── elasticsearch       # Logging (port 9200)
├── kibana              # Log UI (port 5601)
└── overwatch           # Health monitor (background)
```

---

## 🚀 Deployment Workflows

### Development Environment
```bash
# One-command local development
docker-compose -f docker-compose.dev.yml up

# Access:
# - Portal: http://localhost:5173
# - Kernel API: http://localhost:9999
# - Grafana: http://localhost:3000
# - Kibana: http://localhost:5601
```

### Staging Environment
```bash
# Deploy to Manusspace staging
terraform apply -var-file=staging.tfvars
kubectl apply -f k8s/staging/
```

### Production Environment
```bash
# Deploy to Manusspace production
terraform apply -var-file=production.tfvars
kubectl apply -f k8s/production/
```

---

## 🔄 CI/CD Pipeline Stages

### Stage 1: Trigger (on push/PR)
- Code checkout
- Dependency cache

### Stage 2: Test
- Unit tests (Portal + Kernel)
- Integration tests
- Security scanning (SAST)
- Dependency scanning

### Stage 3: Build
- Docker image build (Portal)
- Docker image build (Kernel)
- Push to GHCR
- Generate SBOM

### Stage 4: Deploy (on main branch)
- Terraform apply
- Kubernetes rollout
- Health checks
- Smoke tests

### Stage 5: Monitor
- Prometheus scrape
- Grafana dashboards
- Alert rules
- Log aggregation

---

## 🔐 Security & Secrets Management

### Secrets Hierarchy
1. **GitHub Secrets** – CI/CD credentials
2. **Kubernetes Secrets** – Runtime secrets
3. **Terraform Variables** – Infrastructure secrets
4. **Vault** – Centralized secret management (optional)

### Required Secrets
```
SOVEREIGN_DB_PASSWORD
SOVEREIGN_REDIS_PASSWORD
SOVEREIGN_JWT_SECRET
SOVEREIGN_OAUTH_CLIENT_ID
SOVEREIGN_OAUTH_CLIENT_SECRET
DOCKER_REGISTRY_USERNAME
DOCKER_REGISTRY_PASSWORD
```

---

## 📊 Environment Configuration

### Development
- **Replicas:** 1
- **Resources:** Minimal (dev machines)
- **Logging:** Verbose
- **Monitoring:** Local Prometheus

### Staging
- **Replicas:** 2
- **Resources:** Medium
- **Logging:** Standard
- **Monitoring:** Full stack

### Production
- **Replicas:** 3+
- **Resources:** High (auto-scaling)
- **Logging:** Structured (ELK)
- **Monitoring:** Full observability

---

## 🔗 Integration Points

### Portal → Kernel API
```
POST /api/agents/deploy
GET  /api/agents/status
GET  /api/logs/stream
POST /api/governance/policies
GET  /api/mesh/status
```

### Kernel → Services
```
- Database queries (PostgreSQL)
- Cache operations (Redis)
- Message publishing (Redis Pub/Sub)
- External APIs (OSINT services)
```

---

## 📈 Scaling Strategy

### Horizontal Scaling
- **Portal:** Nginx load balancer + multiple replicas
- **Kernel:** Gunicorn workers + multiple replicas
- **Database:** Read replicas, connection pooling
- **Cache:** Redis cluster

### Vertical Scaling
- **CPU:** Auto-scale based on CPU utilization (>70%)
- **Memory:** Auto-scale based on memory usage (>80%)
- **Storage:** Auto-expand volumes

---

## 🛠️ Operational Procedures

### Deployment
1. Create feature branch
2. Make changes, commit with semantic messages
3. Open PR, run automated tests
4. Merge to main on approval
5. GitHub Actions auto-deploys to staging
6. Manual approval for production

### Rollback
```bash
# Kubernetes rollback
kubectl rollout undo deployment/sovereign-portal
kubectl rollout undo deployment/sovereign-kernel

# Terraform rollback
terraform apply -var-file=production.tfvars -refresh=true
```

### Health Checks
```bash
# Portal health
curl http://portal:5173/health

# Kernel health
curl http://kernel:9999/health

# Database health
pg_isready -h postgres -p 5432

# Redis health
redis-cli ping
```

---

## 📋 Pre-Deployment Checklist

- [ ] All tests passing
- [ ] Code review approved
- [ ] Security scanning passed
- [ ] Secrets configured
- [ ] Database migrations tested
- [ ] Monitoring dashboards ready
- [ ] Runbooks documented
- [ ] Team notified

---

## 🚨 Incident Response

### Service Down
1. Check Kubernetes pod status: `kubectl get pods`
2. Check logs: `kubectl logs <pod-name>`
3. Restart pod: `kubectl delete pod <pod-name>`
4. If persists, rollback: `kubectl rollout undo deployment/<service>`

### Database Issues
1. Check connection: `pg_isready -h postgres`
2. Check disk space: `df -h`
3. Check query performance: `EXPLAIN ANALYZE`
4. Restore from backup if needed

### Performance Degradation
1. Check metrics: Prometheus dashboard
2. Check logs: Kibana
3. Scale up replicas: `kubectl scale deployment <service> --replicas=5`
4. Investigate root cause

---

## 📚 Documentation References

- [Docker Compose Setup](./docs/docker-compose.md)
- [Kubernetes Deployment](./docs/kubernetes.md)
- [Terraform Configuration](./docs/terraform.md)
- [GitHub Actions Workflows](./docs/github-actions.md)
- [API Integration Guide](./docs/api-integration.md)
- [Monitoring & Logging](./docs/monitoring.md)
- [Security Guidelines](./docs/security.md)

---

## 🎯 Success Criteria

✅ **Deployment Infrastructure**
- One-click local development
- Automated CI/CD pipeline
- Production-ready Kubernetes manifests
- Infrastructure as Code (Terraform)

✅ **Monitoring & Observability**
- Real-time metrics (Prometheus)
- Centralized logging (ELK)
- Distributed tracing (Jaeger)
- Alert rules configured

✅ **Security**
- Secrets management
- Network policies
- RBAC configured
- Security scanning automated

✅ **Documentation**
- Deployment guides
- Runbooks
- API documentation
- Troubleshooting guides

---

**Status:** 🟢 **PRODUCTION READY**

For questions or issues, refer to the documentation or contact the DevOps team.
