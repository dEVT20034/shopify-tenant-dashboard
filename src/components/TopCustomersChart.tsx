"use client";

import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface Customer {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  totalSpent: number;
  ordersCount: number;
}

interface TopCustomersChartProps {
  customers: Customer[];
}

export default function TopCustomersChart({ customers }: TopCustomersChartProps) {
  const chartData = customers.map((customer) => ({
    name: customer.firstName
      ? `${customer.firstName} ${customer.lastName || ""}`.trim()
      : customer.email || "Unknown",
    spent: customer.totalSpent,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="rounded-2xl bg-white p-6 shadow-sm shadow-gray-200/50 ring-1 ring-gray-900/5"
    >
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Top Customers</h3>
        <p className="mt-1 text-sm text-gray-600">By total spent</p>
      </div>

      {chartData.length === 0 ? (
        <div className="flex h-64 items-center justify-center">
          <p className="text-sm text-gray-500">No customer data available</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="name"
              stroke="#9ca3af"
              style={{ fontSize: "12px" }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis stroke="#9ca3af" style={{ fontSize: "12px" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                fontSize: "12px",
              }}
              formatter={(value: number) =>
                new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(value)
              }
            />
            <Bar dataKey="spent" fill="#000" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </motion.div>
  );
}
