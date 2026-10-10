# Coinbase Agent - Production Deployment Guide

## Quick Start (5 minutes)

### Step 1: Prepare Kubernetes Cluster

```bash
# Create namespace
kubectl create namespace sovereign

# Verify cluster access
kubectl cluster-info
kubectl get nodes
```

### Step 2: Create Secrets

```bash
# Create Coinbase credentials secret
kubectl create secret generic coinbase-credentials \
  --from-literal=api-key-id=YOUR_CDP_API_KEY_ID \
  --from-literal=api-key-secret=YOUR_CDP_API_KEY_SECRET \
  --from-literal=wallet-secret=YOUR_WALLET_SECRET \
  -n sovereign

# Verify secret created
kubectl get secrets -n sovereign
```

### Step 3: Deploy Helm Chart

```bash
# Add repository (if using remote chart)
# helm repo add sovereign https://charts.sovereign.ae
# helm repo update

# Install chart
helm install coinbase-agent ./helm/coinbase-agent \
  --namespace sovereign \
  --values helm/coinbase-agent/values.yaml

# Verify deployment
kubectl get deployments -n sovereign
kubectl get pods -n sovereign
```

### Step 4: Verify Deployment

```bash
# Check pod status
kubectl get pods -n sovereign -l app=coinbase-agent

# View logs
kubectl logs -n sovereign -l app=coinbase-agent -f

# Test health endpoint
kubectl port-forward -n sovereign svc/coinbase-agent 8080:8080
curl http://localhost:8080/api/coinbase/health
```

---

## Production Configuration

### 1. Update values.yaml for Production

```yaml
# helm/coinbase-agent/values.yaml

deployment:
  replicas: 5  # Increased from 3

autoscaling:
  minReplicas: 3
  maxReplicas: 20
  targetCPUUtilizationPercentage: 60

ingress:
  enabled: true
  hosts:
    - host: coinbase-agent.your-domain.com
      paths:
        - path: /
          pathType: Prefix
  tls:
    - secretName: coinbase-agent-tls
      hosts:
        - coinbase-agent.your-domain.com

monitoring:
  enabled: true
  serviceMonitor:
    enabled: true
```

### 2. Configure Ingress

```bash
# Install cert-manager for TLS
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.yaml

# Create ClusterIssuer for Let's Encrypt
cat <<EOF | kubectl apply -f -
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: ops@sovereign.ae
    privateKeySecretRef:
      name: letsencrypt-prod
    solvers:
    - http01:
        ingress:
          class: nginx
EOF
```

### 3. Setup Monitoring

```bash
# Install Prometheus
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm install prometheus prometheus-community/kube-prometheus-stack \
  --namespace monitoring \
  --create-namespace

# Install Grafana
helm repo add grafana https://grafana.github.io/helm-charts
helm install grafana grafana/grafana \
  --namespace monitoring
```

---

## Advanced Configuration

### Multi-Region Deployment

```bash
# Deploy to multiple regions
for region in us-west-1 us-east-1 eu-west-1; do
  helm install coinbase-agent-$region ./helm/coinbase-agent \
    --namespace sovereign \
    --values helm/coinbase-agent/values-$region.yaml \
    --set global.region=$region
done
```

### Database Persistence

```bash
# Install PostgreSQL
helm repo add bitnami https://charts.bitnami.com/bitnami
helm install postgresql bitnami/postgresql \
  --namespace sovereign \
  --set auth.password=SECURE_PASSWORD

# Update application to use database
kubectl set env deployment/coinbase-agent \
  DATABASE_URL=postgresql://user:password@postgresql:5432/coinbase \
  -n sovereign
```

### Message Queue Integration

```bash
# Install RabbitMQ
helm install rabbitmq bitnami/rabbitmq \
  --namespace sovereign

# Configure application
kubectl set env deployment/coinbase-agent \
  RABBITMQ_URL=amqp://user:password@rabbitmq:5672 \
  -n sovereign
```

---

## Scaling & Performance

### Horizontal Scaling

```bash
# Manual scaling
kubectl scale deployment coinbase-agent \
  --replicas=10 \
  -n sovereign

# Check HPA status
kubectl get hpa -n sovereign
kubectl describe hpa coinbase-agent -n sovereign
```

### Vertical Scaling

```bash
# Increase resource limits
kubectl set resources deployment coinbase-agent \
  --requests=cpu=500m,memory=1Gi \
  --limits=cpu=1000m,memory=2Gi \
  -n sovereign
```

### Performance Tuning

