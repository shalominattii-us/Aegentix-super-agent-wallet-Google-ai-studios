"""
Aegentix Embodied Agentic Super Wallet Module
Path: surf/super_wallet_agent.py
Description: Self-contained Agent-as-Wallet unit that carries its own Surfing Badge credentials,
             bound Deployable Treasury Cell, and dual CEX/DEX wave-riding execution engine.
"""
import time
import hashlib
from typing import List, Dict, Any, Optional
from surf.vessel_treasury import DeployableTreasuryCell
from surf.scoring import SurfScoring


class AgenticSuperWallet:
    """
    An autonomous agent and cryptographic super-wallet fused into a single deployable unit.
    Goes out into open market waters carrying its Surfing Badges and a Deployable Treasury Cell,
    holds the position across multi-leg waves, and returns compounded capital on a single round trip.
    """
    def __init__(
        self,
        agent_id: str,
        naval_role: str,
        species_kernel: str = "AEGENTIX-XVL",
        badges: Optional[List[Dict[str, Any]]] = None,
    ):
        self.agent_id = agent_id
        self.naval_role = naval_role  # e.g., WAVE_STRIKE, ARBITRAGE_RECON, LIQUIDITY_VANGUARD, ESCORT_HEDGE
        self.species_kernel = species_kernel
        self.badges: List[Dict[str, Any]] = list(badges or [])
        self.wallet_address = "0xAEG" + hashlib.sha256(f"{agent_id}:{species_kernel}".encode("utf-8")).hexdigest()[:37]
        self.treasury_cell: Optional[DeployableTreasuryCell] = None
        self.active_position_open = False
        self.current_round_trip_legs: List[Dict[str, Any]] = []

    @property
    def highest_badge_tier(self) -> int:
        if not self.badges:
            return 0
        return max(int(b.get("badge_tier", 0)) for b in self.badges)

    @property
    def highest_badge_code(self) -> str:
        if not self.badges:
            return "UNCREDENTIALED_CADET"
        top = max(self.badges, key=lambda b: int(b.get("badge_tier", 0)))
        return str(top.get("badge_code", "UNCREDENTIALED_CADET"))

    def bind_deployable_treasury(self, cell: DeployableTreasuryCell):
        """Binds an isolated Deployable Treasury Cell directly into the Agentic Super Wallet."""
        if cell.bound_agent_id != self.agent_id:
            raise ValueError(f"Treasury cell {cell.cell_id} is bound to {cell.bound_agent_id}, not {self.agent_id}.")
        self.treasury_cell = cell
        self.current_round_trip_legs = []

    def ride_market_wave_round_trip(
        self,
        symbol: str,
        venue: str,
        wave_impulses: List[Dict[str, Any]],
        duration_seconds: float = 45.0,
    ) -> Dict[str, Any]:
        """
        Executes a single round-trip market wave:
        1. Opens and holds the core position using its bound Deployable Treasury Cell.
        2. Rides successive positive-PnL wave legs (scaling in/harvesting crests) within its badge-cleared limit.
        3. Closes the round trip flat and evaluates Surfing Badge progression.
        """
        if self.treasury_cell is None:
            raise RuntimeError(f"AgenticSuperWallet {self.agent_id} has no bound DeployableTreasuryCell.")

        max_legs = self.treasury_cell.max_wave_legs
        allocated_margin = self.treasury_cell.allocate_position_margin(self.treasury_cell.deployable_liquidity_usd)
        self.active_position_open = True
        self.current_round_trip_legs = []

        for idx, impulse in enumerate(wave_impulses[:max_legs], start=1):
            leg_pnl = float(impulse.get("net_pnl_usd", 0.0))
            is_final_leg = idx == min(len(wave_impulses), max_legs)
            settlement = self.treasury_cell.settle_wave_leg(leg_pnl, release_margin=is_final_leg)

            leg_record = {
                "leg": idx,
                "symbol": symbol,
                "venue": venue,
                "action": impulse.get("action", "WAVE_CREST_HARVEST" if not is_final_leg else "ROUND_TRIP_CLOSE"),
                "net_pnl_usd": round(leg_pnl, 6),
                "cell_nav_usd": settlement["nav_usd"],
                "notary_seal": settlement["seal"],
            }
            self.current_round_trip_legs.append(leg_record)

            if not settlement["accepted"]:
                # GATE_SYM_02_STRICT_ZERO_LOSS triggered immediate flat exit
                self.active_position_open = False
                break

        self.active_position_open = False
        evaluation = SurfScoring.evaluate_surfing_badge(
            positions=self.current_round_trip_legs,
            duration_seconds=duration_seconds,
            strict_zero_loss=True,
        )

        return {
            "agent_id": self.agent_id,
            "wallet_address": self.wallet_address,
            "naval_role": self.naval_role,
            "pre_sortie_badge_tier": self.highest_badge_tier,
            "pre_sortie_badge_code": self.highest_badge_code,
            "treasury_cell_id": self.treasury_cell.cell_id,
            "allocated_margin_usd": allocated_margin,
            "symbol": symbol,
            "venue": venue,
            "positions": self.current_round_trip_legs,
            "duration_seconds": duration_seconds,
            "evaluation": evaluation,
        }
