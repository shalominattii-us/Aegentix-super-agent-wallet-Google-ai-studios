"""
Aegentix CyberSurf Wave Ledger Module (Next-Level Advancement from CyberGym)
Path: surf/ledger.py
Description: Append-only JSONL tracking system preserving multi-position market wave round trips and Surfing Badge attestations.
"""
import os
import json
import time
import hashlib
from typing import Dict, List, Any


class SurfLedger:
    def __init__(self, ledger_path: str = "surf_ledger.jsonl", badge_path: str = "surf_badges.jsonl"):
        self.ledger_path = ledger_path
        self.badge_path = badge_path

    @staticmethod
    def compute_wave_hash(payload: Dict[str, Any]) -> str:
        """Computes a canonical SHA-256 seal for a round-trip wave or badge record."""
        canonical = json.dumps(payload, sort_keys=True, separators=(",", ":")).encode("utf-8")
        return hashlib.sha256(canonical).hexdigest()

    def append_wave_round_trip(self, round_trip_record: Dict[str, Any]) -> Dict[str, Any]:
        """Appends a completed market round-trip wave record to the immutable JSONL tracking log."""
        record = dict(round_trip_record)
        record.setdefault("timestamp", time.time())
        record["wave_hash"] = self.compute_wave_hash(record)
        with open(self.ledger_path, "a", encoding="utf-8") as f:
            f.write(json.dumps(record) + "\n")
        return record

    def append_badge_award(self, badge_record: Dict[str, Any]) -> Dict[str, Any]:
        """Appends an earned Surfing Badge attestation to the immutable JSONL badge log."""
        record = dict(badge_record)
        record.setdefault("awarded_at", time.time())
        record["badge_seal"] = self.compute_wave_hash(record)
        with open(self.badge_path, "a", encoding="utf-8") as f:
            f.write(json.dumps(record) + "\n")
        return record

    def load_agent_badges(self, agent_id: str) -> List[Dict[str, Any]]:
        """Loads all Surfing Badges earned by a specific Aegentix athlete agent."""
        if not os.path.exists(self.badge_path):
            return []
        badges = []
        with open(self.badge_path, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if not line:
                    continue
                entry = json.loads(line)
                if entry.get("agent_id") == agent_id:
                    badges.append(entry)
        return badges
