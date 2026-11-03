#!/usr/bin/env python3
"""
Autonomous CyberCore Orchestrator (The OODA Loop Engine)
Executes a proactive, self-triggering alpha-generation loop every 60 seconds:
1. OBSERVE: Scrapes DEX liquidity, CEX depth, and Social/News sentiment.
2. ORIENT & DECIDE: Consults Heretic LLM (Port 9003) for bounded decision logic.
3. COMPLIANCE GATE: Passes signal through hard security invariants (Port 9004).
4. ACT & BROADCAST: Telemetry dispatch to Super Agent Wallet (Port 9006 / Port 3000).
"""

import asyncio
import json
import os
import time
import urllib.request
import urllib.error
from lib.market_research import MarketResearcher
from security.agent_security_engine import SecurityEngine

HERETIC_URL = "http://127.0.0.1:9003/generate"
COMPLIANCE_URL = "http://127.0.0.1:9004/gate/verify"
TELEMETRY_URL = "http://127.0.0.1:9006/telemetry/push"
WEB_UI_TELEMETRY_URL = "http://127.0.0.1:3000/api/telemetry"
_GATE_KEY_PATH = os.path.join(os.path.expanduser("~"), ".aegentix-dev-keys", "gate_api.key")
GATE_API_KEY = (os.environ.get("AEGENTIX_GATE_API_KEY") or (open(_GATE_KEY_PATH).read().strip() if os.path.exists(_GATE_KEY_PATH) else "")).strip()


