"use client";

import { motion } from "framer-motion";
import { format } from "date-fns";

interface Order {
  id: string;
  orderNumber: string | null;
  customerEmail: string | null;
  totalPrice: number;
  financialStatus: string | null;
  orderCreatedAt: string;
}

interface RecentOrdersProps {
  orders: Order[];
}

export default function RecentOrders({ orders }: RecentOrdersProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getStatusColor = (status: string | null) => {
    switch (status?.toLowerCase()) {
      case "paid":
        return "bg-green-50 text-green-700 ring-green-600/20";
      case "pending":
        return "bg-yellow-50 text-yellow-700 ring-yellow-600/20";
      case "refunded":
        return "bg-red-50 text-red-700 ring-red-600/20";
      default:
        return "bg-gray-50 text-gray-700 ring-gray-600/20";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
      className="rounded-2xl bg-white p-6 shadow-sm shadow-gray-200/50 ring-1 ring-gray-900/5"
    >
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
        <p className="mt-1 text-sm text-gray-600">Latest transactions from your store</p>
      </div>

      {orders.length === 0 ? (
        <div className="flex h-32 items-center justify-center">
          <p className="text-sm text-gray-500">No orders yet</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200">
              <tr>
                <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Order
                </th>
                <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Customer
                </th>
                <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Date
                </th>
                <th className="pb-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                  Amount
                </th>
                <th className="pb-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((order, index) => (
                <motion.tr
                  key={order.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.05 }}
                  className="group hover:bg-gray-50"
                >
                  <td className="py-4 text-sm font-medium text-gray-900">
                    #{order.orderNumber || order.id.slice(0, 8)}
                  </td>
                  <td className="py-4 text-sm text-gray-600">
                    {order.customerEmail || "Guest"}
                  </td>
                  <td className="py-4 text-sm text-gray-600">
                    {format(new Date(order.orderCreatedAt), "MMM dd, yyyy")}
                  </td>
                  <td className="py-4 text-right text-sm font-medium text-gray-900">
                    {formatCurrency(order.totalPrice)}
                  </td>
                  <td className="py-4 text-right">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${getStatusColor(
                        order.financialStatus
                      )}`}
                    >
                      {order.financialStatus || "Pending"}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
}
