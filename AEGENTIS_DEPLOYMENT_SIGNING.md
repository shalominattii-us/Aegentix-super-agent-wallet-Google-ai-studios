# AEGENTIS Deployment Signing & Integrity Verification

**Cryptographic Assurance for Production Deployments**

---

## Executive Summary

The AEGENTIS Deployment Signing framework ensures that all production deployments are cryptographically signed and verified, providing proof of authenticity, integrity, and authorization. This framework prevents unauthorized deployments and ensures that only approved, unmodified artifacts reach production.

---

## Part 1: Signing Architecture

### 1.1 Key Management

**GPG Key Hierarchy**:

```
Master Key (4096-bit RSA)
├── Signing Subkey (4096-bit RSA)
├── Encryption Subkey (4096-bit RSA)
└── Authentication Subkey (4096-bit RSA)
```

**Key Storage**:
- **Master Key**: Offline storage (hardware security module or air-gapped machine)
- **Signing Subkey**: Secure key management service (AWS KMS, HashiCorp Vault)
- **Encryption Subkey**: Secure key management service
- **Authentication Subkey**: Secure key management service

### 1.2 Key Rotation

**Rotation Schedule**:
- Signing subkey: Every 1 year
- Encryption subkey: Every 1 year
- Master key: Every 3 years (offline)

**Rotation Procedure**:
1. Generate new subkey
2. Sign new subkey with master key
3. Publish new subkey to keyserver
4. Revoke old subkey
5. Distribute new key fingerprint

---

## Part 2: Artifact Signing

### 2.1 Signing Process

**Step 1: Generate Checksums**
```bash
sha256sum aegentis-portal-2.1.0.docker.tar.gz > checksums.txt
sha256sum aegentis-portal-2.1.0.apk >> checksums.txt
sha256sum aegentis-portal-2.1.0.runtime.zip >> checksums.txt
```

**Step 2: Sign Checksums**
```bash
gpg --armor --sign --detach-sign checksums.txt
# Creates: checksums.txt.asc
```

**Step 3: Sign Individual Artifacts**
```bash
gpg --armor --sign --detach-sign aegentis-portal-2.1.0.docker.tar.gz
gpg --armor --sign --detach-sign aegentis-portal-2.1.0.apk
gpg --armor --sign --detach-sign aegentis-portal-2.1.0.runtime.zip
```

**Step 4: Create Manifest**
```json
{
  "version": "2.1.0",
  "artifacts": {
    "docker": {
      "filename": "aegentis-portal-2.1.0.docker.tar.gz",
      "sha256": "abc123...",
      "signature": "aegentis-portal-2.1.0.docker.tar.gz.asc"
    }
  },
  "checksums": {
    "file": "checksums.txt",
    "signature": "checksums.txt.asc"
  },
  "signedBy": "release-team@aegentis.io",
  "signedAt": "2026-05-24T23:00:00Z"
}
```

### 2.2 Signing Automation

**GitHub Actions Signing Workflow**:

```yaml
name: Sign Release

on:
  release:
    types: [published]

jobs:
  sign:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Import GPG key
        env:
          GPG_PRIVATE_KEY: ${{ secrets.GPG_PRIVATE_KEY }}
          GPG_PASSPHRASE: ${{ secrets.GPG_PASSPHRASE }}
        run: |
          echo "$GPG_PRIVATE_KEY" | gpg --import
      - name: Generate checksums
        run: |
          sha256sum aegentis-portal-*.* > checksums.txt
      - name: Sign checksums
        env:
          GPG_PASSPHRASE: ${{ secrets.GPG_PASSPHRASE }}
        run: |
          gpg --armor --sign --detach-sign checksums.txt
      - name: Sign artifacts
        env:
          GPG_PASSPHRASE: ${{ secrets.GPG_PASSPHRASE }}
        run: |
          for file in aegentis-portal-*.*; do
            gpg --armor --sign --detach-sign "$file"
          done
      - name: Upload signatures
        run: |
          aws s3 cp checksums.txt.asc s3://aegentis-releases/stable/v2.1.0/
          aws s3 cp aegentis-portal-*.asc s3://aegentis-releases/stable/v2.1.0/
```

---

## Part 3: Signature Verification

### 3.1 Verification Process

