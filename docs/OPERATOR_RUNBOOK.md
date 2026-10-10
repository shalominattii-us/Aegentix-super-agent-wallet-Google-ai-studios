# AEGENTIX Sovereign Runtime - Operator Runbook

## Quick Reference

| Task | Command | Expected Time |
|------|---------|----------------|
| Check system health | `curl http://localhost:3000/health` | < 1s |
| View event metrics | `curl http://localhost:3000/api/metrics` | < 2s |
| Restart service | `systemctl restart aegentix` | 5-10s |
| Backup database | `mysqldump -u sovereign -p sovereign_system > backup.sql` | 1-5m |
| Restore database | `mysql -u sovereign -p sovereign_system < backup.sql` | 2-10m |

## Daily Operations

### Morning Checklist

1. **System Health Check**
   ```bash
   curl http://localhost:3000/health
   ```
   Expected: `"status": "healthy"`

2. **Event Processing Status**
   ```bash
   curl http://localhost:3000/api/metrics | jq '.eventCount'
   ```
   Expected: Increasing count

3. **Error Rate Check**
   ```bash
   curl http://localhost:3000/api/metrics | jq '.errorRate'
   ```
   Expected: < 0.01 (1%)

4. **Database Connection**
   ```bash
   mysql -u sovereign -p sovereign_system -e "SELECT COUNT(*) FROM events;"
   ```
   Expected: Positive number

### Monitoring Dashboard

Access Grafana:
```bash
kubectl port-forward -n monitoring svc/grafana 3000:80
# Open http://localhost:3000
# Credentials: admin / prom-operator
```

Key dashboards:
- **System Health:** Overall system status
- **Event Processing:** Event throughput and latency
- **Federation Status:** Federated node health
- **Database Performance:** Query performance and connections

## Common Operations

### 1. Viewing Event Logs

```bash
# Last 100 events
curl http://localhost:3000/api/events?limit=100 | jq '.'

# Events by system
curl http://localhost:3000/api/events?system=portal | jq '.'

# Events by authority
curl http://localhost:3000/api/events?authority=sovereign | jq '.'

# Events in time range
curl http://localhost:3000/api/events?startTime=2026-07-03T00:00:00Z&endTime=2026-07-03T23:59:59Z | jq '.'
```

### 2. Checking Authority Decisions

```bash
# Pending decisions
curl http://localhost:3000/api/federation/decisions/pending | jq '.'

# Approved decisions
curl http://localhost:3000/api/federation/decisions/approved | jq '.'

# Decision details
curl http://localhost:3000/api/federation/decisions/{decisionId} | jq '.'
```

### 3. Monitoring Replay Operations

```bash
# Active replay sessions
curl http://localhost:3000/api/replay/sessions | jq '.[] | select(.status=="in_progress")'

# Completed replays
curl http://localhost:3000/api/replay/sessions | jq '.[] | select(.status=="completed")'

# Replay statistics
curl http://localhost:3000/api/replay/stats | jq '.'
```

### 4. Federation Status

```bash
# Node status
curl http://localhost:3000/api/federation/nodes | jq '.'

# Node health
curl http://localhost:3000/api/federation/nodes/{nodeId}/health | jq '.'

# Federation metrics
curl http://localhost:3000/api/federation/metrics | jq '.'
```

## Troubleshooting

### Issue: System Health Degraded

**Symptoms:**
- Health check returns `"status": "degraded"`
- Error rate > 5%
- Event processing slow

**Diagnosis:**
```bash
# Check error logs
tail -f /var/log/aegentix/errors.log

# Check database performance
mysql -u sovereign -p sovereign_system -e "SHOW PROCESSLIST;"

# Check system resources
free -h
df -h
top -b -n 1 | head -20
```

**Resolution:**
1. Identify bottleneck (database, memory, CPU)
2. Scale resources if needed
3. Check for stuck queries
4. Restart service if necessary

### Issue: High Error Rate

**Symptoms:**
- Error rate > 10%
- Failed events accumulating

