"use client";

import Navbar from "@/components/layout/Navbar";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Wallet, Briefcase, CheckCircle2, Clock, Plus, User } from "lucide-react";
import Link from "next/link";

const mockJobs = [
  {
    id: "1",
    title: "NFT Marketplace Smart Contract",
    freelancer: "cryptodev.eth",
    amount: "1200 GEN",
    deadline: "2 days left",
    status: "Pending Review",
    type: "active",
  },
  {
    id: "2",
    title: "Brand Identity Design",
    freelancer: "design_pro",
    amount: "800 GEN",
    deadline: "5 days left",
    status: "Active",
    type: "active",
  },
  {
    id: "3",
    title: "Blog Content Strategy",
    freelancer: "writer_hub",
    amount: "450 GEN",
    deadline: "Completed",
    status: "Completed",
    type: "completed",
  },
];

export default function Dashboard() {
  const stats = [
    { label: "Total Escrowed", value: "2,450", suffix: " GEN", icon: Wallet },
    { label: "Active Jobs", value: "4", suffix: "", icon: Briefcase },
    { label: "Completed", value: "28", suffix: "", icon: CheckCircle2 },
    { label: "Avg. Review", value: "1.2", suffix: " Days", icon: Clock },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-32 pb-20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, client.eth</h1>
            <p className="text-muted-foreground">Manage your active escrows and review submissions.</p>
          </div>
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
            <Link href="/post-job">
              <Plus className="w-5 h-5 mr-2" />
              Post New Job
            </Link>
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <stat.icon className="w-5 h-5 text-primary" />
                    </div>
                    <Badge variant="secondary" className="bg-green-500/10 text-green-500 border-none">
                      +12%
                    </Badge>
                  </div>
                  <div className="text-2xl font-bold">
                    {stat.value}
                    <span className="text-sm font-medium text-muted-foreground ml-1">{stat.suffix}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Jobs List */}
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="active" className="px-8">Active Jobs</TabsTrigger>
            <TabsTrigger value="completed" className="px-8">Completed Jobs</TabsTrigger>
          </TabsList>
          
          <TabsContent value="active">
            <div className="grid grid-cols-1 gap-4">
              {mockJobs.filter(j => j.type === 'active').map((job, i) => (
                <JobRow key={job.id} job={job} index={i} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="completed">
            <div className="grid grid-cols-1 gap-4">
              {mockJobs.filter(j => j.type === 'completed').map((job, i) => (
                <JobRow key={job.id} job={job} index={i} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function JobRow({ job, index }: { job: any; index: number }) {
  const statusColors: Record<string, string> = {
    "Active": "blue",
    "Pending Review": "yellow",
    "Completed": "green",
    "Disputed": "red",
  };

  const borderColor = statusColors[job.status] || "blue";

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Link href={`/jobs/${job.id}`}>
        <Card className={`hover:bg-accent/50 transition-colors border-l-4 border-l-${borderColor}-500 overflow-hidden`}>
          <CardContent className="flex flex-col md:flex-row items-center justify-between p-6 gap-6">
            <div className="flex-1">
              <h3 className="text-lg font-bold mb-1">{job.title}</h3>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {job.freelancer}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {job.deadline}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-8 w-full md:w-auto justify-between">
              <div className="text-right">
                <p className="font-bold text-lg">{job.amount}</p>
                <p className="text-xs text-muted-foreground uppercase tracking-widest">Budget</p>
              </div>
              <Badge 
                className={
                  job.status === "Pending Review" 
                    ? "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20" 
                    : job.status === "Completed"
                    ? "bg-green-500/10 text-green-500 hover:bg-green-500/20"
                    : "bg-primary/10 text-primary hover:bg-primary/20"
                }
              >
                {job.status}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
