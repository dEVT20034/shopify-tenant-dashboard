"use client";

import { motion } from "framer-motion";
import { Store, TrendingUp, Users, BarChart3, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50/30 to-white">
      {/* Subtle background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      
      {/* Hero Section */}
      <div className="relative">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-center"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="mb-8 inline-flex items-center gap-2 rounded-full bg-black/5 px-4 py-2 text-sm font-medium text-gray-700 backdrop-blur-sm ring-1 ring-black/10"
            >
              <Sparkles className="h-4 w-4 text-gray-900" />
              <span>Enterprise-Grade Analytics Platform</span>
            </motion.div>

            {/* Main heading */}
            <h1 className="mb-6 text-6xl font-bold tracking-tight text-gray-900 sm:text-7xl lg:text-8xl">
              Shopify Analytics
              <br />
              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-600 bg-clip-text text-transparent">
                  Reimagined
                </span>
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
                  className="absolute -bottom-2 left-0 right-0 h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 opacity-30"
                  style={{ originX: 0 }}
                />
              </span>
            </h1>

            {/* Subheading */}
            <p className="mx-auto mb-12 max-w-3xl text-xl leading-relaxed text-gray-600 sm:text-2xl">
              Transform your Shopify data into actionable insights. Real-time analytics,
              <br className="hidden sm:block" />
              powerful visualizations, and enterprise security—all in one platform.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/onboarding"
                className="group relative inline-flex h-14 items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gray-900 px-10 text-base font-semibold text-white shadow-2xl shadow-gray-900/20 transition-all duration-300 hover:bg-gray-800 hover:shadow-xl hover:shadow-gray-900/30 hover:-translate-y-0.5"
              >
                <span>Get Started</span>
                <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link
                href="/login"
                className="group inline-flex h-14 items-center justify-center gap-2 rounded-2xl border-2 border-gray-900/10 bg-white/80 px-10 text-base font-semibold text-gray-900 backdrop-blur-sm transition-all duration-300 hover:border-gray-900/20 hover:bg-white hover:shadow-lg hover:-translate-y-0.5"
              >
                <span>Sign In</span>
              </Link>
            </div>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mt-32 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            <FeatureCard
              icon={TrendingUp}
              title="Real-time Sync"
              description="Automatic data synchronization with Shopify webhooks and intelligent scheduled jobs for always-current insights"
              delay={0.4}
              gradient="from-blue-500/10 to-cyan-500/10"
            />
            <FeatureCard
              icon={BarChart3}
              title="Advanced Analytics"
              description="Beautiful charts and actionable insights to track orders, revenue, and customer behavior patterns"
              delay={0.5}
              gradient="from-purple-500/10 to-pink-500/10"
            />
            <FeatureCard
              icon={Users}
              title="Multi-tenant"
              description="Secure tenant isolation with enterprise-grade data protection and industry-leading security standards"
              delay={0.6}
              gradient="from-amber-500/10 to-orange-500/10"
            />
          </motion.div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="mt-32 grid grid-cols-2 gap-8 sm:grid-cols-4"
          >
            <StatCard value="99.9%" label="Uptime" />
            <StatCard value="<100ms" label="Response Time" />
            <StatCard value="24/7" label="Monitoring" />
            <StatCard value="SOC 2" label="Compliant" />
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent pointer-events-none" />
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  delay: number;
  gradient: string;
}

function FeatureCard({ icon: Icon, title, description, delay, gradient }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      className="group relative overflow-hidden rounded-3xl bg-white p-8 shadow-sm shadow-gray-900/5 ring-1 ring-gray-900/5 transition-all duration-300 hover:shadow-2xl hover:shadow-gray-900/10 hover:ring-gray-900/10"
    >
      {/* Gradient background on hover */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />
      
      {/* Icon container */}
      <div className="relative mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-900/5 ring-1 ring-gray-900/5 transition-all duration-300 group-hover:bg-gray-900 group-hover:ring-gray-900 group-hover:scale-110">
        <Icon className="h-7 w-7 text-gray-900 transition-colors duration-300 group-hover:text-white" />
      </div>
      
      {/* Content */}
      <div className="relative">
        <h3 className="mb-3 text-xl font-semibold tracking-tight text-gray-900">{title}</h3>
        <p className="text-sm leading-relaxed text-gray-600">{description}</p>
      </div>
      
      {/* Hover arrow indicator */}
      <div className="relative mt-6 flex items-center gap-2 text-sm font-medium text-gray-900 opacity-0 transition-all duration-300 group-hover:opacity-100">
        <span>Learn more</span>
        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
      </div>
    </motion.div>
  );
}

interface StatCardProps {
  value: string;
  label: string;
}

function StatCard({ value, label }: StatCardProps) {
  return (
    <div className="text-center">
      <div className="mb-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">{value}</div>
      <div className="text-sm font-medium text-gray-600">{label}</div>
    </div>
  );
}