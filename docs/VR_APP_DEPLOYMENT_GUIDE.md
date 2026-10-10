# Sovereign System VR Portal - Installation & Deployment Guide

**Version:** 1.0.0  
**Platforms:** Meta Quest 3, Apple Vision Pro, Windows Mixed Reality  
**Updated:** June 2026

---

## Quick Start

### For End Users

1. **Don your VR headset** (Meta Quest 3, Apple Vision Pro, or Windows MR device)
2. **Open app store** (Meta Quest Store, Apple App Store, or Microsoft Store)
3. **Search:** "Sovereign System VR"
4. **Install** and launch
5. **Sign in** with your Sovereign System credentials
6. **Calibrate** your play area
7. **Begin operations**

### For System Administrators

1. **Prepare infrastructure** (see Infrastructure Requirements)
2. **Configure API endpoints** (see Configuration)
3. **Deploy backend services** (see Backend Deployment)
4. **Distribute app packages** (see Distribution Methods)
5. **Monitor deployment** (see Monitoring & Support)

---

## Installation Methods

### Method 1: App Store Installation (Recommended)

#### Meta Quest 3

1. On your Meta Quest 3, press the **Meta button** on the right controller
2. Select **Apps** → **App Store**
3. Use the search icon and search for **"Sovereign System VR"**
4. Select the app and choose **Install**
5. Wait for installation to complete
6. Select **Open** to launch

**Time Required:** 2-5 minutes  
**Storage Required:** 2GB free space  
**Network:** WiFi 6E or wired Ethernet recommended

#### Apple Vision Pro

1. On Apple Vision Pro, open the **App Store**
2. Tap the **Search** tab at the bottom
3. Search for **"Sovereign System VR"**
4. Tap **Get** next to the app
5. Authenticate with Face ID or Apple ID
6. Wait for installation to complete
7. Tap **Open** to launch

**Time Required:** 3-7 minutes  
**Storage Required:** 2GB free space  
**Network:** WiFi 6E or wired Ethernet recommended

#### Windows Mixed Reality

1. On Windows 11, open **Microsoft Store**
2. Select the **Search** icon
3. Search for **"Sovereign System VR"**
4. Select the app and choose **Get**
5. Wait for installation to complete
6. Select **Launch** to start

**Time Required:** 2-5 minutes  
**Storage Required:** 2GB free space  
**Network:** WiFi 6E or wired Ethernet recommended

### Method 2: Sideloading (For Developers)

#### Meta Quest 3 Sideloading

**Prerequisites:**
- Meta Quest 3 with Developer Mode enabled
- Android Debug Bridge (ADB) installed on PC
- APK file: `SovereignSystemVR-MetaQuest3-1.0.0.apk`

**Steps:**

1. **Enable Developer Mode on Meta Quest 3:**
   - Settings → System → Developer Mode
   - Toggle **Developer Mode** to ON
   - Restart headset

2. **Connect Meta Quest 3 to PC:**
   - Connect via USB-C cable
   - On headset, select **Allow** when prompted for USB debugging

3. **Install APK via ADB:**
   ```bash
   adb devices  # Verify connection
   adb install SovereignSystemVR-MetaQuest3-1.0.0.apk
   ```

4. **Launch the app:**
   - On Meta Quest 3, go to Library → Unknown Sources
   - Select **Sovereign System VR**
   - Press **Install** or **Open**

**Time Required:** 5-10 minutes  
**Troubleshooting:** See Sideloading Troubleshooting section

#### Apple Vision Pro Sideloading

**Prerequisites:**
- Apple Vision Pro
- Xcode installed on Mac
- IPA file: `SovereignSystemVR-VisionPro-1.0.0.ipa`
- Apple Developer account

**Steps:**

1. **Prepare IPA for installation:**
   ```bash
   # On Mac with Xcode
   xcrun xcode-select --install
   ```

2. **Install via Xcode:**
   - Open Xcode
   - Select Window → Devices and Simulators
   - Select your Vision Pro
   - Drag IPA file to the app list

3. **Or use Apple Configurator 2:**
   - Open Apple Configurator 2
   - Connect Vision Pro
   - Drag IPA file to device
   - Confirm installation

4. **Launch the app:**
   - On Vision Pro, find **Sovereign System VR** in your apps
   - Select to launch

**Time Required:** 10-15 minutes  
**Troubleshooting:** See Sideloading Troubleshooting section

#### Windows Mixed Reality Sideloading

**Prerequisites:**
- Windows 11 Build 22621 or later
- APPX file: `SovereignSystemVR-WindowsMR-1.0.0.appx`
- Developer Mode enabled

**Steps:**

