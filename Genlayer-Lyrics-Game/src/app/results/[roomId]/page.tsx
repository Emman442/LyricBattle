"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { Trophy, ArrowRight, Twitter } from "lucide-react";

export default function RoundResultsPage() {
  const { roomId } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const username = searchParams.get("u") || "Guest";
  const round = parseInt(searchParams.get("round") || "1");

  const [countDown, setCountDown] = useState(5);

  useEffect(() => {
    if (countDown > 0) {
      const timer = setTimeout(() => setCountDown(countDown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
        if (round < 5) {
            router.push(`/game/${roomId}?u=${username}&round=${round + 1}`);
        } else {
            router.push(`/final-results/${roomId}?u=${username}`);
        }
    }
  }, [countDown]);

  const leaderboard = [
    { name: "Chidera", score: 2850, change: "+950", avatar: "CH", color: "bg-blue-500" },
    { name: username, score: 2420, change: "+820", avatar: username[0], color: "bg-pink-500" },
    { name: "LyricPro", score: 1100, change: "+100", avatar: "LP", color: "bg-orange-500" },
  ].sort((a, b) => b.score - a.score);

  return (
    <div className="min-h-screen bg-[#080808] text-white flex flex-col items-center justify-center p-6 space-y-10">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center space-y-4"
      >
        <div className="relative inline-block">
          <Trophy size={60} className="text-yellow-500 mx-auto" />
          <motion.div 
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="absolute -top-2 -right-2 bg-primary rounded-full p-1.5"
          >
             <span className="text-[9px] font-bold">ROUND {round} WINNER</span>
          </motion.div>
        </div>
        <h1 className="text-3xl font-headline font-bold tracking-tight">
          Chidera <span className="text-white/50 text-xl font-medium">took this round!</span>
        </h1>
      </motion.div>

      <div className="w-full max-w-lg space-y-4">
        <h2 className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] text-center">Leaderboard</h2>
        <div className="space-y-2">
          {leaderboard.map((player, idx) => (
            <motion.div
              key={player.name}
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: idx * 0.1 }}
              className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                player.name === username ? "bg-white/10 border-primary/50" : "bg-white/5 border-white/5"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg font-headline font-bold text-white/10 w-6">{idx + 1}</span>
                <Avatar className={`h-10 w-10 ${player.color}`}>
                  <AvatarFallback className="text-white font-bold text-sm">{player.avatar}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-bold text-sm">{player.name}</p>
                  <p className="text-[10px] text-green-500 font-bold">{player.change} XP</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xl font-headline font-bold">{player.score.toLocaleString()}</p>
                <p className="text-[8px] text-muted-foreground uppercase tracking-widest">Total XP</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="flex flex-col items-center gap-4">
        <div className="bg-white/5 p-4 rounded-2xl border border-white/10 max-w-xs text-center space-y-3">
           <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest">Share this moment</p>
           <p className="text-xs font-medium italic text-white/80 leading-relaxed">"Time is of the essence..." - Chidera nailed it! 🏆</p>
           <Button variant="outline" size="sm" className="w-full border-white/10 bg-white/5 rounded-lg gap-2 text-xs h-9">
             <Twitter size={14} className="text-blue-400" /> Share to X
           </Button>
        </div>

        <div className="flex items-center gap-3">
          <p className="text-sm font-medium text-white/50">Next round in {countDown}s</p>
          <Button 
            size="sm"
            onClick={() => router.push(`/game/${roomId}?u=${username}&round=${round + 1}`)}
            className="bg-white text-black hover:bg-white/90 font-bold rounded-lg h-9"
          >
            Skip <ArrowRight className="ml-1.5 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
