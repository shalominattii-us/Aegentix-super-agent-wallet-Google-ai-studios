/**
 * Zero-Cap Flywheel Express Router
 * Mount at /api/zero-cap
 */

import { Router, Request, Response } from "express";
import {
  getZeroCapStatus,
  simulateSwapRouting,
  simulateFlashLiquidation,
  simulateAgentApiCall,
  bindCoinbaseSuperAgentWallet,
} from "./engine";

export const zeroCapRouter = Router();

// GET /api/zero-cap/status
zeroCapRouter.get("/status", async (_req: Request, res: Response) => {
  try {
    const state = await getZeroCapStatus();
    res.json({ success: true, state });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/zero-cap/simulate-swap-routing
zeroCapRouter.post("/simulate-swap-routing", async (req: Request, res: Response) => {
  try {
    const result = await simulateSwapRouting({
      pair: req.body.pair || "SOL/USDC",
      volumeUsd: Number(req.body.volumeUsd) || 1000,
      protocol: req.body.protocol,
      feeBps: req.body.feeBps ? Number(req.body.feeBps) : undefined,
      live: Boolean(req.body.live),
    });
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/zero-cap/simulate-flash-liquidation
zeroCapRouter.post("/simulate-flash-liquidation", async (req: Request, res: Response) => {
  try {
    const result = await simulateFlashLiquidation({
      protocol: req.body.protocol || "Aave v3",
      debtToRepayUsd: Number(req.body.debtToRepayUsd) || 10000,
      collateralSeizedBonusPct: Number(req.body.collateralSeizedBonusPct) || 5,
      live: Boolean(req.body.live),
    });
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/zero-cap/simulate-agent-api-call
zeroCapRouter.post("/simulate-agent-api-call", async (req: Request, res: Response) => {
  try {
    const result = await simulateAgentApiCall({
      callerAgent: req.body.callerAgent || "@unknown_agent",
      service: req.body.service || "Generic Service",
      feeUsd: Number(req.body.feeUsd) || 0.5,
      live: Boolean(req.body.live),
    });
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/zero-cap/bind-coinbase-sink
// Explicitly re-binds the Super Agent Wallet as the Coinbase treasury sink
zeroCapRouter.post("/bind-coinbase-sink", async (_req: Request, res: Response) => {
  try {
    const state = await bindCoinbaseSuperAgentWallet();
    res.json({
      success: true,
      message: "Super Agent Wallet bound as Coinbase treasury sink",
      coinbaseSink: state.coinbaseSink,
      state,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default zeroCapRouter;
