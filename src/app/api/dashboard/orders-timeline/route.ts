import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { eq, gte } from "drizzle-orm";
import { subDays, startOfDay, format } from "date-fns";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tenantId = session.user.tenantId;
    const { searchParams } = new URL(req.url);
    
    const daysParam = searchParams.get("days");
    const days = daysParam ? parseInt(daysParam) : 30;

    // Get orders from last N days
    const startDate = startOfDay(subDays(new Date(), days));
    const startDateString = startDate.toISOString();

    const ordersList = await db
      .select({
        orderCreatedAt: orders.orderCreatedAt,
        totalPrice: orders.totalPrice,
      })
      .from(orders)
      .where(eq(orders.tenantId, tenantId))
      .where(gte(orders.orderCreatedAt, startDateString))
      .orderBy(orders.orderCreatedAt);

    // Group by day
    const groupedData = ordersList.reduce((acc, order) => {
      const date = format(new Date(order.orderCreatedAt), "MMM dd");
      if (!acc[date]) {
        acc[date] = {
          date,
          orders: 0,
          revenue: 0,
        };
      }
      acc[date].orders += 1;
      acc[date].revenue += order.totalPrice;
      return acc;
    }, {} as Record<string, { date: string; orders: number; revenue: number }>);

    const timeline = Object.values(groupedData);

    return NextResponse.json({ timeline });
  } catch (error) {
    console.error("Error fetching orders timeline:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders timeline" },
      { status: 500 }
    );
  }
}