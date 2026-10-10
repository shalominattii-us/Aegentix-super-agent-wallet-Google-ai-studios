# Meta Horizon Integration Guide: SovereignAE

## Overview

This guide provides the complete integration specifications for deploying the **SovereignAE** Unity build to Meta Horizon OS with the Sovereign System Portal backend.

---

## 1. Docker Deployment Setup

### Prerequisites
- Docker & Docker Compose installed
- Meta Developer Account with SovereignAE app created
- Environment variables configured

### Quick Start

```bash
# 1. Clone the Portal repository
git clone <portal-repo-url> sovereign-system-portal
cd sovereign-system-portal

# 2. Copy environment template
cp .env.example .env

# 3. Configure environment variables (see Section 2)
nano .env

# 4. Build Portal image
docker build -t sovereign-portal:latest .

# 5. Build AEGENTIS image
docker build -t sovereign-aegentis:latest ./server/vr-backend

# 6. Start all services
docker-compose -f docker-compose.meta-horizon.yml up -d

# 7. Verify services
docker-compose -f docker-compose.meta-horizon.yml ps
```

### Service Endpoints (After Deployment)

| Service | Port | Endpoint |
|---------|------|----------|
| Portal Backend | 3000 | `http://localhost:3000` |
| Metrics | 3001 | `http://localhost:3001` |
| MySQL | 3306 | `mysql://sovereign:sovereignpass@localhost:3306/sovereign_portal` |
| AEGENTIS | 8001 | `http://localhost:8001` |
| Ollama | 11434 | `http://localhost:11434` |
| Redis | 6379 | `redis://localhost:6379` |
| Prometheus | 9090 | `http://localhost:9090` |
| Grafana | 3002 | `http://localhost:3002` |

---

## 2. Environment Variables

Create `.env` file with the following variables:

```env
# Database
DATABASE_URL=mysql://sovereign:sovereignpass@mysql:3306/sovereign_portal
MYSQL_ROOT_PASSWORD=sovereignroot
MYSQL_USER=sovereign
MYSQL_PASSWORD=sovereignpass
MYSQL_DATABASE=sovereign_portal

# Auth & Security
JWT_SECRET=<generate-strong-secret>
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

### Generate JWT Secret

```bash
openssl rand -base64 32
```

---

## 3. Unity Build Integration

### 3.1 Connection Configuration

In your Unity project, configure the following connection parameters:

```csharp
// SovereignAEConfig.cs
public class SovereignAEConfig
{
    // Portal Backend
    public const string PORTAL_ENDPOINT = "https://sovereignportal-mjghklkv.manus.space";
    // OR for local development:
    // public const string PORTAL_ENDPOINT = "http://localhost:3000";
    
    // AEGENTIS Local Endpoint
    public const string AEGENTIS_ENDPOINT = "http://aegentis:8001";
    // OR for local development:
    // public const string AEGENTIS_ENDPOINT = "http://localhost:8001";
    
    // Ollama Endpoint
    public const string OLLAMA_ENDPOINT = "http://ollama:11434";
    // OR for local development:
    // public const string OLLAMA_ENDPOINT = "http://localhost:11434";
    
    // WebSocket for real-time sync
    public const string WEBSOCKET_ENDPOINT = "wss://sovereignportal-mjghklkv.manus.space/api/ws";
    // OR for local development:
    // public const string WEBSOCKET_ENDPOINT = "ws://localhost:3000/api/ws";
    
    // App Configuration
    public const string APP_ID = "SovereignAE";
    public const string APP_VERSION = "1.0.0";
    
    // VR Configuration
    public const bool IMMERSIVE_ONLY = true;
    public const bool SELF_HEALING_ENABLED = true;
    public const bool DEVICE_MANAGEMENT_ENABLED = true;
}
```

### 3.2 REST API Integration

**Connect to Portal Backend:**

```csharp
using UnityEngine.Networking;
using System.Collections;

public class PortalClient
{
    private string portalEndpoint = SovereignAEConfig.PORTAL_ENDPOINT;
    
    // Get VR Session
    public IEnumerator GetVRSession(string userId)
    {
        string url = $"{portalEndpoint}/api/trpc/vr.getSession?input={{\"userId\":\"{userId}\"}}";
        
        using (UnityWebRequest request = UnityWebRequest.Get(url))
        {
            request.SetRequestHeader("Authorization", $"Bearer {authToken}");
            yield return request.SendWebRequest();
            
            if (request.result == UnityWebRequest.Result.Success)
            {
                string jsonResponse = request.downloadHandler.text;
                VRSession session = JsonUtility.FromJson<VRSession>(jsonResponse);
                // Use session data
            }
        }
    }
    
