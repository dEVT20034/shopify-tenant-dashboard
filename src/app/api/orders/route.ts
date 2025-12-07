import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/db";
import { orders, customers } from "@/db/schema";
import { eq, like, or, desc, count } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tenantId = session.user.tenantId;
    const { searchParams } = new URL(req.url);
    
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const search = searchParams.get("search") || "";

    const offset = (page - 1) * limit;

    // Build where conditions
    const whereConditions = search
      ? or(
          like(orders.orderNumber, `%${search}%`),
          like(orders.customerEmail, `%${search}%`)
        )
      : undefined;

    // Get orders with customer info
    const ordersList = await db
      .select({
        id: orders.id,
        shopifyOrderId: orders.shopifyOrderId,
        orderNumber: orders.orderNumber,
        customerEmail: orders.customerEmail,
        totalPrice: orders.totalPrice,
        status: orders.status,
        financialStatus: orders.financialStatus,
        orderCreatedAt: orders.orderCreatedAt,
        createdAt: orders.createdAt,
        customerId: orders.customerId,
        customer: {
          firstName: customers.firstName,
          lastName: customers.lastName,
          email: customers.email,
        },
      })
      .from(orders)
      .leftJoin(customers, eq(orders.customerId, customers.id))
      .where(eq(orders.tenantId, tenantId))
      .where(whereConditions)
      .orderBy(desc(orders.orderCreatedAt))
      .limit(limit)
      .offset(offset);

    // Get total count
    const [totalResult] = await db
      .select({ count: count() })
      .from(orders)
      .where(eq(orders.tenantId, tenantId))
      .where(whereConditions);

    const total = totalResult.count;

    return NextResponse.json({
      orders: ordersList,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}