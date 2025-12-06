import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createShopifyClient } from "@/lib/shopify";

export async function POST(req: NextRequest) {
  try {
    // Get all tenants
    const tenants = await prisma.tenant.findMany({
      where: {
        shopifyAccessToken: { not: null },
      },
    });

    const results = [];

    for (const tenant of tenants) {
      try {
        if (!tenant.shopifyAccessToken) continue;

        const client = await createShopifyClient({
          shop: tenant.shopifyDomain,
          accessToken: tenant.shopifyAccessToken,
        });

        // Sync products
        const productsResponse = await client.rest.get({
          path: "products",
          query: { limit: "250" },
        });

        const products = (productsResponse.body as any).products || [];
        
        for (const product of products) {
          const firstVariant = product.variants?.[0];
          await prisma.product.upsert({
            where: {
              shopifyProductId_tenantId: {
                shopifyProductId: product.id.toString(),
                tenantId: tenant.id,
              },
            },
            update: {
              title: product.title,
              description: product.body_html,
              price: firstVariant?.price ? parseFloat(firstVariant.price) : 0,
              compareAtPrice: firstVariant?.compare_at_price ? parseFloat(firstVariant.compare_at_price) : null,
              inventory: firstVariant?.inventory_quantity || 0,
              imageUrl: product.image?.src || product.images?.[0]?.src,
              vendor: product.vendor,
              productType: product.product_type,
              tags: product.tags?.split(",").map((t: string) => t.trim()) || [],
            },
            create: {
              shopifyProductId: product.id.toString(),
              title: product.title,
              description: product.body_html,
              price: firstVariant?.price ? parseFloat(firstVariant.price) : 0,
              compareAtPrice: firstVariant?.compare_at_price ? parseFloat(firstVariant.compare_at_price) : null,
              inventory: firstVariant?.inventory_quantity || 0,
              imageUrl: product.image?.src || product.images?.[0]?.src,
              vendor: product.vendor,
              productType: product.product_type,
              tags: product.tags?.split(",").map((t: string) => t.trim()) || [],
              tenantId: tenant.id,
            },
          });
        }

        // Sync orders (last 250)
        const ordersResponse = await client.rest.get({
          path: "orders",
          query: { limit: "250", status: "any" },
        });

        const orders = (ordersResponse.body as any).orders || [];

        for (const order of orders) {
          let customerId: string | null = null;
          
          if (order.customer) {
            const customer = await prisma.customer.upsert({
              where: {
                shopifyCustomerId_tenantId: {
                  shopifyCustomerId: order.customer.id.toString(),
                  tenantId: tenant.id,
                },
              },
              update: {
                email: order.customer.email,
                firstName: order.customer.first_name,
                lastName: order.customer.last_name,
                phone: order.customer.phone,
                totalSpent: parseFloat(order.customer.total_spent || "0"),
                ordersCount: order.customer.orders_count || 0,
              },
              create: {
                shopifyCustomerId: order.customer.id.toString(),
                email: order.customer.email,
                firstName: order.customer.first_name,
                lastName: order.customer.last_name,
                phone: order.customer.phone,
                totalSpent: parseFloat(order.customer.total_spent || "0"),
                ordersCount: order.customer.orders_count || 0,
                tenantId: tenant.id,
              },
            });
            customerId = customer.id;
          }

          await prisma.order.upsert({
            where: {
              shopifyOrderId_tenantId: {
                shopifyOrderId: order.id.toString(),
                tenantId: tenant.id,
              },
            },
            update: {
              orderNumber: order.order_number?.toString(),
              customerEmail: order.email,
              totalPrice: parseFloat(order.total_price || "0"),
              subtotalPrice: parseFloat(order.subtotal_price || "0"),
              totalTax: parseFloat(order.total_tax || "0"),
              currency: order.currency || "USD",
              financialStatus: order.financial_status,
              fulfillmentStatus: order.fulfillment_status,
              lineItems: order.line_items || [],
              shippingAddress: order.shipping_address || null,
              billingAddress: order.billing_address || null,
              orderCreatedAt: new Date(order.created_at),
            },
            create: {
              shopifyOrderId: order.id.toString(),
              orderNumber: order.order_number?.toString(),
              customerId,
              customerEmail: order.email,
              totalPrice: parseFloat(order.total_price || "0"),
              subtotalPrice: parseFloat(order.subtotal_price || "0"),
              totalTax: parseFloat(order.total_tax || "0"),
              currency: order.currency || "USD",
              financialStatus: order.financial_status,
              fulfillmentStatus: order.fulfillment_status,
              lineItems: order.line_items || [],
              shippingAddress: order.shipping_address || null,
              billingAddress: order.billing_address || null,
              tenantId: tenant.id,
              orderCreatedAt: new Date(order.created_at),
            },
          });
        }

        results.push({
          tenantId: tenant.id,
          tenantName: tenant.name,
          productsSync: products.length,
          ordersSync: orders.length,
          success: true,
        });
      } catch (error) {
        console.error(`Error syncing tenant ${tenant.id}:`, error);
        results.push({
          tenantId: tenant.id,
          tenantName: tenant.name,
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Error in sync endpoint:", error);
    return NextResponse.json(
      { error: "Failed to sync data" },
      { status: 500 }
    );
  }
}
