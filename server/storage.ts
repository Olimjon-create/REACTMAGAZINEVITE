import {
  type Product,
  type InsertProduct,
  type StockMovement,
  type InsertStockMovement,
  type Category,
  type InsertCategory,
  type Location,
  type InsertLocation,
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: string): Promise<boolean>;

  getStockMovements(): Promise<StockMovement[]>;
  createStockMovement(movement: InsertStockMovement): Promise<StockMovement>;

  getCategories(): Promise<Category[]>;
  getCategory(id: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: string, category: Partial<InsertCategory>): Promise<Category | undefined>;
  deleteCategory(id: string): Promise<boolean>;

  getLocations(): Promise<Location[]>;
  getLocation(id: string): Promise<Location | undefined>;
  createLocation(location: InsertLocation): Promise<Location>;
  updateLocation(id: string, location: Partial<InsertLocation>): Promise<Location | undefined>;
  deleteLocation(id: string): Promise<boolean>;

  getLowStockAlerts(): Promise<Product[]>;
  getReportingData(): Promise<{
    totalValue: number;
    categoryStats: Array<{ category: string; count: number; quantity: number; value: number }>;
    locationStats: Array<{ location: string; count: number; quantity: number }>;
    lowStockCount: number;
    outOfStockCount: number;
  }>;
}

export class MemStorage implements IStorage {
  private products: Map<string, Product>;
  private stockMovements: Map<string, StockMovement>;
  private categories: Map<string, Category>;
  private locations: Map<string, Location>;

  constructor() {
    this.products = new Map();
    this.stockMovements = new Map();
    this.categories = new Map();
    this.locations = new Map();
    this.seedData();
  }

