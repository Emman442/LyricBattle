
"use client";

import Navbar from "@/components/layout/Navbar";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Wallet, Rocket, Award, ShieldCheck, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function FreelancersPage() {
  const features = [
    {
      icon: Wallet,
      title: "Guaranteed Payouts",
      description: "No more chasing invoices. Once the AI verifies your work, funds are released instantly.",
    },
    {
      icon: Rocket,
      title: "Instant Verification",
      description: "Don't wait days for client approval. Our AI models review your submissions in seconds.",
    },
    {
      icon: Award,
      title: "On-Chain Reputation",
      description: "Every successful job builds your immutable profile, visible to clients worldwide.",
    },
    {
      icon: ShieldCheck,
      title: "Fair Disputes",
      description: "Transparent criteria and AI-assisted mediation ensure you're treated fairly.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-32 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6">
            Get paid for your <span className="gradient-text">craft.</span>
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Focus on what you do best. Let our automated protocol handle the contracts, verification, and instant global payouts.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
              <Link href="/jobs">Browse Open Jobs</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/leaderboard">View Leaderboard</Link>
            </Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="h-full border-primary/10 hover:border-primary/50 transition-colors bg-primary/5">
                <CardContent className="pt-8">
                  <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mb-6">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center bg-card p-12 rounded-3xl border border-border">
          <div className="order-2 md:order-1 relative aspect-square bg-background rounded-2xl border border-border p-8 flex items-center justify-center">
            <div className="space-y-4 w-full">
              <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
              <div className="h-4 w-1/2 bg-muted rounded animate-pulse" />
              <div className="h-12 w-full bg-primary/10 border border-primary/20 rounded-xl" />
              <div className="h-4 w-5/6 bg-muted rounded animate-pulse" />
            </div>
          </div>
          <div className="order-1 md:order-2">
            <h2 className="text-3xl font-bold mb-6">Why switch from legacy platforms?</h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="mt-1 bg-green-500/10 p-1 rounded">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="font-bold">Zero Withdrawal Limits</p>
                  <p className="text-sm text-muted-foreground">Access your earnings instantly via any GEN-compatible wallet.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="mt-1 bg-green-500/10 p-1 rounded">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="font-bold">Global Accessibility</p>
                  <p className="text-sm text-muted-foreground">Work from anywhere. No bank accounts or credit checks required.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="mt-1 bg-green-500/10 p-1 rounded">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="font-bold">Lower Commissions</p>
                  <p className="text-sm text-muted-foreground">Legacy sites take up to 20%. We take only 5% to keep the network running.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