    // Execute Command via AEGENTIS-X
    public IEnumerator ExecuteCommand(string commandMode, string directive)
    {
        string url = $"{portalEndpoint}/api/trpc/aegentis.executeCommand";
        
        var commandData = new
        {
            commandMode = commandMode,  // "voice", "gesture", "gaze", "sovereignDirective"
            directive = directive,
            manifestationForm = "full_avatar"
        };
        
        string jsonBody = JsonUtility.ToJson(commandData);
        
        using (UnityWebRequest request = new UnityWebRequest(url, "POST"))
        {
            request.uploadHandler = new UploadHandlerRaw(System.Text.Encoding.UTF8.GetBytes(jsonBody));
            request.downloadHandler = new DownloadHandlerBuffer();
            request.SetRequestHeader("Content-Type", "application/json");
            request.SetRequestHeader("Authorization", $"Bearer {authToken}");
            
            yield return request.SendWebRequest();
            
            if (request.result == UnityWebRequest.Result.Success)
            {
                string response = request.downloadHandler.text;
                // Handle response
            }
        }
    }
}
```

### 3.3 WebSocket Integration (Real-time Sync)

```csharp
using WebSocketSharp;

public class SovereignWebSocketClient
{
    private WebSocket ws;
    
    public void Connect()
    {
        ws = new WebSocket(SovereignAEConfig.WEBSOCKET_ENDPOINT);
        
        ws.OnOpen += () =>
        {
            Debug.Log("WebSocket connected to Portal");
            
            // Subscribe to reality layer updates
            var subscribeMessage = new
            {
                action = "subscribe",
                channel = "reality_layers",
                userId = currentUserId
            };
            
            ws.Send(JsonUtility.ToJson(subscribeMessage));
        };
        
        ws.OnMessage += (sender, e) =>
        {
            var update = JsonUtility.FromJson<RealityLayerUpdate>(e.Data);
            HandleRealityLayerUpdate(update);
        };
        
        ws.OnError += (sender, e) =>
        {
            Debug.LogError($"WebSocket error: {e.Message}");
        };
        
        ws.OnClose += (sender, e) =>
        {
            Debug.Log("WebSocket closed");
        };
        
        ws.Connect();
    }
    
    private void HandleRealityLayerUpdate(RealityLayerUpdate update)
    {
        // Update VR environment based on reality layer changes
        Debug.Log($"Reality layer {update.layerId} updated: {update.status}");
    }
}
```

### 3.4 AEGENTIS Local Integration

**Direct AEGENTIS Connection:**

```csharp
public class AEGENTISClient
{
    private string aegentisEndpoint = SovereignAEConfig.AEGENTIS_ENDPOINT;
    
    // Cognitive Test
    public IEnumerator RunCognitiveTest(string testType)
    {
        string url = $"{aegentisEndpoint}/api/cognitive-test";
        
        var testData = new
        {
            testType = testType,
            userId = currentUserId,
            timestamp = System.DateTime.UtcNow.ToString("O")
        };
        
        string jsonBody = JsonUtility.ToJson(testData);
        
        using (UnityWebRequest request = new UnityWebRequest(url, "POST"))
        {
            request.uploadHandler = new UploadHandlerRaw(System.Text.Encoding.UTF8.GetBytes(jsonBody));
            request.downloadHandler = new DownloadHandlerBuffer();
            request.SetRequestHeader("Content-Type", "application/json");
            
            yield return request.SendWebRequest();
            
            if (request.result == UnityWebRequest.Result.Success)
            {
                var result = JsonUtility.FromJson<CognitiveTestResult>(request.downloadHandler.text);
                Debug.Log($"Cognitive test result: {result.score}");
            }
        }
    }
    