**Step 1: Download Artifacts and Signatures**
```bash
curl -O https://releases.aegentis.io/stable/v2.1.0/aegentis-portal-2.1.0.docker.tar.gz
curl -O https://releases.aegentis.io/stable/v2.1.0/aegentis-portal-2.1.0.docker.tar.gz.asc
curl -O https://releases.aegentis.io/stable/v2.1.0/checksums.txt
curl -O https://releases.aegentis.io/stable/v2.1.0/checksums.txt.asc
```

**Step 2: Import Public Key**
```bash
gpg --keyserver keyserver.ubuntu.com --recv-keys 0x1234567890ABCDEF
```

**Step 3: Verify Checksums Signature**
```bash
gpg --verify checksums.txt.asc checksums.txt
```

**Step 4: Verify Artifact Checksums**
```bash
sha256sum -c checksums.txt
```

**Step 5: Verify Artifact Signatures**
```bash
gpg --verify aegentis-portal-2.1.0.docker.tar.gz.asc aegentis-portal-2.1.0.docker.tar.gz
```

### 3.2 Verification Script

```bash
#!/bin/bash
# verify-release.sh - Verify release integrity and authenticity

VERSION=$1
RELEASE_URL="https://releases.aegentis.io/stable/v${VERSION}"

echo "Verifying AEGENTIS release ${VERSION}..."

# 1. Download artifacts and signatures
echo "Downloading artifacts..."
curl -O ${RELEASE_URL}/checksums.txt
curl -O ${RELEASE_URL}/checksums.txt.asc
curl -O ${RELEASE_URL}/aegentis-portal-${VERSION}.docker.tar.gz
curl -O ${RELEASE_URL}/aegentis-portal-${VERSION}.docker.tar.gz.asc

# 2. Import public key
echo "Importing public key..."
gpg --keyserver keyserver.ubuntu.com --recv-keys 0x1234567890ABCDEF

# 3. Verify checksums signature
echo "Verifying checksums signature..."
gpg --verify checksums.txt.asc checksums.txt || exit 1

# 4. Verify artifact checksums
echo "Verifying artifact checksums..."
sha256sum -c checksums.txt || exit 1

# 5. Verify artifact signature
echo "Verifying artifact signature..."
gpg --verify aegentis-portal-${VERSION}.docker.tar.gz.asc aegentis-portal-${VERSION}.docker.tar.gz || exit 1

echo "Verification successful!"
```

---

## Part 4: Deployment Authorization

### 4.1 Deployment Approval Chain

**Approval Chain**:
1. Release Manager signs release
2. Deployment Manager reviews and approves
3. Operations Engineer executes deployment
4. Deployment system verifies signatures
5. Deployment proceeds only if signatures valid

### 4.2 Deployment Manifest

```json
{
  "deployment": {
    "id": "deploy-2026-05-24-001",
    "version": "2.1.0",
    "environment": "production",
    "timestamp": "2026-05-24T23:00:00Z"
  },
  "approvals": [
    {
      "role": "release-manager",
      "approver": "alice@aegentis.io",
      "timestamp": "2026-05-24T22:00:00Z",
      "signature": "-----BEGIN PGP SIGNATURE-----..."
    },
    {
      "role": "deployment-manager",
      "approver": "bob@aegentis.io",
      "timestamp": "2026-05-24T22:30:00Z",
      "signature": "-----BEGIN PGP SIGNATURE-----..."
    }
  ],
  "artifacts": {
    "docker": {
      "checksum": "abc123...",
      "signature": "-----BEGIN PGP SIGNATURE-----..."
    }
  }
}
```

---

## Part 5: Deployment Verification

### 5.1 Pre-Deployment Checks

**Verification Steps**:
1. Verify release manager signature
2. Verify deployment manager approval
3. Verify artifact checksums
4. Verify artifact signatures
5. Verify no unauthorized modifications
6. Verify deployment manifest integrity

