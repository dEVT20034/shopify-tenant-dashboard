import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { tenants, products, customers, orders } from "@/db/schema";
import { eq, and, isNotNull } from "drizzle-orm";
import { createShopifyClient } from "@/lib/shopify";

export async function POST(req: NextRequest) {
  try {
    // Get all tenants with access tokens
    const tenantsList = await db
      .select()
      .from(tenants)
      .where(isNotNull(tenants.shopifyAccessToken));

    const results = [];

    for (const tenant of tenantsList) {
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

        const productsData = (productsResponse.body as any).products || [];
        
        for (const product of productsData) {
          const firstVariant = product.variants?.[0];
          const shopifyProductId = product.id.toString();

          const [existingProduct] = await db
            .select()
            .from(products)
            .where(
              and(
                eq(products.shopifyProductId, shopifyProductId),
                eq(products.tenantId, tenant.id)
              )
            )
            .limit(1);

          const productRecord = {
            shopifyProductId,
            title: product.title || "",
            price: firstVariant?.price ? parseFloat(firstVariant.price) : 0,
            inventory: firstVariant?.inventory_quantity || 0,
            tenantId: tenant.id,
            updatedAt: new Date().toISOString(),
          };

          if (existingProduct) {
            await db
              .update(products)
              .set(productRecord)
              .where(eq(products.id, existingProduct.id));
          } else {
            await db.insert(products).values({
              ...productRecord,
              createdAt: new Date().toISOString(),
            });
          }
        }

        // Sync orders (last 250)
        const ordersResponse = await client.rest.get({
          path: "orders",
          query: { limit: "250", status: "any" },
        });

        const ordersData = (ordersResponse.body as any).orders || [];

        for (const order of ordersData) {
          let customerId: number | null = null;
          
          if (order.customer) {
            const shopifyCustomerId = order.customer.id.toString();
            
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
              email: order.customer.email || "",
              name: `${order.customer.first_name || ""} ${order.customer.last_name || ""}`.trim(),
              firstName: order.customer.first_name,
              lastName: order.customer.last_name,
              totalSpent: parseFloat(order.customer.total_spent || "0"),
              ordersCount: order.customer.orders_count || 0,
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

          const shopifyOrderId = order.id.toString();
          
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
            orderNumber: order.order_number?.toString(),
            customerId,
            customerEmail: order.email,
            totalPrice: parseFloat(order.total_price || "0"),
            status: order.financial_status || "pending",
            financialStatus: order.financial_status,
            orderCreatedAt: new Date(order.created_at).toISOString(),
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
        }

        results.push({
          tenantId: tenant.id,
          tenantName: tenant.name,
          productsSync: productsData.length,
          ordersSync: ordersData.length,
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