# Meta Quest Store Submission Checklist

**Application:** Sovereign System VR Portal  
**Platform:** Meta Quest 3 (Oculus Quest 3)  
**Submission Date:** June 2026  
**Developer Account:** Your Meta Developer Account

---

## Pre-Submission Preparation (Complete Before Starting)

### Account & Developer Setup
- [ ] Meta Developer Account created and verified
- [ ] Developer account linked to Meta Quest device
- [ ] Payment method added to developer account
- [ ] Organization details verified in developer dashboard

### App Build & Testing
- [ ] APK built and tested on Meta Quest 3 device
- [ ] App launches without crashes
- [ ] All VR features tested (hand tracking, controllers, spatial audio)
- [ ] Performance tested (60 FPS maintained)
- [ ] No console errors or warnings
- [ ] Battery drain acceptable (<5% per 30 minutes)

### Assets & Media
- [ ] App icon created (512x512 PNG, transparent background)
- [ ] Store logo created (120x120 PNG)
- [ ] 5-8 screenshots captured (1920x1080 or device native)
- [ ] Promotional banner created (1280x720 PNG)
- [ ] Short video preview recorded (30-60 seconds, MP4)

---

## Meta Developer Dashboard Form Fields

### Step 1: Basic App Information

| Field | Value | Status |
|-------|-------|--------|
| **App Name** | Sovereign System VR | [ ] |
| **Package Name** | gov.sovereignsystem.vr.metaquest | [ ] |
| **Version Number** | 1.0.0 | [ ] |
| **Version Code** | 1 | [ ] |
| **Category** | Productivity | [ ] |
| **Content Rating** | 12+ (PEGI) | [ ] |
| **Price** | Free | [ ] |
| **Release Date** | [Your Date] | [ ] |

### Step 2: Description & Keywords

**Short Description (80 characters max):**
```
Immersive governance and command interface for Sovereign System operations
```
- [ ] Copied to dashboard

**Full Description:**
```
Sovereign System VR Portal brings governance and command operations into 
an immersive virtual reality environment. Designed for Meta Quest 3, this 
app provides operators with real-time access to identity verification, 
treasury operations, federation management, and system monitoring—all 
through an intuitive VR interface.

Key Features:
- Immersive Command Interface: Voice and gesture-controlled operations in full VR
- Real-Time Identity Verification: Confirm authority levels and permissions instantly
- Treasury Operations: Execute minting, transfers, and approvals in immersive space
- Federation Management: Synchronize with peer systems and manage consensus
- Live Monitoring: Real-time dashboards for system health and compliance
- Multi-User Presence: Collaborate with other operators in shared VR space
- Emergency Procedures: Quick-access emergency controls and failover commands
- Accessibility: Full hand tracking and controller support

Authority Levels:
- SOVEREIGN: Full system control and governance
- COMMANDER: Operational management and treasury
- OPERATOR: Routine operations
- CADET: Read-only access

Security Features:
- OAuth 2.0 authentication
- End-to-end encryption
- HMAC request signing
- Authority-based access control
- Complete audit trail
- No personal data collection

Support:
- Documentation: https://docs.sovereignsystem.gov/vr
- Support Portal: https://support.sovereignsystem.gov/vr
- Email: vr-support@sovereignsystem.gov
- Phone: +1-555-VR-HELP
```
- [ ] Copied to dashboard

**Keywords (10 maximum):**
1. [ ] governance
2. [ ] virtualreality
3. [ ] immersive
4. [ ] command
5. [ ] treasury
6. [ ] sovereign
7. [ ] oculus
8. [ ] productivity
9. [ ] authority
10. [ ] federation

### Step 3: Developer Information

| Field | Value | Status |
|-------|-------|--------|
| **Developer Name** | Sovereign System Authority | [ ] |
| **Developer Email** | vr-support@sovereignsystem.gov | [ ] |
| **Support Email** | vr-support@sovereignsystem.gov | [ ] |
| **Support Phone** | +1-555-VR-HELP | [ ] |
| **Website** | https://sovereignsystem.gov | [ ] |
| **Privacy Policy URL** | https://sovereignsystem.gov/privacy | [ ] |
| **Terms of Service URL** | https://sovereignsystem.gov/terms | [ ] |

### Step 4: Content Rating

**PEGI Rating: 12+**

Answer the following questions:

| Question | Answer | Status |
|----------|--------|--------|
| Violence | None | [ ] |
| Language | None | [ ] |
| Sexual Content | None | [ ] |
| Substance Use | None | [ ] |
| Gambling | None | [ ] |
| Discrimination | None | [ ] |

### Step 5: Media & Screenshots

