# AEGENTIX Treasury Labs - Deployment Guide

**Author:** Manus AI  
**Date:** July 5, 2026  
**Status:** Production Ready

## 1. Overview

This guide provides step-by-step instructions for deploying the AEGENTIX Treasury Labs system, a comprehensive autonomous financial operations platform built on the Sovereign System Portal infrastructure. The Treasury Labs integrates with the Coinbase Developer Platform (CDP), multiple cryptocurrency exchanges, and the AEGENTIS-X signal bus for trigger-based autonomous rebalancing.

## 2. Prerequisites

Before deploying the Treasury Labs, ensure the following prerequisites are met:

- **Node.js:** v22.13.0 or later
- **Docker Desktop:** Latest version with Docker Compose support
- **Kubernetes:** v1.28+ (for production deployments)
- **PostgreSQL:** v15+ (database backend)
- **Redis:** v7+ (queue and caching)
- **Environment Variables:** API keys and credentials for Kraken, Binance, and CDP

## 3. Environment Configuration

### 3.1 Create `.env.treasury` File

Create a `.env.treasury` file in the project root with the following variables:

```bash
# Coinbase Developer Platform
CDP_API_KEY=your_cdp_api_key_here
CDP_API_SECRET=your_cdp_api_secret_here

# Kraken Exchange
KRAKEN_API_KEY=your_kraken_api_key_here
KRAKEN_API_SECRET=your_kraken_api_secret_here

# Binance Exchange
BINANCE_API_KEY=your_binance_api_key_here
BINANCE_API_SECRET=your_binance_api_secret_here

# Treasury Labs Configuration
TREASURY_REBALANCE_STRATEGY=balanced
TREASURY_SIGNAL_SOURCE=aegentis-x
TREASURY_AUTONOMOUS_MODE=true
TREASURY_HERMES_GOVERNOR_PORT=9950

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/treasury_labs
REDIS_URL=redis://localhost:6379

# Monitoring
PROMETHEUS_ENABLED=true
GRAFANA_ENABLED=true
```

### 3.2 Secure Credentials in Vault

All sensitive credentials should be stored in the `.secrets/` vault:

```bash
mkdir -p .secrets
chmod 700 .secrets

# Store credentials securely
echo "CDP_API_KEY=..." > .secrets/cdp.env
echo "KRAKEN_API_KEY=..." > .secrets/kraken.env
echo "BINANCE_API_KEY=..." > .secrets/binance.env
```

## 4. Local Development Deployment

### 4.1 Install Dependencies

```bash
cd /home/ubuntu/sovereign-system-portal
pnpm install
```

### 4.2 Initialize Database

```bash
pnpm db:push
```

### 4.3 Start Development Server

```bash
pnpm dev
```

The development server will start on `http://localhost:3000` with hot module reloading enabled.

## 5. Docker Compose Deployment

### 5.1 Build Docker Images

```bash
docker-compose -f docker-compose.cybercore.yml build
```

### 5.2 Start Services

```bash
docker-compose -f docker-compose.cybercore.yml up -d
```

This will start all services including:
- Control Plane (port 3001)
- Hedera Runtime (port 3002)
- Skill Registry (port 3003)
- Wallets Service (port 3004)
- API Gateway (port 8080)
- Redis Queue (port 6379)
- PostgreSQL (port 5432)
- Prometheus (port 9090)
- Grafana (port 3050)

### 5.3 Verify Services

```bash
docker-compose -f docker-compose.cybercore.yml ps
```

All services should show status `Up`.

## 6. Kubernetes Deployment

### 6.1 Create Namespace

```bash
kubectl apply -f k8s/cybercore-deployment.yaml
```

### 6.2 Verify Deployment

```bash
kubectl get pods -n cybercore
kubectl get services -n cybercore
```

### 6.3 Access Services

```bash
# Port forward to API Gateway
kubectl port-forward -n cybercore svc/cybercore-gateway 8080:8080

# Port forward to Grafana
kubectl port-forward -n cybercore svc/grafana 3050:3050
```

## 7. Configuration & Initialization

### 7.1 Register Exchange Adapters

The system automatically initializes with three exchange adapters:

- **Kraken:** For high-liquidity trading pairs
- **Binance:** For diverse asset coverage
- **CDP DEX:** For on-chain Base network trading

### 7.2 Configure Rebalancing Strategies

Three default strategies are available:

**Conservative Strategy:**
- 60% USDC (stables)
- 30% ETH
- 10% BTC
- Rebalance threshold: 5%

**Balanced Strategy:**
- 40% USDC
- 35% ETH
- 15% BTC
- 10% SOL
- Rebalance threshold: 7%

**Aggressive Strategy:**
- 20% USDC
- 40% ETH
- 20% BTC
- 10% SOL
- 10% AAPL
- Rebalance threshold: 10%

### 7.3 Enable AEGENTIS-X Signal Integration

The Treasury Labs automatically subscribes to the AEGENTIS-X signal bus. Ensure AEGENTIS-X is operational and emitting signals:

```typescript
// Signals are automatically processed by AutonomousRebalancingEngine
// Signal types: market_opportunity, risk_alert, rebalance_trigger, arbitrage_signal
```

## 8. Monitoring & Observability

### 8.1 Access Prometheus

Navigate to `http://localhost:9090` to view metrics from all Treasury Labs services.

### 8.2 Access Grafana

Navigate to `http://localhost:3050` (default credentials: admin/admin) to view pre-built dashboards:

- Treasury Portfolio Overview
- Rebalancing Engine Status
- Exchange Integration Health
- Atomic Settlement Metrics
- Gas Sponsorship Analytics

### 8.3 View Logs

```bash
# Docker Compose logs
docker-compose -f docker-compose.cybercore.yml logs -f cybercore-control-plane

# Kubernetes logs
kubectl logs -n cybercore deployment/cybercore-control-plane -f
```

## 9. Testing & Validation

### 9.1 Run Test Suite

```bash
pnpm test server/cybercore.test.ts
```

Expected output: 30+ tests passing with 0 errors.

### 9.2 Manual Testing

Test the Treasury Dashboard at `http://localhost:3000/treasury-dashboard`:

1. Verify portfolio value display
2. Check rebalancing engine status
3. Confirm exchange integration status
4. Test atomic settlement monitoring

## 10. Production Deployment

### 10.1 Pre-Deployment Checklist

- [ ] All environment variables configured
- [ ] Database backups enabled
- [ ] Monitoring and alerting configured
- [ ] Load testing completed
- [ ] Security audit passed
- [ ] Disaster recovery plan documented

### 10.2 Deploy to Production

```bash
# Using Kubernetes
kubectl apply -f k8s/cybercore-deployment.yaml --context=production

# Or using Docker Compose on production server
docker-compose -f docker-compose.cybercore.yml up -d
```

### 10.3 Post-Deployment Verification

```bash
# Verify all services are operational
curl http://api-gateway:8080/health

# Check portfolio value
curl http://api-gateway:8080/api/treasury/portfolio

# Monitor active operations
curl http://api-gateway:8080/api/treasury/status
```

## 11. Troubleshooting

### 11.1 Services Not Starting

**Problem:** Docker containers fail to start  
**Solution:** Check logs with `docker-compose logs` and verify environment variables are set correctly.

### 11.2 Exchange Connection Failures

**Problem:** "Failed to connect to Kraken/Binance"  
**Solution:** Verify API keys are correct and have appropriate permissions. Check firewall rules.

### 11.3 Database Connection Issues

**Problem:** "Cannot connect to PostgreSQL"  
**Solution:** Verify DATABASE_URL is correct and PostgreSQL service is running.

### 11.4 AEGENTIS-X Signal Not Received

**Problem:** Rebalancing engine not receiving signals  
**Solution:** Verify AEGENTIS-X is operational and signal bus is connected. Check network connectivity.

## 12. Maintenance & Operations

### 12.1 Regular Backups

```bash
# Backup PostgreSQL database
pg_dump treasury_labs > backup_$(date +%Y%m%d).sql

# Backup Redis data
redis-cli BGSAVE
```

### 12.2 Performance Tuning

Monitor Prometheus metrics and adjust:
- Database connection pool size
- Redis cache TTL
- Rebalancing check frequency
- Signal processing batch size

### 12.3 Security Updates

Regularly update dependencies:

```bash
pnpm update
docker pull <service>:latest
```

## 13. Support & Escalation

For issues or questions:

1. Check logs in `.manus-logs/` directory
2. Review Prometheus metrics
3. Consult Grafana dashboards
4. Contact AEGENTIX support team

---

**Deployment Status:** ✅ Ready for Production

**Last Updated:** July 5, 2026
