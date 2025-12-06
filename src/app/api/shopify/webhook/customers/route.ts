import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const shopDomain = req.headers.get("x-shopify-shop-domain");
    
    if (!shopDomain) {
      return NextResponse.json({ error: "Missing shop domain" }, { status: 400 });
    }

    const tenant = await prisma.tenant.findUnique({
      where: { shopifyDomain: shopDomain },
    });

    if (!tenant) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
    }

    const customerData = await req.json();

    // Upsert customer
    await prisma.customer.upsert({
      where: {
        shopifyCustomerId_tenantId: {
          shopifyCustomerId: customerData.id.toString(),
          tenantId: tenant.id,
        },
      },
      update: {
        email: customerData.email,
        firstName: customerData.first_name,
        lastName: customerData.last_name,
        phone: customerData.phone,
        totalSpent: parseFloat(customerData.total_spent || "0"),
        ordersCount: customerData.orders_count || 0,
      },
      create: {
        shopifyCustomerId: customerData.id.toString(),
        email: customerData.email,
        firstName: customerData.first_name,
        lastName: customerData.last_name,
        phone: customerData.phone,
        totalSpent: parseFloat(customerData.total_spent || "0"),
        ordersCount: customerData.orders_count || 0,
        tenantId: tenant.id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error processing customer webhook:", error);
    return NextResponse.json({ error: "Failed to process webhook" }, { status: 500 });
  }
}
