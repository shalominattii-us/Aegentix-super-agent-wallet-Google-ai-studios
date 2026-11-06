"""Local fixture checks for naval surf evidence labeling. No network."""

import importlib.util
import pathlib
import tempfile
import unittest


ROOT = pathlib.Path(__file__).resolve().parents[1]


def load_module(name: str, relative: str):
    path = ROOT / relative
    spec = importlib.util.spec_from_file_location(name, path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


class NavalEvidenceTests(unittest.TestCase):
    def test_supplied_pnl_is_not_an_earned_or_certified_badge(self):
        scoring = load_module("surf_scoring", "server/naval/surf_scoring.py")
        positions = [
            {"net_pnl_usd": 0.02},
            {"net_pnl_usd": 0.03},
            {"net_pnl_usd": 0.04},
        ]
        evaluation = scoring.SurfScoring.evaluate_surfing_badge(positions, duration_seconds=30)
        self.assertTrue(evaluation["qualified"])
        self.assertEqual(evaluation["evidence_class"], "CALLER_SUPPLIED_PNL")
        self.assertFalse(evaluation["external_certification"])
        self.assertFalse(evaluation["trading_authorization"])
        self.assertFalse(evaluation["counts_as_earned_badge"])

    def test_sample_round_trip_does_not_mint_a_badge_file(self):
        scoring = load_module("surf_scoring_for_engine", "server/naval/surf_scoring.py")
        ledger_mod = load_module("surf_ledger_for_engine", "server/naval/surf_ledger.py")
        import sys
        sys.modules["surf.scoring"] = scoring
        sys.modules["surf.ledger"] = ledger_mod
        engine = load_module("surf_engine", "server/naval/surf_engine.py")

        with tempfile.TemporaryDirectory() as tmp:
            ledger = ledger_mod.SurfLedger(
                ledger_path=str(pathlib.Path(tmp) / "waves.jsonl"),
                badge_path=str(pathlib.Path(tmp) / "badges.jsonl"),
            )
            result = engine.evaluate_round_trip_wave(
                agent_id="fixture-agent",
                round_trip_id="RT-FIXTURE",
                symbol="ETH-USD",
                positions=[{"net_pnl_usd": 0.02}, {"net_pnl_usd": 0.03}],
                duration_seconds=30,
                ledger=ledger,
                reproducible_observation=False,
            )
            self.assertIsNone(result["badge_award"])
            self.assertFalse(pathlib.Path(tmp, "badges.jsonl").exists())
            self.assertEqual(result["wave"]["evidence_class"], "SYNTHETIC_OR_UNVERIFIED_PNL")
            self.assertFalse(result["external_certification"])


if __name__ == "__main__":
    unittest.main()
