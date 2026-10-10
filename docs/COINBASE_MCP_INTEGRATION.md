# Coinbase Agentic Wallet MCP Integration

## Overview

Agentic Wallet MCP is an MCP server & companion wallet app that combines wallets, onramps, and payments (x402) into a single solution for agentic commerce.

**Key Features:**
- AI agents can autonomously discover and pay for services
- No API keys, complex seed phrases, or manual intervention required
- Payments supported on Base, Polygon, and Solana
- Embedded wallet creation with email/OTP authentication

## Installation & Setup

```bash
npx @coinbase/payments-mcp
```

### Flow:
1. **Install:** Run MCP server
2. **Sign in:** Authenticate with email/OTP (creates embedded wallet)
3. **Add funds:** Use Coinbase Onramp to add USDC
4. **Start using:** Agent can discover and pay for services automatically

## What Agents Can Do

### Wallet Management
- Check balance
- Get wallet address
- Open wallet UI (includes Bazaar explorer to browse services)

### Payments
- Discover x402 services
- Make automatic payments on Base, Polygon, and Solana
- Access paid APIs

### User Control (NOT delegated to agent)
- Spending limits (max per-call, max per-session)
- Fund transfers
- Onramp flows

## Supported Clients
- Claude Desktop
- Claude Code
- Codex CLI
- Gemini CLI
- Cherry Studio
- Most stdio-compatible MCP clients

## Integration with AEGENTIS

### Architecture
```
AEGENTIS Agent
    ↓
Agentic Wallet MCP Server
    ↓
Coinbase Embedded Wallet
    ↓
Base/Polygon/Solana Networks
```

### Implementation Steps

1. **Install MCP Server**
   ```bash
   npm install @coinbase/payments-mcp
   ```

2. **Configure in AEGENTIS**
   - Register MCP server in agent runtime
   - Set spending limits per operation
   - Configure payment networks (Base, Polygon, Solana)

3. **Enable Autonomous Payments**
   - Agents can discover x402 services
   - Automatic payment execution within limits
   - Real-time transaction tracking

## x402 Protocol Integration

x402 is a payment protocol that enables:
- Service discovery by agents
- Automatic payment for API access
- Micropayments on blockchain
- No manual intervention required

## Security & Control

**Agent Permissions:**
- ✅ Check balance
- ✅ Discover services
- ✅ Make payments (within limits)
- ✅ Get wallet address

**User Permissions (retained):**
- ✅ Set spending limits
- ✅ Manage funds
- ✅ Control onramp flows
- ✅ Approve high-value operations

## Example Usage

```
User: "Based on latest AI news, give me a report on top 3 
up and coming tokens on Solana."

Agent:
1. Discovers news API (x402 service)
2. Discovers crypto data API (x402 service)
3. Discovers token info API (x402 service)
4. Pays for API calls with USDC (within spending limit)
5. Returns comprehensive report
```

## AEGENTIS Integration Points

### 1. Autonomous Treasury Agent
- Uses Agentic Wallet MCP for payments
- Operates within defined spending policies
- Tracks all transactions

### 2. Multi-Sig Coordination
- High-value operations require approval
- Low-value operations execute autonomously
- Real-time audit trail

### 3. Skill Economy
- Agents pay for premium data services
- Agents pay for computational resources
- Agents pay for API access

## Configuration for US-WEST-1

```env
COINBASE_MCP_ENABLED=true
COINBASE_MCP_NETWORKS=base,polygon,solana
COINBASE_MCP_SPENDING_LIMIT_PER_CALL=1000 # USDC
COINBASE_MCP_SPENDING_LIMIT_PER_SESSION=10000 # USDC
AWS_REGION=us-west-1
```

## Next Steps

1. Install Coinbase Agentic Wallet MCP
2. Configure spending limits
3. Set up embedded wallet
4. Integrate with AEGENTIS agent runtime
5. Enable autonomous payment discovery
6. Monitor transactions via dashboard

## Resources

- [Coinbase Agentic Wallet MCP Docs](https://docs.cdp.coinbase.com/agentic-wallet/mcp/welcome)
- [Quickstart Guide](https://docs.cdp.coinbase.com/agentic-wallet/mcp/quickstart)
- [MCP Tools Reference](https://docs.cdp.coinbase.com/agentic-wallet/mcp/tools)
- [Examples](https://docs.cdp.coinbase.com/agentic-wallet/mcp/examples)
- [FAQ](https://docs.cdp.coinbase.com/agentic-wallet/mcp/faq)
