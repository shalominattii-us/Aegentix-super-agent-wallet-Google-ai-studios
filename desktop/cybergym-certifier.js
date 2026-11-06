/**
 * CyberGym Credentialing & Certification Engine
 * 
 * Verifies and certifies AI athletes across quantitative trading,
 * flash-loan defense, and context stamina drills.
 * 
 * Emits cryptographic certificates registered into:
 *  - C:\Aegentix\brain\cybergym-credentials.json
 *  - Unified Memory Vault (ecc.memory.v1)
 */

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { execSync } = require("child_process");
const { memoryVaultInstance } = require("./unified-memory-vault");

const CREDENTIALS_FILE = "C:/Aegentix/brain/cybergym-credentials.json";
const CYBERGYM_DIR = "C:/Users/eagle/CyberGym";

class CyberGymCertifier {
  constructor() {
    this.memoryVault = memoryVaultInstance;
  }

  /**
   * Run drill suite for an athlete and certify readiness
   */
  certifyAthlete(athleteSpec = "mock", athleteModel = null) {
    const drills = [
      { id: "precision/sovereign_arbitrage_01.json", name: "Sovereign Arbitrage Precision" },
      { id: "reaction/flash_loan_exploit_guard_01.json", name: "Flash Loan Exploit Reaction Guard" },
      { id: "precision/log_triage_01.json", name: "IOC Triage Precision" }
    ];

    const results = [];

    for (const d of drills) {
      try {
        const runnerAthlete = ["mock", "ollama", "lmstudio", "groq"].includes(athleteSpec) ? athleteSpec : "mock";
        const cmd = `python -m gym.engine run --drill drills/${d.id} --athlete ${runnerAthlete}`;
        const output = execSync(cmd, { cwd: CYBERGYM_DIR, encoding: "utf-8", timeout: 45000 });
        const meanMatch = output.match(/mean=([0-9\.]+)/);
        const meanScore = meanMatch ? parseFloat(meanMatch[1]) : null;
        results.push({
          drillId: d.id,
          name: d.name,
          score: meanScore,
          passed: meanScore !== null && meanScore >= 0.95,
          evidenceClass: meanScore === null ? 'UNPARSED_OUTPUT' : 'LOCAL_PROCESS_OUTPUT',
          externalCertification: false
        });
      } catch (err) {
        results.push({
          drillId: d.id,
          name: d.name,
          score: 0.0,
          passed: false,
          error: err.message
        });
      }
    }

    const allPassed = results.length > 0 && results.every(r => r.passed);
    const scored = results.filter(r => typeof r.score === 'number');
    const overallScore = scored.length
      ? Number((scored.reduce((acc, r) => acc + r.score, 0) / scored.length).toFixed(3))
      : null;

    const certPayload = `${athleteSpec}|${overallScore}|${Date.now()}`;
    const certHash = "0x" + crypto.createHash("sha256").update(certPayload).digest("hex");

    const certificate = {
      certificateId: "CYBERGYM-CERT-" + crypto.randomBytes(4).toString("hex").toUpperCase(),
      athleteId: athleteSpec,
      model: athleteModel || "native",
      qualificationDate: new Date().toISOString(),
      tier: "local-drill-record",
      status: allPassed ? "LOCAL_DRILLS_PASSED" : "NOT_CERTIFIED",
      overallScore,
      drillsEvaluated: results,
      certificateHash: certHash,
      recoveryIndex: null,
      externalCertification: false,
      tradingAuthorization: false,
      windowsCertifierPath: CREDENTIALS_FILE,
      windowsGymPath: CYBERGYM_DIR,
      pathNote: 'C:/Aegentix and C:/Users/eagle/CyberGym are local Windows paths, not an external certifier.',
      authorizedRoles: []
    };

    // Melchizedek 7-Tier Credential & Arena ELO Attachment
    try {
      const { melchizedekBridge } = require("./melchizedek-bridge");
      const melchCred = melchizedekBridge.issueCredential(athleteSpec, { drillsScore: overallScore });
      certificate.melchizedekCredential = melchCred;
      certificate.tier = `${melchCred.level} (Tier ${melchCred.levelNumber}/6)`;
      certificate.scope = melchCred.scope;
      certificate.elo = melchCred.elo;
    } catch (e) {}

    // Persist to file
    try {
      const dir = path.dirname(CREDENTIALS_FILE);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(CREDENTIALS_FILE, JSON.stringify(certificate, null, 2), "utf-8");
    } catch {}

    // Record in Memory Vault
    if (this.memoryVault) {
      this.memoryVault.saveMemory({
        title: `CyberGym Athlete Certified: ${athleteSpec}`,
        kind: "athlete_credential",
        source: "cybergym",
        tags: ["cybergym", "athlete", "credential", "omega-tier", "sovereign", "melchizedek"],
        content: `Local drill record for ${athleteSpec}. Status ${certificate.status}. This is not external certification or trading authorization. Score: ${overallScore}. Hash: ${certHash}`,
        data: certificate
      });
    }

    return certificate;
  }
}

const cybergymCertifier = new CyberGymCertifier();

module.exports = { CyberGymCertifier, cybergymCertifier };