1. **Enable Developer Mode:**
   - Settings → Privacy & Security → For developers
   - Toggle **Developer Mode** to ON

2. **Install APPX via PowerShell (Admin):**
   ```powershell
   Add-AppxPackage -Path "C:\path\to\SovereignSystemVR-WindowsMR-1.0.0.appx"
   ```

3. **Or install via File Explorer:**
   - Right-click APPX file
   - Select **Install**
   - Confirm installation

4. **Launch the app:**
   - Start Menu → Search "Sovereign System VR"
   - Select and launch

**Time Required:** 3-5 minutes  
**Troubleshooting:** See Sideloading Troubleshooting section

### Method 3: Enterprise Distribution

#### For IT Administrators

**Using Mobile Device Management (MDM):**

1. **Meta Quest 3 (via Meta for Work):**
   - Upload APK to Meta for Work console
   - Assign to device groups
   - Devices auto-install on next sync

2. **Apple Vision Pro (via Apple Business Manager):**
   - Add app to Apple Business Manager
   - Assign to users or devices
   - Auto-install via MDM profile

3. **Windows Mixed Reality (via Intune):**
   - Upload APPX to Microsoft Intune
   - Create deployment profile
   - Assign to device groups
   - Auto-install via Intune agent

**Documentation:** See Enterprise Deployment section

---

## First-Time Setup

### Initial Launch

1. **Don your VR headset** and launch the app
2. **Wait for calibration screen** (appears on first launch)
3. **Follow on-screen instructions:**
   - Mark play area boundaries
   - Calibrate controllers/hand tracking
   - Set comfort preferences
4. **Grant permissions:**
   - Camera (for hand tracking)
   - Microphone (for voice commands)
   - Location (for federation services)
5. **Sign in** with your Sovereign System credentials
6. **Complete onboarding tutorial** (optional but recommended)

**Time Required:** 5-10 minutes

### Authentication

**OAuth 2.0 Flow:**

1. App displays login screen
2. Select **Sign In**
3. Browser opens to Sovereign System login portal
4. Enter credentials and authenticate
5. Authorize app permissions
6. Redirected back to app
7. App loads your identity and authority level

**Supported Providers:**
- Sovereign System native authentication
- OIDC-compatible identity providers
- SAML 2.0 providers (enterprise)

### Permissions

The app requests the following permissions:

| Permission | Purpose | Optional |
|-----------|---------|----------|
| Camera | Hand tracking and gesture recognition | No |
| Microphone | Voice commands and audio input | No |
| Location | Federation service geolocation | Yes |
| Contacts | Not used | N/A |
| Calendar | Not used | N/A |

**Privacy Note:** The app does not collect personal data beyond authentication credentials. All permissions are used only for the stated purposes.

---

## Configuration

### Environment Variables

Create a `.env` file in the app configuration directory:

```bash
# AEGENTIS Gateway Configuration
VITE_AEGENTIS_GATEWAY_URL=https://aegentis.sovereignsystem.gov/api/v1
VITE_AEGENTIS_GATEWAY_PORT=8080

# OAuth Configuration
VITE_OAUTH_PORTAL_URL=https://auth.sovereignsystem.gov
VITE_OAUTH_CLIENT_ID=vr-portal-client-id
VITE_APP_ID=sovereign-vr-portal

# API Configuration
VITE_FRONTEND_FORGE_API_URL=https://api.sovereignsystem.gov
VITE_FRONTEND_FORGE_API_KEY=your-api-key-here

# Analytics Configuration
VITE_ANALYTICS_ENDPOINT=https://analytics.sovereignsystem.gov
VITE_ANALYTICS_WEBSITE_ID=vr-portal

# App Configuration
VITE_APP_TITLE=Sovereign System VR
VITE_APP_LOGO=https://cdn.sovereignsystem.gov/logo.png

# Network Configuration
NETWORK_TIMEOUT_MS=30000
NETWORK_RETRY_ATTEMPTS=3
NETWORK_RETRY_DELAY_MS=1000

# VR Configuration
VR_TARGET_FRAMERATE=90
VR_HAND_TRACKING_ENABLED=true
VR_VOICE_COMMANDS_ENABLED=true
VR_GESTURE_RECOGNITION_ENABLED=true
```

### Platform-Specific Configuration

#### Meta Quest 3

**File Location:** `/sdcard/Android/data/gov.sovereignsystem.vr.metaquest/files/config.json`

```json
{
  "platform": "metaquest",
  "handTracking": true,
  "controllers": true,
  "hapticFeedback": true,
  "targetFramerate": 90,
  "graphicsQuality": "high",
  "audioMode": "spatial"
}
```

