
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Users, Trophy, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const TICKER_ITEMS = [
  "Lagos room just started 🔥",
  "HipHop battle ending in 2mins ⚡",
  "Amapiano kings are vibing in Room 402 🪘",
  "Drill battle starting soon... 🔪",
  "Someone just scored a perfect 10.0! 🏆",
];

export default function PlayEntryPage() {
  const [username, setUsername] = useState("");
  const [tickerIndex, setTickerIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % TICKER_ITEMS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-8 bg-[#080808] relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary blur-[100px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary blur-[100px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="z-10 w-full max-w-sm text-center space-y-6"
      >
        <div className="text-left mb-4">
          <Button asChild variant="ghost" size="sm" className="p-0 h-auto text-muted-foreground hover:text-white">
            <Link href="/">
              <ArrowLeft size={14} className="mr-1" /> Back to Home
            </Link>
          </Button>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-headline font-bold tracking-tighter text-white">
            Join the <span className="text-primary">Arena</span>
          </h1>
          <p className="text-xs text-muted-foreground">Pick a name to start battling</p>
        </div>

        <div className="space-y-4">
          <Input
            placeholder="Enter a username..."
            className="h-11 bg-white/5 border-white/10 text-center text-sm focus:ring-primary rounded-xl"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          
          <div className="grid grid-cols-1 gap-2.5">
            <Button 
              asChild
              disabled={!username}
              className="h-11 text-sm font-bold bg-primary hover:bg-primary/90 rounded-xl group shadow-lg"
            >
              <Link href={`/host?u=${username}`}>
                <Plus className="mr-2 group-hover:scale-110 transition-transform w-4 h-4" />
                Host a Game
              </Link>
            </Button>
            
            <Button 
              asChild
              variant="outline"
              disabled={!username}
              className="h-11 text-sm font-bold border-white/10 bg-white/5 hover:bg-white/10 rounded-xl group"
            >
              <Link href={`/join?u=${username}`}>
                <Users className="mr-2 group-hover:scale-110 transition-transform w-4 h-4" />
                Join a Game
              </Link>
            </Button>

            <div className="pt-2">
              <Button 
                asChild
                variant="ghost"
                className="h-9 text-[11px] font-bold text-muted-foreground hover:text-white uppercase tracking-widest gap-2"
              >
                <Link href="/leaderboard">
                  <Trophy size={14} className="text-yellow-500" />
                  Global Leaderboard
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="pt-6 overflow-hidden h-5">
          <AnimatePresence mode="wait">
            <motion.p
              key={tickerIndex}
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -15, opacity: 0 }}
              className="text-muted-foreground font-medium uppercase tracking-[0.2em] text-[9px]"
            >
              {TICKER_ITEMS[tickerIndex]}
            </motion.p>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
