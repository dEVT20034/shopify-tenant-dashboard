import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { tenants, customers, orders } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const shopDomain = req.headers.get("x-shopify-shop-domain");
    
    if (!shopDomain) {
      return NextResponse.json({ error: "Missing shop domain" }, { status: 400 });
    }

    const [tenant] = await db
      .select()
      .from(tenants)
      .where(eq(tenants.shopifyDomain, shopDomain))
      .limit(1);

    if (!tenant) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
    }

    const orderData = await req.json();

    // Upsert customer if exists
    let customerId: number | null = null;
    if (orderData.customer) {
      const shopifyCustomerId = orderData.customer.id.toString();
      
      const [existingCustomer] = await db
        .select()
        .from(customers)
        .where(
          and(
            eq(customers.shopifyCustomerId, shopifyCustomerId),
            eq(customers.tenantId, tenant.id)
          )
        )
        .limit(1);

      const customerRecord = {
        shopifyCustomerId,
        email: orderData.customer.email || "",
        name: `${orderData.customer.first_name || ""} ${orderData.customer.last_name || ""}`.trim(),
        firstName: orderData.customer.first_name,
        lastName: orderData.customer.last_name,
        totalSpent: parseFloat(orderData.customer.total_spent || "0"),
        ordersCount: orderData.customer.orders_count || 0,
        tenantId: tenant.id,
        updatedAt: new Date().toISOString(),
      };

      if (existingCustomer) {
        await db
          .update(customers)
          .set(customerRecord)
          .where(eq(customers.id, existingCustomer.id));
        customerId = existingCustomer.id;
      } else {
        const [newCustomer] = await db.insert(customers).values({
          ...customerRecord,
          createdAt: new Date().toISOString(),
        }).returning();
        customerId = newCustomer.id;
      }
    }

    // Upsert order
    const shopifyOrderId = orderData.id.toString();
    
    const [existingOrder] = await db
      .select()
      .from(orders)
      .where(
        and(
          eq(orders.shopifyOrderId, shopifyOrderId),
          eq(orders.tenantId, tenant.id)
        )
      )
      .limit(1);

    const orderRecord = {
      shopifyOrderId,
      orderNumber: orderData.order_number?.toString(),
      customerId,
      customerEmail: orderData.email,
      totalPrice: parseFloat(orderData.total_price || "0"),
      status: orderData.financial_status || "pending",
      financialStatus: orderData.financial_status,
      orderCreatedAt: new Date(orderData.created_at).toISOString(),
      tenantId: tenant.id,
      updatedAt: new Date().toISOString(),
    };

    if (existingOrder) {
      await db
        .update(orders)
        .set(orderRecord)
        .where(eq(orders.id, existingOrder.id));
    } else {
      await db.insert(orders).values({
        ...orderRecord,
        createdAt: new Date().toISOString(),
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error processing order webhook:", error);
    return NextResponse.json({ error: "Failed to process webhook" }, { status: 500 });
  }
}