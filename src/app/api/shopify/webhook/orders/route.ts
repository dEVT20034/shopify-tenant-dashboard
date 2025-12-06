import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const shopDomain = req.headers.get("x-shopify-shop-domain");
    const topic = req.headers.get("x-shopify-topic");
    
    if (!shopDomain) {
      return NextResponse.json({ error: "Missing shop domain" }, { status: 400 });
    }

    const tenant = await prisma.tenant.findUnique({
      where: { shopifyDomain: shopDomain },
    });

    if (!tenant) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
    }

    const orderData = await req.json();

    // Upsert customer if exists
    let customerId: string | null = null;
    if (orderData.customer) {
      const customer = await prisma.customer.upsert({
        where: {
          shopifyCustomerId_tenantId: {
            shopifyCustomerId: orderData.customer.id.toString(),
            tenantId: tenant.id,
          },
        },
        update: {
          email: orderData.customer.email,
          firstName: orderData.customer.first_name,
          lastName: orderData.customer.last_name,
          phone: orderData.customer.phone,
          totalSpent: parseFloat(orderData.customer.total_spent || "0"),
          ordersCount: orderData.customer.orders_count || 0,
        },
        create: {
          shopifyCustomerId: orderData.customer.id.toString(),
          email: orderData.customer.email,
          firstName: orderData.customer.first_name,
          lastName: orderData.customer.last_name,
          phone: orderData.customer.phone,
          totalSpent: parseFloat(orderData.customer.total_spent || "0"),
          ordersCount: orderData.customer.orders_count || 0,
          tenantId: tenant.id,
        },
      });
      customerId = customer.id;
    }

    // Upsert order
    await prisma.order.upsert({
      where: {
        shopifyOrderId_tenantId: {
          shopifyOrderId: orderData.id.toString(),
          tenantId: tenant.id,
        },
      },
      update: {
        orderNumber: orderData.order_number?.toString(),
        customerEmail: orderData.email,
        totalPrice: parseFloat(orderData.total_price || "0"),
        subtotalPrice: parseFloat(orderData.subtotal_price || "0"),
        totalTax: parseFloat(orderData.total_tax || "0"),
        currency: orderData.currency || "USD",
        financialStatus: orderData.financial_status,
        fulfillmentStatus: orderData.fulfillment_status,
        lineItems: orderData.line_items || [],
        shippingAddress: orderData.shipping_address || null,
        billingAddress: orderData.billing_address || null,
        orderCreatedAt: new Date(orderData.created_at),
      },
      create: {
        shopifyOrderId: orderData.id.toString(),
        orderNumber: orderData.order_number?.toString(),
        customerId,
        customerEmail: orderData.email,
        totalPrice: parseFloat(orderData.total_price || "0"),
        subtotalPrice: parseFloat(orderData.subtotal_price || "0"),
        totalTax: parseFloat(orderData.total_tax || "0"),
        currency: orderData.currency || "USD",
        financialStatus: orderData.financial_status,
        fulfillmentStatus: orderData.fulfillment_status,
        lineItems: orderData.line_items || [],
        shippingAddress: orderData.shipping_address || null,
        billingAddress: orderData.billing_address || null,
        tenantId: tenant.id,
        orderCreatedAt: new Date(orderData.created_at),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error processing order webhook:", error);
    return NextResponse.json({ error: "Failed to process webhook" }, { status: 500 });
  }
}
