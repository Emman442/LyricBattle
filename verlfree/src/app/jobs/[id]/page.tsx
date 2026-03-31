
// "use client";

// import { useState, useMemo, useEffect } from "react";
// import Navbar from "@/components/layout/Navbar";
// import { motion, AnimatePresence } from "framer-motion";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { 
//   CheckCircle2, 
//   Clock, 
//   MessageSquare, 
//   ShieldCheck,
//   Users,
//   XCircle,
//   Sparkles,
//   Trophy,
//   Rocket,
//   AlertCircle
// } from "lucide-react";
// import { useParams } from "next/navigation";
// import { toast } from "sonner";

// // Demo Data Fallback
// const MOCK_JOB_DATA: Record<string, any> = {
//   "demo-job-1": {
//     id: "demo-job-1",
//     title: "Build a Next.js 15 SaaS Dashboard",
//     category: "Web Development",
//     description: "Looking for a specialized developer to create a high-performance dashboard with real-time charting. Must use ShadCN UI and Tailwind CSS. The project requires complex state management and responsive design.",
//     budget: 1500,
//     deadline: "2024-06-15",
//     clientId: "demo-client-1",
//     status: "Open",
//     createdAt: new Date().toISOString(),
//     assignedFreelancerId: null
//   }
// };

// const MOCK_APPLICATIONS = [
//   { id: "app-1", freelancerId: "0x71C...4f92", coverNote: "I have 5 years of experience with React and have built multiple high-scale dashboards. Check my GitHub for examples.", status: "Pending", isAIRecommended: true },
//   { id: "app-2", freelancerId: "0x3A2...b1e8", coverNote: "Expert in ShadCN and Tailwind. I can deliver this project within 10 days with 100% test coverage.", status: "Pending", isAIRecommended: false },
//   { id: "app-3", freelancerId: "0x9D4...a2c1", coverNote: "I am interested in this project. I have worked on similar dashboards before.", status: "Pending", isAIRecommended: false },
// ];

// export default function JobDetail() {
//   const { id } = useParams();
//   const [verifying, setVerifying] = useState(false);
//   const [isAIReordering, setIsAIReordering] = useState(false);
//   const [deliverableUrl, setDeliverableUrl] = useState("");
//   const [localJobState, setLocalJobState] = useState<any>(null);
//   const [localApps, setLocalApps] = useState(MOCK_APPLICATIONS);


//   // const isClient = user && (localJobState?.clientId === user.uid || (id as string).startsWith('demo-'));
//   // const isAssignedFreelancer = user && localJobState?.assignedFreelancerId === user.uid;

//   const handleAIShortlist = () => {
//     setIsAIReordering(true);

    
//     setTimeout(() => {
//       const reordered = [...localApps].sort((a, b) => (a.isAIRecommended ? -1 : 1));
//       setLocalApps(reordered);
//       setIsAIReordering(false);
//       toast({
//         title: "Shortlist Complete",
//         description: "Found the best fit for your requirements.",
//       });
//     }, 2000);
//   };

//   const handleSelectFreelancer = (app: any) => { }

//     toast(`Project is now Active. Payout locked in escrow.`);
//   };

//   const handleRejectApplicant = (appId: string) => {

//   };

//   const handleSubmitDeliverable = () => {}

//   const successCriteria = [
//     "Fully responsive on mobile and desktop",
//     "Tailwind CSS used for all styling",
//     "Interactive animations using Framer Motion",
//     "Clean code structure with modular components"
//   ];

  // if (jobLoading && !localJobState) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center bg-background">
  //       <div className="flex flex-col items-center gap-4">
  //         <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
  //         <p className="text-primary font-bold animate-pulse tracking-widest uppercase text-xs">Synchronizing Node Data...</p>
  //       </div>
  //     </div>
  //   );
  // }

  // if (!localJobState) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center bg-background">
  //       <div className="text-center">
  //         <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
  //         <h2 className="text-2xl font-bold mb-2">Contract Not Found</h2>
  //         <p className="text-muted-foreground mb-6">The specified contract ID does not exist on this chain.</p>
  //         <Button asChild variant="outline">
  //           <a href="/jobs">Return to Job Board</a>
  //         </Button>
  //       </div>
  //     </div>
  //   );
  // }