**App Icon:**
- [ ] File: `icon-512x512.png`
- [ ] Dimensions: 512x512 pixels
- [ ] Format: PNG (transparent background)
- [ ] Uploaded to dashboard

**Store Logo:**
- [ ] File: `store-logo-120x120.png`
- [ ] Dimensions: 120x120 pixels
- [ ] Format: PNG (transparent background)
- [ ] Uploaded to dashboard

**Screenshots (5-8 required):**

| # | Name | Description | Dimensions | Status |
|---|------|-------------|-----------|--------|
| 1 | `screenshot-1-home.png` | VR Portal home screen | 1920x1080 | [ ] |
| 2 | `screenshot-2-identity.png` | Identity panel with authority display | 1920x1080 | [ ] |
| 3 | `screenshot-3-commands.png` | Command interface with AEGENTIS-X | 1920x1080 | [ ] |
| 4 | `screenshot-4-monitoring.png` | Real-time monitoring dashboard | 1920x1080 | [ ] |
| 5 | `screenshot-5-treasury.png` | Treasury operations panel | 1920x1080 | [ ] |
| 6 | `screenshot-6-federation.png` | Federation management interface | 1920x1080 | [ ] |
| 7 | `screenshot-7-multiuser.png` | Multi-user collaboration view | 1920x1080 | [ ] |
| 8 | `screenshot-8-emergency.png` | Emergency procedures panel | 1920x1080 | [ ] |

**Promotional Banner:**
- [ ] File: `banner-1280x720.png`
- [ ] Dimensions: 1280x720 pixels
- [ ] Format: PNG
- [ ] Uploaded to dashboard

**Video Preview (Optional but Recommended):**
- [ ] File: `preview-video.mp4`
- [ ] Duration: 30-60 seconds
- [ ] Resolution: 1920x1080 or higher
- [ ] Format: MP4 (H.264 codec)
- [ ] Uploaded to dashboard

### Step 6: APK Upload

**Build Information:**
- [ ] APK file: `sovereign-system-vr-1.0.0.apk`
- [ ] File size: < 500 MB
- [ ] Minimum SDK: Android 10 (API 29)
- [ ] Target SDK: Android 13+ (API 33+)
- [ ] Architecture: arm64-v8a
- [ ] Signed with release key

**Upload Process:**
1. [ ] Go to "Build" section in Meta Developer Dashboard
2. [ ] Click "Upload APK"
3. [ ] Select `sovereign-system-vr-1.0.0.apk`
4. [ ] Wait for processing (2-5 minutes)
5. [ ] Verify build details display correctly
6. [ ] Confirm no build errors

### Step 7: Permissions & Privacy

**Required Permissions:**
- [ ] Camera (hand tracking)
- [ ] Microphone (voice commands)
- [ ] Internet (API communication)
- [ ] Storage (app data)

**Privacy Policy:**
- [ ] Privacy policy URL verified and accessible
- [ ] Policy covers data collection practices
- [ ] Policy covers third-party sharing (none)
- [ ] Policy covers user rights and deletion

**Terms of Service:**
- [ ] Terms URL verified and accessible
- [ ] Terms cover acceptable use
- [ ] Terms cover liability limitations
- [ ] Terms cover user obligations

### Step 8: Testing & Quality Assurance

**Functionality Testing:**
- [ ] App launches on Meta Quest 3
- [ ] Authentication works correctly
- [ ] All UI elements render properly
- [ ] Hand tracking functions correctly
- [ ] Controller input works as expected
- [ ] Voice commands recognized
- [ ] Network requests complete successfully
- [ ] Error handling works properly
- [ ] App closes cleanly without crashes

**Performance Testing:**
- [ ] Maintains 60 FPS during normal operation
- [ ] No stuttering or frame drops
- [ ] Loading times < 5 seconds
- [ ] Memory usage < 2 GB
- [ ] Battery drain acceptable
- [ ] Thermal management working

**Compatibility Testing:**
- [ ] Tested on Meta Quest 3
- [ ] Tested with hand tracking enabled
- [ ] Tested with controllers
- [ ] Tested with spatial audio
- [ ] Tested with different user profiles

---

## Meta Review Guidelines & Policies

### Content Policy Compliance

**Prohibited Content:**
- [ ] No hate speech or discrimination
- [ ] No violence or graphic content
- [ ] No sexual or adult content
- [ ] No illegal activities
- [ ] No misleading claims
- [ ] No malware or security threats

**Required Compliance:**
- [ ] App does not collect personal data unnecessarily
- [ ] App respects user privacy
- [ ] App has clear privacy policy
- [ ] App does not track users without consent
- [ ] App does not share data with third parties

### Technical Requirements

