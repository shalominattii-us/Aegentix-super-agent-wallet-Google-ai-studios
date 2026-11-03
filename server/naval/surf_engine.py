"""
Aegentix CyberSurf Engine Sync Loop (Next-Level Advancement from CyberGym)
Path: surf/engine.py
Description: Active coordinator advancing CyberGym athletes into market wave surfing and awarding Surfing Badges for successive positive-PnL positions on a single round trip.
"""
import time
from typing import List, Dict, Any
from surf.ledger import SurfLedger
from surf.scoring import SurfScoring


def evaluate_round_trip_wave(
    agent_id: str,
    round_trip_id: str,
    symbol: str,
    positions: List[Dict[str, Any]],
    duration_seconds: float = 60.0,
    ledger: SurfLedger = None,
) -> Dict[str, Any]:
    """
    Evaluates a completed market round trip for consecutive positive-PnL positions,
    logs the wave to SurfLedger, and mints a Surfing Badge if tier criteria are met.
    """
    ledger = ledger or SurfLedger()
    evaluation = SurfScoring.evaluate_surfing_badge(
        positions=positions,
        duration_seconds=duration_seconds,
        strict_zero_loss=True,
    )

    wave_record = {
        "agent_id": agent_id,
        "round_trip_id": round_trip_id,
        "symbol": symbol,
        "positions": positions,
        "duration_seconds": duration_seconds,
        "evaluation": evaluation,
    }
    sealed_wave = ledger.append_wave_round_trip(wave_record)

    badge_award = None
    if evaluation["qualified"] and evaluation["badge"] is not None:
        badge_payload = {
            "agent_id": agent_id,
            "round_trip_id": round_trip_id,
            "symbol": symbol,
            "badge_tier": evaluation["badge"]["tier"],
            "badge_code": evaluation["badge"]["code"],
            "badge_name": evaluation["badge"]["name"],
            "consecutive_positive_positions": evaluation["consecutive_positive_positions"],
            "total_net_pnl_usd": evaluation["total_net_pnl_usd"],
            "wave_velocity": evaluation["wave_velocity"],
            "wave_hash": sealed_wave["wave_hash"],
        }
        badge_award = ledger.append_badge_award(badge_payload)

    return {
        "wave": sealed_wave,
        "badge_award": badge_award,
    }


def run_surf_sync_loop():
    ledger = SurfLedger()
    sample_positions = [
        {"leg": 1, "side": "LONG_SCALE_IN_1", "net_pnl_usd": 0.0150},
        {"leg": 2, "side": "LONG_SCALE_IN_2", "net_pnl_usd": 0.0220},
        {"leg": 3, "side": "LONG_SCALE_OUT_1", "net_pnl_usd": 0.0310},
        {"leg": 4, "side": "LONG_ROUND_TRIP_CLOSE", "net_pnl_usd": 0.0450},
    ]
    result = evaluate_round_trip_wave(
        agent_id="AEGENTIX-ATHLETE-01",
        round_trip_id=f"RT-{int(time.time())}",
        symbol="ETH-USD",
        positions=sample_positions,
        duration_seconds=45.0,
        ledger=ledger,
    )
    badge_name = result["badge_award"]["badge_name"] if result["badge_award"] else "NONE"
    print(f"🌊 [CYBERSURF ENGINE] Wave round-trip synchronized. Awarded Badge: {badge_name}")


if __name__ == "__main__":
    run_surf_sync_loop()
