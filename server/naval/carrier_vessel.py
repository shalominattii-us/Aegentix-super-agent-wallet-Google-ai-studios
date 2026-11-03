"""
Aegentix Sovereign Naval Carrier Vessel Orchestrator
Path: surf/carrier_vessel.py
Description: Naval Strike Group mothership that verifies agent Surfing Badges, provisions
             Deployable Treasury Cells into Agentic Super Wallets, launches open-water market
             wave sorties, and reconciles capital + badge advancements on return.
"""
import time
from typing import Dict, List, Any, Optional
from surf.ledger import SurfLedger
from surf.vessel_treasury import MotherVesselTreasury
from surf.super_wallet_agent import AgenticSuperWallet


class SovereignCarrierVessel:
    """
    Sovereign Expeditionary Carrier Vessel (CVN-AEGENTIX-01).
    Deploys credentialed Agentic Super Wallets with isolated Deployable Treasury Cells
    into open market waters and logs every round-trip wave and Surfing Badge upgrade.
    """
    def __init__(
        self,
        vessel_id: str = "CVN-AEGENTIX-01",
        initial_reserve_usd: float = 100000.00,
        ledger: Optional[SurfLedger] = None,
    ):
        self.vessel_id = vessel_id
        self.ledger = ledger or SurfLedger()
        self.mother_treasury = MotherVesselTreasury(vessel_id=vessel_id, reserve_usd=initial_reserve_usd)
        self.embarked_roster: Dict[str, AgenticSuperWallet] = {}

    def embark_agent(self, agent: AgenticSuperWallet):
        """Registers an Agentic Super Wallet onto the Carrier Vessel's flight deck roster."""
        stored_badges = self.ledger.load_agent_badges(agent.agent_id)
        if stored_badges:
            agent.badges = stored_badges
        self.embarked_roster[agent.agent_id] = agent

    def launch_wave_sortie(
        self,
        agent_id: str,
        symbol: str,
        venue: str,
        wave_impulses: List[Dict[str, Any]],
        required_min_badge_tier: int = 0,
        custom_tranche_usd: Optional[float] = None,
        duration_seconds: float = 45.0,
    ) -> Dict[str, Any]:
        """
        1. Verifies the agent's Surfing Badge clearance at the flight deck catapult gate.
        2. Spawns a badge-scaled Deployable Treasury Cell from the Mother Vessel Treasury.
        3. Binds the treasury cell into the Agentic Super Wallet and launches the round-trip wave sortie.
        4. Recovers the agent on completion, reconciles treasury NAV, and awards new Surfing Badges.
        """
        if agent_id not in self.embarked_roster:
            raise KeyError(f"Agent {agent_id} is not embarked on vessel {self.vessel_id}.")

        agent = self.embarked_roster[agent_id]
        if agent.highest_badge_tier < required_min_badge_tier:
            return {
                "launched": False,
                "agent_id": agent_id,
                "reason": f"BADGE_CLEARANCE_DENIED (holds Tier {agent.highest_badge_tier}, requires Tier {required_min_badge_tier})",
            }

        # Provision Deployable Treasury Cell based on the agent's Surfing Badge tier
        cell = self.mother_treasury.spawn_deployable_cell(
            agent_id=agent.agent_id,
            badge_tier=agent.highest_badge_tier,
            custom_tranche_usd=custom_tranche_usd,
        )
        agent.bind_deployable_treasury(cell)

        # Execute open-water wave round trip
        round_trip_id = f"SORTIE-{self.vessel_id}-{agent.agent_id}-{int(time.time() * 1000) % 100000}"
        sortie_report = agent.ride_market_wave_round_trip(
            symbol=symbol,
            venue=venue,
            wave_impulses=wave_impulses,
            duration_seconds=duration_seconds,
        )
        sortie_report["round_trip_id"] = round_trip_id
        sortie_report["vessel_id"] = self.vessel_id

        # Dock and reconcile the Deployable Treasury Cell back into the Mother Treasury
        treasury_reconciliation = self.mother_treasury.recover_deployable_cell(cell.cell_id)
        sortie_report["treasury_reconciliation"] = treasury_reconciliation

        # Seal wave round trip in SurfLedger
        sealed_wave = self.ledger.append_wave_round_trip(sortie_report)

        # Mint Surfing Badge if qualified
        evaluation = sortie_report["evaluation"]
        badge_award = None
        if evaluation["qualified"] and evaluation["badge"] is not None:
            badge_payload = {
                "vessel_id": self.vessel_id,
                "agent_id": agent.agent_id,
                "wallet_address": agent.wallet_address,
                "naval_role": agent.naval_role,
                "round_trip_id": round_trip_id,
                "treasury_cell_id": cell.cell_id,
                "symbol": symbol,
                "venue": venue,
                "badge_tier": evaluation["badge"]["tier"],
                "badge_code": evaluation["badge"]["code"],
                "badge_name": evaluation["badge"]["name"],
                "consecutive_positive_positions": evaluation["consecutive_positive_positions"],
                "total_net_pnl_usd": evaluation["total_net_pnl_usd"],
                "wave_velocity": evaluation["wave_velocity"],
                "wave_hash": sealed_wave["wave_hash"],
            }
            badge_award = self.ledger.append_badge_award(badge_payload)
            agent.badges.append(badge_award)

        return {
            "launched": True,
            "round_trip_id": round_trip_id,
            "agent_id": agent.agent_id,
            "wallet_address": agent.wallet_address,
            "naval_role": agent.naval_role,
            "treasury_reconciliation": treasury_reconciliation,
            "badge_award": badge_award,
            "mother_treasury_reserve_usd": self.mother_treasury.reserve_usd,
            "realized_fleet_pnl_usd": self.mother_treasury.realized_fleet_pnl_usd,
        }


