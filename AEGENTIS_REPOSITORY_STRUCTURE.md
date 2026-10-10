# AEGENTIS Canonical Repository Structure

**Operational Foundation for Sovereign Infrastructure**

---

## Executive Summary

The AEGENTIS repository structure establishes a canonical organization for all sovereign runtime components, ensuring operational coherence, release integrity, and deployment continuity. This structure transitions the system from experimentation into production-grade infrastructure by providing clear ownership, versioning discipline, and artifact governance.

---

## Part 1: Root Organization

### 1.1 Directory Hierarchy

```
AEGENTIS/
├── runtime/                    # Core sovereign runtime
│   ├── nanotransaction-engine/
│   ├── integrity-scoring/
│   ├── ephemeral-arenas/
│   ├── mesh-propagation/
│   └── continuity-ledger/
├── portal/                     # Portal backend & frontend
│   ├── server/
│   ├── client/
│   ├── drizzle/
│   └── shared/
├── vr/                         # VR/XR systems
│   ├── aegentis-x/
│   ├── webxr/
│   ├── spatial-binding/
│   └── immersive-ui/
├── federation/                 # Federation & multi-node
│   ├── consensus-engine/
│   ├── node-registry/
│   ├── replication/
│   └── conflict-resolution/
├── continuity-ledger/          # Identity & lineage
│   ├── schema/
│   ├── migrations/
│   ├── replay-engine/
│   └── audit-trail/
├── orchestration/              # AEGENTIS orchestration
│   ├── command-protocol/
│   ├── authority-model/
│   ├── capability-registry/
│   └── decision-engine/
├── deployment/                 # Deployment & operations
│   ├── docker/
│   ├── kubernetes/
│   ├── terraform/
│   ├── helm/
│   └── scripts/
├── observability/              # Monitoring & observability
│   ├── prometheus/
│   ├── grafana/
│   ├── logging/
│   ├── tracing/
│   └── metrics/
├── docs/                       # Documentation
│   ├── architecture/
│   ├── api/
│   ├── operations/
│   ├── compliance/
│   └── guides/
├── archives/                   # Historical artifacts
│   ├── snapshots/
│   ├── migrations/
│   ├── schemas/
│   └── releases/
├── releases/                   # Current release artifacts
│   ├── v2.1.0-alpha/
│   ├── v2.0.0/
│   ├── v1.9.4/
│   └── manifests/
└── experiments/                # Experimental features
    ├── feature-branches/
    ├── prototypes/
    ├── research/
    └── sandbox/
```

### 1.2 Directory Ownership & Responsibilities

| Directory | Owner | Responsibility |
|-----------|-------|-----------------|
| runtime/ | Runtime Team | Core engine, event sourcing, continuity |
| portal/ | Portal Team | Backend, frontend, database schema |
| vr/ | VR Team | Immersive systems, spatial computing |
| federation/ | Federation Team | Multi-node coordination, consensus |
| continuity-ledger/ | Identity Team | Identity lineage, replay, audit |
| orchestration/ | AEGENTIS Team | Command protocol, authority, decisions |
| deployment/ | DevOps Team | Docker, Kubernetes, infrastructure |
| observability/ | SRE Team | Monitoring, alerting, metrics |
| docs/ | Documentation Team | Architecture, API, operations guides |
| archives/ | Data Team | Historical artifacts, retention |
| releases/ | Release Manager | Release artifacts, manifests, checksums |
| experiments/ | Research Team | Prototypes, features, sandbox |

---

## Part 2: Component Organization

### 2.1 Runtime Components

The `runtime/` directory contains the core sovereign runtime:

**Nanotransaction Engine**
- Location: `runtime/nanotransaction-engine/`
- Files: `engine.ts`, `types.ts`, `tests/`
- Ownership: Runtime Team
- Version: Semantic versioning (e.g., 1.0.0)

**Integrity Scoring Module**
- Location: `runtime/integrity-scoring/`
- Files: `scoring.ts`, `ullt-packets.ts`, `tests/`
- Ownership: Runtime Team
- Version: Semantic versioning

**Ephemeral Arenas**
- Location: `runtime/ephemeral-arenas/`
- Files: `arena-manager.ts`, `lifecycle.ts`, `tests/`
- Ownership: Runtime Team
- Version: Semantic versioning

**Mesh Propagation**
- Location: `runtime/mesh-propagation/`
- Files: `propagation.ts`, `consensus.ts`, `tests/`
- Ownership: Runtime Team
- Version: Semantic versioning

