# Meta Quest 3 VR App Installation Guide

**Sovereign System VR Portal on Meta Quest 3**

Complete step-by-step guide for installing and running the Sovereign System VR app on Meta Quest 3.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation Methods](#installation-methods)
3. [First Launch](#first-launch)
4. [Configuration](#configuration)
5. [Troubleshooting](#troubleshooting)
6. [Support](#support)

---

## Prerequisites

### Hardware Requirements
- **Meta Quest 3** (8GB or 12GB RAM)
- **Headset Storage**: Minimum 2GB free space
- **WiFi Connection**: 5GHz recommended for optimal performance
- **Fully Charged**: At least 50% battery

### Software Requirements
- **Meta Quest OS**: Latest version (v60+)
- **Developer Account**: Optional (for sideloading)
- **Sovereign System Account**: Required for authentication

### Network Requirements
- Stable internet connection (WiFi or mobile hotspot)
- Access to `sovereignportal-mjghklkv.manus.space`
- Firewall: Allow HTTPS (port 443) and WebSocket (port 8080)

---

## Installation Methods

### Method 1: App Store Installation (Recommended)

**Timeline**: 3-8 business days (after app approval)

#### Step 1: Wait for App Store Approval
1. App is submitted to Meta Quest Store
2. Meta reviews for 2-4 business days
3. You'll receive approval email
4. App appears in Meta Quest Store

#### Step 2: Install from Meta Quest Store
1. **Put on Meta Quest 3 headset**
2. **Open Meta Quest Store** (bottom menu)
3. **Search**: "Sovereign System VR"
4. **Click**: "Install" button
5. **Wait**: App downloads and installs (2-5 minutes)
6. **Launch**: Click "Open" or find in app library

#### Step 3: First Launch
1. **App opens** → AEGENTIS-X splash screen
2. **Select Platform**: Click "META QUEST" button
3. **Authenticate**: Sign in with your Sovereign System account
4. **Accept Permissions**: Grant necessary access
5. **Enter VR**: Portal loads immersive environment

---

### Method 2: WebXR (Browser - Fastest)

**Timeline**: Immediate (no installation)

#### Step 1: Open Browser on Meta Quest 3
1. **Put on headset**
2. **Open Meta Quest Browser** (app library)
3. **Navigate to**: `sovereignportal-mjghklkv.manus.space/vr`

#### Step 2: Launch VR Experience
1. **Page loads** → AEGENTIS-X interface appears
2. **Click**: "META QUEST" button
3. **Allow Permissions**: Grant XR access
4. **Enter Immersive Mode**: Full VR experience starts

#### Step 3: Use VR Controls
- **Hand Tracking**: Use hands to interact
- **Controller**: Use Meta Quest controllers
- **Voice Commands**: Say commands aloud
- **Gaze**: Look at UI elements to select

---

### Method 3: Sideloading (Developer Mode)

**Timeline**: 30 minutes setup + 5 minutes install

#### Step 1: Enable Developer Mode
1. **On your PC/Mac**:
   - Install Meta Quest Developer Hub
   - Connect Meta Quest 3 via USB-C
   - Enable "Developer Mode" in headset settings
   - Authorize USB connection

#### Step 2: Sideload APK
1. **Download APK**: From `dist/sovereign-system-vr.apk`
2. **Open Developer Hub**: Select your headset
3. **Click**: "Install APK"
4. **Select**: `sovereign-system-vr.apk` file
5. **Wait**: Installation completes (2-3 minutes)

#### Step 3: Launch Sideloaded App
1. **Put on headset**
2. **Go to**: App Library → Unknown Sources
3. **Find**: "Sovereign System VR"
4. **Click**: Launch

---

## First Launch

### Initial Setup Wizard

**Step 1: Welcome Screen**
- App name and version displayed
- "Get Started" button
- System requirements check

**Step 2: Platform Selection**
- Choose: "META QUEST" (recommended)
- Alternative: "WEBXR" (browser mode)
- Click: "Continue"

**Step 3: Authentication**
- **Sign In Screen** appears
- Enter credentials:
  - Email/Username
  - Password
- Click: "Authenticate"
- Manus OAuth flow completes

**Step 4: Permissions**
- **Camera**: Allow (for hand tracking)
- **Microphone**: Allow (for voice commands)
- **Location**: Allow (optional, for geo-features)
- Click: "Accept All"

**Step 5: Tutorial**
- 2-minute interactive tutorial
- Learn basic controls
- Practice navigation
- Skip option available

**Step 6: Enter Portal**
- Tutorial completes
- AEGENTIS-X environment loads
- You're in the immersive portal!

---

## Configuration

### Network Configuration

#### WiFi Setup
1. **Headset Settings** → WiFi
2. **Select**: Your network
3. **Enter**: WiFi password
4. **Connect**: Wait for connection
5. **Verify**: Internet icon shows connected

#### Firewall Rules
If behind corporate firewall:
- Allow HTTPS (port 443)
- Allow WebSocket (port 8080)
- Allow domain: `sovereignportal-mjghklkv.manus.space`
- Contact IT if blocked

### Performance Settings

#### Graphics Quality
1. **In-App Settings** → Graphics
2. **Resolution**: High (recommended)
3. **Frame Rate**: 90 FPS (default)
4. **Anti-Aliasing**: On
5. **Shadows**: On

#### Audio Settings
1. **Settings** → Audio
2. **Spatial Audio**: On
3. **Microphone**: On
4. **Volume**: Adjust to preference
5. **Voice Commands**: Enabled

### User Profile

#### Create Profile
1. **Settings** → Profile
2. **Display Name**: Enter your name
3. **Avatar**: Customize appearance
4. **Authority Level**: Displays your role
5. **Save**: Profile saved

#### Update Credentials
1. **Settings** → Account
2. **Change Password**: Update if needed
3. **Two-Factor Auth**: Enable (recommended)
4. **Session Timeout**: Set preference
5. **Save**: Changes applied

---

## Troubleshooting

### App Won't Install

**Problem**: "Installation Failed" error

**Solutions**:
1. Check storage space (need 2GB minimum)
2. Restart headset: Hold power button 30 seconds
3. Clear cache: Settings → Storage → Clear Cache
4. Reinstall: Remove app, reinstall from store
5. Contact support if persists

### App Crashes on Launch

**Problem**: App closes immediately

**Solutions**:
1. **Force Stop**: Settings → Apps → Sovereign System → Force Stop
2. **Clear Data**: Settings → Apps → Sovereign System → Clear Data
3. **Reinstall**: Remove and reinstall app
4. **Update OS**: Check for Meta Quest OS updates
5. **Factory Reset**: Last resort (backs up data first)

### Authentication Fails

**Problem**: "Login Failed" or "Invalid Credentials"

**Solutions**:
1. Check internet connection
2. Verify credentials are correct
3. Reset password on web portal
4. Clear app cache and retry
5. Try WebXR method instead

### Poor Performance / Lag

**Problem**: App is slow or stuttering

**Solutions**:
1. **Close other apps**: Free up RAM
2. **Restart headset**: Power off/on
3. **Lower graphics**: Settings → Graphics → Lower quality
4. **Move closer to WiFi router**: Improve signal
5. **Update app**: Check for latest version

### Hand Tracking Not Working

**Problem**: Hands not visible in VR

**Solutions**:
1. **Ensure good lighting**: Bright room helps
2. **Check permissions**: Settings → Apps → Permissions → Camera
3. **Calibrate hands**: Settings → Hand Tracking → Calibrate
4. **Use controllers**: Switch to controller mode
5. **Restart app**: Close and reopen

### Microphone Not Working

**Problem**: Voice commands not recognized

**Solutions**:
1. **Check permissions**: Settings → Apps → Permissions → Microphone
2. **Test microphone**: Settings → Audio → Test Microphone
3. **Increase volume**: Speak louder and clearer
4. **Restart app**: Close and reopen
5. **Update app**: Install latest version

### Network Connection Issues

**Problem**: "Cannot connect to server" error

**Solutions**:
1. **Check WiFi**: Ensure connected to internet
2. **Restart WiFi**: Toggle WiFi off/on
3. **Check firewall**: Ensure ports 443 and 8080 are open
4. **Try mobile hotspot**: Test with phone hotspot
5. **Contact IT**: If behind corporate firewall

---

## Advanced Configuration

### Command Line Installation (Developer)

```bash
# Download APK
wget https://sovereignportal-mjghklkv.manus.space/dist/sovereign-system-vr.apk

# Install via adb
adb install sovereign-system-vr.apk

# Launch app
adb shell am start -n com.sovereign.vr/.MainActivity
```

### Environment Variables

Set these before launching for custom configuration:

```bash
# Gateway URL
VITE_AEGENTIS_GATEWAY_URL=https://sovereignportal-mjghklkv.manus.space/api/v1

# OAuth Portal
VITE_OAUTH_PORTAL_URL=https://oauth.manus.im

# Analytics
VITE_ANALYTICS_ENDPOINT=https://analytics.manus.im
```

### Debug Mode

Enable debug logging:
1. **Settings** → Developer
2. **Debug Mode**: Toggle On
3. **Log Level**: Select "Verbose"
4. **Save**: Changes applied
5. **Restart**: App restarts with logging

---

## Performance Tips

### Optimize for Best Experience

1. **Charge Fully**: 100% battery recommended
2. **Good Lighting**: Bright room for hand tracking
3. **WiFi 5GHz**: Better than 2.4GHz
4. **Close Other Apps**: Free up 2GB+ RAM
5. **Update OS**: Latest Meta Quest OS
6. **Clear Cache**: Regularly clear app cache
7. **Restart Headset**: Weekly restart recommended

### Recommended Settings

| Setting | Recommendation |
|---------|-----------------|
| Resolution | High |
| Frame Rate | 90 FPS |
| Spatial Audio | On |
| Hand Tracking | On |
| Voice Commands | On |
| Graphics Quality | High |
| WiFi Band | 5GHz |

---

## Support

### Getting Help

**In-App Support**:
1. **Settings** → Support
2. **Contact Support**: Opens support form
3. **Submit**: Issue is logged
4. **Response**: Within 24 hours

**Web Support**:
- Visit: `sovereignportal-mjghklkv.manus.space/support`
- Email: support@sovereign-system.io
- Phone: +1-555-SOVEREIGN (1-555-768-3847)

### Common Questions

**Q: Can I use with Meta Quest Pro?**
A: Yes, app is compatible with Quest Pro (same installation process)

**Q: Do I need internet after installation?**
A: Yes, app requires constant connection for AEGENTIS operations

**Q: Can I use with other VR headsets?**
A: Yes, use WebXR method for other headsets (Valve Index, HTC Vive, etc.)

**Q: How much storage does the app use?**
A: Approximately 1.5GB after installation

**Q: Is my data private?**
A: Yes, all data encrypted end-to-end with AEGENTIS verification

**Q: Can I use offline?**
A: No, app requires internet connection for all features

---

## Uninstallation

### Remove App from Meta Quest 3

1. **App Library** → Find "Sovereign System VR"
2. **Long Press**: Hold on app icon
3. **Select**: "Uninstall"
4. **Confirm**: "Yes, uninstall"
5. **Complete**: App removed

### Clear All Data

To completely remove all app data:
1. **Settings** → Apps & Games
2. **Find**: "Sovereign System VR"
3. **Click**: "Uninstall"
4. **Storage** → Clear Cache
5. **Done**: All data removed

---

## Version History

| Version | Release Date | Changes |
|---------|--------------|---------|
| 1.0.0 | June 2026 | Initial release |
| 1.0.1 | Pending | Bug fixes, performance improvements |
| 1.1.0 | Planned | New features, enhanced UI |

---

## Legal

- **License**: Proprietary (Sovereign System)
- **Privacy**: See privacy policy in app
- **Terms**: Agree to terms on first launch
- **Support**: 24/7 support available

---

**Last Updated**: June 5, 2026

**Questions?** Contact support@sovereign-system.io
