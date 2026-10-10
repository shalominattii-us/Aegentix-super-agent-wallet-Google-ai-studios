# AEGENTIS Versioned Release Pipeline & Artifact Governance

**Operational Framework for Reliable Releases and Artifact Management**

---

## Executive Summary

The AEGENTIS Release Pipeline establishes a disciplined, automated process for building, testing, signing, and releasing artifacts. Combined with comprehensive artifact governance, this framework ensures that every release is:

- **Versioned**: Semantic versioning with clear version identifiers
- **Tested**: Automated testing at each stage
- **Signed**: Cryptographically signed for integrity verification
- **Tracked**: Complete audit trail of all releases
- **Recoverable**: Easy rollback if issues arise

---

## Part 1: Release Pipeline Architecture

### 1.1 Pipeline Stages

```
Source Code
    ↓
[DEV] Build & Unit Test
    ↓
[STAGING] Integration Test & Security Scan
    ↓
[VALIDATED] Full Test Suite & Manual QA
    ↓
[STABLE] Production Deployment
    ↓
[ARCHIVED] Long-term Storage
```

### 1.2 Stage Definitions

**DEV Stage**
- **Purpose**: Rapid iteration and feedback
- **Trigger**: Every commit to develop branch
- **Testing**: Unit tests only
- **Approval**: None required
- **Artifacts**: Build artifacts (Docker images, ZIPs)
- **Retention**: 7 days
- **Location**: `releases/dev/`

**STAGING Stage**
- **Purpose**: Integration testing and validation
- **Trigger**: Daily build from develop branch
- **Testing**: Integration tests, smoke tests
- **Approval**: Tech lead sign-off required
- **Artifacts**: Signed release candidates
- **Retention**: 30 days
- **Location**: `releases/staging/`

**VALIDATED Stage**
- **Purpose**: Comprehensive testing and security verification
- **Trigger**: Weekly build from release branch
- **Testing**: Full test suite, security scan, performance test
- **Approval**: QA + Security sign-off required
- **Artifacts**: Release candidates with checksums
- **Retention**: 90 days
- **Location**: `releases/validated/`

**STABLE Stage**
- **Purpose**: Production-ready releases
- **Trigger**: Monthly build from main branch
- **Testing**: Production-like environment test
- **Approval**: Release manager sign-off required
- **Artifacts**: Final releases with GPG signatures
- **Retention**: 2 years
- **Location**: `releases/stable/`

**ARCHIVED Stage**
- **Purpose**: Long-term historical storage
- **Trigger**: End of life for stable release
- **Testing**: None
- **Approval**: None
- **Artifacts**: Compressed archives
- **Retention**: 7 years
- **Location**: `archives/releases/`

### 1.3 Pipeline Automation

Each stage includes automated steps:

```yaml
DEV Stage:
  - Checkout source code
  - Run unit tests
  - Build Docker image
  - Build runtime ZIP
  - Generate checksums
  - Upload to dev registry

STAGING Stage:
  - Run integration tests
  - Run smoke tests
  - Build release candidate
  - Generate manifests
  - Require tech lead approval
  - Upload to staging registry

VALIDATED Stage:
  - Run full test suite
  - Run security scan (SAST, dependency check)
  - Run performance tests
  - Generate release notes
  - Require QA + security approval
  - Upload to validated registry

STABLE Stage:
  - Deploy to production-like environment
  - Run production tests
  - Generate GPG signatures
  - Create release announcement
  - Require release manager approval
  - Upload to stable registry
  - Tag in Git
```

---

## Part 2: Versioning Strategy

### 2.1 Semantic Versioning

All releases follow semantic versioning (MAJOR.MINOR.PATCH):

**MAJOR Version**
- Breaking changes to API or data format
- Increment: 1.0.0 → 2.0.0
- Example: Portal v1.0.0 → v2.0.0 (schema change)

**MINOR Version**
- New features, backward compatible
- Increment: 1.0.0 → 1.1.0
- Example: Portal v1.0.0 → v1.1.0 (new dashboard)

**PATCH Version**
- Bug fixes, backward compatible
- Increment: 1.0.0 → 1.0.1
- Example: Portal v1.0.0 → v1.0.1 (critical bug fix)