**Diagnosis:**
```bash
# View recent errors
curl http://localhost:3000/api/metrics | jq '.eventsByStatus'

# Check error logs
grep "ERROR" /var/log/aegentix/errors.log | tail -50

# Check causality violations
curl http://localhost:3000/api/metrics | jq '.causalityViolations'
```

**Resolution:**
1. Check for missing dependencies
2. Verify event ordering
3. Check authority enforcement
4. Review recent deployments

### Issue: Slow Event Processing

**Symptoms:**
- Event latency > 1000ms
- Queue building up
- Replay operations slow

**Diagnosis:**
```bash
# Check queue depth
curl http://localhost:3000/api/metrics | jq '.pendingEvents'

# Check database query performance
mysql -u sovereign -p sovereign_system -e "SHOW ENGINE INNODB STATUS\G" | grep -A 20 "LATEST DETECTED DEADLOCK"

# Check index usage
mysql -u sovereign -p sovereign_system -e "SELECT * FROM sys.statements_with_full_table_scans LIMIT 10;"
```

**Resolution:**
1. Optimize database queries
2. Add missing indexes
3. Increase database connection pool
4. Scale horizontally

### Issue: Federation Sync Failures

**Symptoms:**
- Nodes out of sync
- Reconciliation conflicts
- Failover triggered unexpectedly

**Diagnosis:**
```bash
# Check node sync status
curl http://localhost:3000/api/federation/nodes | jq '.[] | {nodeId, lastSync, status}'

# Check reconciliation conflicts
curl http://localhost:3000/api/federation/reconciliation/conflicts | jq '.'

# Check failover status
curl http://localhost:3000/api/federation/failover/status | jq '.'
```

**Resolution:**
1. Verify network connectivity
2. Check node health
3. Manually trigger reconciliation
4. Review federation logs

## Maintenance Tasks

### Weekly Maintenance

**1. Database Optimization**
```bash
# Analyze tables
mysql -u sovereign -p sovereign_system -e "ANALYZE TABLE events, snapshots, decisions;"

# Optimize tables
mysql -u sovereign -p sovereign_system -e "OPTIMIZE TABLE events, snapshots, decisions;"
```

**2. Log Rotation**
```bash
# Check log sizes
du -sh /var/log/aegentix/*

# Archive old logs
tar -czf /backup/aegentix-logs-$(date +%Y%m%d).tar.gz /var/log/aegentix/
rm /var/log/aegentix/*.log.1
```

**3. Backup Verification**
```bash
# Verify backup integrity
mysql -u sovereign -p sovereign_system < /backup/latest-backup.sql -e "SELECT COUNT(*) FROM events;"

# Test restore procedure
# (in test environment)
```

### Monthly Maintenance

**1. Performance Review**
```bash
# Generate performance report
curl http://localhost:3000/api/reports/performance?period=month | jq '.'

# Identify slow queries
mysql -u sovereign -p sovereign_system -e "SELECT * FROM sys.statements_with_runtimes_in_95th_percentile LIMIT 10;"
```

**2. Capacity Planning**
```bash
# Check storage usage
du -sh /var/lib/mysql/sovereign_system

# Estimate growth
curl http://localhost:3000/api/reports/capacity | jq '.'

# Plan scaling if needed
```

**3. Security Audit**
```bash
# Check access logs
grep "DENIED" /var/log/aegentix/audit.log | wc -l

# Review authority decisions
curl http://localhost:3000/api/reports/authority-audit | jq '.'

# Check for unauthorized access attempts
grep "UNAUTHORIZED" /var/log/aegentix/errors.log
```

## Incident Response

### Incident: Data Loss

**Immediate Actions:**
1. Stop all write operations
   ```bash
   systemctl stop aegentix
   ```

2. Assess damage
   ```bash
   # Check latest backup
   ls -lh /backup/
   
   # Check event log integrity
   mysql -u sovereign -p sovereign_system -e "SELECT COUNT(*) FROM events;"
   ```

