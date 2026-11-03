"""
Aegentix Sovereign Naval Vessel — Deployable Treasury Cell Module
Path: surf/vessel_treasury.py
Description: Carves out isolated, badge-gated Deployable Treasury Pods from the Mother Treasury (:8081)
             to travel inside each Agentic Super Wallet during open-water market sorties.
"""
import time
import hmac
import hashlib
import secrets
from typing import Dict, Any, Optional


class DeployableTreasuryCell:
    """
    A self-contained tactical treasury pod provisioned by the Carrier Vessel and bound
    directly into an Agentic Super Wallet for an open-market wave-riding sortie.
    """
    # Badge-gated capital allocations & max concurrent wave legs per sortie
    TIER_ALLOCATION_POLICY = {
        0: {"tranche_usd": 25.00, "max_wave_legs": 2, "escrow_reserve_ratio": 0.25, "clearance": "CADET_SHADOW_RECON"},
        1: {"tranche_usd": 100.00, "max_wave_legs": 3, "escrow_reserve_ratio": 0.20, "clearance": "SWELL_RIDER_TACTICAL"},
        2: {"tranche_usd": 250.00, "max_wave_legs": 5, "escrow_reserve_ratio": 0.15, "clearance": "CREST_RUNNER_STRIKE"},
        3: {"tranche_usd": 1000.00, "max_wave_legs": 8, "escrow_reserve_ratio": 0.12, "clearance": "BARREL_SURFER_VANGUARD"},
        4: {"tranche_usd": 5000.00, "max_wave_legs": 12, "escrow_reserve_ratio": 0.10, "clearance": "PIPELINE_APEX_COMMAND"},
        5: {"tranche_usd": 25000.00, "max_wave_legs": 20, "escrow_reserve_ratio": 0.05, "clearance": "SOVEREIGN_TSUNAMI_FLEET"},
    }

    def __init__(
        self,
        cell_id: str,
        vessel_id: str,
        bound_agent_id: str,
        badge_tier: int,
        notary_secret: bytes,
        custom_tranche_usd: Optional[float] = None,
    ):
        policy = self.TIER_ALLOCATION_POLICY.get(badge_tier, self.TIER_ALLOCATION_POLICY[0])
        self.cell_id = cell_id
        self.vessel_id = vessel_id
        self.bound_agent_id = bound_agent_id
        self.badge_tier = badge_tier
        self.clearance = policy["clearance"]
        self.max_wave_legs = policy["max_wave_legs"]
        self.initial_principal_usd = float(custom_tranche_usd if custom_tranche_usd is not None else policy["tranche_usd"])
        self.escrow_floor_usd = round(self.initial_principal_usd * policy["escrow_reserve_ratio"], 4)
        self.deployable_liquidity_usd = round(self.initial_principal_usd - self.escrow_floor_usd, 4)
        self.accumulated_wave_pnl_usd = 0.0
        self.locked_in_position_usd = 0.0
        self.status = "DEPLOYED_AT_SEA"
        self.provisioned_at = time.time()
        self._notary_secret = notary_secret
        self.notary_seal = self._sign_state("PROVISIONED")

    def _sign_state(self, event_tag: str) -> str:
        msg = f"{self.cell_id}|{self.vessel_id}|{self.bound_agent_id}|T{self.badge_tier}|{self.nav_usd:.6f}|{event_tag}".encode("utf-8")
        return hmac.new(self._notary_secret, msg, hashlib.sha256).hexdigest()

    @property
    def nav_usd(self) -> float:
        """Current Net Asset Value of the Deployable Treasury Cell."""
        return round(self.initial_principal_usd + self.accumulated_wave_pnl_usd, 6)

    def allocate_position_margin(self, amount_usd: float) -> float:
        """Locks deployable liquidity into an active wave position while protecting the escrow floor."""
        if self.status != "DEPLOYED_AT_SEA":
            raise RuntimeError(f"Treasury cell {self.cell_id} is not active at sea (status={self.status}).")
        available = self.deployable_liquidity_usd + self.accumulated_wave_pnl_usd - self.locked_in_position_usd
        allocated = min(float(amount_usd), max(0.0, available))
        self.locked_in_position_usd = round(self.locked_in_position_usd + allocated, 6)
        return allocated

    def settle_wave_leg(self, net_pnl_usd: float, release_margin: bool = False) -> Dict[str, Any]:
        """
        Settles a single wave leg inside the Deployable Treasury Cell.
        Enforces GATE_SYM_02_STRICT_ZERO_LOSS: any non-positive leg triggers immediate recall protection.
        """
        pnl = float(net_pnl_usd)
        if pnl <= 0.0:
            self.status = "ZERO_LOSS_GATE_ABORT"
            if release_margin:
                self.locked_in_position_usd = 0.0
            return {
                "accepted": False,
                "reason": "GATE_SYM_02_STRICT_ZERO_LOSS_VIOLATION",
                "nav_usd": self.nav_usd,
                "status": self.status,
                "seal": self._sign_state("GATE_ABORT"),
            }

        self.accumulated_wave_pnl_usd = round(self.accumulated_wave_pnl_usd + pnl, 6)
        if release_margin:
            self.locked_in_position_usd = 0.0

        return {
            "accepted": True,
            "leg_pnl_usd": round(pnl, 6),
            "accumulated_wave_pnl_usd": self.accumulated_wave_pnl_usd,
            "nav_usd": self.nav_usd,
            "status": self.status,
            "seal": self._sign_state("LEG_SETTLED"),
        }

    def dock_and_reconcile(self) -> Dict[str, Any]:
        """Closes out the sortie and returns principal + compounded wave PnL to the Mother Carrier Treasury."""
        self.locked_in_position_usd = 0.0
        self.status = "DOCKED_RECONCILED"
        return {
            "cell_id": self.cell_id,
            "vessel_id": self.vessel_id,
            "bound_agent_id": self.bound_agent_id,
            "badge_tier": self.badge_tier,
            "clearance": self.clearance,
            "initial_principal_usd": self.initial_principal_usd,
            "accumulated_wave_pnl_usd": self.accumulated_wave_pnl_usd,
            "final_nav_usd": self.nav_usd,
            "status": self.status,
            "notary_seal": self._sign_state("DOCKED_RECONCILED"),
        }


