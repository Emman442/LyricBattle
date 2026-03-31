
"use client";

import { useState, useMemo } from "react";
import Navbar from "@/components/layout/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Search, Filter, Clock, Check, Sparkles, Users } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { useWallet } from "@/components/genlayer/wallet";
import { toast } from "sonner";
import { useGetJobs } from "@/hooks/useVerifree";

const MOCK_JOBS = [
  {
    id: "demo-job-1",
    title: "Build a Next.js 15 SaaS Dashboard",
    category: "Web Development",
    description: "Looking for a specialized developer to create a high-performance dashboard with real-time charting. Must use ShadCN UI and Tailwind CSS. The project requires complex state management and responsive design.",
    budget: 1500,
    deadline: "2024-06-15",
    clientId: "demo-client-1",
    isPublic: true,
    applicantIds: ["u1", "u2", "u3"],
    isDemo: true
  },
  {
    id: "demo-job-2",
    title: "Technical Content Writer for Web3",
    category: "Content Writing",
    description: "Write 10 deep-dive articles on decentralized protocols and AI agents. Must have a deep understanding of blockchain architecture and GenAI trends.",
    budget: 800,
    deadline: "2024-06-20",
    clientId: "demo-client-2",
    isPublic: true,
    applicantIds: ["u4"],
    isDemo: true
  },
  {
    id: "demo-job-3",
    title: "UI/UX Design for Mobile App",
    category: "Design",
    description: "Need a Figma expert to design a 15-screen mobile application for a travel startup. Focus on accessibility and modern aesthetics.",
    budget: 1200,
    deadline: "2024-07-01",
    clientId: "demo-client-3",
    isPublic: true,
    applicantIds: ["u5", "u6"],
    isDemo: true
  }
];

export default function JobBoard() {
  const {isFetching, data: jobs} = useGetJobs()
  console.log("Fetched jobs:", jobs)
  const {address} = useWallet()
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [coverNote, setCoverNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [appliedJobIds, setAppliedJobIds] = useState<string[]>([]);

  const handleOpenApply = (job: any) => {
    if (!address) {
      toast.info("Please connect your wallet to apply for jobs.");
      return;
    }
    setSelectedJob(job);
    setIsApplyModalOpen(true);
  };

  const handleApply = () => {
    setIsSubmitting(true);
    
    // Simulation
    setAppliedJobIds(prev => [...prev, selectedJob.id]);
    
    setTimeout(() => {
      setIsSubmitting(false);
      setIsApplyModalOpen(false);
      setCoverNote("");
      setSelectedJob(null);
      // toast({
      //   title: "Application Submitted",
      //   description: "Your proposal has been sent to the client.",
      // });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-32 pb-20">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
          <div className="max-w-xl w-full">
            <h1 className="text-4xl font-bold mb-4 tracking-tight">Job Board</h1>
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
          <div className="hidden md:block space-y-8">
            <div>
              <h3 className="font-bold mb-4 uppercase text-xs tracking-widest text-primary/80">Category</h3>
              <div className="space-y-2">
                {["Web Development", "Design", "Content Writing", "Video Editing"].map(cat => (
                  <label key={cat} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
                    <input type="checkbox" className="rounded border-border bg-card text-primary focus:ring-primary" />
                    {cat}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-bold mb-4 uppercase text-xs tracking-widest text-primary/80">Budget (GEN)</h3>
              <div className="space-y-4">
                <input type="range" className="w-full accent-primary" min="0" max="5000" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0 GEN</span>
                  <span>5000+ GEN</span>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-3 space-y-4">
            {jobs?.map((job, i) => {
              const isApplied = appliedJobIds.includes(job.job_id);
              const applicantCount = job.job_id?.length || 0;

              return (
                <motion.div
                  key={job.job_id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="hover:border-primary/50 transition-all group overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row justify-between gap-6">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <Badge variant="secondary" className="bg-primary/10 text-primary border-none">
                              {job.category}
                            </Badge>
                            <Badge variant="outline" className="border-border text-muted-foreground">
                              <Users className="w-3 h-3 mr-1" />
                              {applicantCount} applicants
                            </Badge>
                            <span className="text-xs text-muted-foreground flex items-center gap-1 ml-auto md:ml-0">
                              <Clock className="w-3 h-3" /> {job.deadline}
                            </span>
                          </div>
                          <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                            {job.title}
                          </h3>
                          <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                            {job.description}
                          </p>
                        </div>
                        <div className="flex flex-row md:flex-col justify-between md:items-end gap-4 shrink-0">
                          <div className="text-left md:text-right">
                            <p className="text-2xl font-black text-foreground">{job.escrow_amount} GEN</p>
                            <p className="text-xs text-muted-foreground uppercase tracking-widest">Fixed Price</p>
                          </div>
                          
                          {isApplied ? (
                            <Button variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500/20 cursor-default" disabled>
                              <Check className="w-4 h-4 mr-2" />
                              Applied
                            </Button>
                          ) : (
                            <div className="flex gap-2">
                              <Button asChild variant="ghost" className="text-xs">
                                <Link href={`/jobs/${job.job_id}`}>Details</Link>
                              </Button>
                              <Button onClick={() => handleOpenApply(job)} className="bg-primary px-8">
                                Apply Now
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      <Dialog open={isApplyModalOpen} onOpenChange={setIsApplyModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Apply for {selectedJob?.title}
            </DialogTitle>
            <DialogDescription>
              Submit your cover note to the client. This will build your on-chain reputation.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Cover Note</h4>
              <Textarea 
                placeholder="Why are you the best fit for this project? Mention relevant experience..."
                value={coverNote}
                onChange={(e) => setCoverNote(e.target.value)}
                rows={6}
                className="resize-none"
              />
            </div>
            <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl flex items-start gap-3 text-xs text-muted-foreground">
              <Clock className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <p>Applications are processed by the protocol. Your reputation builds upon verified completion.</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsApplyModalOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleApply} 
              disabled={!coverNote || isSubmitting}
              className="bg-primary min-w-[140px]"
            >
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
