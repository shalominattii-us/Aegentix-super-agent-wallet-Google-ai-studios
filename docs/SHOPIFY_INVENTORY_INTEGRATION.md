# Shopify Inventory Integration Guide

## Overview

The AEGENTIX system integrates with Shopify to provide real-time, bi-directional inventory synchronization across Portal, VR, Federation, and Ledger subsystems. This integration enables:

- **Real-time Stock Sync**: Automatic synchronization of inventory levels from Shopify
- **Multi-location Management**: Track inventory across multiple warehouses and fulfillment centers
- **Allocation Management**: Reserve inventory for orders with automatic availability tracking
- **VR Visualization**: Spatial representation of inventory in immersive VR environments
- **Federation Consistency**: Distributed inventory ledger with conflict resolution
- **Compliance Tracking**: Immutable audit trail of all inventory changes

## Architecture

### Core Components

#### 1. Shopify Inventory Sync Engine (`shopify-inventory-engine.ts`)

Manages bi-directional synchronization with Shopify:

```typescript
const syncEngine = new ShopifyInventorySyncEngine();

// Register locations
syncEngine.registerLocation({
  id: 'loc-1',
  name: 'Main Warehouse',
  address: '123 Main St',
  country: 'US',
});

// Register products
syncEngine.registerProduct({
  id: 'prod-1',
  title: 'Widget',
  sku: 'WID-001',
  inventoryLevels: [
    {
      locationId: 'loc-1',
      quantity: 100,
      reserved: 0,
      available: 100,
      lastUpdated: new Date().toISOString(),
    },
  ],
});

// Update inventory
await syncEngine.updateInventoryLevel('prod-1', 'loc-1', 95, 5);

// Allocate inventory for orders
const result = await syncEngine.allocateInventory('prod-1', 'loc-1', 10);

// Release allocated inventory
await syncEngine.releaseInventory('prod-1', 'loc-1', 5);

// Perform sync
const state = await syncEngine.performSync();
```

#### 2. Inventory Event Model (`inventory-events.ts`)

Integrates with the canonical event store for immutable tracking:

```typescript
// Create stock update event
const event = createInventoryStockUpdatedPayload(
  'prod-1',
  'loc-1',
  100,
  95,
  5,
  'sale'
);

// Create sync initiated event
const syncEvent = createInventorySyncInitiatedPayload(
  'sync-1',
  'bidirectional',
  'all',
  'user-123'
);
```

#### 3. Portal Inventory Dashboard (`InventoryDashboard.tsx`)

Real-time monitoring interface for inventory management:

- **Summary Cards**: Total inventory, available, reserved, locations
- **Location View**: Filter inventory by warehouse/fulfillment center
- **Product List**: View stock levels across locations
- **Sync Status**: Monitor sync operations and errors
- **Real-time Updates**: Live stock level changes

#### 4. VR Spatial Visualization (`vr-inventory-visualization.ts`)

Immersive warehouse visualization in VR:

```typescript
const vrViz = new VRInventoryVisualization();

// Create warehouse
const warehouse = vrViz.createWarehouse(
  'wh-1',
  'Main Warehouse',
  { x: 100, y: 50, z: 100 }
);

// Add zones
vrViz.addZone('wh-1', {
  id: 'zone-1',
  name: 'Storage',
  position: { x: 0, y: 0, z: 0 },
  dimensions: { x: 50, y: 25, z: 50 },
  type: 'storage',
  capacity: 1000,
  currentLoad: 500,
});

// Add inventory items
vrViz.addInventoryItem('wh-1', {
  id: 'item-1',
  productId: 'prod-1',
  sku: 'WID-001',
  title: 'Widget',
  quantity: 100,
  reserved: 20,
  position: { x: 10, y: 5, z: 10 },
  scale: { x: 1, y: 1, z: 1 },
  color: '#00ff00',
  locationId: 'loc-1',
});

// Generate picking route for order fulfillment
const route = vrViz.generatePickingRoute('wh-1', ['item-1', 'item-2']);
```

#### 5. Federation Inventory Sync (`federation-inventory-sync.ts`)

Distributed inventory consistency across federated nodes:

```typescript
const fedSync = new FederationInventorySyncManager();

// Register federation nodes
fedSync.registerNode({
  id: 'node-1',
  name: 'Node 1',
  address: 'localhost:3001',
  authority: 'sovereign',
  status: 'healthy',
  lastHeartbeat: new Date().toISOString(),
});

// Record inventory snapshots
fedSync.recordSnapshot({
  nodeId: 'node-1',
  timestamp: new Date().toISOString(),
  products: new Map([['prod-1', 100]]),
  hash: 'hash-123',
});

// Sync inventory across nodes
const result = await fedSync.syncInventory('node-1', ['node-2']);

// Verify consistency
const consistency = fedSync.verifyConsistency();
```

## Webhook Integration

The sync engine automatically handles Shopify webhooks:

- `inventory_levels/update`: Stock level changes
- `products/update`: Product information updates
- `locations/create`: New warehouse/location added
- `locations/update`: Location information changed

### Setting up Webhooks

