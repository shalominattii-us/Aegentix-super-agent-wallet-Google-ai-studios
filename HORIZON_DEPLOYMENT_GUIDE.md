# Meta Horizon Deployment Guide — Sovereign Portal VR

## Quest 3 WebXR Integration

This guide covers deploying the Sovereign Portal VR experience to Meta Horizon Worlds.

---

## 1. Build & Deploy Portal

### Prerequisites
- Node.js 20+
- Docker + Docker Hub account
- Kubernetes cluster (AWS EKS, GCP GKE, or self-hosted)
- Meta Horizon Creator Portal account

### Build & Push

```bash
# Build Docker image
npm run build
docker build -t registry.yourdomain.com/cogn8tives:latest -f cogn8tives/Dockerfile .
docker push registry.yourdomain.com/cogn8tives:latest

# Deploy to Kubernetes
kubectl apply -f k8s/l1-hardening.yaml

# Verify deployment
kubectl get pods -n cogn8tives
kubectl logs -n cogn8tives -l app=cogn8tives --tail=50
```

### Health Check

```bash
# Wait for service to be ready
kubectl wait --for=condition=ready pod -l app=cogn8tives -n cogn8tives --timeout=300s

# Test health endpoint
kubectl port-forward -n cogn8tives svc/cogn8tives-svc 3000:443
curl http://localhost:3000/health
# Expected: {"seal":"GREEN","drift":0,"nodes":1}
```

---

## 2. CORS & WebXR Headers

Add to `next.config.js` or your web server configuration:

```javascript
async headers() {
  return [
    {
      source: '/vr-portal.html',
      headers: [
        {
          key: 'Cross-Origin-Embedder-Policy',
          value: 'require-corp',
        },
        {
          key: 'Cross-Origin-Opener-Policy',
          value: 'same-origin',
        },
        {
          key: 'Cross-Origin-Resource-Policy',
          value: 'cross-origin',
        },
        {
          key: 'Permissions-Policy',
          value: 'microphone=(self), camera=(self), xr-spatial-tracking=(self)',
        },
      ],
    },
  ];
}
```

**Why these headers?**
- `Cross-Origin-Embedder-Policy`: Required for SharedArrayBuffer (WebXR)
- `Cross-Origin-Opener-Policy`: Isolates browsing context for security
- `Permissions-Policy`: Grants microphone access for voice commands

---

## 3. Meta Horizon World Configuration

### Create World in Horizon Creator Portal

