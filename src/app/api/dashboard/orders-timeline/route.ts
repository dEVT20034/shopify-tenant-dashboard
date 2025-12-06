import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
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

    const orders = await prisma.order.findMany({
      where: {
        tenantId,
        orderCreatedAt: {
          gte: startDate,
        },
      },
      select: {
        orderCreatedAt: true,
        totalPrice: true,
      },
      orderBy: {
        orderCreatedAt: "asc",
      },
    });

    // Group by day
    const groupedData = orders.reduce((acc, order) => {
      const date = format(order.orderCreatedAt, "MMM dd");
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
