"""
Aegentix CyberSurf Engine Sync Loop (Next-Level Advancement from CyberGym)
Path: surf/engine.py
Description: Active coordinator advancing CyberGym athletes into market wave surfing and awarding Surfing Badges for successive positive-PnL positions on a single round trip.
"""
import time
from typing import List, Dict, Any
from surf_ledger import SurfLedger
from surf_scoring import SurfScoring

ALLOWED_RESEARCH_PRODUCTS = {"BTC-USD", "XRP-USD"}


def evaluate_round_trip_wave(
    agent_id: str,
    round_trip_id: str,
    symbol: str,
    positions: List[Dict[str, Any]],
    duration_seconds: float = 60.0,
    ledger: SurfLedger = None,
    execution_mode: str = "RESEARCH_SIMULATION",
) -> Dict[str, Any]:
    """
    Research-only round-trip scoring. Does not write a fill receipt or award a badge.
    """
    del ledger
    if execution_mode != "RESEARCH_SIMULATION":
        return {
            "executed": False,
            "mode": "RESEARCH_SIMULATION",
            "status": "REFUSED",
            "symbol": symbol,
            "badge_award": None,
            "earned": False,
            "netProfitUsd": None,
            "txHash": None,
        }
    if symbol not in ALLOWED_RESEARCH_PRODUCTS:
        return {
            "executed": False,
            "mode": "RESEARCH_SIMULATION",
            "venue": "COINBASE_ADVANCED",
            "market": "SPOT",
            "status": "OUT_OF_SCOPE",
            "symbol": symbol,
            "badge_award": None,
            "earned": False,
            "netProfitUsd": None,
            "txHash": None,
            "profitableStrategyValidated": False,
            "zeroLossGuarantee": False,
        }
    evaluation = SurfScoring.evaluate_surfing_badge(
        positions=positions,
        duration_seconds=duration_seconds,
        strict_zero_loss=True,
    )
    return {
        "executed": False,
        "mode": "RESEARCH_SIMULATION",
        "venue": "COINBASE_ADVANCED",
        "market": "SPOT",
        "status": "SIMULATED_NO_ORDER",
        "agent_id": agent_id,
        "round_trip_id": round_trip_id,
        "symbol": symbol,
        "evaluation": evaluation,
        "badge_award": None,
        "earned": False,
        "netProfitUsd": evaluation["total_net_pnl_usd"],
        "txHash": None,
        "profitableStrategyValidated": False,
        "zeroLossGuarantee": False,
    }


def run_surf_sync_loop():
    sample_positions = [
        {"leg": 1, "side": "LONG_SCALE_IN_1", "net_pnl_usd": 0.0},
        {"leg": 2, "side": "LONG_SCALE_IN_2", "net_pnl_usd": 0.0},
    ]
    result = evaluate_round_trip_wave(
        agent_id="AEGENTIX-ATHLETE-01",
        round_trip_id=f"RT-{int(time.time())}",
        symbol="BTC-USD",
        positions=sample_positions,
        duration_seconds=45.0,
    )
    print(
        "[CYBERSURF] Research simulation only. "
        f"Symbol {result['symbol']}. Profit {result['netProfitUsd']}. "
        "Badge earned: no. No order submitted."
    )


if __name__ == "__main__":
    run_surf_sync_loop()
