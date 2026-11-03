import { DatabaseSync } from 'node:sqlite';
import fs from 'fs';
import path from 'path';

// 1. Resolve database path
const dbPath = path.resolve(process.cwd(), 'sovereign_treasury.db');
const db = new DatabaseSync(dbPath);

// 2. Initialize schema directly to guarantee tables exist across any execution context
db.exec(`
CREATE TABLE IF NOT EXISTS sovereign_ledger (
    id TEXT PRIMARY KEY,
    entity_id TEXT NOT NULL,
    transaction_type TEXT NOT NULL,
    amount_usd REAL NOT NULL,
    currency TEXT NOT NULL,
    status TEXT NOT NULL,
    timestamp INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS gsmart_audit_logs (
    event_id TEXT PRIMARY KEY,
    event_type TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    volume_usd REAL NOT NULL,
    payload_hash TEXT NOT NULL,
    signature TEXT NOT NULL,
    verified INTEGER NOT NULL,
    timestamp INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_ledger_timestamp ON sovereign_ledger(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_audit_timestamp ON gsmart_audit_logs(timestamp DESC);
`);

// 3. Prepared Statements for High-Performance Atomic Writes
const insertLedgerStmt = db.prepare(`
  INSERT OR REPLACE INTO sovereign_ledger (id, entity_id, transaction_type, amount_usd, currency, status, timestamp)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);

const insertAuditStmt = db.prepare(`
  INSERT OR REPLACE INTO gsmart_audit_logs (event_id, event_type, entity_id, volume_usd, payload_hash, signature, verified, timestamp)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

export const persistence = {
  recordLedgerTransaction: (id: string, entityId: string, type: string, amountUSD: number, currency: string, status: string) => {
    try {
      return insertLedgerStmt.run(id, entityId, type, amountUSD, currency, status, Date.now());
    } catch {
      return null;
    }
  },

  recordAuditLog: (eventId: string, eventType: string, entityId: string, volumeUSD: number, payloadHash: string, signature: string, verified: boolean) => {
    try {
      return insertAuditStmt.run(eventId, eventType, entityId, volumeUSD, payloadHash, signature, verified ? 1 : 0, Date.now());
    } catch {
      return null;
    }
  },

  getRecentAudits: (limit = 20) => {
    try {
      return db.prepare(`SELECT * FROM gsmart_audit_logs ORDER BY timestamp DESC LIMIT ?`).all(limit);
    } catch {
      return [];
    }
  },

  getRecentTransactions: (limit = 20) => {
    try {
      return db.prepare(`SELECT * FROM sovereign_ledger ORDER BY timestamp DESC LIMIT ?`).all(limit);
    } catch {
      return [];
    }
  }
};

export default db;