3. Initiate recovery
   ```bash
   # Restore from backup
   mysql -u sovereign -p sovereign_system < /backup/latest-backup.sql
   
   # Verify restoration
   mysql -u sovereign -p sovereign_system -e "SELECT COUNT(*) FROM events;"
   ```

4. Restart service
   ```bash
   systemctl start aegentix
   ```

5. Verify integrity
   ```bash
   curl http://localhost:3000/health
   ```

### Incident: Security Breach

**Immediate Actions:**
1. Isolate affected systems
   ```bash
   # Disable network access
   iptables -A INPUT -j DROP
   ```

2. Collect evidence
   ```bash
   # Capture logs
   tar -czf /evidence/logs-$(date +%Y%m%d-%H%M%S).tar.gz /var/log/aegentix/
   
   # Capture database state
   mysqldump -u sovereign -p sovereign_system > /evidence/db-snapshot.sql
   ```

3. Notify security team
   ```bash
   # Send alert
   echo "SECURITY INCIDENT: Potential breach detected" | mail -s "URGENT" security@sovereign.ae
   ```

4. Rotate credentials
   ```bash
   # Update database password
   mysql -u root -p -e "ALTER USER 'sovereign'@'localhost' IDENTIFIED BY 'new-password';"
   
   # Update API keys
   # (manual process)
   ```

### Incident: Service Outage

**Immediate Actions:**
1. Check service status
   ```bash
   systemctl status aegentix
   journalctl -u aegentix -n 50
   ```

2. Attempt restart
   ```bash
   systemctl restart aegentix
   sleep 5
   curl http://localhost:3000/health
   ```

3. If restart fails, check logs
   ```bash
   tail -100 /var/log/aegentix/errors.log
   ```

4. Failover to secondary
   ```bash
   # If using federation, trigger failover
   curl -X POST http://localhost:3000/api/federation/failover/trigger
   ```

5. Investigate root cause
   ```bash
   # Check disk space
   df -h
   
   # Check memory
   free -h
   
   # Check database
   mysql -u sovereign -p sovereign_system -e "SELECT COUNT(*) FROM events;"
   ```

## Performance Tuning

### Database Tuning

```bash
# Check slow query log
mysql -u sovereign -p sovereign_system -e "SET GLOBAL slow_query_log = 'ON'; SET GLOBAL long_query_time = 1;"

# Review slow queries
tail -100 /var/log/mysql/slow.log | mysql-slow-log-parser

# Add indexes for slow queries
mysql -u sovereign -p sovereign_system -e "CREATE INDEX idx_events_authority_timestamp ON events(authority_level, timestamp);"
```

### Memory Tuning

```bash
# Increase Node.js heap size
export NODE_OPTIONS="--max-old-space-size=4096"

# Increase MySQL buffer pool
mysql -u root -p -e "SET GLOBAL innodb_buffer_pool_size = 8589934592;"
```

### Connection Pooling

```bash
# Increase database connection pool
curl -X POST http://localhost:3000/api/config \
  -H "Content-Type: application/json" \
  -d '{"connectionPoolSize": 50}'
```

## Escalation Procedures

### Level 1: Operator

- Monitor system health
- Check logs and metrics
- Restart services
- Notify Level 2 if issue persists

### Level 2: Senior Operator

- Perform advanced diagnostics
- Optimize database queries
- Scale resources
- Notify Level 3 if issue persists

### Level 3: Engineering

- Code-level debugging
- Architecture review
- Deployment decisions
- Root cause analysis

### Escalation Contact

```
Level 1: ops@sovereign.ae
Level 2: senior-ops@sovereign.ae
Level 3: engineering@sovereign.ae
Emergency: +1-555-AEGENTIX (1-555-234-3684)
```

## Documentation References

- [Consolidated Architecture](./CONSOLIDATED_ARCHITECTURE.md)
- [Event Ontology](./EVENT_ONTOLOGY.md)
- [Federation Deployment Guide](./FEDERATION_DEPLOYMENT.md)
- [API Documentation](./API_REFERENCE.md)
