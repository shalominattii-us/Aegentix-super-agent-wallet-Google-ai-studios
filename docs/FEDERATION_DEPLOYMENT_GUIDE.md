# Federation Deployment Guide

## Overview

This guide covers deploying the AEGENTIS Sovereign System with full federation support across multiple nodes, regions, and deployment environments.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Federation Network                        │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │ Node 1       │  │ Node 2       │  │ Node 3       │       │
│  │ (Sovereign)  │  │ (Commander)  │  │ (Operator)   │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
│         │                  │                  │              │
│         └──────────────────┼──────────────────┘              │
│                            │                                 │
│                    ┌───────────────┐                         │
│                    │ Event Store   │                         │
│                    │ (Canonical)   │                         │
│                    └───────────────┘                         │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## Prerequisites

- Kubernetes 1.24+ or Docker Compose 2.0+
- PostgreSQL 14+ or MySQL 8.0+
- Redis 7.0+ for caching
- Istio 1.14+ for service mesh (optional but recommended)
- 8GB+ RAM per node
- 50GB+ storage per node

## Single-Node Deployment

### Docker Compose

```yaml
version: '3.8'
services:
  aegentis-core:
    image: aegentis/sovereign-system:latest
    ports:
      - "3000:3000"
      - "8001:8001"
    environment:
      NODE_ENV: production
      DATABASE_URL: postgresql://user:pass@postgres:5432/aegentis
      REDIS_URL: redis://redis:6379
      FEDERATION_MODE: single
    depends_on:
      - postgres
      - redis
    volumes:
      - ./ledger:/app/ledger
      - ./backups:/app/backups

  postgres:
    image: postgres:14
    environment:
      POSTGRES_DB: aegentis
      POSTGRES_USER: aegentis
      POSTGRES_PASSWORD: secure_password
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

### Deployment Steps

1. **Prepare environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

2. **Start services:**
   ```bash
   docker-compose up -d
   ```

3. **Initialize database:**
   ```bash
   docker-compose exec aegentis-core pnpm db:push
   ```

4. **Verify deployment:**
   ```bash
   curl http://localhost:8001/health
   ```

## Multi-Node Federation Deployment

### Kubernetes Deployment

#### 1. Create Namespace

```bash
kubectl create namespace aegentis
```

#### 2. Deploy PostgreSQL

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: postgres-config
  namespace: aegentis
data:
  POSTGRES_DB: aegentis
  POSTGRES_USER: aegentis
---
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: postgres
  namespace: aegentis
spec:
  serviceName: postgres
  replicas: 1
  selector:
    matchLabels:
      app: postgres
  template:
    metadata:
      labels:
        app: postgres
    spec:
      containers:
      - name: postgres
        image: postgres:14
        ports:
        - containerPort: 5432
        envFrom:
        - configMapRef:
            name: postgres-config
        volumeMounts:
        - name: postgres-data
          mountPath: /var/lib/postgresql/data
  volumeClaimTemplates:
  - metadata:
      name: postgres-data
    spec:
      accessModes: [ "ReadWriteOnce" ]
      resources:
        requests:
          storage: 50Gi
```

#### 3. Deploy AEGENTIS Nodes

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: aegentis-sovereign
  namespace: aegentis
spec:
  replicas: 3
  selector:
    matchLabels:
      app: aegentis
      role: sovereign
  template:
    metadata:
      labels:
        app: aegentis
        role: sovereign
    spec:
      containers:
      - name: aegentis
        image: aegentis/sovereign-system:latest
        ports:
        - containerPort: 3000
        - containerPort: 8001
        env:
        - name: NODE_ENV
          value: "production"
        - name: DATABASE_URL
          value: "postgresql://aegentis:password@postgres:5432/aegentis"
        - name: REDIS_URL
          value: "redis://redis:6379"
        - name: FEDERATION_MODE
          value: "multi"
        - name: NODE_ROLE
          value: "sovereign"
        - name: FEDERATION_PEERS
          value: "aegentis-commander:8001,aegentis-operator:8001"
        resources:
          requests:
            memory: "2Gi"
            cpu: "1000m"
          limits:
            memory: "4Gi"
            cpu: "2000m"
        livenessProbe:
          httpGet:
            path: /health
            port: 8001
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 8001
          initialDelaySeconds: 10
          periodSeconds: 5
