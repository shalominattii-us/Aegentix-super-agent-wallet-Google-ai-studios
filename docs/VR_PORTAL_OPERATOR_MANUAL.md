# VR Portal Operator Manual

**Version:** 1.0  
**Last Updated:** June 2026  
**Classification:** OPERATIONAL  
**Platforms:** Meta Quest 3, Apple Vision Pro, Windows Mixed Reality

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [System Requirements](#system-requirements)
3. [Initial Setup](#initial-setup)
4. [Core Interface](#core-interface)
5. [Navigation & Movement](#navigation--movement)
6. [Command Panel](#command-panel)
7. [Identity & Authority](#identity--authority)
8. [Real-Time Monitoring](#real-time-monitoring)
9. [Emergency Procedures](#emergency-procedures)
10. [Troubleshooting](#troubleshooting)
11. [Maintenance](#maintenance)

---

## Quick Start

### First-Time Entry

1. **Don VR Headset** - Meta Quest 3, Apple Vision Pro, or compatible device
2. **Launch Portal App** - Open Sovereign System VR application
3. **Authenticate** - Use OAuth credentials (same as web portal)
4. **Calibrate Space** - Follow on-screen calibration for your play area
5. **Enter Immersive Mode** - Accept permissions and enter VR environment

**Estimated Setup Time:** 5-10 minutes

### Daily Operations

1. **Boot Sequence** - Launch app and authenticate
2. **Authority Check** - Confirm your authority level (SOVEREIGN/COMMANDER/OPERATOR/CADET)
3. **System Status** - Review health metrics in command panel
4. **Begin Operations** - Navigate to desired workspace

---

## System Requirements

### Hardware

| Component | Meta Quest 3 | Apple Vision Pro | Windows MR |
|-----------|-------------|-----------------|-----------|
| Processor | Snapdragon XR Gen 2 | Apple M2 | Intel i7+ / AMD Ryzen 7+ |
| RAM | 8GB | 16GB | 16GB |
| Storage | 128GB+ | 256GB+ | 256GB+ |
| Display | 1800x1920 per eye | 2048x2048 per eye | 1440x1440 per eye |
| Refresh Rate | 90Hz | 90Hz | 90Hz |
| Tracking | 6DOF hand/head | Eye + hand tracking | 6DOF controllers |

### Network

- **Bandwidth:** Minimum 50 Mbps, recommended 100+ Mbps
- **Latency:** <50ms recommended (critical for command execution)
- **Connection:** WiFi 6E or hardwired Ethernet preferred
- **Firewall:** Port 8080 (AEGENTIS-X) and 443 (HTTPS) must be open

### Software

- **OS:** Meta Quest OS 14+, visionOS 2+, Windows 11+
- **Browser:** Chromium-based (Edge, Chrome) for WebXR
- **Auth:** OAuth 2.0 compatible identity provider
- **VPN:** Optional but recommended for classified operations

---

## Initial Setup

### 1. Device Configuration

**Meta Quest 3:**
```
Settings → System → Developer Mode → Enable
Settings → System → USB Debugging → Enable
Settings → Apps → Unknown Sources → Allow
```

**Apple Vision Pro:**
```
Settings → Developer → Enable Developer Mode
Settings → Privacy → Allow VR Portal app permissions
```

**Windows MR:**
```
Settings → Mixed Reality → Enable Developer Mode
Settings → Privacy → Allow app access to camera/microphone
```

### 2. Network Configuration

1. Connect to WiFi 6E network or Ethernet
2. Run network diagnostics: **Settings → Network → Diagnostics**
3. Confirm latency <50ms and bandwidth >50 Mbps
4. Configure proxy if required: **Settings → Network → Proxy**

### 3. Authentication Setup

1. Launch VR Portal app
2. Select **"New User"** or **"Existing Account"**
3. Scan QR code or enter OAuth credentials
4. Authorize Portal app access to identity provider
5. Confirm authority level and permissions
6. Set up biometric unlock (fingerprint/face)

### 4. Spatial Calibration

1. Clear play area (minimum 2m x 2m)
2. Follow on-screen calibration wizard
3. Define floor level and boundaries
4. Test hand tracking and controllers
5. Adjust comfort settings (locomotion type, FOV, etc.)

### 5. Preferences Configuration

**Display Settings:**
- Brightness: 80-100% (adjust for ambient lighting)
- Contrast: 100%
- Refresh Rate: 90Hz (or 120Hz if supported)
- Anti-aliasing: On

**Audio Settings:**
- Spatial Audio: On
- Microphone: Enable for voice commands
- Volume: 70-80% (adjust for environment)
- Haptic Feedback: On

**Comfort Settings:**
- Locomotion: Teleport (recommended for first-time users)
- Snap Turning: 45° increments
- Vignette: On (reduces motion sickness)
- Field of View: 100% (default)

---

## Core Interface

### Main Menu

The main menu appears when you activate the **Menu Button** (right controller):

```
┌─────────────────────────────────────┐
│  SOVEREIGN SYSTEM VR PORTAL         │
├─────────────────────────────────────┤
│  [Identity]      [Commands]         │
│  [Monitoring]    [Treasury]         │
│  [Compliance]    [Settings]         │
│  [Help]          [Logout]           │
└─────────────────────────────────────┘
```

### Workspace Panels

**Identity Panel** - Authority, seals, federation status
**Command Panel** - Execute operations, skill synthesis
**Monitoring Panel** - Real-time metrics, event streams
**Treasury Panel** - Transaction status, multi-sig approvals
**Compliance Panel** - Investigations, alerts, reports

### Gesture Controls

| Gesture | Action |
|---------|--------|
| **Pinch Thumb + Index** | Select/Activate |
| **Grab (Full Hand)** | Move/Drag panels |
| **Palm Up + Rotate** | Rotate objects |
| **Two-Hand Grab** | Scale/Resize |
| **Swipe (Index Finger)** | Navigate/Scroll |
| **Point (Index Only)** | Aim/Target |

### Voice Commands

**Global Commands:**
- "Show menu" - Display main menu
- "Close panel" - Dismiss active panel
- "Help" - Show contextual help
- "Record" - Start session recording
- "Logout" - End session

**Authority Commands:**
- "Check authority" - Display current level
- "Request elevation" - Request higher authority
- "Verify identity" - Re-authenticate

---

## Navigation & Movement

### Locomotion Types

**Teleportation (Default)**
1. Point index finger at destination
2. Curve arc shows trajectory
3. Pinch to teleport
4. Smooth arrival with fade effect

**Smooth Locomotion (Advanced)**
1. Hold controller forward to move
2. Adjust speed with trigger pressure
3. Use head direction for steering
4. Recommended for experienced users only

**Snap Turning**
1. Rotate right controller 45° clockwise to turn right
2. Rotate left controller 45° counter-clockwise to turn left
3. Each rotation = 45° turn
4. Adjustable in Settings

### Spatial Awareness

**Boundary System:**
- Red boundary appears when approaching play area edge
- Haptic feedback warns of boundary proximity
- Automatic fade-out prevents collision
- Expand boundary in Settings → Space

**Comfort Features:**
- Vignette effect reduces motion sickness
- Locomotion speed adjustable
- Rest areas available throughout environment
- "Safe Mode" disables aggressive movement

---

## Command Panel

### Accessing Commands

1. Activate right controller menu
2. Select **"Commands"** from main menu
3. Command panel appears in front of you
4. Grab and position for optimal viewing

### Command Types

**Skill Synthesis Commands**
- Mint new assets
- Execute treasury operations
- Trigger compliance workflows
- Manage federation peers

**System Commands**
- Health checks
- Status queries
- Configuration updates
- Maintenance operations

**Emergency Commands**
- System lockdown
- Authority revocation
- Session termination
- Incident reporting

### Executing Commands

1. **Select Command** - Pinch on desired command
2. **Review Parameters** - Confirm operation details
3. **Authorize** - Provide biometric or voice confirmation
4. **Execute** - Command sends to AEGENTIS-X
5. **Monitor** - Watch real-time execution status

### Command Confirmation

**Authority-Based Confirmation:**

| Authority | Confirmation Required |
|-----------|----------------------|
| SOVEREIGN | Voice + Biometric |
| COMMANDER | Biometric only |
| OPERATOR | PIN + Biometric |
| CADET | PIN only |

---

## Identity & Authority

### Authority Levels

**SOVEREIGN** (Highest)
- Full system access
- Can modify governance rules
- Can revoke other authorities
- Can execute critical operations
- Requires dual authentication

**COMMANDER**
- Operational command authority
- Can execute treasury operations
- Can manage federation peers
- Can approve multi-sig transactions
- Requires biometric authentication

**OPERATOR**
- Standard operational authority
- Can execute routine commands
- Can query system state
- Can approve routine transactions
- Requires PIN + biometric

**CADET** (Lowest)
- Read-only access
- Can view dashboards
- Can query data
- Cannot execute commands
- Requires PIN only

### Authority Display

The **Identity Panel** shows:
- Current authority level (color-coded)
- Authority expiration (if applicable)
- Delegation status (if delegated authority)
- Recent authority changes
- Multi-factor authentication status

### Authority Elevation

**Requesting Higher Authority:**
1. Say "Request elevation" or select from menu
2. Specify target authority level
3. Provide justification (voice or text)
4. Wait for approval from higher authority
5. Confirmation appears in panel

**Delegating Authority:**
1. Open Identity Panel
2. Select "Delegate Authority"
3. Choose recipient and authority level
4. Set expiration time
5. Provide biometric confirmation

---

## Real-Time Monitoring

### Metrics Dashboard

The **Monitoring Panel** displays:

**System Health:**
- AEGENTIS-X status (ONLINE/OFFLINE)
- Gateway latency (target <50ms)
- Event stream health
- Database connectivity
- Federation peer status

**Operational Metrics:**
- Active commands (count and status)
- Transaction throughput (ops/sec)
- Error rate (%)
- Authority usage (breakdown by level)
- Compliance alerts (count)

**Performance Indicators:**
- FPS (frames per second)
- Latency (network round-trip)
- CPU usage (%)
- Memory usage (%)
- Bandwidth (Mbps)

### Event Stream Viewer

Real-time event feed showing:
- Identity changes
- Command executions
- Treasury transactions
- Compliance events
- Federation updates
- System alerts

**Filtering:**
- By event type
- By authority level
- By time range
- By component

**Actions:**
- Pause/resume stream
- Export events
- Set alerts
- Archive events

### Alert System

**Alert Levels:**

| Level | Color | Action |
|-------|-------|--------|
| CRITICAL | Red | Immediate attention required |
| URGENT | Orange | Address within 5 minutes |
| WARNING | Yellow | Monitor and plan response |
| INFO | Blue | Informational only |

**Alert Handling:**
1. Alert appears in notification area
2. Haptic feedback and audio cue
3. Select alert to view details
4. Take action or acknowledge
5. Alert clears or escalates

---

## Emergency Procedures

### System Lockdown

**When to Use:** Suspected compromise, unauthorized access, critical failure

**Procedure:**
1. Say "Emergency lockdown" or press emergency button
2. Confirm with biometric authentication
3. System immediately:
   - Revokes all active sessions
   - Locks all command execution
   - Preserves audit logs
   - Alerts security team
   - Enters read-only mode

**Recovery:**
1. Contact security team
2. Provide incident details
3. Undergo re-authentication
4. System resumes normal operation

### Authority Revocation

**When to Use:** Unauthorized activity detected, security breach

**Procedure:**
1. Open Identity Panel
2. Select "Revoke Authority"
3. Choose authority to revoke
4. Provide reason and evidence
5. Confirm with higher authority
6. Authority immediately revoked
7. Session terminated for affected user

### Session Termination

**Graceful Shutdown:**
1. Save any pending work
2. Say "Logout" or select from menu
3. Confirm logout
4. Session ends cleanly
5. Return to login screen

**Emergency Termination:**
1. Press emergency button (right controller)
2. Confirm termination
3. Session ends immediately
4. No save/cleanup performed
5. Incident logged

### Incident Reporting

**To Report an Incident:**
1. Say "Report incident" or use menu
2. Select incident type:
   - Security breach
   - System failure
   - Unauthorized access
   - Performance issue
   - Other
3. Provide detailed description
4. Attach evidence (screenshots, logs)
5. Submit to security team
6. Receive incident number
7. Track status in dashboard

---

## Troubleshooting

### Common Issues

**Issue: "Cannot Connect to AEGENTIS-X"**

*Symptoms:* Command panel shows "OFFLINE", latency >500ms

*Solutions:*
1. Check network connection (WiFi or Ethernet)
2. Verify firewall allows port 8080
3. Restart VR app
4. Restart headset
5. Check AEGENTIS-X service status
6. Contact system administrator

**Issue: "Hand Tracking Not Working"**

*Symptoms:* Controllers visible but hands not tracked

*Solutions:*
1. Ensure adequate lighting (>200 lux)
2. Remove hand obstructions (gloves, jewelry)
3. Re-calibrate hand tracking (Settings → Calibration)
4. Restart app
5. Update device firmware
6. Factory reset if persistent

**Issue: "High Latency / Lag"**

*Symptoms:* Commands delayed, panels stutter, movement jerky

*Solutions:*
1. Check network bandwidth (run diagnostics)
2. Move closer to WiFi router
3. Reduce background network usage
4. Close other apps
5. Switch to wired Ethernet
6. Reduce visual quality (Settings → Display)

**Issue: "Motion Sickness"**

*Symptoms:* Nausea, dizziness, disorientation

*Solutions:*
1. Enable vignette effect (Settings → Comfort)
2. Switch to teleportation mode
3. Reduce movement speed
4. Take frequent breaks (5-10 min)
5. Focus on fixed point during transitions
6. Adjust refresh rate (try 60Hz if 90Hz causes issues)

**Issue: "Audio Not Working"**

*Symptoms:* No sound, voice commands not recognized

*Solutions:*
1. Check volume level (Settings → Audio)
2. Verify microphone enabled
3. Test microphone (Settings → Audio → Test)
4. Restart app
5. Check headset speakers
6. Update audio drivers

### Performance Optimization

**For Smooth Operation:**

1. **Network:**
   - Use WiFi 6E or wired Ethernet
   - Minimize background traffic
   - Disable VPN if possible
   - Target <50ms latency

2. **Display:**
   - Reduce resolution if needed
   - Lower refresh rate to 60Hz if stuttering
   - Disable anti-aliasing if performance poor
   - Adjust brightness for environment

3. **System:**
   - Close background applications
   - Ensure adequate storage (>50GB free)
   - Update device firmware regularly
   - Restart headset daily

4. **Comfort:**
   - Use teleportation mode
   - Enable vignette effect
   - Take breaks every 30 minutes
   - Maintain good posture

---

## Maintenance

### Daily Maintenance

- Check system health metrics
- Review audit logs
- Verify all authorities active
- Test command execution
- Confirm federation connectivity

### Weekly Maintenance

- Review performance metrics
- Check for firmware updates
- Validate backup status
- Test emergency procedures
- Review compliance alerts

### Monthly Maintenance

- Full system diagnostics
- Database integrity check
- Authority audit review
- Security log analysis
- Capacity planning review

### Firmware Updates

**Checking for Updates:**
1. Settings → System → About
2. Check for available updates
3. If available, select "Update"
4. Confirm and restart headset
5. Update completes during restart

**Important:** Always update when available for security patches and performance improvements.

### Backup & Recovery

**Automatic Backups:**
- Session data backed up every 5 minutes
- Authority configurations backed up hourly
- Full system backup nightly

**Manual Backup:**
1. Settings → Backup → Create Backup
2. Select backup type (session/full)
3. Choose storage location
4. Confirm and wait for completion

**Recovery:**
1. Settings → Backup → Restore
2. Select backup to restore
3. Confirm restoration
4. System restarts with restored state

---

## Support & Resources

### Getting Help

**In-App Help:**
- Say "Help" to access contextual help
- Browse help topics in Settings → Help
- View video tutorials in Help → Tutorials

**Contact Support:**
- Email: vr-support@sovereignsystem.gov
- Phone: +1-555-VR-HELP (1-555-874-3357)
- Portal: https://support.sovereignsystem.gov
- Hours: 24/7 for critical issues, 8am-6pm EST for general support

**Emergency Contacts:**
- Security Incident: security@sovereignsystem.gov
- System Failure: ops@sovereignsystem.gov
- Authority Issues: admin@sovereignsystem.gov

### Documentation

- **VR Portal Operator Manual** (this document)
- **AEGENTIS-X Flight Manual** - Command reference
- **Authority Management Guide** - Authority procedures
- **Compliance Procedures** - Investigation workflows
- **Federation Operations** - Peer management

### Training

- **Basic Training:** 2 hours (required for all users)
- **Advanced Training:** 4 hours (for COMMANDER+ authority)
- **Emergency Procedures:** 1 hour (annual refresh required)
- **Compliance Training:** 2 hours (annual requirement)

---

## Appendix A: Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| Menu Button | Show main menu |
| Emergency Button | Emergency lockdown |
| Grip + Trigger | Grab/Move panel |
| Thumbstick Click | Teleport |
| Y/X Button | Toggle comfort mode |

---

## Appendix B: Glossary

- **AEGENTIS-X:** Immersive-only sovereign AI entity
- **Authority:** Permission level (SOVEREIGN/COMMANDER/OPERATOR/CADET)
- **Command Panel:** Interface for executing operations
- **Federation:** Network of peer systems
- **Latency:** Network delay (measured in milliseconds)
- **Monitoring Panel:** Real-time metrics display
- **Skill Synthesis:** Asset creation and operation execution
- **Teleportation:** Primary locomotion method
- **Treasury:** Financial operations and transactions
- **VR Portal:** Immersive interface to Sovereign System

---

**Document Classification:** OPERATIONAL  
**Last Updated:** June 2026  
**Next Review:** December 2026  
**Approved By:** AEGENTIS-X Command Authority
