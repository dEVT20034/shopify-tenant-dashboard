"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import DashboardHeader from "@/components/DashboardHeader";
import StatsCard from "@/components/StatsCard";
import OrdersChart from "@/components/OrdersChart";
import TopCustomersChart from "@/components/TopCustomersChart";
import RecentOrders from "@/components/RecentOrders";
import { motion } from "framer-motion";
import { DollarSign, ShoppingCart, Users, Package } from "lucide-react";

interface DashboardData {
  summary: {
    totalCustomers: number;
    totalOrders: number;
    totalProducts: number;
    totalRevenue: number;
  };
  topCustomers: Array<{
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    totalSpent: number;
    ordersCount: number;
  }>;
  recentOrders: Array<{
    id: string;
    orderNumber: string | null;
    customerEmail: string | null;
    totalPrice: number;
    financialStatus: string | null;
    orderCreatedAt: string;
  }>;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchDashboardData();
    }
  }, [status]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/dashboard/summary");
      if (!response.ok) {
        throw new Error("Failed to fetch dashboard data");
      }
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  // Show loading while checking authentication
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-black"></div>
            <p className="mt-4 text-sm text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  // Don't render dashboard if not authenticated
  if (status === "unauthenticated") {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader />
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-black"></div>
              <p className="mt-4 text-sm text-gray-600">Loading dashboard...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader />
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="rounded-lg bg-red-50 p-4 text-center">
            <p className="text-sm text-red-600">{error || "Failed to load data"}</p>
            <button 
              onClick={fetchDashboardData}
              className="mt-2 text-sm font-medium text-red-600 hover:underline"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Welcome back, {session?.user?.name || "there"}
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Here's what's happening with your store today.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Revenue"
            value={formatCurrency(data.summary.totalRevenue)}
            icon={DollarSign}
            delay={0.1}
          />
          <StatsCard
            title="Total Orders"
            value={data.summary.totalOrders.toLocaleString()}
            icon={ShoppingCart}
            delay={0.2}
          />
          <StatsCard
            title="Customers"
            value={data.summary.totalCustomers.toLocaleString()}
            icon={Users}
            delay={0.3}
          />
          <StatsCard
            title="Products"
            value={data.summary.totalProducts.toLocaleString()}
            icon={Package}
            delay={0.4}
          />
        </div>

        {/* Charts Grid */}
        <div className="mb-8 grid gap-6 lg:grid-cols-2">
          <OrdersChart />
          <TopCustomersChart customers={data.topCustomers} />
        </div>

        {/* Recent Orders */}
        <RecentOrders orders={data.recentOrders} />
      </main>
    </div>
  );
}