```

#### 4. Deploy Redis

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: redis
  namespace: aegentis
spec:
  replicas: 1
  selector:
    matchLabels:
      app: redis
  template:
    metadata:
      labels:
        app: redis
    spec:
      containers:
      - name: redis
        image: redis:7
        ports:
        - containerPort: 6379
        resources:
          requests:
            memory: "512Mi"
            cpu: "250m"
```

#### 5. Deploy Services

```yaml
apiVersion: v1
kind: Service
metadata:
  name: aegentis-sovereign
  namespace: aegentis
spec:
  selector:
    app: aegentis
    role: sovereign
  ports:
  - name: http
    port: 3000
    targetPort: 3000
  - name: grpc
    port: 8001
    targetPort: 8001
  type: LoadBalancer
---
apiVersion: v1
kind: Service
metadata:
  name: postgres
  namespace: aegentis
spec:
  selector:
    app: postgres
  ports:
  - port: 5432
    targetPort: 5432
  clusterIP: None
---
apiVersion: v1
kind: Service
metadata:
  name: redis
  namespace: aegentis
spec:
  selector:
    app: redis
  ports:
  - port: 6379
    targetPort: 6379
```

## Federation Configuration

### Node Roles

- **Sovereign**: Primary authority node, handles critical decisions
- **Commander**: Secondary authority node, manages operations
- **Operator**: Tertiary node, executes operations
- **Cadet**: Read-only node for monitoring

### Environment Variables

```bash
# Federation Settings
FEDERATION_MODE=multi                    # single, multi, hybrid
NODE_ROLE=sovereign                      # sovereign, commander, operator, cadet
FEDERATION_PEERS=node2:8001,node3:8001  # Comma-separated peer addresses
FEDERATION_CONSENSUS=raft                # raft, pbft, paxos
FEDERATION_TIMEOUT=5000                  # ms

# Authority Settings
AUTHORITY_LEVEL=sovereign                # sovereign, commander, operator, cadet
AUTHORITY_APPROVAL_REQUIRED=true
AUTHORITY_QUORUM_SIZE=2

# Replication Settings
REPLICATION_FACTOR=3
REPLICATION_TIMEOUT=10000
REPLICATION_BATCH_SIZE=100
```

## Monitoring & Observability

### Prometheus Metrics

```yaml
apiVersion: v1
kind: Service
metadata:
  name: aegentis-metrics
  namespace: aegentis
spec:
  selector:
    app: aegentis
  ports:
  - name: metrics
    port: 9090
    targetPort: 9090
---
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: aegentis
  namespace: aegentis
spec:
  selector:
    matchLabels:
      app: aegentis
  endpoints:
  - port: metrics
    interval: 30s
```

### Grafana Dashboards

Key metrics to monitor:
- Node health status
- Federation sync latency
- Event processing rate
- Database connection pool
- Memory and CPU usage
- Network latency between nodes

## Backup & Recovery

### Automated Backups

```bash
# Daily backup at 2 AM UTC
0 2 * * * /app/scripts/backup.sh

# Weekly full backup
0 3 * * 0 /app/scripts/backup-full.sh

# Monthly archive
0 4 1 * * /app/scripts/backup-archive.sh
```

### Recovery Procedures

1. **Single Node Failure:**
   ```bash
   # Node automatically rejoins federation
   kubectl delete pod aegentis-sovereign-xyz
   # Pod will be recreated and sync from peers
   ```

2. **Database Failure:**
   ```bash
   # Restore from backup
   docker-compose exec postgres psql -U aegentis < backup.sql
   # Restart all nodes
   docker-compose restart aegentis-core
   ```