//   return (
//     <div className="min-h-screen bg-background">
//       <Navbar />
//       <div className="container mx-auto px-4 pt-32 pb-20">
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           <div className="lg:col-span-2 space-y-8">
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//             >
//               <div className="flex items-center gap-3 mb-4">
//                 <Badge className="bg-primary/10 text-primary border-none">{localJobState.category}</Badge>
//                 <Badge variant="outline" className={`
//                   ${localJobState.status === 'Active' ? 'text-blue-500 border-blue-500/50' : 
//                     localJobState.status === 'Completed' ? 'text-green-500 border-green-500/50' : 
//                     'text-yellow-500 border-yellow-500/50'}
//                 `}>
//                   {localJobState.status}
//                 </Badge>
//               </div>
//               <h1 className="text-4xl font-extrabold mb-4 tracking-tight">{localJobState.title}</h1>
//               <p className="text-muted-foreground text-lg leading-relaxed mb-6">
//                 {localJobState.description}
//               </p>
//             </motion.div>

//             {isClient && localJobState.status === "Open" && (
//               <Card className="border-primary/20 bg-primary/5">
//                 <CardHeader className="flex flex-row items-center justify-between">
//                   <div className="flex items-center gap-2">
//                     <Users className="w-5 h-5 text-primary" />
//                     <CardTitle className="text-lg">Applications ({localApps.length})</CardTitle>
//                   </div>
//                   <Button 
//                     variant="outline" 
//                     size="sm" 
//                     className="border-primary/50 text-primary hover:bg-primary/10"
//                     onClick={handleAIShortlist}
//                     disabled={isAIReordering || !localApps.length}
//                   >
//                     <Sparkles className={`w-4 h-4 mr-2 ${isAIReordering ? 'animate-spin' : ''}`} />
//                     {isAIReordering ? "Analyzing..." : "AI Shortlist"}
//                   </Button>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   <AnimatePresence mode="popLayout">
//                     {localApps.map((app) => (
//                       <motion.div
//                         key={app.id}
//                         layout
//                         initial={{ opacity: 0, x: -20 }}
//                         animate={{ opacity: 1, x: 0 }}
//                         className={`p-4 rounded-xl border bg-background transition-all hover:border-primary/30 ${app.isAIRecommended ? 'border-yellow-500/50 ring-1 ring-yellow-500/20' : 'border-border'} ${app.status === 'Rejected' ? 'opacity-50 grayscale' : ''}`}
//                       >
//                         <div className="flex flex-col md:flex-row gap-6">
//                           <div className="flex-1">
//                             <div className="flex items-center justify-between mb-3">
//                               <div className="flex items-center gap-3">
//                                 <Avatar className="w-8 h-8">
//                                   <AvatarImage src={`https://picsum.photos/seed/${app.freelancerId}/100/100`} />
//                                   <AvatarFallback>{app.freelancerId[0]}</AvatarFallback>
//                                 </Avatar>
//                                 <span className="font-bold text-sm">{app.freelancerId}</span>
//                                 {app.isAIRecommended && (
//                                   <Badge className="bg-yellow-500 text-black font-black text-[10px] h-5 px-2">
//                                     AI RECOMMENDED
//                                   </Badge>
//                                 )}
//                               </div>
//                               <div className="flex items-center gap-1 text-xs text-yellow-500 font-bold">
//                                 <Trophy className="w-3 h-3" />
//                                 Rep: 95
//                               </div>
//                             </div>
//                             <p className="text-sm text-muted-foreground line-clamp-3 mb-2 italic">
//                               "{app.coverNote}"
//                             </p>
//                             {app.isAIRecommended && (
//                               <p className="text-[10px] text-yellow-600 font-bold flex items-center gap-1">
//                                 <Sparkles className="w-3 h-3" />
//                                 Strongest cover note with relevant experience mentioned.
//                               </p>
//                             )}
//                           </div>
//                           {app.status === 'Pending' && (
//                             <div className="flex md:flex-col gap-2 justify-end">
//                               <Button 
//                                 variant="outline" 
//                                 size="sm" 
//                                 className="text-destructive hover:bg-destructive/10"
//                                 onClick={() => handleRejectApplicant(app.id)}
//                               >
//                                 <XCircle className="w-4 h-4 mr-2" />
//                                 Reject
//                               </Button>
//                               <Button 
//                                 size="sm" 
//                                 className="bg-primary"
//                                 onClick={() => handleSelectFreelancer(app)}
//                               >
//                                 <ShieldCheck className="w-4 h-4 mr-2" />
//                                 Select
//                               </Button>
//                             </div>
//                           )}
//                           {app.status !== 'Pending' && (
//                             <Badge className={`h-8 px-4 ${app.status === 'Selected' ? 'bg-green-500' : 'bg-muted'}`}>
//                               {app.status}
//                             </Badge>
//                           )}
//                         </div>
//                       </motion.div>
//                     ))}
//                   </AnimatePresence>
//                 </CardContent>
//               </Card>
//             )}