  private seedData() {
    const sampleCategories = [
      { id: randomUUID(), name: "Electronics", description: "Electronic devices and components" },
      { id: randomUUID(), name: "Tools", description: "Hand and power tools" },
      { id: randomUUID(), name: "Hardware", description: "Nuts, bolts, and fasteners" },
      { id: randomUUID(), name: "Safety Equipment", description: "PPE and safety gear" },
    ];

    sampleCategories.forEach((cat) => this.categories.set(cat.id, cat));

    const sampleLocations = [
      { id: randomUUID(), zone: "A", shelf: "1", bin: "A" },
      { id: randomUUID(), zone: "A", shelf: "1", bin: "B" },
      { id: randomUUID(), zone: "A", shelf: "2", bin: "A" },
      { id: randomUUID(), zone: "B", shelf: "1", bin: null },
      { id: randomUUID(), zone: "B", shelf: "2", bin: "A" },
      { id: randomUUID(), zone: "C", shelf: "1", bin: null },
    ];

    sampleLocations.forEach((loc) => this.locations.set(loc.id, loc));

    const sampleProducts: Product[] = [
      {
        id: randomUUID(),
        name: "Wireless Mouse",
        sku: "ELC-001",
        description: "Ergonomic wireless mouse with USB receiver",
        quantity: 45,
        minStockLevel: 20,
        category: "Electronics",
        location: "A-1-A",
        price: "29.99",
      },
      {
        id: randomUUID(),
        name: "USB-C Cable",
        sku: "ELC-002",
        description: "2m USB-C to USB-A cable",
        quantity: 150,
        minStockLevel: 50,
        category: "Electronics",
        location: "A-1-B",
        price: "12.99",
      },
      {
        id: randomUUID(),
        name: "Power Drill",
        sku: "TLS-001",
        description: "18V cordless power drill with battery",
        quantity: 8,
        minStockLevel: 10,
        category: "Tools",
        location: "B-1",
        price: "89.99",
      },
      {
        id: randomUUID(),
        name: "Screwdriver Set",
        sku: "TLS-002",
        description: "12-piece precision screwdriver set",
        quantity: 25,
        minStockLevel: 15,
        category: "Tools",
        location: "B-2-A",
        price: "24.99",
      },
      {
        id: randomUUID(),
        name: "M6 Bolts (Box of 100)",
        sku: "HRD-001",
        description: "Stainless steel M6 bolts",
        quantity: 5,
        minStockLevel: 10,
        category: "Hardware",
        location: "A-2-A",
        price: "15.99",
      },
      {
        id: randomUUID(),
        name: "Safety Goggles",
        sku: "SFT-001",
        description: "Anti-fog safety goggles",
        quantity: 0,
        minStockLevel: 20,
        category: "Safety Equipment",
        location: "C-1",
        price: "8.99",
      },
      {
        id: randomUUID(),
        name: "Work Gloves",
        sku: "SFT-002",
        description: "Cut-resistant work gloves (Size L)",
        quantity: 35,
        minStockLevel: 25,
        category: "Safety Equipment",
        location: "C-1",
        price: "14.99",
      },
    ];

    sampleProducts.forEach((product) => this.products.set(product.id, product));

    const sampleMovements: StockMovement[] = [
      {
        id: randomUUID(),
        productId: sampleProducts[0].id,
        productName: sampleProducts[0].name,
        productSku: sampleProducts[0].sku,
        type: "in",
        quantity: 50,
        notes: "Initial stock",
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
      {
        id: randomUUID(),
        productId: sampleProducts[0].id,
        productName: sampleProducts[0].name,
        productSku: sampleProducts[0].sku,
        type: "out",
        quantity: 5,
        notes: "Customer order #1234",
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        id: randomUUID(),
        productId: sampleProducts[1].id,
        productName: sampleProducts[1].name,
        productSku: sampleProducts[1].sku,
        type: "in",
        quantity: 200,
        notes: "Restocking",
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
      {
        id: randomUUID(),
        productId: sampleProducts[1].id,
        productName: sampleProducts[1].name,
        productSku: sampleProducts[1].sku,
        type: "out",
        quantity: 50,
        notes: "Bulk order",
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
    ];

    sampleMovements.forEach((movement) => this.stockMovements.set(movement.id, movement));
  }

  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProduct(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = randomUUID();
    const product: Product = { ...insertProduct, id };
    this.products.set(id, product);
    return product;
  }

  async updateProduct(id: string, updates: Partial<InsertProduct>): Promise<Product | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;
    const updatedProduct = { ...product, ...updates };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }

  async deleteProduct(id: string): Promise<boolean> {
    return this.products.delete(id);
  }

  async getStockMovements(): Promise<StockMovement[]> {
    return Array.from(this.stockMovements.values()).sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  async createStockMovement(insertMovement: InsertStockMovement): Promise<StockMovement> {
    const product = this.products.get(insertMovement.productId);
    if (!product) {
      throw new Error("Product not found");
    }

    if (insertMovement.type === "out" && product.quantity < insertMovement.quantity) {
      throw new Error("Insufficient stock for outgoing movement");
    }

    const id = randomUUID();
    const movement: StockMovement = {
      id,
      productId: insertMovement.productId,
      productName: product.name,
      productSku: product.sku,
      type: insertMovement.type,
      quantity: insertMovement.quantity,
      notes: insertMovement.notes || null,
      timestamp: new Date(),
    };
    this.stockMovements.set(id, movement);

    if (insertMovement.type === "in") {
      product.quantity += insertMovement.quantity;
    } else {
      product.quantity -= insertMovement.quantity;
    }
    this.products.set(product.id, product);

    return movement;
  }

  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategory(id: string): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = randomUUID();
    const category: Category = { ...insertCategory, id };
    this.categories.set(id, category);
    return category;
  }

  async updateCategory(id: string, updates: Partial<InsertCategory>): Promise<Category | undefined> {
    const category = this.categories.get(id);
    if (!category) return undefined;
    const updatedCategory = { ...category, ...updates };
    this.categories.set(id, updatedCategory);
    return updatedCategory;
  }

  async deleteCategory(id: string): Promise<boolean> {
    return this.categories.delete(id);
  }

  async getLocations(): Promise<Location[]> {
    return Array.from(this.locations.values());
  }

  async getLocation(id: string): Promise<Location | undefined> {
    return this.locations.get(id);
  }

  async createLocation(insertLocation: InsertLocation): Promise<Location> {
    const id = randomUUID();
    const location: Location = { ...insertLocation, id };
    this.locations.set(id, location);
    return location;
  }

  async updateLocation(id: string, updates: Partial<InsertLocation>): Promise<Location | undefined> {
    const location = this.locations.get(id);
    if (!location) return undefined;
    const updatedLocation = { ...location, ...updates };
    this.locations.set(id, updatedLocation);
    return updatedLocation;
  }

  async deleteLocation(id: string): Promise<boolean> {
    return this.locations.delete(id);
  }

  async getLowStockAlerts(): Promise<Product[]> {
    const products = await this.getProducts();
    return products.filter((p) => p.quantity <= p.minStockLevel);
  }

  async getReportingData(): Promise<{
    totalValue: number;
    categoryStats: Array<{ category: string; count: number; quantity: number; value: number }>;
    locationStats: Array<{ location: string; count: number; quantity: number }>;
    lowStockCount: number;
    outOfStockCount: number;
  }> {
    const products = await this.getProducts();
    
    const totalValue = products.reduce((sum, p) => {
      const price = parseFloat(p.price || "0");
      return sum + price * p.quantity;
    }, 0);

    const categoryStats = products.reduce((acc, product) => {
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
    }, [] as Array<{ category: string; count: number; quantity: number; value: number }>);

    const locationStats = products.reduce((acc, product) => {
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
    }, [] as Array<{ location: string; count: number; quantity: number }>);

    const lowStockCount = products.filter((p) => p.quantity <= p.minStockLevel).length;
    const outOfStockCount = products.filter((p) => p.quantity === 0).length;

    return {
      totalValue,
      categoryStats,
      locationStats,
      lowStockCount,
      outOfStockCount,
    };
  }
}

export const storage = new MemStorage();
