# AEGENTIS Release Promotion Flow & CI/CD Integration

**Automated Pipeline for Continuous Integration and Deployment**

---

## Executive Summary

The AEGENTIS CI/CD pipeline automates the release promotion flow from dev → staging → validated → stable → archived, with automated testing, security scanning, and approval gates at each stage. This ensures reliable, auditable releases with minimal manual intervention.

---

## Part 1: CI/CD Pipeline Architecture

### 1.1 GitHub Actions Workflow

```yaml
name: AEGENTIS Release Pipeline

on:
  push:
    branches: [main, develop, release/*]
  pull_request:
    branches: [main, develop]
  schedule:
    - cron: '0 2 * * *'  # Nightly build

jobs:
  # DEV STAGE
  dev-build:
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/develop'
    steps:
      - uses: actions/checkout@v3
      - name: Run unit tests
        run: pnpm test
      - name: Build Docker image
        run: docker build -t aegentis-portal:dev .
      - name: Build runtime ZIP
        run: pnpm build && zip -r aegentis-runtime-dev.zip dist/
      - name: Generate checksums
        run: |
          sha256sum aegentis-runtime-dev.zip > checksums.txt
          sha256sum docker-image.tar.gz >> checksums.txt
      - name: Upload to dev registry
        run: |
          aws s3 cp aegentis-runtime-dev.zip s3://aegentis-releases/dev/
          aws s3 cp checksums.txt s3://aegentis-releases/dev/

  # STAGING STAGE
  staging-build:
    runs-on: ubuntu-latest
    needs: dev-build
    if: github.ref == 'refs/heads/develop'
    steps:
      - uses: actions/checkout@v3
      - name: Run integration tests
        run: pnpm test:integration
      - name: Run smoke tests
        run: pnpm test:smoke
      - name: Build release candidate
        run: |
          VERSION=$(cat package.json | grep version | head -1 | awk -F: '{ print $2 }' | sed 's/[",]//g' | tr -d ' ')
          docker build -t aegentis-portal:${VERSION}-rc .
          docker save aegentis-portal:${VERSION}-rc | gzip > aegentis-portal-${VERSION}-rc.docker.tar.gz
      - name: Generate manifest
        run: |
          cat > manifest.json << EOF
          {
            "version": "${VERSION}-rc",
            "stage": "staging",
            "timestamp": "$(date -u +'%Y-%m-%dT%H:%M:%SZ')",
            "components": {
              "portal": "1.9.4",
              "runtime": "0.9.4"
            }
          }
          EOF
      - name: Upload to staging registry
        run: aws s3 cp . s3://aegentis-releases/staging/ --recursive

  # VALIDATED STAGE
  validated-build:
    runs-on: ubuntu-latest
    needs: staging-build
    if: github.ref == 'refs/heads/release/*'
    steps:
      - uses: actions/checkout@v3
      - name: Run full test suite
        run: pnpm test:full
      - name: Run security scan
        run: |
          npm audit
          trivy scan --severity HIGH,CRITICAL .
      - name: Run performance tests
        run: pnpm test:performance
      - name: Generate release notes
        run: |
          git log --oneline $(git describe --tags --abbrev=0)..HEAD > RELEASE_NOTES.md
      - name: Build final artifacts
        run: |
          VERSION=$(cat package.json | grep version | head -1 | awk -F: '{ print $2 }' | sed 's/[",]//g' | tr -d ' ')
          docker build -t aegentis-portal:${VERSION} .
          docker save aegentis-portal:${VERSION} | gzip > aegentis-portal-${VERSION}.docker.tar.gz
      - name: Generate checksums
        run: sha256sum aegentis-portal-${VERSION}.docker.tar.gz > checksums.txt
      - name: Upload to validated registry
        run: aws s3 cp . s3://aegentis-releases/validated/ --recursive

  # STABLE STAGE
  stable-release:
    runs-on: ubuntu-latest
    needs: validated-build
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to production-like environment
        run: |
          docker-compose -f docker-compose.prod.yml up -d
          sleep 30
      - name: Run production tests
        run: pnpm test:production
      - name: Generate GPG signatures
        run: |
          gpg --armor --sign --detach-sign checksums.txt
          gpg --armor --sign --detach-sign aegentis-portal-${VERSION}.docker.tar.gz
      - name: Create GitHub release
        uses: actions/create-release@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          tag_name: v${{ env.VERSION }}
          release_name: Release ${{ env.VERSION }}
          body_path: RELEASE_NOTES.md
      - name: Upload to stable registry
        run: aws s3 cp . s3://aegentis-releases/stable/ --recursive
      - name: Archive to Glacier
        run: aws s3 cp . s3://aegentis-releases/archive/ --storage-class GLACIER --recursive
      - name: Notify stakeholders
        run: |
          curl -X POST -H 'Content-type: application/json' \
            --data "{\"text\":\"AEGENTIS Release ${VERSION} deployed to production\"}" \
            ${{ secrets.SLACK_WEBHOOK }}
```

