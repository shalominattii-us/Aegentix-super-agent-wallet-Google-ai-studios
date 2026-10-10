#!/usr/bin/env bash
# ============================================================
# AEGENTIX CYBERCORE — FULL MULTI-INDUSTRY BAKE VALIDATION
# Runs all 5 industry personas against the local GaiaNet node
# ============================================================

ENGINE="/mnt/c/Users/eagle/AEGENTIX-CYBERNETICS-CORE/cybercore_baking_engine.py"
PASS=0
FAIL=0
TOTAL=5

echo ""
echo "============================================================"
echo "   AEGENTIX CYBERCORE — MULTI-INDUSTRY BAKE VALIDATION"
echo "============================================================"
echo ""

run_test() {
    local industry="$1"
    local prompt="$2"
    echo ">>> [$industry]"
    echo "    Prompt: $prompt"
    result=$(python3 "$ENGINE" --industry "$industry" --prompt "$prompt" 2>&1)
    if echo "$result" | grep -q "RESPONSE OK"; then
        echo "    [PASS] $(echo "$result" | grep 'RESPONSE OK')"
        PASS=$((PASS + 1))
    else
        echo "    [FAIL] $result" | head -4
        FAIL=$((FAIL + 1))
    fi
    echo ""
}

run_test "cybersecurity" \
    "IOC: OAuth token issued to svc-deploy from Tor exit node 185.220.101.45. Triage and action."

run_test "fintech_defi" \
    "Price gap of 42 BPS on ETH-USDC between Aerodrome (Base) and Uniswap v3. Evaluate depth and output swap plan."

run_test "defense_aerospace" \
    "Swarm unit DRN-007 has deviated 12km off mission vector. Telemetry health: GPS degraded. Generate directive."

run_test "healthcare_bio" \
    "Patient: HR 132, SpO2 88%, temp 39.8C, confusion onset 2h ago. Triage and recommended protocol."

run_test "sovereign_governance" \
    "Proposal #42: Increase validator stake weight by 15%. Smart contract hash: 0xd3ad...beef. Audit verdict?"

echo "============================================================"
echo "  RESULTS: $PASS/$TOTAL passed | $FAIL/$TOTAL failed"
echo "============================================================"
echo ""

# Export full industry manifest JSON
python3 "$ENGINE" --export-manifest /mnt/c/Users/eagle/AEGENTIX-CYBERNETICS-CORE/cybercore_industry_manifest.json
echo "  Manifest exported: cybercore_industry_manifest.json"
echo ""
