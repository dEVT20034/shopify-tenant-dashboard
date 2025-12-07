import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { tenants, products } from "@/db/schema";
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

    const productData = await req.json();
    const shopifyProductId = productData.id.toString();

    // Get first variant for pricing
    const firstVariant = productData.variants?.[0];
    const price = firstVariant?.price ? parseFloat(firstVariant.price) : 0;
    const inventory = firstVariant?.inventory_quantity || 0;

    // Check if product exists
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
      title: productData.title || "",
      price,
      inventory,
      tenantId: tenant.id,
      updatedAt: new Date().toISOString(),
    };

    if (existingProduct) {
      // Update existing product
      await db
        .update(products)
        .set(productRecord)
        .where(eq(products.id, existingProduct.id));
    } else {
      // Insert new product
      await db.insert(products).values({
        ...productRecord,
        createdAt: new Date().toISOString(),
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error processing product webhook:", error);
    return NextResponse.json({ error: "Failed to process webhook" }, { status: 500 });
  }
}