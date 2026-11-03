import { Router, Request, Response } from 'express';
import os from 'os';
import http from 'http';
import { devOpsAgent } from '../devops/continuousDevOpsAgent.ts';

export interface ServiceHealth {
  name: string;
  endpoint: string;
  status: 'ONLINE' | 'OFFLINE' | 'DEGRADED';
  latencyMs: number;
  lastChecked: string;
}

export interface SystemCoherenceReport {
  timestamp: string;
  uptimeSeconds: number;
  coherenceScore: number; // 0 to 100%
  connectivity: {
    corePort3000: boolean;
    omniRoute20128: boolean;
    geminiLive7777: boolean;
  };
  services: ServiceHealth[];
  hostMetrics: {
    cpuCount: number;
    memoryFreeMb: number;
    memoryTotalMb: number;
    memoryUsagePercent: number;
  };
  devOpsSync: {
    cycleCount: number;
    lastStatus: string;
    version: string;
  };
}

class SystemSyncEngine {
  private lastReport: SystemCoherenceReport | null = null;
  private sseClients: Response[] = [];
  private monitorInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.startHeartbeat();
  }

  private startHeartbeat() {
    this.checkCoherence();
    this.monitorInterval = setInterval(() => {
      this.checkCoherence();
    }, 5000);
  }

  private async pingService(name: string, url: string, timeoutMs = 2000): Promise<ServiceHealth> {
    const start = Date.now();
    return new Promise((resolve) => {
      try {
        const req = http.get(url, { timeout: timeoutMs }, (res) => {
          const latencyMs = Date.now() - start;
          const status = res.statusCode && res.statusCode < 400 ? 'ONLINE' : 'DEGRADED';
          resolve({
            name,
            endpoint: url,
            status,
            latencyMs,
            lastChecked: new Date().toISOString()
          });
        });

        req.on('error', () => {
          resolve({
            name,
            endpoint: url,
            status: 'OFFLINE',
            latencyMs: Date.now() - start,
            lastChecked: new Date().toISOString()
          });
        });

        req.on('timeout', () => {
          req.destroy();
          resolve({
            name,
            endpoint: url,
            status: 'OFFLINE',
            latencyMs: timeoutMs,
            lastChecked: new Date().toISOString()
          });
        });
      } catch {
        resolve({
          name,
          endpoint: url,
          status: 'OFFLINE',
          latencyMs: Date.now() - start,
          lastChecked: new Date().toISOString()
        });
      }
    });
  }

  public async checkCoherence(): Promise<SystemCoherenceReport> {
    const services = await Promise.all([
      this.pingService('Core Server', 'http://127.0.0.1:3000/mcp/info'),
      this.pingService('DevOps API', 'http://127.0.0.1:3000/api/devops/status'),
      this.pingService('OmniRoute Proxy', 'http://127.0.0.1:20128/v1/models'),
      this.pingService('Gemini Bridge', 'http://127.0.0.1:8081/status')
    ]);

    const onlineCount = services.filter(s => s.status === 'ONLINE').length;
    const coherenceScore = Math.round((onlineCount / services.length) * 100);

    const devopsStatus = devOpsAgent.getStatus();
    const memTotal = os.totalmem() / (1024 * 1024);
    const memFree = os.freemem() / (1024 * 1024);
    const memUsed = memTotal - memFree;

    const report: SystemCoherenceReport = {
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(os.uptime()),
      coherenceScore,
      connectivity: {
        corePort3000: services[0].status === 'ONLINE',
        omniRoute20128: services[2].status === 'ONLINE',
        geminiLive7777: false
      },
      services,
      hostMetrics: {
        cpuCount: os.cpus().length,
        memoryFreeMb: Math.round(memFree),
        memoryTotalMb: Math.round(memTotal),
        memoryUsagePercent: Math.round((memUsed / memTotal) * 100)
      },
      devOpsSync: {
        cycleCount: devopsStatus.totalCyclesExecuted,
        lastStatus: devopsStatus.lastCycle?.status || 'IDLE',
        version: devopsStatus.lastCycle?.productPropagation?.version || '1.0.0'
      }
    };

    this.lastReport = report;
    this.broadcast(report);
    return report;
  }

  public addClient(res: Response) {
    this.sseClients.push(res);
    res.on('close', () => {
      this.sseClients = this.sseClients.filter(c => c !== res);
    });

    if (this.lastReport) {
      res.write(`data: ${JSON.stringify(this.lastReport)}\n\n`);
    }
  }

  private broadcast(report: SystemCoherenceReport) {
    const payload = `data: ${JSON.stringify(report)}\n\n`;
    for (const client of this.sseClients) {
      try {
        client.write(payload);
      } catch {
        // Drop disconnected client
      }
    }
  }

  public getLatestReport(): SystemCoherenceReport | null {
    return this.lastReport;
  }
}

export const systemSyncEngine = new SystemSyncEngine();
export const syncRouter = Router();

// REST polling endpoint
syncRouter.get('/status', async (_req: Request, res: Response) => {
  const report = await systemSyncEngine.checkCoherence();
  res.json({ success: true, report });
});

// Real-time Server-Sent Events (SSE) streaming endpoint
syncRouter.get('/stream', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  systemSyncEngine.addClient(res);
});
