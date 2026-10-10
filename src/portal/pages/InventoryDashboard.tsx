import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw, Package, MapPin, TrendingUp } from 'lucide-react';

interface InventoryLocation {
  id: string;
  name: string;
  address: string;
  country: string;
}

interface StockLevel {
  locationId: string;
  quantity: number;
  reserved: number;
  available: number;
  lastUpdated: string;
}

interface Product {
  id: string;
  title: string;
  sku: string;
  inventoryLevels: StockLevel[];
}

interface SyncState {
  lastSyncTime: string;
  productsProcessed: number;
  locationsProcessed: number;
  itemsSynced: number;
  errors: string[];
  status: 'idle' | 'syncing' | 'completed' | 'failed';
}

export function InventoryDashboard() {
  const [locations, setLocations] = useState<InventoryLocation[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [syncState, setSyncState] = useState<SyncState>({
    lastSyncTime: new Date().toISOString(),
    productsProcessed: 0,
    locationsProcessed: 0,
    itemsSynced: 0,
    errors: [],
    status: 'idle',
  });
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch inventory data
  useEffect(() => {
    fetchInventoryData();
  }, []);

  const fetchInventoryData = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual tRPC call
      // const data = await trpc.inventory.getInventory.useQuery();
      // setProducts(data.products);
      // setLocations(data.locations);
      // setSyncState(data.syncState);
    } catch (error) {
      console.error('Failed to fetch inventory data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    try {
      setSyncState(prev => ({ ...prev, status: 'syncing' }));
      // TODO: Replace with actual tRPC call
      // const result = await trpc.inventory.sync.useMutation();
      setSyncState(prev => ({
        ...prev,
        status: 'completed',
        lastSyncTime: new Date().toISOString(),
      }));
    } catch (error) {
      console.error('Sync failed:', error);
      setSyncState(prev => ({ ...prev, status: 'failed' }));
    }
  };

  const getTotalInventory = () => {
    return products.reduce((total, product) => {
      return (
        total +
        product.inventoryLevels.reduce((sum, level) => sum + level.quantity, 0)
      );
    }, 0);
  };

  const getTotalAvailable = () => {
    return products.reduce((total, product) => {
      return (
        total +
        product.inventoryLevels.reduce((sum, level) => sum + level.available, 0)
      );
    }, 0);
  };

  const getTotalReserved = () => {
    return products.reduce((total, product) => {
      return (
        total +
        product.inventoryLevels.reduce((sum, level) => sum + level.reserved, 0)
      );
    }, 0);
  };

  const getLocationStats = (locationId: string) => {
    const items = products.flatMap(p =>
      p.inventoryLevels.filter(l => l.locationId === locationId)
    );
    return {
      total: items.reduce((sum, l) => sum + l.quantity, 0),
      available: items.reduce((sum, l) => sum + l.available, 0),
      reserved: items.reduce((sum, l) => sum + l.reserved, 0),
      itemCount: items.length,
    };
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Inventory Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time Shopify inventory management
          </p>
        </div>
        <Button
          onClick={handleSync}
          disabled={syncState.status === 'syncing'}
          className="gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          {syncState.status === 'syncing' ? 'Syncing...' : 'Sync Now'}
        </Button>
      </div>

      {/* Sync Status */}
      {syncState.errors.length > 0 && (
        <Card className="p-4 border-red-500 bg-red-50 dark:bg-red-950">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-red-900 dark:text-red-100">
                Sync Errors
              </h3>
              <ul className="mt-2 space-y-1 text-sm text-red-800 dark:text-red-200">
                {syncState.errors.map((error, i) => (
                  <li key={i}>• {error}</li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Inventory</p>
              <p className="text-2xl font-bold mt-1">{getTotalInventory()}</p>
            </div>
            <Package className="w-8 h-8 text-blue-500 opacity-50" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Available</p>
              <p className="text-2xl font-bold mt-1 text-green-600">
                {getTotalAvailable()}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-500 opacity-50" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Reserved</p>
              <p className="text-2xl font-bold mt-1 text-orange-600">
                {getTotalReserved()}
              </p>
            </div>
            <AlertCircle className="w-8 h-8 text-orange-500 opacity-50" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Locations</p>
              <p className="text-2xl font-bold mt-1">{locations.length}</p>
            </div>
            <MapPin className="w-8 h-8 text-purple-500 opacity-50" />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Locations */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Locations</h2>
          <div className="space-y-2">
            {locations.map(location => {
              const stats = getLocationStats(location.id);
              return (
                <button
                  key={location.id}
                  onClick={() =>
                    setSelectedLocation(
                      selectedLocation === location.id ? null : location.id
                    )
                  }
                  className={`w-full text-left p-3 rounded-lg border transition-colors ${
                    selectedLocation === location.id
                      ? 'bg-blue-50 border-blue-500 dark:bg-blue-950 dark:border-blue-400'
                      : 'border-border hover:bg-muted'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{location.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {location.address}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">{stats.total}</p>
                      <p className="text-xs text-muted-foreground">
                        {stats.available} available
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </Card>

        {/* Products */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Products</h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {products.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No products found
                </p>
              ) : (
                products.map(product => {
                  const levels = selectedLocation
                    ? product.inventoryLevels.filter(
                        l => l.locationId === selectedLocation
                      )
                    : product.inventoryLevels;

                  return (
                    <div key={product.id} className="border rounded-lg p-3">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium text-sm">{product.title}</p>
                          <p className="text-xs text-muted-foreground">
                            SKU: {product.sku}
                          </p>
                        </div>
                      </div>

                      {levels.length > 0 ? (
                        <div className="space-y-1 text-xs">
                          {levels.map(level => (
                            <div
                              key={level.locationId}
                              className="flex justify-between text-muted-foreground"
                            >
                              <span>
                                {locations.find(l => l.id === level.locationId)
                                  ?.name || 'Unknown'}
                              </span>
                              <span>
                                {level.quantity} total ({level.available} avail,{' '}
                                {level.reserved} reserved)
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-muted-foreground italic">
                          No inventory at selected location
                        </p>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Sync Info */}
      <Card className="p-4 bg-muted/50">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Last Sync</p>
            <p className="font-medium">
              {new Date(syncState.lastSyncTime).toLocaleTimeString()}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Products</p>
            <p className="font-medium">{syncState.productsProcessed}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Items Synced</p>
            <p className="font-medium">{syncState.itemsSynced}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Status</p>
            <p className="font-medium capitalize">{syncState.status}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