1. Log in to [Meta Horizon Creator Portal](https://www.horizonworlds.com/create)
2. Click **Create World**
3. Name: `Sovereign Constellation`
4. Description: `Event-sourced sovereign runtime with continuity preservation`
5. Privacy: `Public` or `Private` (your choice)

### Add WebSurface

1. In world editor, click **Add Object** → **WebSurface**
2. Configure:
   - **URL**: `https://cogn8tives.yourdomain.com/vr-portal.html`
   - **Width**: 1024
   - **Height**: 1024
   - **Scale**: 2.0 (adjust to fit world)
   - **Position**: Center of world
3. Enable:
   - ✅ **Microphone** (for voice commands)
   - ✅ **Spatial Audio** (for Guardian TTS)
   - ✅ **WebXR** (for immersive mode)
4. **Interaction**: Set to `Trigger on Gaze + Controller Select`

### Test in Horizon Browser

1. On Quest 3, open **Horizon Browser**
2. Navigate to `https://cogn8tives.yourdomain.com/vr-portal.html`
3. Click **Enter VR** button
4. FIRSTVSCENE boots (7.83Hz thrum, constellation appears)
5. Say: "MINT AGENT CARL" → new star appears

---

## 4. Quest 3 User Flow

### Step-by-Step

1. **User enters Horizon World**
   - Sees WebSurface with Portal interface
   - 2D fallback visible (mouse controls)

2. **Click "Enter VR"**
   - Browser requests XR session
   - Quest shows permission prompt
   - FIRSTVSCENE boots (5-second sequence)

3. **Guardian TTS speaks**
   - "Continuity is locked. Synthesis is enabled. What do you mint?"
   - User hears via spatial audio

4. **Voice Command**
   - User says: "MINT AGENT CARL"
   - Web Speech API captures transcript
   - `/api/v1/command` called with HMAC nonce
   - New star spawns in constellation
   - Guardian confirms: "Asset minted: tx_12345"

5. **Continuous Sync**
   - WebSocket streams live `head_tx` updates
   - Constellation updates in real-time
   - HUD shows DRIFT, SEAL, NODE metrics

---

## 5. JWT & Authentication

### Token Lifecycle

1. **User logs in** on `/identity` page (2D)
   - Enters credentials
   - Receives `SOVEREIGN_TOKEN` JWT
   - Token stored in `localStorage`

2. **VR Portal reads token**
   - On page load: `const jwt = localStorage.getItem('auth_token')`
   - Includes in all API calls: `Authorization: Bearer ${jwt}`

3. **Token expiry**
   - Set to 1 hour
   - Before expiry, refresh via `/api/v1/refresh`
   - If expired in VR: Show "Re-authenticate" overlay

### Secure Token Storage

```typescript
// client/src/pages/Identity.tsx
const handleLogin = async (email: string, password: string) => {
  const response = await fetch('/api/v1/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  
  const { token } = await response.json();
  
  // Store with expiry
  localStorage.setItem('auth_token', token);
  localStorage.setItem('auth_token_expires', Date.now() + 3600000); // 1h
};

// VR Portal checks token before commands
const getAuthToken = () => {
  const token = localStorage.getItem('auth_token');
  const expires = parseInt(localStorage.getItem('auth_token_expires') || '0');
  
  if (Date.now() > expires) {
    // Token expired, redirect to login
    window.location.href = '/identity';
    return null;
  }
  
  return token;
};
```

---

## 6. Monitoring & Observability

### Prometheus Metrics

Portal exposes metrics at `/metrics`:

```
cogn8tives_drift_ms{instance="pod-1"} 2.5
cogn8tives_seal_status{instance="pod-1",status="GREEN"} 1
cogn8tives_tx_lag_ms{instance="pod-1"} 15
cogn8tives_vr_ws_clients{instance="pod-1"} 42
cogn8tives_command_count{action="mint_agent"} 1523
cogn8tives_command_errors{action="mint_agent"} 3
```

### Grafana Dashboard

Import dashboard JSON:

```json
{
  "dashboard": {
    "title": "Cogn8tives Portal",
    "panels": [
      {
        "title": "Drift (ms)",
        "targets": [{"expr": "cogn8tives_drift_ms"}]
      },
      {
        "title": "Seal Status",
        "targets": [{"expr": "cogn8tives_seal_status"}]
      },
      {
        "title": "VR WebSocket Clients",
        "targets": [{"expr": "cogn8tives_vr_ws_clients"}]
      },
      {
        "title": "Command Success Rate",
        "targets": [{"expr": "rate(cogn8tives_command_count[5m])"}]
      }
    ]
  }
}
```

### Alerting Rules

```yaml
groups:
- name: cogn8tives
  rules:
  - alert: HighDrift
    expr: cogn8tives_drift_ms > 16
    for: 2m
    annotations:
      summary: "Drift exceeds 16ms"
  
  - alert: SealRed
    expr: cogn8tives_seal_status{status="RED"} == 1
    for: 1m
    annotations:
      summary: "Seal status is RED"
  
  - alert: NoVRClients
    expr: cogn8tives_vr_ws_clients == 0
    for: 5m
    annotations:
      summary: "No VR clients connected"
```

---

## 7. Troubleshooting

### WebXR Not Supported

**Error**: "WebXR not available"

**Fix**:
- Ensure Quest 3 has latest firmware
- Use Horizon Browser (not Chrome)
- Check CORS headers are set correctly

### Voice Commands Not Working

**Error**: "Speech recognition failed"

**Fix**:
- Grant microphone permission in Quest settings
- Check Web Speech API support (Chrome/Edge only)
- Speak clearly, pause between words

### Constellation Not Rendering

**Error**: "Three.js scene blank"

**Fix**:
- Check WebGL support: `gl.getParameter(gl.VERSION)`
- Verify `/health` returns `seal: GREEN`
- Check browser console for WebGL errors

### Token Expired

**Error**: "401 Unauthorized"

**Fix**:
- Refresh token: `POST /api/v1/refresh`
- Or re-authenticate on `/identity` page
- Check token expiry: `localStorage.getItem('auth_token_expires')`

---

## 8. Production Checklist

- [ ] DNS configured: `cogn8tives.yourdomain.com`
- [ ] SSL certificate installed (Let's Encrypt)
- [ ] Kubernetes cluster healthy: `kubectl get nodes`
- [ ] AEGENTIS backend running: `curl http://aegentis-svc:43118/health`
- [ ] Portal health check passing: `curl https://cogn8tives.yourdomain.com/health`
- [ ] Prometheus scraping metrics
- [ ] Grafana dashboard accessible
- [ ] Alerting rules active
- [ ] Meta Horizon World published
- [ ] Quest 3 test user can enter VR
- [ ] Voice commands working
- [ ] Constellation rendering at 90fps
- [ ] WebSocket stream live
- [ ] Royalty tracking enabled (if using licensing)

---

## 9. Next Steps

1. **L2 Hardening**: Deploy Raft consensus for multi-node failover
2. **L3 Federation**: Enable cross-domain BFT and CRDT synchronization
3. **Enterprise Licensing**: Activate royalty tracking and monthly invoicing
4. **Mobile App**: Deploy to iOS/Android with native WebXR bridge

---

**Questions?** Check `/health` endpoint or review logs: `kubectl logs -n cogn8tives -f`