    // Device Management
    public IEnumerator ManageDevice(string deviceId, string action)
    {
        string url = $"{aegentisEndpoint}/api/device-management";
        
        var deviceData = new
        {
            deviceId = deviceId,
            action = action,  // "scan", "control", "monitor"
            userId = currentUserId
        };
        
        string jsonBody = JsonUtility.ToJson(deviceData);
        
        using (UnityWebRequest request = new UnityWebRequest(url, "POST"))
        {
            request.uploadHandler = new UploadHandlerRaw(System.Text.Encoding.UTF8.GetBytes(jsonBody));
            request.downloadHandler = new DownloadHandlerBuffer();
            request.SetRequestHeader("Content-Type", "application/json");
            
            yield return request.SendWebRequest();
            
            if (request.result == UnityWebRequest.Result.Success)
            {
                var response = JsonUtility.FromJson<DeviceManagementResponse>(request.downloadHandler.text);
                // Handle device response
            }
        }
    }
}
```

---

## 4. Meta Quest 3 Platform Configuration

### 4.1 Quest App Manifest

Update your Unity project's `AndroidManifest.xml`:

```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.sovereign.ae">
    
    <uses-permission android:name="com.oculus.permission.HAND_TRACKING" />
    <uses-permission android:name="com.oculus.permission.SCENE_UNDERSTANDING" />
    <uses-permission android:name="com.oculus.permission.SPATIAL_ANCHORS" />
    <uses-permission android:name="com.oculus.permission.PASSTHROUGH" />
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    
    <application
        android:label="@string/app_name"
        android:icon="@mipmap/ic_launcher">
        
        <activity
            android:name="com.sovereign.ae.MainActivity"
            android:screenOrientation="landscape"
            android:launchMode="singleTask">
            
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>
```

### 4.2 Quest Features Configuration

In your Unity project, enable the following in `ProjectSettings/ProjectSettings`:

```
XR Plugin Management:
  - Oculus: Enabled
  - Quest 3: Target Device
  
XR Features:
  - Hand Tracking: Level 2
  - Scene Understanding: Enabled
  - Spatial Anchors: Enabled
  - Passthrough: Enabled
  - Foveated Rendering: High Quality
  - Adaptive Space Warp: Enabled
  - On-Device Inference: Enabled
  
Graphics:
  - Target Framerate: 90 FPS
  - Anti-aliasing: MSAA 4x
  - Dynamic Resolution: Enabled
```

---

## 5. Apple Vision Pro Integration

### 5.1 Vision Pro Configuration

In your Unity project, enable the following in `ProjectSettings/ProjectSettings`:

```
XR Plugin Management:
  - Apple Vision Pro: Enabled
  
XR Features:
  - Eye Tracking: Enabled
  - Hand Gesture: Enabled
  - Scene Understanding: Enabled
  - Spatial Audio: Enabled
  
Graphics:
  - Target Framerate: 90 FPS
  - Dynamic Resolution: Enabled
  - Spatial Rendering: Enabled
```

### 5.2 Vision Pro Code Integration

```csharp
using Apple.Vision;

public class VisionProBridge
{
    public void InitializeVisionPro()
    {
        // Eye tracking calibration
        VisionProEyeTracking.RequestCalibration();
        
        // Scene understanding
        VisionProSceneUnderstanding.StartSceneUnderstanding();
        
        // Hand gesture mapping
        VisionProGestureRecognizer.RegisterGesture("pinch", OnPinchGesture);
        VisionProGestureRecognizer.RegisterGesture("point", OnPointGesture);
    }
    
    private void OnPinchGesture(HandGestureEvent e)
    {
        // Execute command on pinch
        StartCoroutine(ExecuteCommand("gesture", "pinch"));
    }
    
    private void OnPointGesture(HandGestureEvent e)
    {
        // Execute command on point
        StartCoroutine(ExecuteCommand("gaze", "point"));
    }
}
```

---

## 6. Deployment Checklist

### Pre-Deployment

- [ ] Meta Developer Account created
- [ ] SovereignAE app registered in Meta Developer Center
- [ ] App ID obtained
- [ ] All environment variables configured
- [ ] Docker images built and tested locally
- [ ] Unity build compiled for Quest 3
- [ ] Vision Pro build compiled (if applicable)
- [ ] SSL certificates configured
- [ ] Database migrations applied

### Deployment Steps

```bash
# 1. Push images to registry (if using cloud)
docker tag sovereign-portal:latest <registry>/sovereign-portal:latest
docker push <registry>/sovereign-portal:latest

# 2. Deploy to Meta Horizon infrastructure
docker-compose -f docker-compose.meta-horizon.yml up -d

# 3. Verify all services
docker-compose -f docker-compose.meta-horizon.yml ps

# 4. Run health checks
curl http://localhost:3000/api/health
curl http://localhost:8001/health
curl http://localhost:11434/api/tags

# 5. Upload to Meta Developer Center
# - Go to https://developer.oculus.com/
# - Select SovereignAE app
# - Upload APK/AAB build
# - Configure app settings
# - Submit for review