**Build Requirements:**
- [ ] APK signed with release key
- [ ] No debug symbols in production build
- [ ] All dependencies properly included
- [ ] No hardcoded API keys or secrets
- [ ] Proper error handling implemented

**Performance Requirements:**
- [ ] Minimum 60 FPS in VR
- [ ] Load times < 5 seconds
- [ ] Memory efficient (< 2 GB)
- [ ] Thermal management working
- [ ] Battery drain acceptable

**Security Requirements:**
- [ ] HTTPS for all network requests
- [ ] Data encryption in transit
- [ ] Secure credential storage
- [ ] No hardcoded passwords
- [ ] Regular security updates

---

## Submission Process

### Step 1: Prepare Everything
- [ ] All checklist items completed
- [ ] All files ready and tested
- [ ] All text content reviewed for accuracy
- [ ] All images optimized and formatted
- [ ] APK built and tested

### Step 2: Create App in Dashboard
1. [ ] Log in to Meta Developer Dashboard
2. [ ] Click "Create New App"
3. [ ] Select "VR Experience"
4. [ ] Enter app name: "Sovereign System VR"
5. [ ] Select category: "Productivity"
6. [ ] Click "Create"

### Step 3: Fill in App Details
1. [ ] Go to "App Settings"
2. [ ] Fill in all required fields (see Form Fields section above)
3. [ ] Upload all media (icons, screenshots, banner, video)
4. [ ] Set content rating to 12+
5. [ ] Add privacy policy and terms URLs
6. [ ] Save changes

### Step 4: Upload Build
1. [ ] Go to "Build" section
2. [ ] Click "Upload APK"
3. [ ] Select your APK file
4. [ ] Wait for processing
5. [ ] Verify build details
6. [ ] Confirm no errors

### Step 5: Submit for Review
1. [ ] Review all information one final time
2. [ ] Click "Submit for Review"
3. [ ] Confirm submission
4. [ ] Note submission date and time
5. [ ] Save confirmation email

### Step 6: Monitor Review Status
1. [ ] Check dashboard daily for status updates
2. [ ] Watch email for Meta communications
3. [ ] Be prepared to respond to questions
4. [ ] If rejected, note feedback and resubmit

---

## Expected Timeline

| Phase | Duration | Notes |
|-------|----------|-------|
| **Preparation** | 1-2 hours | Gather assets, test build |
| **Dashboard Entry** | 15-30 min | Create app, fill forms |
| **APK Upload** | 5-10 min | Upload and process |
| **Initial Review** | 1-3 business days | Meta reviews for compliance |
| **Approval/Rejection** | 1-3 business days | Decision made |
| **Publishing** | 1-24 hours | After approval, goes live |
| **Total** | **3-8 business days** | From submission to live |

---

## If Rejected

**Common Rejection Reasons:**
1. Missing or incorrect metadata
2. Crashes or performance issues
3. Privacy policy URL not working
4. Permissions not justified
5. Content policy violations
6. Misleading descriptions
7. Broken links in app

**If Rejected:**
1. [ ] Read Meta's feedback carefully
2. [ ] Note specific issues mentioned
3. [ ] Fix all identified problems
4. [ ] Test thoroughly before resubmitting
5. [ ] Resubmit with updated APK
6. [ ] Add notes explaining changes

---

## Post-Submission Monitoring

**After Approval:**
- [ ] App appears in Meta Quest Store
- [ ] Monitor user reviews and ratings
- [ ] Track download numbers
- [ ] Monitor crash reports
- [ ] Respond to user feedback
- [ ] Plan updates and improvements

**Ongoing Maintenance:**
- [ ] Release updates regularly (monthly recommended)
- [ ] Fix bugs and security issues
- [ ] Add new features based on feedback
- [ ] Maintain high user ratings (target 4.5+)
- [ ] Keep privacy policy current

---

## Support Contacts

**Meta Developer Support:**
- Website: https://developer.oculus.com/support/
- Email: support@oculus.com
- Phone: Available through developer dashboard

**Sovereign System Support:**
- Email: vr-support@sovereignsystem.gov
- Portal: https://support.sovereignsystem.gov/vr
- Phone: +1-555-VR-HELP

---

## Additional Resources

- [Meta Quest Store Guidelines](https://developer.oculus.com/distribute/latest/concepts/publish-submission-guidelines/)
- [Meta Developer Documentation](https://developer.oculus.com/documentation/)
- [VR Best Practices](https://developer.oculus.com/documentation/native/android/mobile-app-framework/)
- [APK Signing Guide](https://developer.android.com/studio/publish/app-signing)

---

**Status:** Ready for Submission  
**Last Updated:** June 2026  
**Version:** 1.0.0
