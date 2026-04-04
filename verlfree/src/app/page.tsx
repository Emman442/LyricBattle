
"use client";

import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/landing/Hero";
import HowItWorks from "@/components/landing/HowItWorks";
import StatsBar from "@/components/landing/StatsBar";
import { Button } from "@/components/ui/button";
import { Check, Shield } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <HowItWorks />
      <StatsBar />

      {/* Split Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-card/50 p-12 rounded-3xl border border-border"
            >
              <h2 className="text-3xl font-bold mb-6">Hire with confidence</h2>
              <ul className="space-y-4">
                {[
                  "No more payment disputes or ghosting freelancers",
                  "Funds only release when criteria are met",
                  "AI-powered verification for consistent quality",
                  "Scale your workforce with instant, trustless hiring",
                ].map((item) => (
                  <li key={item} className="flex gap-3 items-start">
                    <Check className="w-5 h-5 text-primary mt-0.5" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
              <Button asChild className="mt-10" size="lg">
                <Link href="/post-job">Start Hiring</Link>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-primary/5 p-12 rounded-3xl border border-primary/20"
            >
              <h2 className="text-3xl font-bold mb-6">Get paid what you're worth</h2>
              <ul className="space-y-4">
                {[
                  "Guaranteed payouts for completed work",
                  "No waiting for manual client approval",
                  "Build a verified on-chain reputation",
                  "Focus on your craft, not chasing invoices",
                ].map((item) => (
                  <li key={item} className="flex gap-3 items-start">
                    <Check className="w-5 h-5 text-primary mt-0.5" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
              <Button asChild variant="outline" className="mt-10 border-primary text-primary hover:bg-primary/10" size="lg">
                <Link href="/jobs">Browse Jobs</Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-card/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold">Loved by builders worldwide</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Emmanuel Ndema",
                role: "Founder, Verifree",
                quote: "VeriFree solved my biggest headache: payment delays. Now I get paid the second my code passes AI verification.",
              },
              {
                name: "Godson Daniel",
                role: "Cleaner, VeriFree",
                quote: "Posting jobs with clear success criteria has improved our deliverable quality by 40%. The AI verification is incredibly accurate.",
              },
              {
                name: "Dude",
                role: "UI Designer",
                quote: "The on-chain portfolio is a game changer. Clients can see my success rate and verified reviews instantly.",
              },
            ].map((t, i) => (
              <Card key={i} className="hover:scale-[1.02] transition-transform duration-300">
                <CardContent className="pt-8">
                  <div className="flex items-center gap-4 mb-6">
                    <Avatar>
                      <AvatarImage src={`https://picsum.photos/seed/${t.name}/100/100`} />
                      <AvatarFallback>{t.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-bold">{t.name}</p>
                      <p className="text-sm text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground italic leading-relaxed">"{t.quote}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <footer className="py-12 border-t border-border">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            <span className="font-bold text-foreground">VeriFree</span>
          </div>
          <div className="flex gap-8">
            <Link href="/terms" className="hover:text-primary">Terms</Link>
            <Link href="/privacy" className="hover:text-primary">Privacy</Link>
            <Link href="/docs" className="hover:text-primary">Documentation</Link>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-xs font-bold text-primary">
            Powered by GenLayer
          </div>
        </div>
      </footer>
    </main>
  );
}