#### Apple Vision Pro

**File Location:** `~/Library/Containers/gov.sovereignsystem.vr.visionpro/Data/Documents/config.json`

```json
{
  "platform": "visionpro",
  "eyeTracking": true,
  "handTracking": true,
  "spatialAudio": true,
  "targetFramerate": 90,
  "graphicsQuality": "ultra",
  "audioMode": "spatial"
}
```

#### Windows Mixed Reality

**File Location:** `%APPDATA%\SovereignSystemVR\config.json`

```json
{
  "platform": "windowsmr",
  "controllers": true,
  "handTracking": true,
  "hapticFeedback": true,
  "targetFramerate": 90,
  "graphicsQuality": "high",
  "audioMode": "spatial"
}
```

---

## Backend Deployment

### Infrastructure Requirements

**Minimum Specifications:**

| Component | Requirement |
|-----------|-------------|
| **CPU** | 4 cores, 2.4 GHz minimum |
| **RAM** | 8GB minimum, 16GB recommended |
| **Storage** | 50GB SSD minimum |
| **Network** | 1Gbps connection, <50ms latency |
| **Bandwidth** | 100 Mbps minimum per 100 users |

**Recommended Specifications:**

| Component | Recommendation |
|-----------|-----------------|
| **CPU** | 8+ cores, 3.0+ GHz |
| **RAM** | 32GB+ |
| **Storage** | 500GB+ SSD |
| **Network** | 10Gbps, <20ms latency |
| **Bandwidth** | 1Gbps per 100 users |

### Docker Deployment

**Prerequisites:**
- Docker 20.10+
- Docker Compose 2.0+
- 50GB free disk space

**Steps:**

1. **Clone deployment repository:**
   ```bash
   git clone https://github.com/sovereignsystem/vr-portal-deployment.git
   cd vr-portal-deployment
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your settings
   nano .env
   ```

3. **Start services:**
   ```bash
   docker-compose up -d
   ```

4. **Verify deployment:**
   ```bash
   docker-compose ps
   curl http://localhost:8080/health
   ```

5. **View logs:**
   ```bash
   docker-compose logs -f
   ```

### Kubernetes Deployment

**Prerequisites:**
- Kubernetes 1.24+
- kubectl configured
- Helm 3.0+

**Steps:**

1. **Add Helm repository:**
   ```bash
   helm repo add sovereignsystem https://helm.sovereignsystem.gov
   helm repo update
   ```

2. **Install chart:**
   ```bash
   helm install vr-portal sovereignsystem/vr-portal \
     --namespace vr-portal \
     --create-namespace \
     -f values.yaml
   ```

3. **Verify deployment:**
   ```bash
   kubectl get pods -n vr-portal
   kubectl get svc -n vr-portal
   ```

4. **Check logs:**
   ```bash
   kubectl logs -n vr-portal -l app=vr-portal -f
   ```

### AWS Deployment

**Using CloudFormation:**

```bash
aws cloudformation create-stack \
  --stack-name vr-portal \
  --template-body file://vr-portal-template.yaml \
  --parameters ParameterKey=Environment,ParameterValue=production
```

**Using ECS:**

```bash
aws ecs create-service \
  --cluster vr-portal \
  --service-name vr-portal-service \
  --task-definition vr-portal:1 \
  --desired-count 3
```

---

## Monitoring & Support

### Health Checks

**API Health Endpoint:**
```bash
curl https://aegentis.sovereignsystem.gov/api/v1/health
```

