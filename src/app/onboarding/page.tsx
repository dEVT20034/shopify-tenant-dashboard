"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import Link from "next/link";
import { AlertCircle } from "lucide-react";

export default function OnboardingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    tenantName: "",
    shopifyDomain: "",
    shopifyApiKey: "1999b2303b346baa294f825cda8c7c47",
    shopifyApiSecret: "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",
    shopifyAccessToken: "",
    adminEmail: "",
    adminPassword: "",
    adminFirstName: "",
    adminLastName: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/tenants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          // Handle duplicate domain/email specifically
          if (data.error.includes("domain")) {
            throw new Error(
              "A store with this Shopify domain already exists. Please use a different domain or sign in to your existing account."
            );
          } else if (data.error.includes("email")) {
            throw new Error(
              "An account with this email already exists. Please use a different email or sign in to your existing account."
            );
          }
        }
        throw new Error(data.error || "Failed to create tenant");
      }

      // Success - redirect to login with success message
      router.push("/login?success=Account created successfully! Please sign in.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 px-4 py-12">
      <div className="mx-auto max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">
              Create your store
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Connect your Shopify store to get started with analytics
            </p>
          </div>

          <div className="rounded-2xl bg-white p-8 shadow-xl shadow-gray-200/50 ring-1 ring-gray-900/5">
            <form onSubmit={handleSubmit} className="space-y-8">
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-start gap-3 rounded-lg bg-red-50 p-4 text-sm text-red-600"
                >
                  <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium">Error creating account</p>
                    <p className="mt-1">{error}</p>
                    {error.includes("already exists") && (
                      <Link 
                        href="/login" 
                        className="mt-2 inline-block font-medium underline hover:no-underline"
                      >
                        Sign in instead →
                      </Link>
                    )}
                  </div>
                </motion.div>
              )}

              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900">Store Information</h2>
                
                <div className="space-y-2">
                  <Label htmlFor="tenantName">Store Name</Label>
                  <Input
                    id="tenantName"
                    placeholder="My Awesome Store"
                    value={formData.tenantName}
                    onChange={(e) => updateField("tenantName", e.target.value)}
                    required
                    className="border-gray-200 bg-gray-50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shopifyDomain">Shopify Domain</Label>
                  <Input
                    id="shopifyDomain"
                    placeholder="your-store.myshopify.com"
                    value={formData.shopifyDomain}
                    onChange={(e) => updateField("shopifyDomain", e.target.value)}
                    required
                    className="border-gray-200 bg-gray-50"
                  />
                  <p className="text-xs text-gray-500">
                    Your Shopify store URL (e.g., example.myshopify.com)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shopifyAccessToken">Shopify Access Token (Optional)</Label>
                  <Input
                    id="shopifyAccessToken"
                    type="password"
                    placeholder="shpat_xxxxx"
                    value={formData.shopifyAccessToken}
                    onChange={(e) => updateField("shopifyAccessToken", e.target.value)}
                    className="border-gray-200 bg-gray-50"
                  />
                  <p className="text-xs text-gray-500">
                    Leave blank if you don't have one yet
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900">Admin Account</h2>
                
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="adminFirstName">First Name</Label>
                    <Input
                      id="adminFirstName"
                      placeholder="John"
                      value={formData.adminFirstName}
                      onChange={(e) => updateField("adminFirstName", e.target.value)}
                      className="border-gray-200 bg-gray-50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="adminLastName">Last Name</Label>
                    <Input
                      id="adminLastName"
                      placeholder="Doe"
                      value={formData.adminLastName}
                      onChange={(e) => updateField("adminLastName", e.target.value)}
                      className="border-gray-200 bg-gray-50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="adminEmail">Email</Label>
                  <Input
                    id="adminEmail"
                    type="email"
                    placeholder="admin@example.com"
                    value={formData.adminEmail}
                    onChange={(e) => updateField("adminEmail", e.target.value)}
                    required
                    className="border-gray-200 bg-gray-50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="adminPassword">Password</Label>
                  <Input
                    id="adminPassword"
                    type="password"
                    placeholder="••••••••"
                    value={formData.adminPassword}
                    onChange={(e) => updateField("adminPassword", e.target.value)}
                    required
                    minLength={8}
                    className="border-gray-200 bg-gray-50"
                  />
                  <p className="text-xs text-gray-500">
                    Minimum 8 characters
                  </p>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="h-11 w-full bg-black text-white hover:bg-gray-800 disabled:opacity-50"
              >
                {loading ? "Creating account..." : "Create account"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link href="/login" className="font-medium text-black hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}