//             {localJobState.status === "Active" && (
//               <Card className="border-primary/20 bg-primary/5">
//                 <CardHeader>
//                   <CardTitle className="text-lg flex items-center gap-2">
//                     <Rocket className="w-5 h-5 text-primary" />
//                     Deliverable Submission
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-6">
//                   {isAssignedFreelancer ? (
//                     <div className="space-y-4">
//                       <div className="space-y-2">
//                         <Label htmlFor="deliverable">Submission Link (GitHub, URL, etc.)</Label>
//                         <Input 
//                           id="deliverable" 
//                           placeholder="https://..." 
//                           value={deliverableUrl}
//                           onChange={(e) => setDeliverableUrl(e.target.value)}
//                         />
//                         <p className="text-xs text-muted-foreground">AI will automatically crawl this link to verify against success criteria.</p>
//                       </div>
//                       <Button 
//                         onClick={handleSubmitDeliverable} 
//                         disabled={!deliverableUrl || verifying}
//                         className="w-full bg-primary py-6 text-lg font-bold"
//                       >
//                         {verifying ? "Triggering AI Node..." : "Submit for Verification"}
//                       </Button>
//                     </div>
//                   ) : (
//                     <div className="p-12 text-center text-muted-foreground border-2 border-dashed border-border rounded-xl">
//                       <ShieldCheck className="w-12 h-12 mx-auto mb-4 opacity-20" />
//                       <p className="font-medium">
//                         {isClient 
//                           ? "Contract is Active. Awaiting deliverable from the assigned freelancer." 
//                           : "You are not assigned to this job."}
//                       </p>
//                     </div>
//                   )}
//                 </CardContent>
//               </Card>
//             )}

//             <Card>
//               <CardHeader className="border-b border-border">
//                 <CardTitle className="text-lg flex items-center gap-2">
//                   <MessageSquare className="w-5 h-5 text-primary" />
//                   Project Log
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="p-6">
//                 <div className="space-y-4">
//                   <div className="flex gap-4 items-start">
//                     <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
//                       <Clock className="w-4 h-4 text-primary" />
//                     </div>
//                     <div>
//                       <p className="text-sm font-bold">Contract Initialized</p>
//                       <p className="text-xs text-muted-foreground">{new Date(localJobState.createdAt).toLocaleString()}</p>
//                     </div>
//                   </div>
//                   {localJobState.status === 'Active' && (
//                     <div className="flex gap-4 items-start">
//                       <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
//                         <CheckCircle2 className="w-4 h-4 text-green-500" />
//                       </div>
//                       <div>
//                         <p className="text-sm font-bold">Freelancer Assigned</p>
//                         <p className="text-xs text-muted-foreground">Escrow funds locked by protocol.</p>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </CardContent>
//             </Card>
//           </div>

//           <div className="space-y-6">
//             <Card>
//               <CardHeader>
//                 <CardTitle className="text-lg">Contract Details</CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div className="flex justify-between items-center py-2 border-b border-border">
//                   <span className="text-muted-foreground text-sm">Escrow Amount</span>
//                   <span className="font-bold text-lg">{localJobState.budget} GEN</span>
//                 </div>
//                 <div className="flex justify-between items-center py-2 border-b border-border">
//                   <span className="text-muted-foreground text-sm">Deadline</span>
//                   <span className="font-bold text-sm">{localJobState.deadline}</span>
//                 </div>
//                 <div className="flex justify-between items-center py-2">
//                   <span className="text-muted-foreground text-sm">Protocol Fee</span>
//                   <span className="font-bold text-sm text-primary">5%</span>
//                 </div>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader>
//                 <CardTitle className="text-lg">Success Criteria</CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 {successCriteria.map((c, i) => (
//                   <div key={i} className="flex gap-3 items-start group">
//                     <div className="w-5 h-5 rounded border border-primary/50 flex items-center justify-center mt-0.5 group-hover:bg-primary/10">
//                       <CheckCircle2 className="w-3.5 h-3.5 text-primary opacity-20" />
//                     </div>
//                     <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">{c}</span>
//                   </div>
//                 ))}
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