**Expected Response:**
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "uptime": 3600,
  "timestamp": "2026-06-05T12:00:00Z"
}
```

### Performance Monitoring

**Key Metrics:**
- Frame rate (target: 90 FPS)
- Network latency (<50ms)
- Command execution time (<500ms)
- API response time (<200ms)
- Error rate (<0.1%)

**Monitoring Tools:**
- Prometheus for metrics collection
- Grafana for visualization
- ELK Stack for log aggregation
- DataDog for APM

### Troubleshooting

#### App Won't Install

**Meta Quest 3:**
- Check storage space (minimum 2GB free)
- Verify network connection
- Restart headset
- Clear app cache: Settings → Apps → Unknown Sources → Clear Cache

**Apple Vision Pro:**
- Check storage space (minimum 2GB free)
- Verify network connection
- Restart Vision Pro
- Sign out and back into App Store

**Windows MR:**
- Check storage space (minimum 2GB free)
- Verify network connection
- Run: `Get-AppxPackage -Name SovereignSystemVR | Remove-AppxPackage`
- Reinstall from Microsoft Store

#### App Crashes on Launch

1. **Force close the app:**
   - Meta Quest: Long-press app, select Close
   - Vision Pro: Swipe up from bottom
   - Windows MR: Alt+F4

2. **Clear app data:**
   - Meta Quest: Settings → Apps → Manage Apps → Clear Data
   - Vision Pro: Settings → Apps → Offload App → Reinstall
   - Windows MR: Settings → Apps → Apps & Features → Repair

3. **Reinstall the app:**
   - Uninstall completely
   - Restart device
   - Reinstall from app store

#### Cannot Connect to AEGENTIS-X

**Check network:**
```bash
ping aegentis.sovereignsystem.gov
traceroute aegentis.sovereignsystem.gov
```

**Verify firewall:**
- Port 8080 (HTTP) - open
- Port 443 (HTTPS) - open
- Port 9443 (WebSocket) - open

**Check credentials:**
- Verify OAuth token is valid
- Re-authenticate if needed
- Check authority level permissions

**Check service status:**
- Visit: https://status.sovereignsystem.gov
- Check AEGENTIS-X service status
- Check federation node status

#### Poor Performance / High Latency

1. **Network optimization:**
   - Move closer to WiFi router
   - Switch to wired Ethernet if available
   - Reduce other network usage
   - Check bandwidth: `iperf3 -c server.example.com`

2. **Device optimization:**
   - Close other apps
   - Restart headset
   - Reduce graphics quality in settings
   - Enable power saving mode if available

3. **Backend optimization:**
   - Check server CPU/memory usage
   - Scale up infrastructure if needed
   - Enable caching
   - Optimize database queries

### Support Contacts

| Issue Type | Contact | Response Time |
|-----------|---------|-----------------|
| **General Support** | vr-support@sovereignsystem.gov | 24 hours |
| **Technical Issues** | ops@sovereignsystem.gov | 4 hours |
| **Security Issues** | security@sovereignsystem.gov | 1 hour |
| **Emergency** | +1-555-VR-HELP | 15 minutes |

### Escalation Procedure

1. **Level 1 - User Support**
   - Email: vr-support@sovereignsystem.gov
   - Response: 24 hours
   - Issues: General questions, basic troubleshooting

2. **Level 2 - Technical Support**
   - Email: ops@sovereignsystem.gov
   - Response: 4 hours
   - Issues: Performance, crashes, connectivity

3. **Level 3 - Engineering**
   - Email: engineering@sovereignsystem.gov
   - Response: 2 hours
   - Issues: Bugs, feature requests, infrastructure

4. **Level 4 - Emergency Response**
   - Phone: +1-555-VR-HELP
   - Response: 15 minutes
   - Issues: Security breaches, system outages

---

## Updates & Maintenance

### Automatic Updates

The app automatically checks for updates on launch:

1. **Check for new version**
2. **If available, prompt user**
3. **Download in background**
4. **Install on next app restart**

**Update Schedule:**
- Security patches: As needed
- Bug fixes: Weekly
- Feature updates: Monthly
- Major releases: Quarterly

### Manual Updates

**Meta Quest 3:**
- Settings → Apps → App Store → Updates → Update

**Apple Vision Pro:**
- App Store → Updates → Sovereign System VR → Update

**Windows MR:**
- Microsoft Store → Updates → Sovereign System VR → Update

### Rollback Procedure

If an update causes issues:

1. **Uninstall current version**
2. **Restart device**
3. **Reinstall previous version** (if available)
4. **Contact support** if issues persist

---

## Security Best Practices

### Authentication

- Always use strong passwords (12+ characters)
- Enable two-factor authentication if available
- Never share credentials
- Log out when finished

### Network Security

- Use VPN for remote access
- Ensure WiFi is password-protected
- Use WPA3 encryption if available
- Keep firewall enabled

### Data Protection

- Enable device encryption
- Use secure WiFi networks
- Avoid public WiFi for sensitive operations
- Enable app-level encryption

### Incident Response

If you suspect a security issue:

1. **Disconnect from network**
2. **Close the app**
3. **Contact security team:** security@sovereignsystem.gov
4. **Provide details:** What happened, when, affected systems
5. **Follow remediation steps**

---

## Additional Resources

- **Documentation:** https://docs.sovereignsystem.gov/vr
- **API Reference:** https://api.sovereignsystem.gov/docs
- **Status Page:** https://status.sovereignsystem.gov
- **Community Forum:** https://forum.sovereignsystem.gov
- **GitHub Repository:** https://github.com/sovereignsystem/vr-portal

---

**Document Version:** 1.0.0  
**Last Updated:** June 2026  
**Next Review:** September 2026  
**Approval Status:** Ready for Distribution
