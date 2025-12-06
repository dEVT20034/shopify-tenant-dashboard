import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/db";
import { customers, orders, products } from "@/db/schema";
import { eq, desc, count, sum, sql } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tenantId = session.user.tenantId;

    // Get summary statistics
    const [customersCount] = await db
      .select({ count: count() })
      .from(customers)
      .where(eq(customers.tenantId, tenantId));

    const [ordersCount] = await db
      .select({ count: count() })
      .from(orders)
      .where(eq(orders.tenantId, tenantId));

    const [productsCount] = await db
      .select({ count: count() })
      .from(products)
      .where(eq(products.tenantId, tenantId));

    const [revenueResult] = await db
      .select({ total: sum(orders.totalPrice) })
      .from(orders)
      .where(eq(orders.tenantId, tenantId));

    const totalCustomers = customersCount.count;
    const totalOrders = ordersCount.count;
    const totalProducts = productsCount.count;
    const totalRevenue = revenueResult.total || 0;

    // Get top 5 customers by total spent
    const topCustomers = await db
      .select({
        id: customers.id,
        firstName: customers.firstName,
        lastName: customers.lastName,
        email: customers.email,
        totalSpent: customers.totalSpent,
        ordersCount: customers.ordersCount,
      })
      .from(customers)
      .where(eq(customers.tenantId, tenantId))
      .orderBy(desc(customers.totalSpent))
      .limit(5);

    // Get recent 10 orders sorted by orderCreatedAt
    const recentOrders = await db
      .select({
        id: orders.id,
        orderNumber: orders.orderNumber,
        customerEmail: orders.customerEmail,
        totalPrice: orders.totalPrice,
        financialStatus: orders.financialStatus,
        orderCreatedAt: orders.orderCreatedAt,
      })
      .from(orders)
      .where(eq(orders.tenantId, tenantId))
      .orderBy(desc(orders.orderCreatedAt))
      .limit(10);

    return NextResponse.json({
      summary: {
        totalCustomers,
        totalOrders,
        totalProducts,
        totalRevenue,
      },
      topCustomers,
      recentOrders,
    });
  } catch (error) {
    console.error("Error fetching dashboard summary:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}