# 6. Test on Quest 3 device
# - Install app from Meta Developer Center
# - Launch app
# - Verify Portal connection
# - Test AEGENTIS integration
# - Run cognitive tests
```

### Post-Deployment

- [ ] Monitor logs: `docker-compose -f docker-compose.meta-horizon.yml logs -f portal-backend`
- [ ] Check metrics: `http://localhost:3002` (Grafana)
- [ ] Verify database: `docker-compose -f docker-compose.meta-horizon.yml exec mysql mysql -u sovereign -p`
- [ ] Test WebSocket: `wscat -c ws://localhost:3000/api/ws`
- [ ] Validate AEGENTIS: `curl http://localhost:8001/health`

---

## 7. Troubleshooting

### Portal Backend Not Starting

```bash
# Check logs
docker-compose -f docker-compose.meta-horizon.yml logs portal-backend

# Verify database connection
docker-compose -f docker-compose.meta-horizon.yml exec mysql mysql -u sovereign -p -e "SELECT 1"

# Restart service
docker-compose -f docker-compose.meta-horizon.yml restart portal-backend
```

### AEGENTIS Connection Failed

```bash
# Check AEGENTIS service
docker-compose -f docker-compose.meta-horizon.yml logs aegentis

# Verify Ollama is running
docker-compose -f docker-compose.meta-horizon.yml exec ollama curl http://localhost:11434/api/tags

# Restart AEGENTIS
docker-compose -f docker-compose.meta-horizon.yml restart aegentis
```

### WebSocket Connection Issues

```bash
# Test WebSocket endpoint
wscat -c ws://localhost:3000/api/ws

# Check Redis connection
docker-compose -f docker-compose.meta-horizon.yml exec redis redis-cli ping

# Verify Socket.IO configuration
curl -I http://localhost:3000/socket.io/?EIO=4&transport=polling
```

### Quest 3 App Not Connecting

1. Verify Portal endpoint in `SovereignAEConfig.cs`
2. Check network connectivity: `adb shell ping sovereignportal-mjghklkv.manus.space`
3. Review app logs: `adb logcat | grep SovereignAE`
4. Verify SSL certificates are valid
5. Check firewall rules

---

## 8. Production Deployment

### Cloud Deployment (AWS/GCP/Azure)

```bash
# 1. Push to container registry
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com
docker tag sovereign-portal:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/sovereign-portal:latest
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/sovereign-portal:latest

# 2. Deploy to Kubernetes (if using K8s)
kubectl apply -f k8s-deployment.yml

# 3. Configure DNS
# Point sovereignportal-mjghklkv.manus.space to load balancer IP

# 4. Set up monitoring
# Configure CloudWatch/Stackdriver alerts
# Set up log aggregation
```

### Scaling Configuration

```yaml
# docker-compose.meta-horizon.yml scaling
services:
  portal-backend:
    deploy:
      replicas: 3
      resources:
        limits:
          cpus: '2'
          memory: 4G
        reservations:
          cpus: '1'
          memory: 2G
```

---

## 9. Support & Documentation

- **Portal Docs**: `PORTAL_EXPORT_CONFIG.md`
- **AEGENTIS Docs**: `AEGENTIS_INTEGRATION_GUIDE.md`
- **Meta Horizon Docs**: https://developer.oculus.com/
- **Meta Quest 3 Docs**: https://developer.oculus.com/documentation/native/android/
- **Apple Vision Pro Docs**: https://developer.apple.com/visionos/

---

## 10. Quick Reference

### Essential Commands

```bash
# Start all services
docker-compose -f docker-compose.meta-horizon.yml up -d

# Stop all services
docker-compose -f docker-compose.meta-horizon.yml down

# View logs
docker-compose -f docker-compose.meta-horizon.yml logs -f

# Execute command in container
docker-compose -f docker-compose.meta-horizon.yml exec portal-backend npm run db:push

# Rebuild images
docker-compose -f docker-compose.meta-horizon.yml build --no-cache

# Health check
curl http://localhost:3000/api/health
```

### Key Endpoints

| Endpoint | Purpose |
|----------|---------|
| `POST /api/trpc/vr.getSession` | Get VR session |
| `POST /api/trpc/aegentis.executeCommand` | Execute AEGENTIS command |
| `POST /api/trpc/reality.switchLayer` | Switch reality layer |
| `WS /api/ws` | WebSocket for real-time sync |
| `GET /api/health` | Health check |

---

**SovereignAE is now Meta Horizon ready!** 🚀

For questions or issues, refer to the troubleshooting section or contact support.
