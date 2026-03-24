
"use client";

import Navbar from "@/components/layout/Navbar";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Filter, Clock, Wallet, Star } from "lucide-react";
import Link from "next/link";

const mockPublicJobs = [
  {
    id: "1",
    title: "Responsive Landing Page",
    category: "Web Development",
    budget: "450 GEN",
    deadline: "3 days",
    reputation: 98,
    description: "Looking for a clean, modern landing page for a Web3 startup. Must use Tailwind CSS and Framer Motion.",
  },
  {
    id: "2",
    title: "Technical Writing - AI/ML",
    category: "Content Writing",
    budget: "200 GEN",
    deadline: "1 week",
    reputation: 95,
    description: "Write a detailed technical article explaining how Generative AI is changing smart contract audits.",
  },
  {
    id: "3",
    title: "SaaS Dashboard UI Design",
    category: "Design",
    budget: "900 GEN",
    deadline: "10 days",
    reputation: 100,
    description: "Need high-fidelity Figma designs for a complex analytics dashboard. 10 screens total.",
  },
  {
    id: "4",
    title: "Discord Bot for Community",
    category: "Web Development",
    budget: "350 GEN",
    deadline: "5 days",
    reputation: 92,
    description: "Create a custom Discord bot for automated roles and community tracking. Must use Node.js.",
  },
];

export default function JobBoard() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-32 pb-20">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
          <div className="max-w-xl w-full">
            <h1 className="text-4xl font-bold mb-4">Find Work</h1>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input className="pl-11 h-12 bg-card border-border/50" placeholder="Search jobs, skills, or keywords..." />
            </div>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <Button variant="outline" className="h-12">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
            <Button className="h-12 bg-primary">Search</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="hidden md:block space-y-8">
            <div>
              <h3 className="font-bold mb-4 uppercase text-xs tracking-widest">Category</h3>
              <div className="space-y-2">
                {["Web Development", "Design", "Content Writing", "Social Media", "Video Editing"].map(cat => (
                  <label key={cat} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
                    <input type="checkbox" className="rounded border-border bg-card text-primary focus:ring-primary" />
                    {cat}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-bold mb-4 uppercase text-xs tracking-widest">Budget (GEN)</h3>
              <div className="space-y-4">
                <input type="range" className="w-full accent-primary" min="0" max="5000" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0 GEN</span>
                  <span>5000+ GEN</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Feed */}
          <div className="md:col-span-3 space-y-4">
            {mockPublicJobs.map((job, i) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="hover:border-primary/50 transition-all group">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row justify-between gap-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge variant="secondary" className="bg-primary/10 text-primary border-none">
                            {job.category}
                          </Badge>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {job.deadline}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                          {job.title}
                        </h3>
                        <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                          {job.description}
                        </p>
                        <div className="flex items-center gap-4 text-xs font-medium">
                          <span className="flex items-center gap-1 text-yellow-500">
                            <Star className="w-3 h-3 fill-current" />
                            Client Rep: {job.reputation}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-row md:flex-col justify-between md:items-end gap-4 shrink-0">
                        <div className="text-left md:text-right">
                          <p className="text-2xl font-black text-foreground">{job.budget}</p>
                          <p className="text-xs text-muted-foreground uppercase tracking-widest">Fixed Price</p>
                        </div>
                        <Button asChild className="bg-primary px-8">
                          <Link href={`/jobs/${job.id}`}>View Details</Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