**Continuity Ledger**
- Location: `runtime/continuity-ledger/`
- Files: `ledger.ts`, `schema.ts`, `migrations/`
- Ownership: Runtime Team
- Version: Semantic versioning

### 2.2 Portal Components

The `portal/` directory contains the Portal application:

**Server**
- Location: `portal/server/`
- Files: `routers.ts`, `db.ts`, `auth.ts`
- Ownership: Portal Team
- Version: Semantic versioning

**Client**
- Location: `portal/client/`
- Files: `src/`, `public/`, `index.html`
- Ownership: Portal Team
- Version: Semantic versioning

**Database**
- Location: `portal/drizzle/`
- Files: `schema.ts`, `migrations/`
- Ownership: Portal Team
- Version: Schema versioning (e.g., schema-v1, schema-v2)

### 2.3 VR Components

The `vr/` directory contains VR/XR systems:

**AEGENTIS-X Commander**
- Location: `vr/aegentis-x/`
- Files: `commander.ts`, `voice-commands.ts`, `spatial-presence.ts`
- Ownership: VR Team
- Version: Semantic versioning

**WebXR Interface**
- Location: `vr/webxr/`
- Files: `interface.ts`, `controllers.ts`, `rendering.ts`
- Ownership: VR Team
- Version: Semantic versioning

**Spatial Binding**
- Location: `vr/spatial-binding/`
- Files: `dxvr.ts`, `physics.ts`, `synchronization.ts`
- Ownership: VR Team
- Version: Semantic versioning

---

## Part 3: Versioning Strategy

### 3.1 Semantic Versioning

All components follow semantic versioning (MAJOR.MINOR.PATCH):

- **MAJOR**: Breaking changes (e.g., 1.0.0 → 2.0.0)
- **MINOR**: New features, backward compatible (e.g., 1.0.0 → 1.1.0)
- **PATCH**: Bug fixes, backward compatible (e.g., 1.0.0 → 1.0.1)

**Pre-release versions**: `1.0.0-alpha`, `1.0.0-beta`, `1.0.0-rc.1`

**Build metadata**: `1.0.0+build.123`

### 3.2 Schema Versioning

Database schemas use explicit versioning:

- **schema-v1**: Initial schema (Portal v1.0.0)
- **schema-v2**: Added new tables (Portal v1.1.0)
- **schema-v3**: Restructured tables (Portal v2.0.0)

Migrations track schema version changes:

```
migrations/
├── 001_schema_v1.sql
├── 002_schema_v2.sql
└── 003_schema_v3.sql
```

### 3.3 Release Versioning

Release artifacts use full version identifiers:

- **SovereignAE-v2.1.0-alpha**: Full system release
- **Portal-v1.9.4**: Portal component release
- **Runtime-v0.9.4**: Runtime component release
- **ContinuityLedgerSchema-v1**: Schema release

---

## Part 4: Release Artifacts

### 4.1 Artifact Types

| Artifact | Location | Format | Versioning |
|----------|----------|--------|-----------|
| Docker Image | `releases/v2.1.0-alpha/docker/` | `.tar.gz` | Semantic |
| APK | `releases/v2.1.0-alpha/mobile/` | `.apk` | Semantic |
| Runtime ZIP | `releases/v2.1.0-alpha/runtime/` | `.zip` | Semantic |
| Manifest | `releases/v2.1.0-alpha/manifest.json` | JSON | Semantic |
| Snapshot | `archives/snapshots/` | `.tar.gz` | Timestamp |
| Schema | `releases/v2.1.0-alpha/schema/` | SQL | Schema version |

### 4.2 Artifact Metadata

Each artifact includes metadata:

```json
{
  "artifactId": "SovereignAE-v2.1.0-alpha",
  "version": "2.1.0-alpha",
  "releaseDate": "2026-05-24T23:00:00Z",
  "components": {
    "portal": "1.9.4",
    "runtime": "0.9.4",
    "vr": "1.2.0",
    "federation": "0.5.0"
  },
  "checksums": {
    "sha256": "abc123...",
    "md5": "def456..."
  },
  "signature": "gpg_signature_here",
  "dependencies": [
    "Node.js 22.13.0",
    "MySQL 8.0",
    "Docker 24.0"
  ],
  "releaseNotes": "url_to_changelog",
  "downloadUrl": "https://releases.aegentis.io/v2.1.0-alpha/"
}
```

### 4.3 Artifact Registry

Central registry of all artifacts:

```
releases/
├── manifests/
│   ├── 2.1.0-alpha.json
│   ├── 2.0.0.json
│   └── 1.9.4.json
├── v2.1.0-alpha/
│   ├── manifest.json
│   ├── docker/
│   ├── mobile/
│   ├── runtime/
│   ├── schema/
│   └── checksums.txt
├── v2.0.0/
│   └── ...
└── v1.9.4/
    └── ...
```

