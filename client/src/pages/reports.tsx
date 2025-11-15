import { useQuery } from "@tanstack/react-query";
import { BarChart3, Package, TrendingUp, AlertTriangle, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line } from "recharts";
import type { Product, StockMovement } from "@shared/schema";

export default function Reports() {
  const { data: products, isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const { data: movements, isLoading: movementsLoading } = useQuery<StockMovement[]>({
    queryKey: ["/api/movements"],
  });

  const isLoading = productsLoading || movementsLoading;

  const totalValue = products?.reduce((sum, p) => {
    const price = parseFloat(p.price || "0");
    return sum + price * p.quantity;
  }, 0) || 0;

  const categoryStats = products?.reduce((acc, product) => {
    const existing = acc.find((item) => item.category === product.category);
    const price = parseFloat(product.price || "0");
    if (existing) {
      existing.count += 1;
      existing.quantity += product.quantity;
      existing.value += price * product.quantity;
    } else {
      acc.push({
        category: product.category,
        count: 1,
        quantity: product.quantity,
        value: price * product.quantity,
      });
    }
    return acc;
  }, [] as { category: string; count: number; quantity: number; value: number }[]);

  const locationStats = products?.reduce((acc, product) => {
    const existing = acc.find((item) => item.location === product.location);
    if (existing) {
      existing.count += 1;
      existing.quantity += product.quantity;
    } else {
      acc.push({
        location: product.location,
        count: 1,
        quantity: product.quantity,
      });
    }
    return acc;
  }, [] as { location: string; count: number; quantity: number }[]);

  const lowStockItems = products?.filter((p) => p.quantity <= p.minStockLevel) || [];
  const outOfStockItems = products?.filter((p) => p.quantity === 0) || [];

  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    return date.toISOString().split("T")[0];
  });

  const movementsByDay = last30Days.map((date) => {
    const dayMovements = movements?.filter(
      (m) => new Date(m.timestamp).toISOString().split("T")[0] === date
    ) || [];
    const incoming = dayMovements.filter((m) => m.type === "in").reduce((sum, m) => sum + m.quantity, 0);
    const outgoing = dayMovements.filter((m) => m.type === "out").reduce((sum, m) => sum + m.quantity, 0);
    return {
      date: new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      incoming,
      outgoing,
    };
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold" data-testid="text-page-title">Reports & Analytics</h1>
          <p className="text-sm text-muted-foreground">Comprehensive warehouse insights</p>
        </div>
        <Button variant="outline" data-testid="button-export-report">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card data-testid="card-total-inventory-value">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Inventory Value</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-32" />
            ) : (
              <>
                <div className="text-3xl font-bold" data-testid="text-inventory-value">
                  ${totalValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Current stock valuation</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card data-testid="card-total-products-report">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <>
                <div className="text-3xl font-bold" data-testid="text-total-products-report">
                  {products?.length || 0}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Active SKUs</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card data-testid="card-low-stock-report">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <>
                <div className="text-3xl font-bold text-destructive" data-testid="text-low-stock-report">
                  {lowStockItems.length}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Need attention</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card data-testid="card-out-of-stock-report">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <>
                <div className="text-3xl font-bold" data-testid="text-out-of-stock-report">
                  {outOfStockItems.length}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Items unavailable</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card data-testid="card-category-performance">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Category Performance</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[300px]" />
            ) : categoryStats && categoryStats.length > 0 ? (
              <ChartContainer
                config={{}}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryStats}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="category" className="text-xs" />
                    <YAxis className="text-xs" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="count" fill="hsl(var(--chart-1))" name="Products" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="quantity" fill="hsl(var(--chart-2))" name="Units" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            ) : (
              <div className="flex h-[300px] items-center justify-center text-muted-foreground">
                No category data available
              </div>
            )}
          </CardContent>
        </Card>

        <Card data-testid="card-movement-trend">
          <CardHeader>
            <CardTitle className="text-lg font-medium">30-Day Movement Trend</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[300px]" />
            ) : movementsByDay && movementsByDay.length > 0 ? (
              <ChartContainer
                config={{
                  incoming: { label: "Incoming", color: "hsl(var(--chart-1))" },
                  outgoing: { label: "Outgoing", color: "hsl(var(--chart-2))" },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={movementsByDay}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis 
                      dataKey="date" 
                      className="text-xs" 
                      tick={{ fontSize: 10 }}
                      interval="preserveStartEnd"
                    />
                    <YAxis className="text-xs" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line
                      type="monotone"
                      dataKey="incoming"
                      stroke="hsl(var(--chart-1))"
                      strokeWidth={2}
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="outgoing"
                      stroke="hsl(var(--chart-2))"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            ) : (
              <div className="flex h-[300px] items-center justify-center text-muted-foreground">
                No movement data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card data-testid="card-category-breakdown">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Category Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : categoryStats && categoryStats.length > 0 ? (
              <div className="space-y-3">
                {categoryStats.map((stat) => (
                  <div
                    key={stat.category}
                    className="flex items-center justify-between p-3 rounded-md bg-muted/50"
                    data-testid={`category-stat-${stat.category}`}
                  >
                    <div className="flex-1">
                      <p className="font-medium text-sm">{stat.category}</p>
                      <p className="text-xs text-muted-foreground">
                        {stat.count} products • {stat.quantity} units
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        ${stat.value.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </p>
                      <Badge variant="secondary" className="text-xs">{stat.count} SKUs</Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex h-32 items-center justify-center text-muted-foreground">
                No category data available
              </div>
            )}
          </CardContent>
        </Card>

        <Card data-testid="card-location-breakdown">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Location Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : locationStats && locationStats.length > 0 ? (
              <div className="space-y-3">
                {locationStats.map((stat) => (
                  <div
                    key={stat.location}
                    className="flex items-center justify-between p-3 rounded-md bg-muted/50"
                    data-testid={`location-stat-${stat.location}`}
                  >
                    <div className="flex-1">
                      <p className="font-medium text-sm">{stat.location}</p>
                      <p className="text-xs text-muted-foreground">
                        {stat.count} products • {stat.quantity} units
                      </p>
                    </div>
                    <Badge variant="secondary" className="text-xs">{stat.count} items</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex h-32 items-center justify-center text-muted-foreground">
                No location data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