### 2.2 Pre-release Versions

Pre-release versions indicate work in progress:

- **Alpha**: Early development, may have bugs
  - Example: `2.1.0-alpha`, `2.1.0-alpha.1`
  - Used in: DEV, STAGING stages

- **Beta**: Feature complete, undergoing testing
  - Example: `2.1.0-beta`, `2.1.0-beta.1`
  - Used in: STAGING, VALIDATED stages

- **Release Candidate**: Ready for release pending final testing
  - Example: `2.1.0-rc.1`, `2.1.0-rc.2`
  - Used in: VALIDATED stage

- **Stable**: Production release
  - Example: `2.1.0`, `2.0.0`, `1.9.4`
  - Used in: STABLE stage

### 2.3 Build Metadata

Build metadata can be appended for additional information:

- `2.1.0+build.123`: Build 123 of version 2.1.0
- `2.1.0+git.abc123`: Built from git commit abc123
- `2.1.0+timestamp.20260524`: Built on 2026-05-24

---

## Part 3: Artifact Governance

### 3.1 Artifact Types

| Type | Format | Example | Retention |
|------|--------|---------|-----------|
| Docker Image | `.tar.gz` | `SovereignAE-v2.1.0-alpha.docker.tar.gz` | 90 days |
| Mobile APK | `.apk` | `SovereignAE-v2.1.0-alpha.apk` | 2 years |
| Runtime ZIP | `.zip` | `SovereignAE-v2.1.0-alpha.runtime.zip` | 2 years |
| Manifest | `.json` | `SovereignAE-v2.1.0-alpha.manifest.json` | Indefinite |
| Checksum | `.txt` | `SovereignAE-v2.1.0-alpha.checksums.txt` | Indefinite |
| Signature | `.asc` | `SovereignAE-v2.1.0-alpha.asc` | Indefinite |
| Release Notes | `.md` | `SovereignAE-v2.1.0-alpha.RELEASE_NOTES.md` | Indefinite |

### 3.2 Artifact Metadata

Each artifact includes comprehensive metadata:

```json
{
  "artifactId": "SovereignAE-v2.1.0-alpha",
  "version": "2.1.0-alpha",
  "releaseDate": "2026-05-24T23:00:00Z",
  "releaseStage": "staging",
  "components": {
    "portal": "1.9.4",
    "runtime": "0.9.4",
    "vr": "1.2.0",
    "federation": "0.5.0",
    "continuity-ledger": "1.0.0"
  },
  "checksums": {
    "sha256": "abc123def456...",
    "md5": "xyz789..."
  },
  "signature": {
    "algorithm": "GPG",
    "keyId": "0x1234567890ABCDEF",
    "signature": "-----BEGIN PGP SIGNATURE-----..."
  },
  "dependencies": {
    "node": "22.13.0",
    "mysql": "8.0",
    "docker": "24.0"
  },
  "releaseNotes": "https://github.com/aegentis/releases/v2.1.0-alpha",
  "downloadUrl": "https://releases.aegentis.io/v2.1.0-alpha/",
  "supportedPlatforms": [
    "Linux x86_64",
    "macOS arm64",
    "Windows x86_64",
    "Meta Quest 3",
    "Apple Vision Pro"
  ],
  "knownIssues": [
    "Issue #123: Performance degradation with >1000 nodes",
    "Issue #124: WebXR not working on Firefox"
  ],
  "upgradeNotes": "Requires schema migration from v1 to v2"
}
```

### 3.3 Artifact Registry

Central registry of all artifacts:

```
releases/
├── manifests/
│   ├── 2.1.0-alpha.json
│   ├── 2.0.0.json
│   ├── 1.9.4.json
│   └── index.json (registry of all releases)
├── v2.1.0-alpha/
│   ├── manifest.json
│   ├── docker/
│   │   ├── SovereignAE-v2.1.0-alpha.docker.tar.gz
│   │   └── SovereignAE-v2.1.0-alpha.docker.tar.gz.asc
│   ├── mobile/
│   │   ├── SovereignAE-v2.1.0-alpha.apk
│   │   └── SovereignAE-v2.1.0-alpha.apk.asc
│   ├── runtime/
│   │   ├── SovereignAE-v2.1.0-alpha.runtime.zip
│   │   └── SovereignAE-v2.1.0-alpha.runtime.zip.asc
│   ├── schema/
│   │   ├── schema-v2.sql
│   │   └── migration-v1-to-v2.sql
│   ├── checksums.txt
│   ├── checksums.txt.asc
│   ├── RELEASE_NOTES.md
│   └── CHANGELOG.md
├── v2.0.0/
│   └── ...
└── v1.9.4/
    └── ...
```

