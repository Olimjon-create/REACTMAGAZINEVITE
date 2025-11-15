import { useQuery } from "@tanstack/react-query";
import { Package, TrendingDown, TrendingUp, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import type { Product, StockMovement } from "@shared/schema";

export default function Dashboard() {
  const { data: products, isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const { data: movements, isLoading: movementsLoading } = useQuery<StockMovement[]>({
    queryKey: ["/api/movements"],
  });

  const totalProducts = products?.length || 0;
  const totalStock = products?.reduce((sum, p) => sum + p.quantity, 0) || 0;
  const lowStockItems = products?.filter((p) => p.quantity <= p.minStockLevel) || [];
  const recentMovements = movements?.slice(0, 10) || [];

  const categoryData = products?.reduce((acc, product) => {
    const existing = acc.find((item) => item.name === product.category);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: product.category, value: 1 });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  const movementData = movements
    ?.slice(0, 7)
    .reverse()
    .map((m) => ({
      date: new Date(m.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      incoming: m.type === "in" ? m.quantity : 0,
      outgoing: m.type === "out" ? m.quantity : 0,
    }));

  const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];

  const isLoading = productsLoading || movementsLoading;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold" data-testid="text-page-title">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Overview of your warehouse inventory</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card data-testid="card-stat-total-products">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <>
                <div className="text-3xl font-bold" data-testid="text-total-products">{totalProducts}</div>
                <p className="text-xs text-muted-foreground mt-1">Active items in inventory</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card data-testid="card-stat-total-stock">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Stock</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <>
                <div className="text-3xl font-bold" data-testid="text-total-stock">{totalStock}</div>
                <p className="text-xs text-muted-foreground mt-1">Units across all products</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card data-testid="card-stat-low-stock">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <>
                <div className="text-3xl font-bold text-destructive" data-testid="text-low-stock-count">{lowStockItems.length}</div>
                <p className="text-xs text-muted-foreground mt-1">Items need restocking</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card data-testid="card-stat-recent-movements">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <>
                <div className="text-3xl font-bold" data-testid="text-recent-movements-count">{movements?.length || 0}</div>
                <p className="text-xs text-muted-foreground mt-1">Stock movements today</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card data-testid="card-category-distribution">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Category Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[300px]" />
            ) : categoryData && categoryData.length > 0 ? (
              <ChartContainer
                config={{}}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            ) : (
              <div className="flex h-[300px] items-center justify-center text-muted-foreground">
                No data available
              </div>
            )}
          </CardContent>
        </Card>

        <Card data-testid="card-stock-movements-chart">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Stock Movement Trend</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[300px]" />
            ) : movementData && movementData.length > 0 ? (
              <ChartContainer
                config={{
                  incoming: { label: "Incoming", color: "hsl(var(--chart-1))" },
                  outgoing: { label: "Outgoing", color: "hsl(var(--chart-2))" },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={movementData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="date" className="text-xs" />
                    <YAxis className="text-xs" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="incoming" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="outgoing" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
                  </BarChart>
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
        <Card data-testid="card-low-stock-items">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Low Stock Items</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : lowStockItems.length > 0 ? (
              <div className="space-y-3">
                {lowStockItems.slice(0, 5).map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-3 rounded-md bg-muted/50"
                    data-testid={`low-stock-item-${product.id}`}
                  >
                    <div className="flex-1">
                      <p className="font-medium text-sm">{product.name}</p>
                      <p className="text-xs text-muted-foreground">SKU: {product.sku}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-sm font-medium text-destructive">{product.quantity} units</p>
                        <p className="text-xs text-muted-foreground">Min: {product.minStockLevel}</p>
                      </div>
                      <Badge variant="destructive" className="text-xs">Low Stock</Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex h-32 items-center justify-center text-muted-foreground">
                All products are well stocked
              </div>
            )}
          </CardContent>
        </Card>

        <Card data-testid="card-recent-movements">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Recent Stock Movements</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : recentMovements.length > 0 ? (
              <div className="space-y-3">
                {recentMovements.slice(0, 5).map((movement) => (
                  <div
                    key={movement.id}
                    className="flex items-center justify-between p-3 rounded-md bg-muted/50"
                    data-testid={`movement-${movement.id}`}
                  >
                    <div className="flex items-center gap-3">
                      {movement.type === "in" ? (
                        <TrendingUp className="h-4 w-4 text-chart-1" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-chart-2" />
                      )}
                      <div>
                        <p className="font-medium text-sm">{movement.productName}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(movement.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {movement.type === "in" ? "+" : "-"}{movement.quantity}
                      </p>
                      <Badge variant={movement.type === "in" ? "default" : "secondary"} className="text-xs">
                        {movement.type === "in" ? "In" : "Out"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex h-32 items-center justify-center text-muted-foreground">
                No recent movements
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