3. **Complete Cluster Failure:**
   ```bash
   # Restore from offline backup
   tar -xzf backup-latest.tar.gz
   docker-compose up -d
   # Verify data integrity
   curl http://localhost:8001/verify
   ```

## Security

### TLS/mTLS Configuration

```yaml
apiVersion: security.istio.io/v1beta1
kind: PeerAuthentication
metadata:
  name: aegentis-mtls
  namespace: aegentis
spec:
  mtls:
    mode: STRICT
---
apiVersion: security.istio.io/v1beta1
kind: AuthorizationPolicy
metadata:
  name: aegentis-authz
  namespace: aegentis
spec:
  selector:
    matchLabels:
      app: aegentis
  rules:
  - from:
    - source:
        principals: ["cluster.local/ns/aegentis/sa/aegentis"]
    to:
    - operation:
        methods: ["GET", "POST"]
        paths: ["/api/*"]
```

### Network Policies

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: aegentis-network-policy
  namespace: aegentis
spec:
  podSelector:
    matchLabels:
      app: aegentis
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - namespaceSelector:
        matchLabels:
          name: aegentis
    ports:
    - protocol: TCP
      port: 3000
    - protocol: TCP
      port: 8001
  egress:
  - to:
    - namespaceSelector:
        matchLabels:
          name: aegentis
    ports:
    - protocol: TCP
      port: 5432
    - protocol: TCP
      port: 6379
```

## Troubleshooting

### Common Issues

**1. Federation Sync Lag**
```bash
# Check node status
curl http://localhost:8001/federation/status

# Check event queue
curl http://localhost:8001/federation/queue

# Force sync
curl -X POST http://localhost:8001/federation/sync
```

**2. Database Connection Issues**
```bash
# Check connection pool
curl http://localhost:8001/metrics/db

# Restart database
docker-compose restart postgres

# Verify connectivity
docker-compose exec aegentis-core npm run db:verify
```

**3. Memory Leaks**
```bash
# Check memory usage
curl http://localhost:8001/metrics/memory

# Enable heap dumps
export NODE_OPTIONS="--max-old-space-size=4096"
docker-compose restart aegentis-core
```

## Performance Tuning

### Database Optimization

```sql
-- Create indexes for federation queries
CREATE INDEX idx_events_node_id ON canonical_events(node_id);
CREATE INDEX idx_events_timestamp ON canonical_events(timestamp);
CREATE INDEX idx_federation_state ON federation_state(node_id, stage);

-- Analyze query performance
ANALYZE canonical_events;
```

### Redis Optimization

```bash
# Increase max memory
redis-cli CONFIG SET maxmemory 2gb

# Set eviction policy
redis-cli CONFIG SET maxmemory-policy allkeys-lru

# Enable persistence
redis-cli CONFIG SET save "900 1 300 10 60 10000"
```

## Scaling

### Horizontal Scaling

```bash
# Add new node to federation
kubectl scale deployment aegentis-sovereign --replicas=5

# Verify new nodes joined
kubectl logs -f deployment/aegentis-sovereign
```

### Vertical Scaling

```yaml
# Increase resource limits
resources:
  requests:
    memory: "4Gi"
    cpu: "2000m"
  limits:
    memory: "8Gi"
    cpu: "4000m"
```

## Maintenance

### Regular Tasks

- **Daily**: Monitor metrics, check logs
- **Weekly**: Review performance, update dependencies
- **Monthly**: Full backup verification, security audit
- **Quarterly**: Capacity planning, disaster recovery drill

### Upgrade Procedure

```bash
# 1. Create backup
./scripts/backup-full.sh

# 2. Update image
docker pull aegentis/sovereign-system:latest

# 3. Rolling update
kubectl set image deployment/aegentis-sovereign \
  aegentis=aegentis/sovereign-system:latest

# 4. Verify upgrade
kubectl rollout status deployment/aegentis-sovereign
```

## Support & Resources

- Documentation: https://docs.aegentis.io
- GitHub Issues: https://github.com/aegentis/sovereign-system/issues
- Community Forum: https://forum.aegentis.io
- Enterprise Support: support@aegentis.io
