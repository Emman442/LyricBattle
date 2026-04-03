
"use client";

import { useState, useMemo, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  CheckCircle2,
  Clock,
  MessageSquare,
  ShieldCheck,
  Users,
  XCircle,
  Sparkles,
  Trophy,
  Rocket,
  AlertCircle
} from "lucide-react";
import { useParams } from "next/navigation";
import { useWallet } from "@/components/genlayer/wallet";
import { useAIShortlist, useGetJobApplications, useGetJobMilestones, useJobByID, useRejectFreelancer, useSelectFreelancer, useSubmitDeliverable } from "@/hooks/useVerifree";
import { toast } from "sonner";
import { JobMilestone } from "@/lib/types/types";

export default function JobDetail() {
  const { id } = useParams();
  const [isAIReordering, setIsAIReordering] = useState(false);
  const [deliverableUrl, setDeliverableUrl] = useState("");
  const [deliverableNote, setDeliverableNote] = useState("");
  const { address } = useWallet();
  const { isFetching: jobLoading, data: jobData } = useJobByID(id as string);
  const { isFetching: isLoadingJobMilestones, data: jobMilestones } = useGetJobMilestones(id as string);
  const { isFetching: isLoadingApplications, data: applications } = useGetJobApplications(id as string);
  const { mutate: SubmitDeliverable, isPending: isSubmitting } = useSubmitDeliverable();
  console.log("applications: ", applications)
  const { mutate: selectFreelancer, isPending: isSelectingFreelancer } = useSelectFreelancer();
  const { mutate: rejectFreelancer, isPending: isRejectingFreelancer } = useRejectFreelancer();
  console.log("Job data fetched:", jobData);
  console.log("Selected Job Milestones:", jobMilestones);

  const isClient = address && (jobData?.client.toLocaleLowerCase() == address);
  const isAssignedFreelancer = address && jobData?.freelancer.toLocaleLowerCase() === address;

  const isJobActive = jobData?.status === "active" || jobData?.status === "in_progress";
  const activeApplications = applications?.filter((app: any) => app.status === "pending" || app.status === "shortlisted") || [];
  const { mutate: AIShortlist, isPending: isShortlisting } = useAIShortlist()
  const sortedApplications = [...activeApplications].sort((a: any, b: any) => {
    const scoreA = parseFloat(a.ai_score || "0");
    const scoreB = parseFloat(b.ai_score || "0");
    return scoreB - scoreA;   // Highest score first
  });

  // Get the highest score value
  const highestScore = sortedApplications.length > 0
    ? parseFloat(sortedApplications[0].ai_score || "0")
    : 0;

    console.log("Sorted Applications with AI Scores:", sortedApplications);
    console.log("Highest AI Score among applications:", highestScore);
  const handleAIShortlist = async () => {
    setIsAIReordering(true);

    await AIShortlist({ job_id: jobData?.job_id || "" }, {
      onSuccess() {
        toast.success("AI has analyzed the applications and updated the shortlist based on relevance to the job description and cover note strength.");
      },
      onError() {
        toast.error("AI Shortlisting failed. Please try again.");
      },
      onSettled() {
        setIsAIReordering(false);
      }
    });

  };

  const handleSelectFreelancer = async (appId: string) => {
    await selectFreelancer({
      job_id: jobData?.job_id || "",
      freelancer_address: appId,
    }, {
      onSuccess() {
        toast.success(`Project is now Active. Payout locked in escrow.`);

      }
    });
  };

  const handleRejectApplicant = async (appId: string) => {

    await rejectFreelancer({
      job_id: jobData?.job_id || "",
      freelancer_address: appId,
    }, {
      onSuccess() {
        toast.success(`Applicant has been rejected.`);
      }
    });

  };

  const handleSubmitDeliverable = async (deliverableNote: string, deliverableUrl: string) => {

    await SubmitDeliverable({
      job_id: jobData?.job_id || "",
      deliverable_url: deliverableUrl,
      deliverable_note: deliverableNote
    }, {
      onSuccess() {
        toast.success(`Deliverables submitted. When the AI completes the verification process, the client will be notified to review the submission.`);
        setDeliverableUrl("");
      },
      onError() {
        toast.error("Failed to submit deliverable. Please try again.");
      }
    });
  }

  const successCriteria = [
    "Fully responsive on mobile and desktop",
    "Tailwind CSS used for all styling",
    "Interactive animations using Framer Motion",
    "Clean code structure with modular components"
  ];

  if (jobLoading && !jobData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-primary font-bold animate-pulse tracking-widest uppercase text-xs">Synchronizing Node Data...</p>
        </div>
      </div>
    );
  }

  if (!jobData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Contract Not Found</h2>
          <p className="text-muted-foreground mb-6">The specified contract ID does not exist on this chain.</p>
          <Button asChild variant="outline">
            <a href="/jobs">Return to Job Board</a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-32 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <Badge className="bg-primary/10 text-primary border-none">{jobData.category}</Badge>
                <Badge variant="outline" className={`
                  ${jobData.status === 'active' ? 'text-blue-500 border-blue-500/50' :
                    jobData.status === 'completed' ? 'text-green-500 border-green-500/50' :
                      'text-yellow-500 border-yellow-500/50'}
                `}>
                  {jobData.status}
                </Badge>
              </div>
              <h1 className="text-4xl font-extrabold mb-4 tracking-tight">{jobData.title}</h1>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                {jobData.description}
              </p>
            </motion.div>

            {isClient && jobData.status === "active" && (
              <Card className="border-primary/20 bg-primary/5">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    <CardTitle className="text-lg">Applications ({activeApplications?.length})</CardTitle>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-primary/50 text-primary hover:bg-primary/10"
                    onClick={handleAIShortlist}
                    disabled={isShortlisting || activeApplications.length === 0}
                  >
                    <Sparkles className={`w-4 h-4 mr-2 ${isShortlisting ? 'animate-spin' : ''}`} />
                    {isShortlisting ? "Analyzing..." : "AI Shortlist"}
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <AnimatePresence mode="popLayout">
                    {activeApplications?.map((app) => (
                      <motion.div
                        key={app.job_id}
                        layout
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`p-4 rounded-xl border bg-background transition-all hover:border-primary/30 ${app.isAIRecommended ? 'border-yellow-500/50 ring-1 ring-yellow-500/20' : 'border-border'} ${app.status === 'Rejected' ? 'opacity-50 grayscale' : ''}`}
                      >
                        <div className="flex flex-col md:flex-row gap-6">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <Avatar className="w-8 h-8">
                                  <AvatarImage src={`https://picsum.photos/seed/${app.applicant}/100/100`} />
                                  <AvatarFallback>{app.applicant[0]}</AvatarFallback>
                                </Avatar>
                                <span className="font-bold text-sm">{app.applicant}</span>
                                {Number(app.ai_score) === highestScore && (
                                  <Badge className="bg-yellow-500 text-black font-black text-[10px] h-5 px-2">
                                    AI RECOMMENDED
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-1 text-xs text-yellow-500 font-bold">
                                <Trophy className="w-3 h-3" />
                                Rep: 95
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-3 mb-2 italic">
                              "{app.cover_note}"
                            </p>
                            
                              <p className="text-[10px] text-yellow-600 font-bold flex items-center gap-1">
                                <Sparkles className="w-3 h-3" />
                                {app.ai_recommendation}
                              </p>
                            
                          </div>
                          {app.status === 'pending' || app.status === 'shortlisted' && (
                            <div className="flex md:flex-col gap-2 justify-end">
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-destructive hover:bg-destructive/10"
                                onClick={() => handleRejectApplicant(app.applicant)}
                                disabled={isSelectingFreelancer || isRejectingFreelancer}
                              >
                                <XCircle className="w-4 h-4 mr-2" />
                                Reject
                              </Button>
                              <Button
                                size="sm"
                                className="bg-primary"
                                onClick={() => handleSelectFreelancer(app.applicant)}
                                disabled={isSelectingFreelancer || isRejectingFreelancer}
                              >
                                <ShieldCheck className="w-4 h-4 mr-2" />
                                Select
                              </Button>
                            </div>
                          )}
                          {app.status !== 'pending' && app.status !== 'shortlisted' && (
                            <Badge className={`h-8 px-4 ${app.status === 'Selected' ? 'bg-green-500' : 'bg-muted'}`}>
                              {app.status}
                            </Badge>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </CardContent>
              </Card>
            )}

            {jobData.status === "in_progress" && (
              <Card className="border-primary/20 bg-primary/5">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Rocket className="w-5 h-5 text-primary" />
                    Deliverable Submission
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {isAssignedFreelancer ? (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="deliverable">Submission Link (GitHub, URL, etc.)</Label>
                        <Input
                          id="deliverable"
                          placeholder="https://..."
                          value={deliverableUrl}
                          onChange={(e) => setDeliverableUrl(e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">AI will automatically crawl this link to verify against success criteria.</p>
                      </div>
                      <Button
                        onClick={() => handleSubmitDeliverable(deliverableUrl, deliverableNote)}
                        disabled={!deliverableUrl || isSubmitting || !deliverableNote}
                        className="w-full bg-primary py-6 text-lg font-bold"
                      >
                        {isSubmitting ? "Submitting..." : "Submit for Verification"}
                      </Button>
                    </div>
                  ) : (
                    <div className="p-12 text-center text-muted-foreground border-2 border-dashed border-border rounded-xl">
                      <ShieldCheck className="w-12 h-12 mx-auto mb-4 opacity-20" />
                      <p className="font-medium">
                        {isClient
                          ? "Contract is Active. Awaiting deliverable from the assigned freelancer."
                          : "You are not assigned to this job."}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader className="border-b border-border">
                <CardTitle className="text-lg flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  Project Log
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex gap-4 items-start">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Clock className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-bold">Contract Initialized</p>
                      <p className="text-xs text-muted-foreground">{new Date(Date.now()).toLocaleString()}</p>
                    </div>
                  </div>
                  {jobData.status === 'active' && (
                    <div className="flex gap-4 items-start">
                      <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                      </div>
                      <div>
                        <p className="text-sm font-bold">Freelancer Assigned</p>
                        <p className="text-xs text-muted-foreground">Escrow funds locked by protocol.</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Contract Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-muted-foreground text-sm">Escrow Amount</span>
                  <span className="font-bold text-lg">{jobData.escrow_amount} GEN</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-muted-foreground text-sm">Deadline</span>
                  <span className="font-bold text-sm">{jobData.deadline}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-muted-foreground text-sm">Protocol Fee</span>
                  <span className="font-bold text-sm text-primary">5%</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Success Criteria</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {jobMilestones?.map((c: JobMilestone, i) => (
                  <div key={i} className="flex gap-3 items-start group">
                    <div className="w-5 h-5 rounded border border-primary/50 flex items-center justify-center mt-0.5 group-hover:bg-primary/10">
                      <CheckCircle2 className="w-3.5 h-3.5 text-primary opacity-20" />
                    </div>
                    <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">{c.title}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