def run_carrier_strike_simulation():
    carrier = SovereignCarrierVessel(vessel_id="CVN-AEGENTIX-01", initial_reserve_usd=100000.00)

    # Embark two specialized Agentic Super Wallets onto the Carrier Flight Deck
    vanguard = AgenticSuperWallet(
        agent_id="AEG-NODE-644943",
        naval_role="WAVE_STRIKE_SURFER",
        species_kernel="AEGENTIX-XVL",
        badges=[{"badge_tier": 2, "badge_code": "SURF_TIER_2_CREST_RUNNER", "badge_name": "Crest Runner Badge"}],
    )
    recon = AgenticSuperWallet(
        agent_id="AEG-NODE-865854",
        naval_role="ARBITRAGE_RECON_SCOUT",
        species_kernel="AEGENTIX-XV",
        badges=[{"badge_tier": 1, "badge_code": "SURF_TIER_1_SWELL_RIDER", "badge_name": "Swell Rider Badge"}],
    )

    carrier.embark_agent(vanguard)
    carrier.embark_agent(recon)

    # Sortie 1: Vanguard agent (holds Tier 2 Crest Runner Badge -> unlocks $250 Deployable Treasury Cell, up to 5 legs)
    # Rides 5 consecutive positive-PnL wave positions on one round trip -> earns Tier 3 Barrel Surfer Badge!
    sortie_1 = carrier.launch_wave_sortie(
        agent_id="AEG-NODE-644943",
        symbol="SOL-USDC",
        venue="JUPITER_DEX_AND_BINANCE_US",
        required_min_badge_tier=2,
        wave_impulses=[
            {"action": "WAVE_ENTRY_ANCHOR", "net_pnl_usd": 0.0120},
            {"action": "SWELL_SCALE_IN_1", "net_pnl_usd": 0.0185},
            {"action": "CREST_HARVEST_1", "net_pnl_usd": 0.0240},
            {"action": "BARREL_HOLD_EXTENSION", "net_pnl_usd": 0.0310},
            {"action": "ROUND_TRIP_FLAT_EXIT", "net_pnl_usd": 0.0425},
        ],
        duration_seconds=38.0,
    )

    # Sortie 2: Recon Scout (holds Tier 1 Swell Rider Badge -> unlocks $100 Deployable Treasury Cell, up to 3 legs)
    sortie_2 = carrier.launch_wave_sortie(
        agent_id="AEG-NODE-865854",
        symbol="XRP-ESC",
        venue="XRPL_DEX_MANTIS",
        required_min_badge_tier=1,
        wave_impulses=[
            {"action": "RECON_WAVE_ENTRY", "net_pnl_usd": 0.0045},
            {"action": "MID_WAVE_ROTATION", "net_pnl_usd": 0.0065},
            {"action": "ROUND_TRIP_FLAT_EXIT", "net_pnl_usd": 0.0095},
        ],
        duration_seconds=25.0,
    )

    print(f"⚓ [CARRIER {carrier.vessel_id}] Sortie 1 ({sortie_1['agent_id']}): Cell {sortie_1['treasury_reconciliation']['cell_id']} | "
          f"Final Cell NAV: ${sortie_1['treasury_reconciliation']['final_nav_usd']:.4f} | "
          f"Promoted Badge: {sortie_1['badge_award']['badge_name']}")
    print(f"⚓ [CARRIER {carrier.vessel_id}] Sortie 2 ({sortie_2['agent_id']}): Cell {sortie_2['treasury_reconciliation']['cell_id']} | "
          f"Final Cell NAV: ${sortie_2['treasury_reconciliation']['final_nav_usd']:.4f} | "
          f"Promoted Badge: {sortie_2['badge_award']['badge_name']}")
    print(f"🏛️ [MOTHER TREASURY] Reserve: ${carrier.mother_treasury.reserve_usd:,.4f} | Realized Fleet PnL: +${carrier.mother_treasury.realized_fleet_pnl_usd:.4f}")


if __name__ == "__main__":
    run_carrier_strike_simulation()
