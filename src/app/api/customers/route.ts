import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/db";
import { customers } from "@/db/schema";
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
          like(customers.email, `%${search}%`),
          like(customers.firstName, `%${search}%`),
          like(customers.lastName, `%${search}%`)
        )
      : undefined;

    // Get customers with search and pagination
    const customersList = await db
      .select()
      .from(customers)
      .where(eq(customers.tenantId, tenantId))
      .where(whereConditions)
      .orderBy(desc(customers.totalSpent))
      .limit(limit)
      .offset(offset);

    // Get total count
    const [totalResult] = await db
      .select({ count: count() })
      .from(customers)
      .where(eq(customers.tenantId, tenantId))
      .where(whereConditions);

    const total = totalResult.count;

    return NextResponse.json({
      customers: customersList,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching customers:", error);
    return NextResponse.json(
      { error: "Failed to fetch customers" },
      { status: 500 }
    );
  }
}