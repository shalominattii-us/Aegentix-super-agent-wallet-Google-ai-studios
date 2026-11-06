import { Router } from 'express';
import {
  buildIntegrationReadiness,
  buildResearchWalletBody,
  guardSpotSimulationRequest,
  rejectConsequentialAction,
  type ConsequentialAction,
  type CredentialPresence,
} from '../../src/research/xamanOmniResearch.ts';

function credentialPresence(): CredentialPresence {
  return {
    xummKeyConfigured: Boolean(process.env.XUMM_API_KEY || process.env.XAMAN_API_KEY),
    xummSecretConfigured: Boolean(process.env.XUMM_API_SECRET || process.env.XAMAN_API_SECRET),
    coinbaseJwtConfigured: Boolean(process.env.COINBASE_JWT),
  };
}

const BLOCKED_POSTS: Record<string, ConsequentialAction> = {
  '/api/omnicyberdex/execute': 'EXECUTE_FILL',
  '/api/agent/execute': 'EXECUTE_FILL',
  '/api/agent/batch-execute-top': 'EXECUTE_FILL',
  '/api/trading/signals/execute': 'EXECUTE_FILL',
  '/api/xaman/create-payload': 'SUBMIT_PAYLOAD',
  '/api/xaman/save-credentials': 'SAVE_CREDENTIALS',
  '/api/xaman/submit-payload': 'SIGN_TRANSACTION',
};

export const xamanResearchGuard = Router();

xamanResearchGuard.use((req, res, next) => {
  if (req.method === 'POST') {
    const action = BLOCKED_POSTS[req.path];
    if (action) {
      return res.status(403).json(rejectConsequentialAction(action));
    }
    if (req.path === '/api/xaman/research/spot-simulation') {
      const result = guardSpotSimulationRequest(req.body || {});
      if (!result.success) {
        return res.status(result.httpStatus).json(result);
      }
      return res.status(200).json(result);
    }
  }

  if (req.method === 'GET' && req.path === '/api/xaman/wallet') {
    return res.status(200).json(buildResearchWalletBody(credentialPresence()));
  }

  if (req.method === 'GET' && req.path === '/api/xaman/research-status') {
    return res.status(200).json({
      success: true,
      ...buildIntegrationReadiness(credentialPresence()),
    });
  }

  if (req.method === 'GET' && req.path === '/api/omnicyberdex/engines') {
    return res.status(200).json({
      success: true,
      mode: 'RESEARCH_SIMULATION',
      liveExecutionEnabled: false,
      evidenceClass: 'SAMPLE_FIXTURE',
      evidenceLabel: 'Engine rows below are the historical static table. They are not heartbeats, volumes, or profit observations.',
      engines: [
        {
          id: 'binance_us',
          name: 'Binance US Engine',
          exchange: 'Binance US',
          status: 'RESEARCH_SIMULATION',
          storedStatusClaim: 'ACTIVE_TRADING',
          evidenceClass: 'SAMPLE_FIXTURE',
          countsAsFill: false,
          countsAsPnl: false,
          liveExecutionEnabled: false,
          totalVolume24hUsd: 1425800,
          ordersExecuted24h: 312,
          pnl24hUsd: 4892.4,
        },
        {
          id: 'finance_us',
          name: 'Finance US CEX/DEX Engine',
          exchange: 'Finance US CEX/DEX',
          status: 'RESEARCH_SIMULATION',
          storedStatusClaim: 'ACTIVE_TRADING',
          evidenceClass: 'SAMPLE_FIXTURE',
          countsAsFill: false,
          countsAsPnl: false,
          liveExecutionEnabled: false,
          totalVolume24hUsd: 1894200,
          ordersExecuted24h: 428,
          pnl24hUsd: 6140.2,
        },
      ],
    });
  }

  next();
});
