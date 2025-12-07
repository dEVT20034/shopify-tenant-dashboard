import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { tenants, customers } from "@/db/schema";
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

    const customerData = await req.json();
    const shopifyCustomerId = customerData.id.toString();

    // Check if customer exists
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
      email: customerData.email || "",
      name: `${customerData.first_name || ""} ${customerData.last_name || ""}`.trim(),
      firstName: customerData.first_name,
      lastName: customerData.last_name,
      totalSpent: parseFloat(customerData.total_spent || "0"),
      ordersCount: customerData.orders_count || 0,
      tenantId: tenant.id,
      updatedAt: new Date().toISOString(),
    };

    if (existingCustomer) {
      // Update existing customer
      await db
        .update(customers)
        .set(customerRecord)
        .where(eq(customers.id, existingCustomer.id));
    } else {
      // Insert new customer
      await db.insert(customers).values({
        ...customerRecord,
        createdAt: new Date().toISOString(),
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error processing customer webhook:", error);
    return NextResponse.json({ error: "Failed to process webhook" }, { status: 500 });
  }
}