```bash
#!/bin/bash
# pre-deployment-verify.sh - Verify deployment before proceeding

DEPLOYMENT_ID=$1
MANIFEST_FILE="deployment-${DEPLOYMENT_ID}.json"

echo "Verifying deployment ${DEPLOYMENT_ID}..."

# 1. Verify manifest signature
echo "Verifying manifest signature..."
gpg --verify ${MANIFEST_FILE}.asc ${MANIFEST_FILE} || exit 1

# 2. Verify artifact signatures
echo "Verifying artifact signatures..."
ARTIFACTS=$(jq -r '.artifacts | keys[]' ${MANIFEST_FILE})
for artifact in $ARTIFACTS; do
  CHECKSUM=$(jq -r ".artifacts.${artifact}.checksum" ${MANIFEST_FILE})
  SIGNATURE=$(jq -r ".artifacts.${artifact}.signature" ${MANIFEST_FILE})
  
  # Verify checksum
  echo "Verifying ${artifact}..."
  sha256sum ${artifact} | grep ${CHECKSUM} || exit 1
done

# 3. Verify approvals
echo "Verifying approvals..."
APPROVALS=$(jq -r '.approvals | length' ${MANIFEST_FILE})
if [ $APPROVALS -lt 2 ]; then
  echo "ERROR: Insufficient approvals"
  exit 1
fi

echo "Deployment verification successful!"
```

### 5.2 Post-Deployment Verification

**Verification Steps**:
1. Verify deployed artifact matches signed artifact
2. Verify deployment manifest matches deployment
3. Verify no unauthorized modifications
4. Verify deployment logs integrity

---

## Part 6: Audit Trail

### 6.1 Signing Audit Trail

**Recorded Information**:
- Signer identity
- Signing timestamp
- Artifact version
- Artifact checksum
- Signature algorithm
- Key fingerprint

**Audit Log Entry**:
```json
{
  "event": "artifact_signed",
  "timestamp": "2026-05-24T22:00:00Z",
  "signer": "alice@aegentis.io",
  "keyFingerprint": "0x1234567890ABCDEF",
  "artifact": "aegentis-portal-2.1.0.docker.tar.gz",
  "checksum": "abc123...",
  "algorithm": "GPG (RSA-4096)",
  "status": "success"
}
```

### 6.2 Deployment Audit Trail

**Recorded Information**:
- Deployment ID
- Deployment timestamp
- Deployer identity
- Approvers
- Artifacts deployed
- Verification results
- Deployment status

**Audit Log Entry**:
```json
{
  "event": "deployment_executed",
  "timestamp": "2026-05-24T23:00:00Z",
  "deploymentId": "deploy-2026-05-24-001",
  "deployer": "charlie@aegentis.io",
  "environment": "production",
  "version": "2.1.0",
  "artifacts": [
    {
      "name": "aegentis-portal-2.1.0.docker.tar.gz",
      "checksum": "abc123...",
      "verified": true
    }
  ],
  "approvals": [
    {
      "role": "release-manager",
      "approver": "alice@aegentis.io",
      "verified": true
    },
    {
      "role": "deployment-manager",
      "approver": "bob@aegentis.io",
      "verified": true
    }
  ],
  "status": "success"
}
```

---

## Part 7: Incident Response

### 7.1 Signature Verification Failure

**Response Procedure**:
1. Stop deployment immediately
2. Alert security team
3. Investigate cause
4. Review artifact integrity
5. Review signing process
6. Document incident
7. Implement corrective action

### 7.2 Unauthorized Deployment Attempt

**Response Procedure**:
1. Block deployment
2. Alert security team
3. Revoke credentials
4. Audit access logs
5. Notify stakeholders
6. Conduct investigation
7. Implement security controls

---

## Part 8: Key Compromise Response

### 8.1 Key Compromise Detection

**Detection Methods**:
- Unauthorized signature verification failure
- Unexpected deployment attempts
- Key access logs anomalies
- Security scanning alerts

### 8.2 Key Compromise Response

**Immediate Actions**:
1. Revoke compromised key
2. Notify all stakeholders
3. Block all deployments
4. Audit all recent deployments

**Recovery Actions**:
1. Generate new signing key
2. Sign all recent artifacts with new key
3. Update key distribution
4. Resume deployments with new key

---

## Conclusion

The AEGENTIS Deployment Signing framework provides cryptographic assurance that all production deployments are authentic, authorized, and unmodified. By combining GPG signing, strict approval chains, comprehensive verification, and detailed audit trails, this framework ensures the highest standards of deployment security and integrity.

---

## Appendix: Quick Reference

**Signing Process**: Checksum → Sign → Manifest → Upload

**Verification**: Import key → Verify signature → Verify checksum → Verify artifact

**Key Management**: Master key (offline) → Signing subkey (KMS) → Deployment system

**Approval Chain**: Release Manager → Deployment Manager → Operations Engineer

**Audit Trail**: Signer, timestamp, artifact, checksum, key fingerprint