1. In Shopify Admin, navigate to Settings → Notifications → Webhooks
2. Create new webhooks for the topics above
3. Set the endpoint URL to: `https://your-domain.com/api/webhooks/shopify`
4. Verify webhook signature using `SHOPIFY_WEBHOOK_SECRET`

## Event Taxonomy

All inventory events are recorded in the canonical event store with:

- **Event Type**: `inventory:stock_updated`, `inventory:stock_allocated`, etc.
- **Authority Level**: `sovereign`, `commander`, `operator`, `cadet`
- **Causality Chain**: Linked events for traceability
- **Timestamp**: UTC-based for consistency
- **Payload**: Event-specific data

## Bi-directional Sync

### Pull (Shopify → AEGENTIX)

1. Sync engine receives webhook from Shopify
2. Updates local inventory cache
3. Emits inventory event to canonical store
4. VR visualization updates in real-time
5. Federation nodes receive sync notification

### Push (AEGENTIX → Shopify)

1. Allocation/release operations in Portal
2. Inventory event created with causality chain
3. Sync engine batches updates
4. Periodic sync sends updates to Shopify API
5. Shopify confirms receipt and updates stock

## Conflict Resolution

When inventory levels differ between nodes:

1. **Authority-based**: Higher authority level wins
   - Sovereign > Commander > Operator > Cadet

2. **Last-write-wins**: For equal authority, most recent timestamp wins

3. **Merge**: Conservative approach uses maximum value

## Performance Considerations

- **Sync Interval**: Default 60 seconds (configurable)
- **Batch Size**: Up to 1000 items per sync operation
- **Cache Strategy**: In-memory cache with snapshot export/import
- **Event Storage**: Immutable append-only ledger

## Monitoring & Alerts

### Sync Status Metrics

```typescript
const status = syncEngine.getSyncState();
// {
//   lastSyncTime: "2026-07-03T23:00:00Z",
//   productsProcessed: 150,
//   locationsProcessed: 5,
//   itemsSynced: 750,
//   errors: [],
//   status: "completed"
// }
```

### Federation Consistency

```typescript
const consistency = fedSync.verifyConsistency();
// {
//   consistent: true,
//   conflicts: 0,
//   nodes: 3,
//   details: "All nodes have consistent inventory"
// }
```

### VR Warehouse Utilization

```typescript
const overview = vrViz.getWarehouseOverview('wh-1');
// {
//   totalItems: 150,
//   totalQuantity: 5000,
//   lowStockItems: 5,
//   utilizationPercentage: 78.5
// }
```

## API Endpoints

### Portal API

- `GET /api/inventory/dashboard` - Get inventory summary
- `GET /api/inventory/products` - List all products
- `GET /api/inventory/locations` - List all locations
- `POST /api/inventory/allocate` - Allocate inventory
- `POST /api/inventory/release` - Release inventory
- `POST /api/inventory/sync` - Trigger manual sync

### VR API

- `GET /api/vr/warehouse/:id` - Get warehouse data
- `POST /api/vr/warehouse` - Create warehouse
- `POST /api/vr/picking-route` - Generate picking route
- `GET /api/vr/heatmap/:warehouseId` - Get interaction heatmap

### Federation API

- `GET /api/federation/nodes` - List federation nodes
- `POST /api/federation/sync` - Trigger federation sync
- `GET /api/federation/consistency` - Check consistency
- `GET /api/federation/conflicts` - List conflicts

## Troubleshooting

### Sync Failures

1. Check webhook delivery in Shopify Admin
2. Verify API credentials and permissions
3. Review error logs in sync state
4. Check network connectivity to Shopify

### Inventory Discrepancies

1. Run consistency check: `fedSync.verifyConsistency()`
2. Review conflict history: `fedSync.getConflicts()`
3. Trigger manual sync: `syncEngine.performSync()`
4. Check federation node status: `fedSync.getSyncStatus()`

### VR Visualization Issues

1. Verify warehouse data: `vrViz.getWarehouse('wh-1')`
2. Check item positions and scales
3. Review zone configurations
4. Test picking route generation

## Best Practices

1. **Regular Syncs**: Enable periodic sync (60-300 seconds)
2. **Monitoring**: Set up alerts for sync failures
3. **Backups**: Export snapshots regularly
4. **Authority**: Use appropriate authority levels for operations
5. **Causality**: Always include causality chain in events
6. **Testing**: Run integration tests before deployment

## Security Considerations

- **Webhook Signature**: Always verify Shopify webhook signatures
- **API Keys**: Store credentials in environment variables
- **Authority Levels**: Enforce role-based access control
- **Audit Trail**: Maintain immutable event log
- **Rate Limiting**: Implement rate limiting for API endpoints

## Support

For issues or questions:

1. Check logs in `.manus-logs/`
2. Review integration tests in `server/inventory-integration.test.ts`
3. Consult Shopify API documentation
4. Contact support team

## References

- [Shopify Admin API Documentation](https://shopify.dev/api/admin)
- [Shopify Webhooks](https://shopify.dev/api/admin-rest/2024-01/resources/webhook)
- [AEGENTIX Architecture](./CONSOLIDATED_ARCHITECTURE.md)
- [Event Ontology](./EVENT_ONTOLOGY.md)
