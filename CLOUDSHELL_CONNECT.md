# AEGENTIS AWS CloudShell Connection Guide

## Quick Connection (Copy & Paste)

### Option 1: Bash Script
```bash
bash cloudshell-aegentis-connect.sh
```

### Option 2: Direct kubectl Commands
```bash
# Set configuration
AWS_REGION="us-west-1"
EKS_CLUSTER="sovereign-cluster"
AEGENTIS_NS="aegentis"
AEGENTIS_SVC="aegentis-kernel"

# Configure kubectl
aws eks update-kubeconfig --name $EKS_CLUSTER --region $AWS_REGION

# Port forward
kubectl port-forward -n $AEGENTIS_NS svc/$AEGENTIS_SVC 8001:8001

# Test connection (in another CloudShell tab)
curl http://localhost:8001/health
```

### Option 3: Cat Command (View Configuration)
```bash
cat << 'EOF'
# AEGENTIS AWS Configuration
AWS_REGION=us-west-1
EKS_CLUSTER=sovereign-cluster
AEGENTIS_NAMESPACE=aegentis
AEGENTIS_SERVICE=aegentis-kernel
AEGENTIS_PORT=8001

# Connection String
AEGENTIS_ENDPOINT=http://localhost:8001

# Health Check
curl http://localhost:8001/health

# Get pods
kubectl get pods -n aegentis -l app=aegentis-kernel

# Get service
kubectl get svc -n aegentis aegentis-kernel

# View logs
kubectl logs -n aegentis -l app=aegentis-kernel -f

# Describe deployment
kubectl describe deployment aegentis-kernel -n aegentis
EOF
```

## Available Endpoints

Once connected, access:

- **Health**: `http://localhost:8001/health`
- **Identity**: `http://localhost:8001/identity`
- **Command**: `http://localhost:8001/command`
- **Federation**: `http://localhost:8001/internal/federation`
- **Events**: `http://localhost:8001/internal/events`
- **Metrics**: `http://localhost:8001:9090/metrics`

## Example API Calls

### Get AEGENTIS Status
```bash
curl http://localhost:8001/health | jq .
```

### Get Identity
```bash
curl http://localhost:8001/identity | jq .
```

### Execute Command
```bash
curl -X POST http://localhost:8001/command \
  -H "Content-Type: application/json" \
  -d '{
    "command": "skill_synthesis",
    "params": {
      "skill_name": "voice_recognition",
      "version": "1.0.0"
    }
  }' | jq .
```

### Stream Events
```bash
curl -N http://localhost:8001/internal/events
```

## Troubleshooting

### Connection Refused
```bash
# Check if pods are running
kubectl get pods -n aegentis

# Check service
kubectl get svc -n aegentis

# Check logs
kubectl logs -n aegentis -l app=aegentis-kernel --tail=50
```

### Port Already in Use
```bash
# Kill existing port forward
pkill -f "port-forward.*8001"

# Try different port
kubectl port-forward -n aegentis svc/aegentis-kernel 8002:8001
```

### Authentication Issues
```bash
# Verify AWS credentials
aws sts get-caller-identity

# Re-authenticate
aws configure

# Update kubeconfig
aws eks update-kubeconfig --name sovereign-cluster --region us-west-1
```

## Persistent Connection

To keep connection alive in CloudShell:

```bash
# Start in background
nohup kubectl port-forward -n aegentis svc/aegentis-kernel 8001:8001 > /tmp/aegentis-pf.log 2>&1 &

# Check status
ps aux | grep port-forward

# View logs
tail -f /tmp/aegentis-pf.log
```

## Integration with Dashboard

The AEGENTIS kernel is automatically integrated with:
- Dashboard: https://sovereignportal-mjghklkv.manus.space
- Skill Economy: https://sovereignportal-mjghklkv.manus.space/skill-economy
- VR Portal: https://sovereignportal-mjghklkv.manus.space/vr-quest

All CloudShell commands will synchronize with the live dashboard.