### 3.4 Artifact Lifecycle

```
Created
   ↓
[DEV] Temporary (7 days)
   ↓
[STAGING] Candidate (30 days)
   ↓
[VALIDATED] Release Candidate (90 days)
   ↓
[STABLE] Production Release (2 years)
   ↓
[ARCHIVED] Long-term Storage (7 years)
   ↓
Deleted
```

---

## Part 4: Release Process

### 4.1 Pre-Release Preparation

**1 week before release**:
- Freeze feature development
- Create release branch: `release/v2.1.0`
- Update version numbers in code
- Generate changelog from commits

**3 days before release**:
- Code review and testing
- Update documentation
- Prepare release notes
- Create release candidate

**1 day before release**:
- Final testing in staging environment
- Verify all artifacts
- Prepare deployment plan
- Notify stakeholders

### 4.2 Release Day

**Morning (Build)**:
1. Merge release branch to main
2. Tag commit: `git tag -a v2.1.0 -m "Release 2.1.0"`
3. Trigger release pipeline
4. Build all artifacts (Docker, APK, ZIP)
5. Generate checksums
6. Create manifests

**Afternoon (Sign & Publish)**:
1. Sign all artifacts with GPG
2. Verify signatures
3. Upload to artifact registry
4. Update release notes
5. Create GitHub release
6. Announce release

**Evening (Verification)**:
1. Verify downloads work
2. Verify checksums
3. Verify signatures
4. Monitor for issues
5. Document any problems

### 4.3 Post-Release

**Day 1 after release**:
- Monitor production for issues
- Respond to user feedback
- Track bug reports

**Week 1 after release**:
- Analyze release metrics
- Document lessons learned
- Plan next release

**Month 1 after release**:
- Conduct post-release review
- Update processes based on feedback
- Archive release artifacts

---

## Part 5: Artifact Governance Policies

### 5.1 Naming Conventions

**Release Names**:
- `SovereignAE-v2.1.0-alpha`: Full system release
- `Portal-v1.9.4`: Component release
- `Runtime-v0.9.4`: Component release

**File Names**:
- `SovereignAE-v2.1.0-alpha.docker.tar.gz`: Docker image
- `SovereignAE-v2.1.0-alpha.apk`: Mobile APK
- `SovereignAE-v2.1.0-alpha.runtime.zip`: Runtime ZIP
- `SovereignAE-v2.1.0-alpha.manifest.json`: Manifest
- `SovereignAE-v2.1.0-alpha.checksums.txt`: Checksums

**Never use**:
- "final", "new", "latest", "latest2"
- Timestamps in version (use in metadata instead)
- Random names or abbreviations

### 5.2 Retention Policies

| Artifact | Retention | Reason |
|----------|-----------|--------|
| DEV artifacts | 7 days | Rapid iteration |
| STAGING artifacts | 30 days | Integration testing |
| VALIDATED artifacts | 90 days | Release candidates |
| STABLE artifacts | 2 years | Production support |
| ARCHIVED artifacts | 7 years | Regulatory requirement |
| Manifests | Indefinite | Historical reference |
| Checksums | Indefinite | Integrity verification |
| Signatures | Indefinite | Authenticity verification |

### 5.3 Access Control

**Public Access**:
- Stable releases (v2.0.0, v1.9.4)
- Release notes and changelogs
- Checksums and signatures

**Internal Access**:
- Dev and staging artifacts
- Pre-release versions
- Build logs and metrics

**Restricted Access**:
- Security patches before public release
- Vulnerability information
- Private deployment configurations

---

## Part 6: Checksum & Signature Management

### 6.1 Checksum Generation

SHA-256 checksums for all artifacts:

```bash
sha256sum SovereignAE-v2.1.0-alpha.docker.tar.gz > SovereignAE-v2.1.0-alpha.checksums.txt
sha256sum SovereignAE-v2.1.0-alpha.apk >> SovereignAE-v2.1.0-alpha.checksums.txt
sha256sum SovereignAE-v2.1.0-alpha.runtime.zip >> SovereignAE-v2.1.0-alpha.checksums.txt
```

Checksum file format:

```
abc123def456... SovereignAE-v2.1.0-alpha.docker.tar.gz
def456ghi789... SovereignAE-v2.1.0-alpha.apk
ghi789jkl012... SovereignAE-v2.1.0-alpha.runtime.zip
```

### 6.2 GPG Signing

Sign checksums file with GPG:

```bash
gpg --armor --sign --detach-sign SovereignAE-v2.1.0-alpha.checksums.txt
```

Creates: `SovereignAE-v2.1.0-alpha.checksums.txt.asc`

Sign individual artifacts:

```bash
gpg --armor --sign --detach-sign SovereignAE-v2.1.0-alpha.docker.tar.gz
```

Creates: `SovereignAE-v2.1.0-alpha.docker.tar.gz.asc`

### 6.3 Signature Verification

Users can verify artifacts:

```bash
# Verify checksums
sha256sum -c SovereignAE-v2.1.0-alpha.checksums.txt

# Verify GPG signature
gpg --verify SovereignAE-v2.1.0-alpha.checksums.txt.asc

# Verify artifact signature
gpg --verify SovereignAE-v2.1.0-alpha.docker.tar.gz.asc SovereignAE-v2.1.0-alpha.docker.tar.gz
```

---

## Part 7: Release Metrics & Monitoring

### 7.1 Key Metrics

| Metric | Target | Frequency |
|--------|--------|-----------|
| Build Success Rate | >99% | Per build |
| Test Pass Rate | 100% | Per build |
| Security Scan Pass Rate | 100% | Per build |
| Release Frequency | Monthly | Monthly |
| Time to Release | <1 day | Per release |
| Artifact Availability | 99.9% | Continuous |
| Download Success Rate | >99% | Per download |

### 7.2 Release Dashboard

Real-time monitoring of release pipeline:

- Current stage of each component
- Build status and logs
- Test results and coverage
- Security scan results
- Artifact availability
- Download metrics
- User feedback and issues

### 7.3 Release Reporting

**Weekly Report**:
- Releases completed
- Issues encountered
- Metrics summary
- Upcoming releases

**Monthly Report**:
- Release frequency and velocity
- Quality metrics
- Security findings
- User feedback analysis

---

## Part 8: Rollback Procedures

### 8.1 Rollback Decision Criteria

Rollback if:
- Critical bug discovered in production
- Performance degradation >20%
- Data corruption or loss
- Security vulnerability
- Compliance violation

### 8.2 Rollback Process

1. **Detection**: Issue detected in production
2. **Assessment**: Determine severity and impact
3. **Decision**: Release manager approves rollback
4. **Execution**: Revert to previous stable version
5. **Verification**: Verify rollback successful
6. **Communication**: Notify users and stakeholders
7. **Investigation**: Root cause analysis
8. **Fix**: Develop and test fix
9. **Re-release**: Release fixed version

### 8.3 Rollback Timeline

- **Detection to Decision**: <15 minutes
- **Decision to Execution**: <30 minutes
- **Execution to Verification**: <15 minutes
- **Total Rollback Time**: <1 hour

---

## Conclusion

The AEGENTIS Release Pipeline and Artifact Governance framework provides a disciplined, automated process for building, testing, signing, and releasing artifacts. By combining semantic versioning, comprehensive testing, cryptographic signing, and careful artifact management, this framework ensures that every release is reliable, traceable, and recoverable.

---

## Appendix: Quick Reference

**Pipeline Stages**: dev → staging → validated → stable → archived

**Versioning**: MAJOR.MINOR.PATCH (e.g., 2.1.0-alpha)

**Artifact Types**: Docker, APK, ZIP, manifest, checksums, signatures

**Signing**: GPG with SHA-256 checksums

**Retention**: 7 days to 7 years depending on stage

**Metrics**: Build success, test pass, security scan, availability