class AutonomousCyberCore:
    def __init__(self, heartbeat_interval_seconds: int = 60):
        self.researcher = MarketResearcher()
        self.security = SecurityEngine()
        self.actor_id = "actor-001 [SOVEREIGN]"
        self.heartbeat_interval = heartbeat_interval_seconds
        self.pulse_counter = 0
        self.total_alpha_usd = 0.0

    async def _post_json(self, url: str, data: dict, timeout: float = 2.0, extra_headers: dict = None) -> dict:
        """Helper to post JSON using standard urllib to avoid mandatory third-party pip packages."""
        def _sync_req():
            headers = {"Content-Type": "application/json"}
            if extra_headers:
                headers.update(extra_headers)
            req = urllib.request.Request(
                url,
                data=json.dumps(data).encode("utf-8"),
                headers=headers,
                method="POST",
            )
            try:
                with urllib.request.urlopen(req, timeout=timeout) as resp:
                    return json.loads(resp.read().decode("utf-8"))
            except Exception as e:
                return {"error": str(e)}

        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(None, _sync_req)

    async def broadcast_telemetry(self, event_data: dict):
        """Pushes telemetry to Python bridge (9006) and Web UI (3000)."""
        await self._post_json(TELEMETRY_URL, event_data, timeout=0.8)
        await self._post_json(WEB_UI_TELEMETRY_URL, event_data, timeout=0.8)

    async def heartbeat(self):
        """The core proactive loop that runs continuously."""
        print("=" * 68)
        print(" [!] AUTONOMOUS CYBERCORE ENGINE INITIALIZED: PROACTIVE SIGNAL LOOP")
        print(f" [!] Heartbeat Interval: {self.heartbeat_interval}s | Authority: {self.actor_id}")
        print("=" * 68)

        while True:
            self.pulse_counter += 1
            print(f"\n[*] HEARTBEAT PULSE #{self.pulse_counter}: Initiating OODA Strategy Cycle...")

            try:
                # -----------------------------------------------------------------
                # 1. OBSERVE: Scrape DEX/CEX data + Social/News sentiment
                # -----------------------------------------------------------------
                print("[1. OBSERVE] Ingesting dual-exchange orderbooks & social sentiment...")
                market_context = await self.researcher.get_alpha_data("ETH/USDT")
                spread = market_context.get("spread_pct", 0.0)
                sentiment = market_context.get("social_sentiment", {})
                
                print(f"    -> CEX ETH: ${market_context.get('eth_price_cex')}")
                print(f"    -> DEX ETH: ${market_context.get('eth_price_dex')} | Spread: {spread}%")
                print(f"    -> Social Sentiment: {sentiment.get('sentiment_rating')} (Fear/Greed: {sentiment.get('fear_greed_index')})")

                await self.broadcast_telemetry({
                    "stage": "OBSERVE",
                    "pulse": self.pulse_counter,
                    "market_context": market_context,
                    "message": f"Ingested ETH/USDT spread: {spread}%, sentiment: {sentiment.get('sentiment_rating')}",
                })

                # -----------------------------------------------------------------
                # 2. ORIENT & DECIDE: Consult Heretic LLM
                # -----------------------------------------------------------------
                print("[2. ORIENT & DECIDE] Submitting context to Heretic LLM (Port 9003)...")
                prompt = (
                    f"Analyze this market context: {json.dumps(market_context)}. "
                    f"Generate a trade signal if spread > 0.50%. "
                    f"Format: SIGNAL: [BUY/SELL], ASSET: [X], SPREAD: [Y%], REASON: [Z]"
                )

                heretic_resp = await self._post_json(HERETIC_URL, {"prompt": prompt})
                signal_text = heretic_resp.get("response", "")

                if not signal_text:
                    # Built-in fallback if local heretic_server.py is not yet started in terminal
                    if spread >= 0.50:
                        signal_text = f"SIGNAL: BUY, ASSET: ETH, SPREAD: {spread}%, REASON: Cross-market spread divergence of {spread}% satisfies sovereign threshold."
                    else:
                        signal_text = f"SIGNAL: HOLD, ASSET: ETH, SPREAD: {spread}%, REASON: Spread below minimum threshold."

                print(f"    -> Heretic Output: {signal_text}")

                await self.broadcast_telemetry({
                    "stage": "DECIDE",
                    "pulse": self.pulse_counter,
                    "signal_text": signal_text,
                    "message": f"Heretic Decision: {signal_text}",
                })

                # -----------------------------------------------------------------
                # 3. SECURITY & COMPLIANCE GATE (Hard Invariants Check)
                # -----------------------------------------------------------------
                if "SIGNAL: BUY" in signal_text or "SIGNAL: SELL" in signal_text:
                    print(f"[!] PROACTIVE SIGNAL DETECTED: {signal_text}")
                    print("[3. COMPLIANCE GATE] Auditing behavioral velocity and HMAC sign-off...")

                    # Check behavioral anomaly locally
                    self.security.record_event("AUTONOMOUS_AGENT", "SIGNAL_GENERATED", {"signal": signal_text})
                    is_anomaly = self.security.check_anomalies()

                    if is_anomaly:
                        print("[!] SIGNAL BLOCKED: Behavioral anomaly detected (velocity limit).")
                        await self.broadcast_telemetry({
                            "stage": "GATE_BLOCKED",
                            "pulse": self.pulse_counter,
                            "reason": "Behavioral anomaly detected",
                        })
                    else:
                        # Remote gate verification on Port 9004 (Fail-Closed: never bypass on error or rejection)
                        gate_resp = await self._post_json(
                            COMPLIANCE_URL,
                            {
                                "signal": signal_text,
                                "actor_id": self.actor_id,
                                "market_data": market_context,
                            },
                            extra_headers={"X-API-Key": GATE_API_KEY} if GATE_API_KEY else {},
                        )

                        if gate_resp.get("error") or not gate_resp.get("gate_approved"):
                            reason = gate_resp.get("reason") or gate_resp.get("error") or "Compliance Gate rejected or unreachable (fail-closed)"
                            print(f"[!] GATE FAIL-CLOSED: {reason}")
                            await self.broadcast_telemetry({
                                "stage": "GATE_BLOCKED",
                                "pulse": self.pulse_counter,
                                "reason": reason,
                            })
                            continue

                        gate_block = gate_resp.get("block", {})
                        print(f"    -> Gate PASSED. Chained Block #{gate_block.get('height')}: {gate_block.get('hash', '')[:24]}...")

                        # -------------------------------------------------------------
                        # 4. ACT & BROADCAST: Stage proposal only (never fabricate live alpha)
                        # -------------------------------------------------------------
                        print(f"[4. ACT] Signal approved by Compliance Gate (#{gate_block.get('height')}); live execution requires hardware signing bridge (:8081).")

                        await self.broadcast_telemetry({
                            "stage": "ACT_PROPOSAL_STAGED",
                            "pulse": self.pulse_counter,
                            "action": "STAGE_ARBITRAGE_PROPOSAL",
                            "pair": "ETH/USDT",
                            "alpha_usd": 0.0,
                            "total_alpha_usd": round(self.total_alpha_usd, 2),
                            "compliance_hash": gate_block.get("hash", ""),
                            "message": f"Signal approved by Compliance Gate (Block #{gate_block.get('height')}); awaiting live signing bridge (:8081).",
                        })
                else:
                    print("[*] No trade threshold met. Preserving capital in reserve.")

            except Exception as e:
                print(f"[x] Heartbeat exception: {e}")

            print(f"[*] Sleeping for {self.heartbeat_interval}s until next proactive pulse...")
            await asyncio.sleep(self.heartbeat_interval)


def main():
    agent = AutonomousCyberCore(heartbeat_interval_seconds=60)
    try:
        asyncio.run(agent.heartbeat())
    except KeyboardInterrupt:
        print("\n[*] Autonomous CyberCore Orchestrator stopped by operator.")


if __name__ == "__main__":
    main()
