import { spawn, ChildProcess } from 'child_process';
import http from 'http';
import path from 'path';

class PersistentSupervisor {
  private child: ChildProcess | null = null;
  private isShuttingDown: boolean = false;
  private restartCount: number = 0;
  private readonly projectDir: string = process.cwd();

  constructor() {
    this.setupExitHandlers();
    this.startServer();
    this.startHealthWatchdog();
  }

  private setupExitHandlers() {
    const cleanup = () => {
      this.isShuttingDown = true;
      if (this.child) {
        console.log('[Supervisor] Terminating child process...');
        this.child.kill('SIGTERM');
      }
      process.exit(0);
    };

    process.on('SIGINT', cleanup);
    process.on('SIGTERM', cleanup);
  }

  private startServer() {
    if (this.isShuttingDown) return;

    this.restartCount++;
    console.log(`[Supervisor] Launching Aegentix Core server (Invocation #${this.restartCount})...`);

    const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';

    this.child = spawn(npmCmd, ['run', 'dev'], {
      cwd: this.projectDir,
      stdio: 'inherit',
      shell: true,
      env: { ...process.env, SUPERVISOR_ACTIVE: 'true' }
    });

    this.child.on('exit', (code, signal) => {
      console.warn(`[Supervisor] Core server exited with code ${code}, signal ${signal}.`);
      this.child = null;
      if (!this.isShuttingDown) {
        console.log('[Supervisor] Auto-restarting core server in 3 seconds...');
        setTimeout(() => this.startServer(), 3000);
      }
    });

    this.child.on('error', (err) => {
      console.error('[Supervisor] Failed to spawn child process:', err.message);
    });
  }

  private startHealthWatchdog() {
    // Health probe every 15 seconds to ensure port 3000 is answering
    setInterval(() => {
      if (this.isShuttingDown) return;

      const req = http.get('http://127.0.0.1:3000/api/devops/status', { timeout: 4000 }, (res) => {
        if (res.statusCode !== 200) {
          console.warn(`[Supervisor] Health probe returned status ${res.statusCode}.`);
        }
      });

      req.on('error', (err) => {
        console.warn(`[Supervisor] Health check warning: 127.0.0.1:3000 unreachable (${err.message}).`);
      });

      req.on('timeout', () => {
        req.destroy();
        console.warn('[Supervisor] Health check timed out after 4000ms.');
      });
    }, 15000);
  }
}

new PersistentSupervisor();