---

## Part 5: Backup Strategy

### 5.1 Triple Backup Rule

Every critical artifact exists in three locations:

1. **Local Working Copy**: Developer machine or CI/CD server
2. **Git Remote**: GitHub repository (primary remote)
3. **Offline Archive**: Cold storage backup (S3 Glacier, tape, etc.)

### 5.2 Backup Schedule

| Backup Type | Frequency | Retention | Location |
|-------------|-----------|-----------|----------|
| Source Code | Every commit | 7 years | Git + S3 |
| Runtime Configs | Nightly | 1 year | S3 + Glacier |
| Continuity Ledgers | Hourly | 10 years | Database + S3 |
| Manifests | Every release | Indefinite | Git + S3 |
| Snapshots | Weekly | 2 years | S3 + Glacier |
| Deployment Files | Every deploy | 1 year | Git + S3 |

### 5.3 Backup Verification

Automated verification ensures backup integrity:

- **Checksum Verification**: SHA-256 checksums match
- **Restore Testing**: Monthly restore drills
- **Encryption Verification**: Backups are encrypted
- **Access Logging**: Backup access is logged

---

## Part 6: Release Promotion Flow

### 6.1 Promotion Stages

```
dev → staging → validated → stable → archived
```

**Dev Stage**
- Location: `releases/dev/`
- Frequency: Continuous
- Testing: Unit tests only
- Approval: None required
- Retention: 7 days

**Staging Stage**
- Location: `releases/staging/`
- Frequency: Daily
- Testing: Integration tests
- Approval: Tech lead approval
- Retention: 30 days

**Validated Stage**
- Location: `releases/validated/`
- Frequency: Weekly
- Testing: Full test suite + security scan
- Approval: QA + security approval
- Retention: 90 days

**Stable Stage**
- Location: `releases/stable/`
- Frequency: Monthly
- Testing: Production-like environment
- Approval: Release manager approval
- Retention: 2 years

**Archived Stage**
- Location: `archives/releases/`
- Frequency: End of life
- Testing: None
- Approval: None
- Retention: 7 years

### 6.2 Promotion Gates

Each promotion requires:

1. **Automated Tests**: All tests pass
2. **Security Scan**: No critical vulnerabilities
3. **Code Review**: Peer review completed
4. **Approval**: Required approver signs off
5. **Documentation**: Changelog updated
6. **Artifacts**: All artifacts present and verified

### 6.3 Rollback Procedures

If issues are detected:

1. **Immediate Rollback**: Revert to previous stable version
2. **Root Cause Analysis**: Identify issue
3. **Fix & Retest**: Fix issue and retest
4. **Re-promotion**: Promote through stages again

---

## Part 7: Governance & Discipline

### 7.1 Branch Strategy

```
main (stable releases)
├── release/v2.1.0
├── release/v2.0.0
└── release/v1.9.4

develop (integration branch)
├── feature/nanotransaction-engine
├── feature/integrity-scoring
├── bugfix/mesh-consensus
└── hotfix/critical-issue
```

**Main Branch**
- Contains stable releases only
- Protected: requires pull request review
- Automated: tests run before merge
- Tagged: each release tagged with version

**Develop Branch**
- Contains integration of features
- Protected: requires pull request review
- Automated: tests run before merge
- Merged to main for releases

**Feature Branches**
- Created from develop
- Naming: `feature/description` or `bugfix/description`
- Deleted after merge
- Require pull request review

### 7.2 Release Tagging

All releases are tagged in Git:

```
git tag -a v2.1.0-alpha -m "Release 2.1.0-alpha"
git tag -a v2.0.0 -m "Release 2.0.0 (stable)"
git tag -a v1.9.4 -m "Release 1.9.4 (maintenance)"
```

Tags include:
- Version number
- Release date
- Release notes
- Signed by release manager

### 7.3 Schema Versioning

Database schemas are versioned and tracked:

```
schema-v1 (Portal v1.0.0)
├── tables: users, transactions, events
└── migrations: 001_initial_schema.sql

schema-v2 (Portal v1.1.0)
├── tables: + compliance_records
└── migrations: 002_add_compliance.sql

schema-v3 (Portal v2.0.0)
├── tables: restructured, + continuity_ledger
└── migrations: 003_restructure_schema.sql
```

### 7.4 Migration Tracking

Migrations are tracked and versioned:

```
migrations/
├── 001_initial_schema.sql (schema-v1)
├── 002_add_compliance.sql (schema-v2)
├── 003_restructure_schema.sql (schema-v3)
└── migration_log.json
```

Each migration includes:
- Version number
- Description
- Author
- Date
- Rollback procedure

### 7.5 Artifact Retention Policies

| Artifact Type | Retention Period | Location | Reason |
|---------------|-----------------|----------|--------|
| Source Code | 7 years | Git + S3 | Regulatory requirement |
| Releases | 2 years | S3 | Maintenance support |
| Snapshots | 2 years | S3 Glacier | Disaster recovery |
| Schemas | Indefinite | Git + S3 | Historical reference |
| Compliance Records | 10 years | S3 Glacier | Regulatory requirement |
| Logs | 1 year | S3 Glacier | Audit trail |

---

## Part 8: Operational Procedures

### 8.1 Release Process

1. **Preparation** (1 day before)
   - Finalize changelog
   - Update version numbers
   - Create release branch

2. **Build** (Release day)
   - Run full test suite
   - Build artifacts
   - Generate checksums
   - Create manifests

3. **Signing** (Release day)
   - Sign artifacts with GPG
   - Sign manifests
   - Verify signatures

4. **Publishing** (Release day)
   - Upload to artifact registry
   - Update release notes
   - Announce release
   - Tag in Git

5. **Verification** (1 day after)
   - Verify downloads work
   - Verify checksums
   - Verify signatures
   - Monitor for issues

### 8.2 Backup Verification

Monthly backup verification:

1. **Checksum Verification**: Verify all checksums match
2. **Restore Test**: Restore from backup to test environment
3. **Integrity Check**: Verify restored data integrity
4. **Access Logging**: Review backup access logs
5. **Report**: Document verification results

### 8.3 Incident Response

If operational issues occur:

1. **Detection**: Automated monitoring detects issue
2. **Alert**: Alert sent to on-call engineer
3. **Investigation**: Root cause analysis
4. **Mitigation**: Apply temporary fix if needed
5. **Resolution**: Implement permanent fix
6. **Verification**: Verify fix in production
7. **Post-Incident**: Document lessons learned

---

## Part 9: Naming Conventions

### 9.1 Repository Names

- `aegentis-runtime`: Core runtime components
- `aegentis-portal`: Portal backend and frontend
- `aegentis-vr`: VR/XR systems
- `aegentis-federation`: Federation and multi-node
- `aegentis-continuity-ledger`: Identity and lineage
- `aegentis-orchestration`: AEGENTIS orchestration
- `aegentis-deployment`: Deployment and operations
- `aegentis-observability`: Monitoring and observability

### 9.2 Release Names

- `SovereignAE-v2.1.0-alpha`: Full system release
- `Portal-v1.9.4`: Portal component release
- `Runtime-v0.9.4`: Runtime component release
- `VR-v1.2.0`: VR component release
- `Federation-v0.5.0`: Federation component release

### 9.3 File Names

- `SovereignAE-v2.1.0-alpha.docker.tar.gz`: Docker image
- `SovereignAE-v2.1.0-alpha.apk`: Mobile APK
- `SovereignAE-v2.1.0-alpha.runtime.zip`: Runtime ZIP
- `SovereignAE-v2.1.0-alpha.manifest.json`: Manifest
- `SovereignAE-v2.1.0-alpha.checksums.txt`: Checksums

### 9.4 Branch Names

- `main`: Stable releases
- `develop`: Integration branch
- `release/v2.1.0`: Release branch
- `feature/nanotransaction-engine`: Feature branch
- `bugfix/mesh-consensus`: Bug fix branch
- `hotfix/critical-issue`: Hotfix branch

---

## Conclusion

The AEGENTIS canonical repository structure establishes operational discipline and ensures that the sovereign runtime transitions from experimentation into production infrastructure. By providing clear ownership, versioning discipline, artifact governance, and backup automation, this structure enables reliable operations, rapid recovery, and continuous delivery.

---

## Appendix: Quick Reference

**Key Directories**
- Runtime: `AEGENTIS/runtime/`
- Portal: `AEGENTIS/portal/`
- VR: `AEGENTIS/vr/`
- Releases: `AEGENTIS/releases/`
- Backups: S3 + Glacier

**Key Processes**
- Release: `dev → staging → validated → stable → archived`
- Backup: Triple backup rule (local, git, offline)
- Versioning: Semantic versioning (MAJOR.MINOR.PATCH)

**Key Artifacts**
- Docker images, APKs, ZIPs, manifests, checksums, signatures

**Key Governance**
- Branch strategy, release tagging, schema versioning, retention policies
