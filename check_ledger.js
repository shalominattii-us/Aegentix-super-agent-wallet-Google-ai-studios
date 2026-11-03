import { DatabaseSync } from 'node:sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, 'sovereign_treasury.db');
const db = new DatabaseSync(dbPath);

// Ensure audit_logs view exists for query compatibility
db.exec(`CREATE VIEW IF NOT EXISTS audit_logs AS SELECT event_id, event_type, entity_id, volume_usd, payload_hash, signature, verified, timestamp FROM gsmart_audit_logs;`);

try {
  console.log('--- SEARCHING LEDGER FOR VAULT ---');
  const rows = db.prepare('SELECT * FROM audit_logs WHERE entity_id = ? OR entity_id LIKE ?').all('Wn6mXAw47HwSXiGDxGjxydPe5aPDntUzt5DgkHf99WM', '%Wn6mXAw%');
  console.log(JSON.stringify(rows, null, 2));

  console.log('\n--- ALL RECENT AUDIT LOGS ---');
  const all = db.prepare('SELECT * FROM audit_logs ORDER BY timestamp DESC LIMIT 10').all();
  console.log(JSON.stringify(all, null, 2));
} catch (err) {
  console.log('Error reading DB:', err.message);
} finally {
  db.close();
}
