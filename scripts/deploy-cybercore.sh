#!/bin/bash

# ============================================================================
# AEGENTIX CyberCore Deployment Automation Script
# ============================================================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DOCKER_COMPOSE_FILE="${PROJECT_ROOT}/docker-compose.cybercore.yml"
ENV_FILE="${PROJECT_ROOT}/.env.cybercore"

# ============================================================================
# UTILITY FUNCTIONS
# ============================================================================

log_info() {
  echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
  echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
  echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
  echo -e "${RED}[ERROR]${NC} $1"
}

# ============================================================================
# ENVIRONMENT SETUP
# ============================================================================

setup_environment() {
  log_info "Setting up environment..."

  if [ ! -f "$ENV_FILE" ]; then
    log_warning "Environment file not found: $ENV_FILE"
    log_info "Creating .env.cybercore with default values..."

    cat > "$ENV_FILE" << EOF
# AEGENTIX CyberCore Environment Configuration

# Hedera Configuration
HEDERA_NETWORK=testnet
HEDERA_ACCOUNT_ID=0.0.123456
HEDERA_PRIVATE_KEY=your_private_key_here

# Database Configuration
DB_PASSWORD=cybercore123
DB_USER=cybercore
DB_NAME=cybercore

# Grafana Configuration
GRAFANA_PASSWORD=admin

# Redis Configuration
REDIS_PASSWORD=redis123

# API Gateway Configuration
API_GATEWAY_PORT=8080
API_GATEWAY_HOST=0.0.0.0

# Logging Configuration
LOG_LEVEL=info
EOF

    log_warning "Please update $ENV_FILE with your actual credentials"
  fi

  # Load environment variables
  export $(cat "$ENV_FILE" | grep -v '^#' | xargs)
}

# ============================================================================
# DOCKER OPERATIONS
# ============================================================================

build_images() {
  log_info "Building Docker images..."

  docker-compose -f "$DOCKER_COMPOSE_FILE" build --no-cache

  log_success "Docker images built successfully"
}

start_services() {
  log_info "Starting CyberCore services..."

  docker-compose -f "$DOCKER_COMPOSE_FILE" up -d

  log_success "CyberCore services started"
}

stop_services() {
  log_info "Stopping CyberCore services..."

  docker-compose -f "$DOCKER_COMPOSE_FILE" down

  log_success "CyberCore services stopped"
}

restart_services() {
  log_info "Restarting CyberCore services..."

  docker-compose -f "$DOCKER_COMPOSE_FILE" restart

  log_success "CyberCore services restarted"
}

# ============================================================================
# HEALTH CHECKS
# ============================================================================

check_health() {
  log_info "Checking service health..."

  local services=(
    "cybercore-control-plane:3001"
    "cybercore-hedera:3002"
    "cybercore-skill-registry:3003"
    "cybercore-wallets:3004"
    "cybercore-redis:6379"
    "cybercore-postgres:5432"
    "cybercore-prometheus:9090"
    "cybercore-grafana:3000"
    "cybercore-gateway:8080"
  )

  local healthy=0
  local total=${#services[@]}

  for service in "${services[@]}"; do
    local name="${service%%:*}"
    local port="${service##*:}"

    if docker ps --format '{{.Names}}' | grep -q "^${name}$"; then
      log_success "✓ $name is running"
      ((healthy++))
    else
      log_error "✗ $name is not running"
    fi
  done

  log_info "Health check: $healthy/$total services running"

  if [ $healthy -eq $total ]; then
    log_success "All services are healthy!"
    return 0
  else
    log_warning "Some services are not running"
    return 1
  fi
}

# ============================================================================
# MONITORING & LOGS
# ============================================================================

view_logs() {
  local service=$1

  if [ -z "$service" ]; then
    log_info "Viewing logs for all services..."
    docker-compose -f "$DOCKER_COMPOSE_FILE" logs -f
  else
    log_info "Viewing logs for $service..."
    docker-compose -f "$DOCKER_COMPOSE_FILE" logs -f "$service"
  fi
}

show_status() {
  log_info "CyberCore Service Status:"
  echo ""
  docker-compose -f "$DOCKER_COMPOSE_FILE" ps
  echo ""
}

# ============================================================================
# DATABASE OPERATIONS
# ============================================================================

init_database() {
  log_info "Initializing database..."

  docker-compose -f "$DOCKER_COMPOSE_FILE" exec -T postgres psql -U cybercore -d cybercore << EOF
-- Create tables for CyberCore
CREATE TABLE IF NOT EXISTS skills (
  id SERIAL PRIMARY KEY,
  skill_id VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  version VARCHAR(50),
  status VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS wallets (
  id SERIAL PRIMARY KEY,
  wallet_id VARCHAR(255) UNIQUE NOT NULL,
  version VARCHAR(10),
  status VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS executions (
  id SERIAL PRIMARY KEY,
  execution_id VARCHAR(255) UNIQUE NOT NULL,
  skill_id VARCHAR(255),
  wallet_id VARCHAR(255),
  status VARCHAR(50),
  result JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_skills_status ON skills(status);
CREATE INDEX idx_wallets_version ON wallets(version);
CREATE INDEX idx_executions_skill_id ON executions(skill_id);
EOF

  log_success "Database initialized"
}

# ============================================================================
# DEPLOYMENT WORKFLOW
# ============================================================================

deploy() {
  log_info "Starting CyberCore deployment..."

  setup_environment
  build_images
  start_services

  # Wait for services to be ready
  log_info "Waiting for services to be ready..."
  sleep 10

  check_health
  init_database

  log_success "CyberCore deployment complete!"
  log_info "Access points:"
  echo "  - API Gateway: http://localhost:8080"
  echo "  - Control Plane: http://localhost:3001"
  echo "  - Hedera Runtime: http://localhost:3002"
  echo "  - Skill Registry: http://localhost:3003"
  echo "  - Wallets: http://localhost:3004"
  echo "  - Prometheus: http://localhost:9090"
  echo "  - Grafana: http://localhost:3050"
  echo "  - PostgreSQL: localhost:5432"
  echo "  - Redis: localhost:6379"
}

# ============================================================================
# CLEANUP
# ============================================================================

cleanup() {
  log_info "Cleaning up CyberCore deployment..."

  docker-compose -f "$DOCKER_COMPOSE_FILE" down -v

  log_success "Cleanup complete"
}

# ============================================================================
# MAIN
# ============================================================================

main() {
  local command=${1:-help}

  case $command in
    deploy)
      deploy
      ;;
    start)
      setup_environment
      start_services
      check_health
      ;;
    stop)
      stop_services
      ;;
    restart)
      restart_services
      check_health
      ;;
    status)
      show_status
      check_health
      ;;
    logs)
      view_logs "$2"
      ;;
    health)
      check_health
      ;;
    init-db)
      init_database
      ;;
    cleanup)
      cleanup
      ;;
    *)
      echo "AEGENTIX CyberCore Deployment Script"
      echo ""
      echo "Usage: $0 <command> [options]"
      echo ""
      echo "Commands:"
      echo "  deploy          Deploy CyberCore stack"
      echo "  start           Start services"
      echo "  stop            Stop services"
      echo "  restart         Restart services"
      echo "  status          Show service status"
      echo "  logs [service]  View service logs"
      echo "  health          Check service health"
      echo "  init-db         Initialize database"
      echo "  cleanup         Remove all containers and volumes"
      echo "  help            Show this help message"
      echo ""
      ;;
  esac
}

main "$@"