```bash
# Adjust connection pool
kubectl set env deployment/coinbase-agent \
  CONNECTION_POOL_SIZE=50 \
  -n sovereign

# Adjust cache settings
kubectl set env deployment/coinbase-agent \
  CACHE_TTL=3600 \
  -n sovereign
```

---

## Monitoring & Logging

### View Logs

```bash
# Real-time logs
kubectl logs -f deployment/coinbase-agent -n sovereign

# Last 100 lines
kubectl logs --tail=100 deployment/coinbase-agent -n sovereign

# Logs from specific pod
kubectl logs pod/coinbase-agent-xyz -n sovereign
```

### Monitoring Dashboard

```bash
# Port forward to Grafana
kubectl port-forward -n monitoring svc/grafana 3000:80

# Access at http://localhost:3000
# Default credentials: admin / prom-operator
```

### Metrics

```bash
# View pod metrics
kubectl top pod -n sovereign

# View node metrics
kubectl top node
```

---

## Backup & Recovery

### Backup Configuration

```bash
# Backup Helm release
helm get values coinbase-agent -n sovereign > backup-values.yaml
helm get manifest coinbase-agent -n sovereign > backup-manifest.yaml

# Backup secrets
kubectl get secret coinbase-credentials -n sovereign -o yaml > backup-secrets.yaml
```

### Restore from Backup

```bash
# Restore secrets
kubectl apply -f backup-secrets.yaml

# Reinstall Helm chart
helm install coinbase-agent ./helm/coinbase-agent \
  --namespace sovereign \
  --values backup-values.yaml
```

---

## Troubleshooting

### Pod Stuck in Pending

```bash
# Check events
kubectl describe pod <pod-name> -n sovereign

# Check node capacity
kubectl describe nodes

# Check resource requests
kubectl get pod <pod-name> -n sovereign -o yaml | grep -A 10 resources
```

### High Memory Usage

```bash
# Check memory usage
kubectl top pod -n sovereign

# Increase memory limit
kubectl set resources deployment coinbase-agent \
  --limits=memory=2Gi \
  -n sovereign

# Restart pods
kubectl rollout restart deployment/coinbase-agent -n sovereign
```

### Network Issues

```bash
# Check service endpoints
kubectl get endpoints -n sovereign

# Test DNS
kubectl run -it --rm debug --image=busybox --restart=Never -- nslookup coinbase-agent

# Check network policies
kubectl get networkpolicies -n sovereign
```

---

## Security Hardening

### Network Policies

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: coinbase-agent-policy
  namespace: sovereign
spec:
  podSelector:
    matchLabels:
      app: coinbase-agent
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - namespaceSelector:
        matchLabels:
          name: sovereign
  egress:
  - to:
    - namespaceSelector: {}
    ports:
    - protocol: TCP
      port: 443
```

### Pod Security Policy

```yaml
apiVersion: policy/v1beta1
kind: PodSecurityPolicy
metadata:
  name: coinbase-agent-psp
spec:
  privileged: false
  allowPrivilegeEscalation: false
  requiredDropCapabilities:
  - ALL
  volumes:
  - 'configMap'
  - 'emptyDir'
  - 'projected'
  - 'secret'
  - 'downwardAPI'
  - 'persistentVolumeClaim'
  hostNetwork: false
  hostIPC: false
  hostPID: false
  runAsUser:
    rule: 'MustRunAsNonRoot'
  seLinux:
    rule: 'MustRunAs'
    seLinuxOptions:
      level: "s0:c123,c456"
  fsGroup:
    rule: 'MustRunAs'
    ranges:
    - min: 1000
      max: 65535
  readOnlyRootFilesystem: true
```

---

## Maintenance

### Regular Updates

```bash
# Check for chart updates
helm repo update
helm search repo coinbase-agent

# Upgrade chart
helm upgrade coinbase-agent ./helm/coinbase-agent \
  --namespace sovereign \
  --values helm/coinbase-agent/values.yaml
```

### Cleanup

```bash
# Remove old pods
kubectl delete pod -n sovereign --field-selector=status.phase=Failed

# Remove old deployments
kubectl delete deployment -n sovereign --selector=app!=coinbase-agent

# Prune unused resources
kubectl delete pvc -n sovereign --field-selector=status.phase=Released
```

---

## Support

For issues and questions:
- Documentation: https://docs.sovereign.ae
- GitHub: https://github.com/sovereign-ae/aegentis-x
- Email: ops@sovereign.ae
- Slack: #coinbase-agent