class MotherVesselTreasury:
    """
    The Carrier Vessel's primary reserve (:8081 Treasury integration) that spawns
    and reconciles Deployable Treasury Cells for credentialed agents.
    """
    def __init__(self, vessel_id: str = "CVN-AEGENTIX-01", reserve_usd: float = 100000.00, notary_key: Optional[str] = None):
        self.vessel_id = vessel_id
        self.reserve_usd = float(reserve_usd)
        self.deployed_capital_usd = 0.0
        self.realized_fleet_pnl_usd = 0.0
        self._notary_secret = (notary_key or secrets.token_hex(16)).encode("utf-8")
        self.active_cells: Dict[str, DeployableTreasuryCell] = {}

    def spawn_deployable_cell(self, agent_id: str, badge_tier: int, custom_tranche_usd: Optional[float] = None) -> DeployableTreasuryCell:
        cell_id = f"DTC-{agent_id}-T{badge_tier}-{int(time.time() * 1000) % 100000}"
        cell = DeployableTreasuryCell(
            cell_id=cell_id,
            vessel_id=self.vessel_id,
            bound_agent_id=agent_id,
            badge_tier=badge_tier,
            notary_secret=self._notary_secret,
            custom_tranche_usd=custom_tranche_usd,
        )
        if cell.initial_principal_usd > self.reserve_usd:
            raise ValueError(f"Insufficient Mother Treasury reserve ({self.reserve_usd}) for cell tranche ({cell.initial_principal_usd}).")
        self.reserve_usd = round(self.reserve_usd - cell.initial_principal_usd, 6)
        self.deployed_capital_usd = round(self.deployed_capital_usd + cell.initial_principal_usd, 6)
        self.active_cells[cell_id] = cell
        return cell

    def recover_deployable_cell(self, cell_id: str) -> Dict[str, Any]:
        cell = self.active_cells.pop(cell_id)
        settlement = cell.dock_and_reconcile()
        self.deployed_capital_usd = round(self.deployed_capital_usd - cell.initial_principal_usd, 6)
        self.reserve_usd = round(self.reserve_usd + settlement["final_nav_usd"], 6)
        self.realized_fleet_pnl_usd = round(self.realized_fleet_pnl_usd + settlement["accumulated_wave_pnl_usd"], 6)
        return settlement
