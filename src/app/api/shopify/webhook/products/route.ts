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

    const productData = await req.json();

    // Get first variant for pricing
    const firstVariant = productData.variants?.[0];
    const price = firstVariant?.price ? parseFloat(firstVariant.price) : 0;
    const compareAtPrice = firstVariant?.compare_at_price ? parseFloat(firstVariant.compare_at_price) : null;
    const inventory = firstVariant?.inventory_quantity || 0;

    // Upsert product
    await prisma.product.upsert({
      where: {
        shopifyProductId_tenantId: {
          shopifyProductId: productData.id.toString(),
          tenantId: tenant.id,
        },
      },
      update: {
        title: productData.title,
        description: productData.body_html,
        price,
        compareAtPrice,
        inventory,
        imageUrl: productData.image?.src || productData.images?.[0]?.src,
        vendor: productData.vendor,
        productType: productData.product_type,
        tags: productData.tags?.split(",").map((t: string) => t.trim()) || [],
      },
      create: {
        shopifyProductId: productData.id.toString(),
        title: productData.title,
        description: productData.body_html,
        price,
        compareAtPrice,
        inventory,
        imageUrl: productData.image?.src || productData.images?.[0]?.src,
        vendor: productData.vendor,
        productType: productData.product_type,
        tags: productData.tags?.split(",").map((t: string) => t.trim()) || [],
        tenantId: tenant.id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error processing product webhook:", error);
    return NextResponse.json({ error: "Failed to process webhook" }, { status: 500 });
  }
}