### 1.2 Pipeline Stages

**DEV Stage** (Every commit to develop)
- Trigger: Push to develop branch
- Tests: Unit tests
- Artifacts: Docker image, runtime ZIP
- Approval: None
- Duration: <10 minutes

**STAGING Stage** (Daily from develop)
- Trigger: Scheduled daily build
- Tests: Integration, smoke tests
- Artifacts: Release candidate
- Approval: Tech lead review
- Duration: <30 minutes

**VALIDATED Stage** (Weekly from release branch)
- Trigger: Push to release/* branch
- Tests: Full suite, security scan, performance
- Artifacts: Release candidate with checksums
- Approval: QA + security review
- Duration: <60 minutes

**STABLE Stage** (Monthly from main)
- Trigger: Push to main branch
- Tests: Production-like environment
- Artifacts: Final release with signatures
- Approval: Release manager
- Duration: <90 minutes

---

## Part 2: Approval Gates

### 2.1 Approval Process

**STAGING Approval**:
```yaml
staging-approval:
  runs-on: ubuntu-latest
  needs: staging-build
  environment: staging
  steps:
    - name: Request approval
      run: echo "Waiting for tech lead approval..."
    - name: Deploy to staging
      run: docker-compose -f docker-compose.staging.yml up -d
```

**VALIDATED Approval**:
```yaml
validated-approval:
  runs-on: ubuntu-latest
  needs: validated-build
  environment: validated
  steps:
    - name: Request QA approval
      run: echo "Waiting for QA approval..."
    - name: Request security approval
      run: echo "Waiting for security approval..."
    - name: Deploy to validated
      run: docker-compose -f docker-compose.validated.yml up -d
```

**STABLE Approval**:
```yaml
stable-approval:
  runs-on: ubuntu-latest
  needs: validated-build
  environment: production
  steps:
    - name: Request release manager approval
      run: echo "Waiting for release manager approval..."
    - name: Deploy to production
      run: |
        docker pull aegentis-portal:${VERSION}
        docker-compose -f docker-compose.prod.yml up -d
```

### 2.2 Approval Criteria

**STAGING Approval Criteria**:
- All unit tests pass
- All integration tests pass
- No critical security issues
- Code review completed
- Tech lead sign-off

**VALIDATED Approval Criteria**:
- All tests pass (unit, integration, performance)
- Security scan passes (no critical vulnerabilities)
- Performance tests meet SLA
- QA sign-off
- Security sign-off

**STABLE Approval Criteria**:
- All validated tests pass
- Production-like environment tests pass
- Release notes complete
- Documentation updated
- Release manager sign-off

---

## Part 3: Automated Testing

### 3.1 Test Stages

**Unit Tests** (DEV stage)
```bash
pnpm test
# Coverage: >80%
# Duration: <5 minutes
```

**Integration Tests** (STAGING stage)
```bash
pnpm test:integration
# Tests: API endpoints, database operations, external services
# Duration: <15 minutes
```

**Smoke Tests** (STAGING stage)
```bash
pnpm test:smoke
# Tests: Critical paths, basic functionality
# Duration: <5 minutes
```

**Full Test Suite** (VALIDATED stage)
```bash
pnpm test:full
# Tests: All unit, integration, smoke, performance tests
# Duration: <60 minutes
```

**Performance Tests** (VALIDATED stage)
```bash
pnpm test:performance
# Tests: Response time, throughput, resource usage
# SLAs: <200ms p99, >1000 req/s, <50% CPU
```

**Production Tests** (STABLE stage)
```bash
pnpm test:production
# Tests: Real production-like environment
# Duration: <30 minutes
```

### 3.2 Security Scanning

**Static Analysis** (VALIDATED stage)
```bash
npm audit
# Checks: Known vulnerabilities in dependencies
trivy scan --severity HIGH,CRITICAL .
# Checks: Container image vulnerabilities
```

**SAST** (Static Application Security Testing)
```bash
sonarqube-scanner
# Checks: Code quality, security issues, code smells
```

**Dependency Check**
```bash
dependency-check --project "AEGENTIS" --scan .
# Checks: Known vulnerabilities in dependencies
```

---

## Part 4: Artifact Management

### 4.1 Artifact Promotion

```
dev/
  └── aegentis-runtime-dev.zip
  └── checksums.txt

staging/
  └── aegentis-portal-1.9.4-rc.docker.tar.gz
  └── manifest.json
  └── checksums.txt

validated/
  └── aegentis-portal-1.9.4-rc1.docker.tar.gz
  └── aegentis-portal-1.9.4-rc1.apk
  └── aegentis-portal-1.9.4-rc1.runtime.zip
  └── manifest.json
  └── checksums.txt

stable/
  └── aegentis-portal-1.9.4.docker.tar.gz
  └── aegentis-portal-1.9.4.apk
  └── aegentis-portal-1.9.4.runtime.zip
  └── manifest.json
  └── checksums.txt
  └── checksums.txt.asc

archive/
  └── aegentis-portal-1.9.4.tar.gz (compressed)
```

### 4.2 Artifact Registry

Central registry in S3:

```
s3://aegentis-releases/
├── dev/
├── staging/
├── validated/
├── stable/
├── archive/
└── manifests/
    ├── 1.9.4.json
    ├── 1.9.3.json
    └── index.json
```

---

## Part 5: Deployment Procedures

### 5.1 Staging Deployment

```bash
#!/bin/bash
# deploy-staging.sh

VERSION=$1
ENVIRONMENT="staging"

echo "Deploying ${VERSION} to ${ENVIRONMENT}..."

# 1. Download artifact
aws s3 cp s3://aegentis-releases/staging/aegentis-portal-${VERSION}-rc.docker.tar.gz .

# 2. Load Docker image
docker load < aegentis-portal-${VERSION}-rc.docker.tar.gz

# 3. Deploy with docker-compose
docker-compose -f docker-compose.staging.yml up -d

# 4. Verify deployment
sleep 10
curl -f http://localhost:3000/api/health || exit 1

echo "Deployment successful!"
```

### 5.2 Production Deployment

```bash
#!/bin/bash
# deploy-production.sh

VERSION=$1
ENVIRONMENT="production"

echo "Deploying ${VERSION} to ${ENVIRONMENT}..."

# 1. Verify artifact signature
gpg --verify s3://aegentis-releases/stable/checksums.txt.asc

# 2. Download artifact
aws s3 cp s3://aegentis-releases/stable/aegentis-portal-${VERSION}.docker.tar.gz .

# 3. Verify checksum
sha256sum -c s3://aegentis-releases/stable/checksums.txt

# 4. Create backup of current version
docker-compose -f docker-compose.prod.yml down
tar czf backup-prod-$(date +%Y%m%d_%H%M%S).tar.gz docker-compose.prod.yml

# 5. Load Docker image
docker load < aegentis-portal-${VERSION}.docker.tar.gz

# 6. Deploy with docker-compose
docker-compose -f docker-compose.prod.yml up -d

# 7. Verify deployment
sleep 10
curl -f https://sovereignportal.aegentis.io/api/health || {
  echo "Deployment failed! Rolling back..."
  docker-compose -f docker-compose.prod.yml down
  exit 1
}

# 8. Monitor for 5 minutes
for i in {1..30}; do
  curl -f https://sovereignportal.aegentis.io/api/health || {
    echo "Health check failed! Rolling back..."
    docker-compose -f docker-compose.prod.yml down
    exit 1
  }
  sleep 10
done

echo "Deployment successful!"
```

---

## Part 6: Rollback Procedures

### 6.1 Automatic Rollback

If production deployment fails:

```bash
# Automatic rollback triggered by health check failure
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d --build

# Restore previous version if new version fails
PREVIOUS_VERSION=$(git describe --tags --abbrev=0 HEAD~1)
docker pull aegentis-portal:${PREVIOUS_VERSION}
docker-compose -f docker-compose.prod.yml up -d
```

### 6.2 Manual Rollback

If issues detected after deployment:

```bash
#!/bin/bash
# rollback-production.sh

PREVIOUS_VERSION=$1

echo "Rolling back to ${PREVIOUS_VERSION}..."

# 1. Stop current version
docker-compose -f docker-compose.prod.yml down

# 2. Restore previous version
docker pull aegentis-portal:${PREVIOUS_VERSION}
docker-compose -f docker-compose.prod.yml up -d

# 3. Verify rollback
curl -f https://sovereignportal.aegentis.io/api/health

echo "Rollback successful!"
```

---

## Part 7: Monitoring & Observability

### 7.1 Pipeline Monitoring

**GitHub Actions Dashboard**:
- Build status for each branch
- Test results and coverage
- Deployment status
- Artifact registry status

**Metrics**:
- Build success rate
- Test pass rate
- Deployment frequency
- Lead time for changes
- Mean time to recovery

### 7.2 Deployment Monitoring

**Health Checks**:
- API endpoint availability
- Database connectivity
- External service connectivity
- Resource usage (CPU, memory, disk)

**Alerts**:
- Deployment failed
- Health check failed
- High error rate
- High latency
- Resource exhaustion

---

## Conclusion

The AEGENTIS CI/CD pipeline automates the release promotion flow with comprehensive testing, security scanning, and approval gates. By combining GitHub Actions, automated testing, and careful artifact management, this framework ensures reliable, auditable releases with minimal manual intervention.

---

## Appendix: Quick Reference

**Pipeline Stages**: dev (every commit) → staging (daily) → validated (weekly) → stable (monthly)

**Testing**: Unit → integration → smoke → full → performance → production

**Approvals**: Tech lead (staging) → QA + security (validated) → release manager (stable)

**Deployment**: Automated with health checks and automatic rollback

**Monitoring**: GitHub Actions dashboard, health checks, alerts
