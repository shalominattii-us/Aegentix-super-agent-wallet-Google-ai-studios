"""
Aegentix CyberSurf Wave Scoring & Badge Tier Module (Next-Level Advancement from CyberGym)
Path: surf/scoring.py
Description: Evaluates consecutive positive-PnL positions within a single market round trip, wave velocity, and Surfing Badge tier ascension.
"""
from typing import List, Dict, Any, Optional


class SurfScoring:
    # Progressive Surfing Badge Tiers advancing from CyberGym into Sovereign Lattice Levels 1-5
    BADGE_TIERS = [
        {"tier": 1, "code": "SURF_TIER_1_SWELL_RIDER", "name": "Swell Rider Badge", "min_streak": 2, "min_round_trip_pnl_usd": 0.0035},
        {"tier": 2, "code": "SURF_TIER_2_CREST_RUNNER", "name": "Crest Runner Badge", "min_streak": 3, "min_round_trip_pnl_usd": 0.0105},
        {"tier": 3, "code": "SURF_TIER_3_BARREL_SURFER", "name": "Barrel Surfer Badge", "min_streak": 5, "min_round_trip_pnl_usd": 0.0385},
        {"tier": 4, "code": "SURF_TIER_4_PIPELINE_APEX", "name": "Pipeline Apex Badge", "min_streak": 8, "min_round_trip_pnl_usd": 0.1400},
        {"tier": 5, "code": "SURF_TIER_5_SOVEREIGN_TSUNAMI", "name": "Sovereign Tsunami Badge", "min_streak": 12, "min_round_trip_pnl_usd": 0.3850},
    ]

    @staticmethod
    def calculate_positive_pnl_streak(positions: List[Dict[str, Any]], strict_zero_loss: bool = True) -> Dict[str, Any]:
        """
        Evaluates a sequence of closed positions executed within a single market round trip.
        Enforces GATE_SYM_02_STRICT_ZERO_LOSS (net_pnl_usd > 0) and tracks consecutive positive-PnL succession.
        """
        max_consecutive = 0
        current_streak = 0
        total_net_pnl_usd = 0.0
        zero_loss_intact = True

        for pos in positions:
            pnl = float(pos.get("net_pnl_usd", 0.0))
            total_net_pnl_usd += pnl
            if pnl > 0.0:
                current_streak += 1
                if current_streak > max_consecutive:
                    max_consecutive = current_streak
            else:
                zero_loss_intact = False
                if strict_zero_loss:
                    current_streak = 0

        return {
            "position_count": len(positions),
            "consecutive_positive_positions": max_consecutive if not strict_zero_loss else (current_streak if zero_loss_intact else 0),
            "max_streak_observed": max_consecutive,
            "total_net_pnl_usd": round(total_net_pnl_usd, 6),
            "zero_loss_intact": zero_loss_intact and len(positions) > 0,
        }

    @staticmethod
    def calculate_wave_velocity(positions: List[Dict[str, Any]], duration_seconds: float) -> float:
        """Computes positive PnL compounding velocity across successive positions on a round trip."""
        if len(positions) < 2 or duration_seconds <= 0:
            return 0.0
        pnls = [float(p.get("net_pnl_usd", 0.0)) for p in positions]
        slope = (pnls[-1] - pnls[0]) / len(pnls)
        return round(( sum(pnls) / duration_seconds ) * (1.0 + max(0.0, slope)), 6)

    @classmethod
    def evaluate_surfing_badge(
        cls,
        positions: List[Dict[str, Any]],
        duration_seconds: float = 60.0,
        strict_zero_loss: bool = True,
    ) -> Dict[str, Any]:
        """Determines the highest Surfing Badge tier earned on a single market round trip."""
        metrics = cls.calculate_positive_pnl_streak(positions, strict_zero_loss=strict_zero_loss)
        velocity = cls.calculate_wave_velocity(positions, duration_seconds)
        streak = metrics["consecutive_positive_positions"]
        total_pnl = metrics["total_net_pnl_usd"]

        awarded_tier: Optional[Dict[str, Any]] = None
        for tier in cls.BADGE_TIERS:
            if streak >= tier["min_streak"] and total_pnl >= tier["min_round_trip_pnl_usd"]:
                awarded_tier = tier

        return {
            **metrics,
            "wave_velocity": velocity,
            "qualified": awarded_tier is not None,
            "badge": awarded_tier,
            # Tier math on caller-supplied PnL is not an earned badge, a market
            # observation, or permission to trade.
            "evidence_class": "CALLER_SUPPLIED_PNL",
            "external_certification": False,
            "trading_authorization": False,
            "counts_as_earned_badge": False,
        }
