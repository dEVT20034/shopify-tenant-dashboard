"use client";

import { motion } from "framer-motion";
import { ArrowRight, BarChart3, Shield, Zap, Clock, TrendingUp, Users } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute left-0 top-0 h-[600px] w-[600px] rounded-full bg-gray-900/[0.02] blur-3xl" />
          <div className="absolute right-0 top-40 h-[500px] w-[500px] rounded-full bg-gray-900/[0.03] blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 pb-24 pt-20 lg:px-8 lg:pb-32 lg:pt-32">
          {/* Hero Content */}
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
            {/* Left Column */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-gray-900/10 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gray-900 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-gray-900" />
                </span>
                Real-time analytics platform
              </div>

              <h1 className="mb-6 text-6xl font-bold leading-tight tracking-tight text-gray-900 lg:text-7xl">
                Your Shopify data,
                <br />
                <span className="bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent">
                  beautifully simple
                </span>
              </h1>

              <p className="mb-8 text-xl leading-relaxed text-gray-600">
                Transform complex store data into clear insights. Make better decisions faster with real-time analytics built for modern merchants.
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href="/onboarding"
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-gray-900/20 transition-all hover:bg-gray-800 hover:shadow-xl hover:shadow-gray-900/30"
                >
                  Start free trial
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-gray-200 bg-white px-8 py-4 text-base font-semibold text-gray-900 transition-all hover:border-gray-300 hover:bg-gray-50"
                >
                  Sign in
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="mt-12 flex flex-wrap items-center gap-8 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    <div className="h-8 w-8 rounded-full border-2 border-white bg-gray-300" />
                    <div className="h-8 w-8 rounded-full border-2 border-white bg-gray-400" />
                    <div className="h-8 w-8 rounded-full border-2 border-white bg-gray-500" />
                  </div>
                  <span className="font-medium">10,000+ merchants</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="h-4 w-4 fill-gray-900" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="font-medium">4.9/5 rating</span>
                </div>
              </div>
            </motion.div>

            {/* Right Column - Stats Card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative"
            >
              <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl">
                {/* Header */}
                <div className="border-b border-gray-100 bg-gray-50/50 px-8 py-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-gray-500">Dashboard Overview</div>
                      <div className="text-xs text-gray-400">Last 30 days</div>
                    </div>
                    <div className="rounded-lg bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-700">
                      Live
                    </div>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="p-8">
                  <div className="mb-8 grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-gray-500">Total Revenue</div>
                      <div className="text-3xl font-bold text-gray-900">$847,392</div>
                      <div className="flex items-center gap-1 text-sm font-medium text-green-600">
                        <TrendingUp className="h-4 w-4" />
                        <span>+12.5%</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-gray-500">Orders</div>
                      <div className="text-3xl font-bold text-gray-900">3,842</div>
                      <div className="flex items-center gap-1 text-sm font-medium text-green-600">
                        <TrendingUp className="h-4 w-4" />
                        <span>+8.2%</span>
                      </div>
                    </div>
                  </div>

                  {/* Chart Placeholder */}
                  <div className="space-y-3">
                    <div className="flex items-end justify-between gap-2">
                      {[40, 65, 45, 80, 55, 90, 70].map((height, i) => (
                        <motion.div
                          key={i}
                          initial={{ height: 0 }}
                          animate={{ height: `${height}%` }}
                          transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
                          className="flex-1 rounded-t-lg bg-gray-900"
                        />
                      ))}
                    </div>
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>Mon</span>
                      <span>Tue</span>
                      <span>Wed</span>
                      <span>Thu</span>
                      <span>Fri</span>
                      <span>Sat</span>
                      <span>Sun</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t border-gray-100 bg-gray-50 py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16 text-center"
          >
            <h2 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 lg:text-5xl">
              Everything you need to succeed
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              Powerful features designed to help you understand and grow your business
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: BarChart3,
                title: "Real-time Analytics",
                description: "Monitor your store performance with live data updates and instant insights",
                color: "from-blue-500/10 to-blue-500/5",
                iconColor: "text-blue-600",
                iconBg: "bg-blue-500/10",
              },
              {
                icon: Zap,
                title: "Lightning Fast",
                description: "Sub-100ms response times ensure you never miss a critical business moment",
                color: "from-amber-500/10 to-amber-500/5",
                iconColor: "text-amber-600",
                iconBg: "bg-amber-500/10",
              },
              {
                icon: Shield,
                title: "Enterprise Security",
                description: "SOC 2 compliant with bank-level encryption and tenant isolation",
                color: "from-green-500/10 to-green-500/5",
                iconColor: "text-green-600",
                iconBg: "bg-green-500/10",
              },
              {
                icon: TrendingUp,
                title: "Growth Insights",
                description: "Actionable recommendations to increase revenue and customer satisfaction",
                color: "from-purple-500/10 to-purple-500/5",
                iconColor: "text-purple-600",
                iconBg: "bg-purple-500/10",
              },
              {
                icon: Users,
                title: "Customer Intelligence",
                description: "Deep insights into customer behavior, preferences, and lifetime value",
                color: "from-pink-500/10 to-pink-500/5",
                iconColor: "text-pink-600",
                iconBg: "bg-pink-500/10",
              },
              {
                icon: Clock,
                title: "Automated Sync",
                description: "Set it and forget it. Webhooks keep your data fresh automatically",
                color: "from-cyan-500/10 to-cyan-500/5",
                iconColor: "text-cyan-600",
                iconBg: "bg-cyan-500/10",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-8 transition-all hover:border-gray-300 hover:shadow-lg"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 transition-opacity group-hover:opacity-100`} />
                <div className="relative">
                  <div className={`mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl ${feature.iconBg}`}>
                    <feature.icon className={`h-6 w-6 ${feature.iconColor}`} />
                  </div>
                  <h3 className="mb-3 text-xl font-semibold text-gray-900">{feature.title}</h3>
                  <p className="text-sm leading-relaxed text-gray-600">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden bg-gray-900 py-24 lg:py-32">
        <div className="absolute inset-0">
          <div className="absolute right-0 top-0 h-[500px] w-[500px] rounded-full bg-white/5 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-white/5 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="mb-6 text-4xl font-bold tracking-tight text-white lg:text-5xl">
              Start making better decisions today
            </h2>
            <p className="mx-auto mb-10 max-w-2xl text-xl text-gray-400">
              Join thousands of merchants who trust our platform to power their analytics
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/onboarding"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-4 text-base font-semibold text-gray-900 transition-all hover:bg-gray-100"
              >
                Get started for free
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-white/20 px-8 py-4 text-base font-semibold text-white transition-all hover:border-white/40 hover:bg-white/5"
              >
                Sign in to dashboard
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-2 gap-8 lg:grid-cols-4">
              {[
                { value: "99.9%", label: "Uptime" },
                { value: "<100ms", label: "Response" },
                { value: "24/7", label: "Support" },
                { value: "SOC 2", label: "Certified" },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="text-center"
                >
                  <div className="mb-2 text-3xl font-bold text-white lg:text-4xl">{stat.value}</div>
                  <div className="text-sm font-medium text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}