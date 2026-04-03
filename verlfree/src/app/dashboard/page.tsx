
"use client";

import Navbar from "@/components/layout/Navbar";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Wallet,
  Briefcase,
  CheckCircle2,
  Clock,
  Plus,
  Users,
  Trophy,
  Rocket,
  TrendingUp,
  ArrowRight
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useGetClientJobs, useGetFreelancerJobs, useGetJobApplications, useUserProfile } from "@/hooks/useVerifree";
import { useWallet } from "@/components/genlayer/wallet";
import { Job } from "@/lib/types/types";

// Mock Data for Demo Stability
const MOCK_APPLICATIONS = [
  { id: "app-1", jobId: "demo-job-1", status: "Shortlisted", coverNote: "Expert in Next.js and Tailwind. I built the VeriFree prototype.", appliedAt: "2024-03-20T10:00:00Z" },
  { id: "app-2", jobId: "demo-job-2", status: "Pending", coverNote: "I've written for several major Web3 protocols.", appliedAt: "2024-03-21T14:30:00Z" },
];

export default function Dashboard() {
  const { address } = useWallet()
  const { isFetching, data: fetchedProfile } = useUserProfile(address!)
  const { isFetching: isFetchingClientJobs, data: clientJobs } = useGetClientJobs(address || "");
  const { isFetching: isFetchingFreelancerJobs, data: freelancerJobs } = useGetFreelancerJobs(address || "");
  // console.log("Client jobs data:", clientJobs);
  // console.log("Freelancer jobs data:", freelancerJobs);



  // NEW: Hydration-safe state
  const [isClientMounted, setIsClientMounted] = useState(false);
  const [isClientRole, setIsClientRole] = useState(false);

  useEffect(() => {
    setIsClientMounted(true);
    if (fetchedProfile?.role === "client") {
      setIsClientRole(true);
    }
  }, [fetchedProfile]);

  // Show loading while fetching or not mounted
  if (isFetching || !isClientMounted || !address) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground font-medium animate-pulse">
            {isFetching ? "Syncing on-chain profile..." : "Please connect your wallet to continue"}
          </p>
        </div>
      </div>
    );
  }

  const isClient = isClientRole; // Use the safe state


  if (isFetching) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground font-medium animate-pulse">Syncing on-chain profile...</p>
        </div>
      </div>
    );
  }
  if (!address) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground font-medium animate-pulse">Please connect your wallet to continue</p>
        </div>
      </div>
    );
  }


  // Stats based on role
  const stats = isClient ? [
    { label: "Total Escrowed", value: fetchedProfile?.total_spent, suffix: " USDC", icon: Wallet },
    { label: "Active Jobs", value: 2, suffix: "", icon: Briefcase },
    { label: "Pending Applicants", value: 8, suffix: "", icon: Users },
    { label: "Success Rate", value: "100", suffix: "%", icon: CheckCircle2 },
  ] : [
    { label: "Total Earned", value: "12.8k", suffix: " USDC", icon: TrendingUp },
    { label: "Active Projects", value: 1, suffix: "", icon: Rocket },
    { label: "My Applications", value: MOCK_APPLICATIONS.length, suffix: "", icon: Clock },
    { label: "Reputation", value: "98", suffix: "", icon: Trophy },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-32 pb-20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                {isClient ? "Client Mode" : "Freelancer Mode"}
              </Badge>
              <h1 className="text-3xl font-bold tracking-tight">
                Welcome back, {fetchedProfile?.username}
              </h1>
            </div>
            <p className="text-muted-foreground">
              {isClient
                ? "Manage your listings and verify project milestones."
                : "Track your applications and active project status."}
            </p>
          </div>
          {isClient && (
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
              <Link href="/post-job">
                <Plus className="w-5 h-5 mr-2" />
                Post New Job
              </Link>
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="border-border/50 hover:border-primary/30 transition-colors">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <stat.icon className="w-5 h-5 text-primary" />
                    </div>
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

        <Tabs defaultValue={isClient ? "open" : "applied"} className="w-full">
          <TabsList className="mb-8 bg-muted/50 p-1 flex-wrap h-auto">
            {isClient ? (
              <>
                <TabsTrigger value="open" className="px-6">My Listings</TabsTrigger>
                <TabsTrigger value="active" className="px-6">Active Projects</TabsTrigger>
                <TabsTrigger value="completed" className="px-6">Completed</TabsTrigger>
              </>
            ) : (
              <>
                <TabsTrigger value="applied" className="px-6">Applied Jobs</TabsTrigger>
                <TabsTrigger value="active" className="px-6">Active Projects</TabsTrigger>
                <TabsTrigger value="completed" className="px-6">Completed</TabsTrigger>
              </>
            )}
          </TabsList>

          <div className="mt-4">
            {isClient ? (
              <>
                <TabsContent value="open" className="space-y-4">
                  {clientJobs?.filter(j => j.status === 'in_progress').map((job: Job, i) => (
                    <JobRow key={job.job_id} job={job} index={i} />
                  ))}
                </TabsContent>
                <TabsContent value="open" className="space-y-4">
                  {clientJobs?.filter(j => j.status === 'active').map((job: Job, i) => (
                    <JobRow key={job.job_id} job={job} index={i} />
                  ))}
                </TabsContent>
                <TabsContent value="completed" className="space-y-4">
                  <EmptyState message="No completed projects yet." />
                </TabsContent>
              </>
            ) : (
              <>
                <TabsContent value="applied" className="space-y-4">
                  {MOCK_APPLICATIONS.map((app, i) => (
                    <ApplicationRow key={app.id} application={app} index={i} />
                  ))}
                </TabsContent>
                <TabsContent value="active" className="space-y-4">
                  {clientJobs?.filter(j => j.status === 'active').map((job: Job, i) => (
                    <JobRow key={job.job_id} job={job} index={i} />
                  ))}
                </TabsContent>
                <TabsContent value="completed" className="space-y-4">
                  <EmptyState message="No completed projects yet." />
                </TabsContent>
              </>
            )}
          </div>
        </Tabs>
      </div>
    </div>
  );
}


function EmptyState({ message, actionLink, actionText }: { message: string; actionLink?: string; actionText?: string }) {
  return (
    <div className="text-center py-20 text-muted-foreground border-2 border-dashed border-border rounded-2xl">
      <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-10" />
      <p className="font-medium mb-6">{message}</p>
      {actionLink && (
        <Button asChild variant="outline" className="border-primary/50 text-primary hover:bg-primary/5">
          <Link href={actionLink}>{actionText}</Link>
        </Button>
      )}
    </div>
  );
}

function ApplicationRow({ application, index }: { application: any; index: number }) {
  const statusColors: Record<string, string> = {
    "Pending": "bg-yellow-500",
    "Shortlisted": "bg-accent",
    "Selected": "bg-green-500",
    "Rejected": "bg-destructive",
  };


  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link href={`/jobs/${application.jobId}`}>
        <Card className="hover:bg-accent/5 transition-all border-border/50 group">
          <CardContent className="flex items-center justify-between p-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h3 className="text-lg font-bold group-hover:text-primary transition-colors">
                  {jobTitleMap[application.jobId] || "Syncing Contract..."}
                </h3>
                <Badge className={`${statusColors[application.status]} text-white border-none text-[10px]`}>
                  {application.status}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-1 italic">"{application.coverNote}"</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Applied On</p>
                <p className="text-sm font-medium">{new Date(application.appliedAt).toLocaleDateString()}</p>
              </div>
              <Button size="sm" variant="ghost" className="group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                View Job
              </Button>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}

function JobRow({ job, index }: { job: any; index: number }) {
  const statusColors: Record<string, string> = {
    "Open": "text-blue-500 bg-blue-500/10",
    "active": "text-green-500 bg-green-500/10",
    "Completed": "text-primary bg-primary/10",
  };

  const { data: jobApplications } = useGetJobApplications(job.job_id);
  const applicantCount = jobApplications ? jobApplications.length : 0;


  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link href={`/jobs/${job.job_id}`}>
        <Card className="hover:bg-accent/5 transition-all border-border/50 group overflow-hidden">
          <CardContent className="flex flex-col md:flex-row items-center justify-between p-6 gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-bold group-hover:text-primary transition-colors">{job.title}</h3>
                <Badge variant="outline" className={`text-[10px] border-none ${statusColors[job.status]}`}>
                  {job.status}
                </Badge>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-primary" />
                  Due {job.deadline}
                </span>
                {job.status === "active" && (
                  <span className="flex items-center gap-1.5 font-bold text-primary">
                    <Users className="w-4 h-4" />
                    {applicantCount} applicants
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-8 w-full md:w-auto justify-between">
              <div className="text-right">
                <p className="font-black text-xl text-foreground">{job.escrow_amount} USDC</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">In Escrow</p>
              </div>
              <Button size="sm" className="bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all min-w-[140px]">
                {job.status === "active" ? "Manage Candidates" : "View Progress"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
