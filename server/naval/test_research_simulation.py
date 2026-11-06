import unittest

from surf_engine import evaluate_round_trip_wave
from surf_scoring import SurfScoring


class ResearchSimulationTests(unittest.TestCase):
    def test_zero_profit_stays_zero_and_badge_is_not_earned(self):
        result = evaluate_round_trip_wave(
            agent_id="athlete",
            round_trip_id="rt-zero",
            symbol="XRP-USD",
            positions=[{"net_pnl_usd": 0}, {"net_pnl_usd": 0}],
        )
        self.assertFalse(result["executed"])
        self.assertIsNone(result["badge_award"])
        self.assertFalse(result["earned"])
        self.assertEqual(result["netProfitUsd"], 0.0)
        self.assertIsNone(result["txHash"])
        self.assertFalse(result["zeroLossGuarantee"])

    def test_missing_profit_stays_unknown(self):
        metrics = SurfScoring.calculate_positive_pnl_streak([{"leg": 1}, {"net_pnl_usd": 0}])
        self.assertIsNone(metrics["total_net_pnl_usd"])
        self.assertTrue(metrics["unknown_pnl"])

    def test_out_of_scope_pair_does_not_report_the_supplied_profit(self):
        result = evaluate_round_trip_wave(
            agent_id="athlete",
            round_trip_id="rt-eth",
            symbol="ETH-USD",
            positions=[{"net_pnl_usd": 4.5}],
        )
        self.assertEqual(result["status"], "OUT_OF_SCOPE")
        self.assertIsNone(result["netProfitUsd"])
        self.assertIsNone(result["badge_award"])

    def test_positive_fixture_is_not_an_earned_badge(self):
        result = evaluate_round_trip_wave(
            agent_id="athlete",
            round_trip_id="rt-fixture",
            symbol="BTC-USD",
            positions=[{"net_pnl_usd": 0.02}, {"net_pnl_usd": 0.03}],
        )
        self.assertFalse(result["earned"])
        self.assertIsNone(result["badge_award"])
        self.assertFalse(result["evaluation"]["qualified"])
        self.assertIsNone(result["evaluation"]["badge"])
        self.assertFalse(result["profitableStrategyValidated"])


if __name__ == "__main__":
    unittest.main()
