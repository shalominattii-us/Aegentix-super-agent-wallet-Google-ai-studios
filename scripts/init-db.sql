-- ============================================================================
-- SOVEREIGN SYSTEM - Database Initialization
-- ============================================================================

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "btree_gin";

-- ============================================================================
-- AGENTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS agents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    tier INTEGER NOT NULL CHECK (tier IN (1, 2, 3)),
    status VARCHAR(50) NOT NULL DEFAULT 'inactive',
    agent_type VARCHAR(100) NOT NULL,
    description TEXT,
    configuration JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_heartbeat TIMESTAMP,
    CONSTRAINT agent_name_unique UNIQUE (name)
);

CREATE INDEX idx_agents_tier ON agents(tier);
CREATE INDEX idx_agents_status ON agents(status);
CREATE INDEX idx_agents_created_at ON agents(created_at DESC);

-- ============================================================================
-- AGENT TASKS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS agent_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
    task_name VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    priority VARCHAR(20) NOT NULL DEFAULT 'normal',
    payload JSONB,
    result JSONB,
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    CONSTRAINT valid_status CHECK (status IN ('pending', 'running', 'completed', 'failed', 'cancelled'))
);

CREATE INDEX idx_agent_tasks_agent_id ON agent_tasks(agent_id);
CREATE INDEX idx_agent_tasks_status ON agent_tasks(status);
CREATE INDEX idx_agent_tasks_created_at ON agent_tasks(created_at DESC);

-- ============================================================================
-- INTER-AGENT COMMUNICATION LOG TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS communication_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
    target_agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
    message_type VARCHAR(100) NOT NULL,
    priority VARCHAR(20) NOT NULL DEFAULT 'normal',
    status VARCHAR(50) NOT NULL DEFAULT 'sent',
    payload JSONB,
    latency_ms INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_priority CHECK (priority IN ('low', 'normal', 'high', 'critical')),
    CONSTRAINT valid_status CHECK (status IN ('sent', 'received', 'error', 'pending'))
);

CREATE INDEX idx_comm_logs_source ON communication_logs(source_agent_id);
CREATE INDEX idx_comm_logs_target ON communication_logs(target_agent_id);
CREATE INDEX idx_comm_logs_created_at ON communication_logs(created_at DESC);
CREATE INDEX idx_comm_logs_priority ON communication_logs(priority);

-- ============================================================================
-- GOVERNANCE POLICIES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS governance_policies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    policy_name VARCHAR(255) NOT NULL,
    description TEXT,
    policy_type VARCHAR(100) NOT NULL,
    rules JSONB NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT policy_name_unique UNIQUE (policy_name)
);

CREATE INDEX idx_policies_status ON governance_policies(status);
CREATE INDEX idx_policies_type ON governance_policies(policy_type);

-- ============================================================================
-- SYSTEM METRICS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS system_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    metric_name VARCHAR(255) NOT NULL,
    metric_value FLOAT NOT NULL,
    metric_unit VARCHAR(50),
    agent_id UUID REFERENCES agents(id) ON DELETE SET NULL,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_metric_value CHECK (metric_value >= 0)
);

CREATE INDEX idx_metrics_name ON system_metrics(metric_name);
CREATE INDEX idx_metrics_agent_id ON system_metrics(agent_id);
CREATE INDEX idx_metrics_recorded_at ON system_metrics(recorded_at DESC);

-- ============================================================================
-- DEPLOYMENT RECORDS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS deployments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    deployment_name VARCHAR(255) NOT NULL,
    environment VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    version VARCHAR(50) NOT NULL,
    manifest JSONB,
    deployed_by VARCHAR(255),
    deployed_at TIMESTAMP,
    completed_at TIMESTAMP,
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_environment CHECK (environment IN ('development', 'staging', 'production'))
);

CREATE INDEX idx_deployments_environment ON deployments(environment);
CREATE INDEX idx_deployments_status ON deployments(status);
CREATE INDEX idx_deployments_version ON deployments(version);

-- ============================================================================
-- AUDIT LOG TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    action VARCHAR(255) NOT NULL,
    actor VARCHAR(255),
    resource_type VARCHAR(100),
    resource_id UUID,
    changes JSONB,
    ip_address INET,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_logs_resource ON audit_logs(resource_type, resource_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);
CREATE INDEX idx_audit_logs_actor ON audit_logs(actor);

-- ============================================================================
-- VIEWS
-- ============================================================================

-- Active agents summary
CREATE OR REPLACE VIEW active_agents_summary AS
SELECT 
    tier,
    COUNT(*) as agent_count,
    COUNT(CASE WHEN status = 'active' THEN 1 END) as active_count,
    COUNT(CASE WHEN status = 'inactive' THEN 1 END) as inactive_count,
    MAX(last_heartbeat) as last_heartbeat
FROM agents
GROUP BY tier;

-- Recent communication summary
CREATE OR REPLACE VIEW recent_communication_summary AS
SELECT 
    DATE_TRUNC('minute', created_at) as minute,
    COUNT(*) as message_count,
    COUNT(CASE WHEN status = 'error' THEN 1 END) as error_count,
    AVG(latency_ms) as avg_latency_ms
FROM communication_logs
WHERE created_at > NOW() - INTERVAL '1 hour'
GROUP BY DATE_TRUNC('minute', created_at)
ORDER BY minute DESC;

-- ============================================================================
-- PERMISSIONS (Optional - for multi-user scenarios)
-- ============================================================================
-- GRANT SELECT ON agents TO app_user;
-- GRANT SELECT, INSERT, UPDATE ON agent_tasks TO app_user;
-- GRANT SELECT ON communication_logs TO app_user;
-- GRANT SELECT ON governance_policies TO app_user;

-- ============================================================================
-- INITIAL DATA (Optional)
-- ============================================================================

-- Insert sample Tier 1 agents
INSERT INTO agents (name, tier, status, agent_type, description) VALUES
    ('Data Collection Agent', 1, 'active', 'data_collector', 'Collects system and external data'),
    ('Notification Agent', 1, 'active', 'notifier', 'Sends notifications to stakeholders'),
    ('Monitoring Agent', 1, 'active', 'monitor', 'Monitors system health and performance')
ON CONFLICT (name) DO NOTHING;

-- Insert sample Tier 2 agents
INSERT INTO agents (name, tier, status, agent_type, description) VALUES
    ('Workflow Orchestrator', 2, 'active', 'orchestrator', 'Coordinates multi-agent workflows'),
    ('Anomaly Detector', 2, 'active', 'detector', 'Detects anomalies in system behavior')
ON CONFLICT (name) DO NOTHING;

-- Insert sample Tier 3 agents
INSERT INTO agents (name, tier, status, agent_type, description) VALUES
    ('Strategic Planner', 3, 'active', 'planner', 'Plans system-wide strategies'),
    ('Governance Agent', 3, 'active', 'governor', 'Enforces governance policies')
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- DONE
-- ============================================================================
COMMIT;
