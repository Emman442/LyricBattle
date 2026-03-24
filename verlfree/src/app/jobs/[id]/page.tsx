"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  CheckCircle2, 
  Clock, 
  Wallet, 
  FileText, 
  MessageSquare, 
  ExternalLink,
  ShieldCheck,
  AlertCircle
} from "lucide-react";
import { aiDeliverableVerification } from "@/ai/flows/ai-deliverable-verification-flow";
import { aiVerificationExplanation } from "@/ai/flows/ai-verification-explanation-flow";
import { useToast } from "@/hooks/use-toast";

export default function JobDetail() {
  const [verifying, setVerifying] = useState(false);
  const [verdict, setVerdict] = useState<any>(null);
  const { toast } = useToast();

  const successCriteria = [
    "Fully responsive on mobile and desktop",
    "Tailwind CSS used for all styling",
    "Interactive animations using Framer Motion",
    "Clean code structure with modular components"
  ];

  const milestones = [
    { label: "Job Created", status: "completed" },
    { label: "Freelancer Accepted", status: "completed" },
    { label: "Deliverable Submitted", status: "completed" },
    { label: "AI Verification", status: "current" },
    { label: "Funds Released", status: "pending" },
  ];

  const handleRunVerification = async () => {
    setVerifying(true);
    try {
      const result = await aiDeliverableVerification({
        jobDescription: "Build a responsive React landing page with animations.",
        successCriteria: successCriteria.join(", "),
        deliverableUrl: "https://verifree-submission-demo.vercel.app"
      });

      const explanation = await aiVerificationExplanation({
        jobTitle: "Responsive React Landing Page",
        deliverableDescription: "Landing page for Web3 startup",
        successCriteria,
        aiVerdict: result.isVerified,
        metCriteria: result.isVerified ? successCriteria : [successCriteria[0]],
        unmetCriteria: result.isVerified ? [] : [successCriteria[1], successCriteria[2]],
        aiReasoning: result.reasoning
      });

      setVerdict({ 
        isVerified: result.isVerified, 
        explanation: explanation.explanation 
      });
      
      toast({
        title: result.isVerified ? "Verification Passed" : "Verification Failed",
        description: "AI has completed the assessment of the submission.",
        variant: result.isVerified ? "default" : "destructive"
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "AI agent failed to process verification. Please try again.",
        variant: "destructive"
      });
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-32 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Badge className="bg-primary/10 text-primary border-none">Web Development</Badge>
                <Badge variant="outline" className="text-yellow-500 border-yellow-500/50">Pending Review</Badge>
              </div>
              <h1 className="text-4xl font-extrabold mb-4 tracking-tight">Responsive React Landing Page</h1>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Looking for a clean, modern landing page for a Web3 startup. Must use Tailwind CSS and Framer Motion.
              </p>
            </div>

            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Project Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative flex justify-between items-center px-2">
                  <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-border -translate-y-1/2 -z-10" />
                  {milestones.map((m, i) => (
                    <div key={m.label} className="flex flex-col items-center gap-2">
                      <div className={`w-10 h-10 rounded-full border-4 flex items-center justify-center bg-background transition-colors ${
                        m.status === 'completed' ? 'border-primary bg-primary text-primary-foreground' : 
                        m.status === 'current' ? 'border-primary animate-pulse' : 'border-border'
                      }`}>
                        {m.status === 'completed' ? <CheckCircle2 className="w-5 h-5" /> : (i + 1)}
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-tighter text-center max-w-[60px] leading-tight">
                        {m.label}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Submission Section */}
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">Latest Submission</CardTitle>
                  <span className="text-xs text-muted-foreground">Submitted 2 hours ago</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4 p-4 bg-background border border-border rounded-xl">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <ExternalLink className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold">https://verifree-submission-demo.vercel.app</p>
                    <p className="text-xs text-muted-foreground">Main deliverable URL</p>
                  </div>
                  <Button variant="outline" size="sm">Open Link</Button>
                </div>

                {!verdict ? (
                  <Button 
                    className="w-full bg-primary h-14 text-lg font-bold" 
                    onClick={handleRunVerification}
                    disabled={verifying}
                  >
                    {verifying ? (
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 animate-spin" />
                        AI Agent Analyzing Submission...
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <ShieldCheck className="w-6 h-6" />
                        Run AI Verification
                      </div>
                    )}
                  </Button>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-6 rounded-xl border-2 ${verdict.isVerified ? 'border-green-500/50 bg-green-500/5' : 'border-red-500/50 bg-red-500/5'}`}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      {verdict.isVerified ? (
                        <CheckCircle2 className="w-6 h-6 text-green-500" />
                      ) : (
                        <AlertCircle className="w-6 h-6 text-red-500" />
                      )}
                      <h3 className={`text-xl font-bold ${verdict.isVerified ? 'text-green-500' : 'text-red-500'}`}>
                        {verdict.isVerified ? "Verification Successful" : "Verification Failed"}
                      </h3>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                      {verdict.explanation}
                    </p>
                    {verdict.isVerified && (
                      <Button className="w-full mt-6 bg-green-500 hover:bg-green-600 text-white font-bold h-12">
                        Release 450 GEN Funds
                      </Button>
                    )}
                  </motion.div>
                )}
              </CardContent>
            </Card>

            {/* Chat */}
            <Card>
              <CardHeader className="border-b border-border">
                <CardTitle className="text-lg flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  Project Chat
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[300px] overflow-y-auto p-6 space-y-4 flex flex-col">
                  <div className="bg-muted p-4 rounded-2xl rounded-tl-none max-w-[80%] self-start">
                    <p className="text-sm">Hi! I've just submitted the deliverable. The AI should be able to verify it based on our criteria.</p>
                  </div>
                  <div className="bg-primary/10 border border-primary/20 p-4 rounded-2xl rounded-tr-none max-w-[80%] self-end">
                    <p className="text-sm">Great, I'll run the AI agent now to check the responsiveness and code quality.</p>
                  </div>
                </div>
                <div className="p-4 border-t border-border flex gap-2">
                  <Input placeholder="Type a message..." className="bg-card" />
                  <Button>Send</Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Contract Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-muted-foreground text-sm">Escrow Amount</span>
                  <span className="font-bold text-lg">450 GEN</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-muted-foreground text-sm">Deadline</span>
                  <span className="font-bold text-sm">Oct 24, 2025</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-muted-foreground text-sm">Fee (5%)</span>
                  <span className="font-bold text-sm">22.5 GEN</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Success Criteria</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {successCriteria.map((c, i) => (
                  <div key={i} className="flex gap-3 items-start group">
                    <div className="w-5 h-5 rounded border border-primary/50 flex items-center justify-center mt-0.5 group-hover:bg-primary/10">
                      <CheckCircle2 className="w-3.5 h-3.5 text-primary opacity-20" />
                    </div>
                    <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">{c}</span>
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
