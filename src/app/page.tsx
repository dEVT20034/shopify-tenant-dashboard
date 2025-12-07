"use client";

import { motion } from "framer-motion";
import { Store, TrendingUp, Users, BarChart3 } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="mb-8 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-black"
            >
              <Store className="h-10 w-10 text-white" />
            </motion.div>

            <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl">
              Shopify Analytics
              <br />
              <span className="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Reimagined
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
              A premium multi-tenant analytics platform for Shopify stores. Get real-time insights,
              track performance, and grow your business with enterprise-grade analytics.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/onboarding"
                className="inline-flex h-12 items-center justify-center rounded-xl bg-black px-8 text-sm font-semibold text-white transition-all hover:bg-gray-800 hover:scale-105"
              >
                Get Started
              </Link>
              <Link
                href="/login"
                className="inline-flex h-12 items-center justify-center rounded-xl border border-gray-300 bg-white px-8 text-sm font-semibold text-gray-900 transition-all hover:bg-gray-50 hover:scale-105"
              >
                Sign In
              </Link>
            </div>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-24 grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
          >
            <FeatureCard
              icon={TrendingUp}
              title="Real-time Sync"
              description="Automatic data synchronization with Shopify webhooks and scheduled jobs"
              delay={0.5}
            />
            <FeatureCard
              icon={BarChart3}
              title="Advanced Analytics"
              description="Beautiful charts and insights to track orders, revenue, and customer behavior"
              delay={0.6}
            />
            <FeatureCard
              icon={Users}
              title="Multi-tenant"
              description="Secure tenant isolation with enterprise-grade data protection"
              delay={0.7}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  delay: number;
}

function FeatureCard({ icon: Icon, title, description, delay }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -4 }}
      className="group rounded-2xl bg-white p-8 shadow-sm shadow-gray-200/50 ring-1 ring-gray-900/5 transition-all hover:shadow-xl hover:shadow-gray-200/50"
    >
      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gray-50 transition-colors group-hover:bg-gray-100">
        <Icon className="h-6 w-6 text-gray-900" />
      </div>
      <h3 className="mb-2 text-lg font-semibold text-gray-900">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </motion.div>
  );
}