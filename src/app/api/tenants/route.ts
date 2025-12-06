import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { tenants, users } from "@/db/schema";
import { hash } from "bcryptjs";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      tenantName,
      shopifyDomain,
      shopifyApiKey,
      shopifyApiSecret,
      shopifyAccessToken,
      adminEmail,
      adminPassword,
      adminFirstName,
      adminLastName,
    } = body;

    // Validate required fields
    if (!tenantName || !shopifyDomain || !shopifyApiKey || !shopifyApiSecret || !adminEmail || !adminPassword) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if tenant already exists
    const existingTenant = await db.select().from(tenants).where(eq(tenants.shopifyDomain, shopifyDomain)).limit(1);

    if (existingTenant.length > 0) {
      return NextResponse.json(
        { error: "Tenant with this Shopify domain already exists" },
        { status: 409 }
      );
    }

    // Check if user email already exists
    const existingUser = await db.select().from(users).where(eq(users.email, adminEmail)).limit(1);

    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = await hash(adminPassword, 12);

    // Create tenant first
    const [tenant] = await db.insert(tenants).values({
      name: tenantName,
      shopifyDomain,
      shopifyApiKey,
      shopifyApiSecret,
      shopifyAccessToken: shopifyAccessToken || null,
      createdAt: new Date().toISOString(),
    }).returning();

    // Create admin user
    const [user] = await db.insert(users).values({
      email: adminEmail,
      firstName: adminFirstName || "",
      lastName: adminLastName || "",
      passwordHash,
      role: "admin",
      tenantId: tenant.id,
      createdAt: new Date().toISOString(),
    }).returning();

    return NextResponse.json(
      {
        message: "Tenant created successfully",
        tenant: {
          id: tenant.id,
          name: tenant.name,
          shopifyDomain: tenant.shopifyDomain,
        },
        user: {
          id: user.id,
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating tenant:", error);
    return NextResponse.json(
      { error: "Failed to create tenant" },
      { status: 500 }
    );
  }
}