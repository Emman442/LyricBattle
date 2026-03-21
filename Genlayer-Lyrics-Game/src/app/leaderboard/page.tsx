"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { Trophy, ArrowLeft, Crown, Flame, Star } from "lucide-react";

const LEADERBOARD_DATA = [
  { name: "Chidera", xp: 145200, level: 42, winRate: "78%", badge: "Legend", color: "bg-blue-500" },
  { name: "LyricPro", xp: 132400, level: 38, winRate: "65%", badge: "Elite", color: "bg-orange-500" },
  { name: "VibeCheck", xp: 128900, level: 37, winRate: "72%", badge: "Elite", color: "bg-green-500" },
  { name: "AfroKing_99", xp: 115000, level: 34, winRate: "60%", badge: "Pro", color: "bg-primary" },
  { name: "StreetGenius", xp: 98400, level: 29, winRate: "82%", badge: "Street Pro", color: "bg-yellow-600" },
  { name: "Rhythm_Rider", xp: 87000, level: 25, winRate: "55%", badge: "Rising", color: "bg-pink-500" },
  { name: "MicDrop", xp: 76500, level: 22, winRate: "48%", badge: "Rising", color: "bg-indigo-500" },
  { name: "Popsicle", xp: 62000, level: 18, winRate: "42%", badge: "Newbie", color: "bg-cyan-500" },
];

export default function GlobalLeaderboardPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#080808] text-white p-6 lg:p-8 font-body">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-muted-foreground hover:text-white p-0 h-auto gap-2"
            onClick={() => router.back()}
          >
            <ArrowLeft size={16} /> Back
          </Button>
          <div className="text-center space-y-1">
            <h1 className="text-3xl font-headline font-bold tracking-tight flex items-center justify-center gap-3">
              <Trophy className="text-yellow-500" size={28} />
              Global Hall of Fame
            </h1>
            <p className="text-[10px] text-muted-foreground uppercase tracking-[0.3em]">Top lyricists worldwide</p>
          </div>
          <div className="w-16" /> {/* Spacer */}
        </header>

        {/* Podium / Top 3 */}
        <div className="grid grid-cols-3 gap-3 pt-4">
          {/* #2 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col items-center justify-end space-y-3 pb-4"
          >
            <Avatar className="h-16 w-16 border-2 border-slate-400 bg-orange-500">
              <AvatarFallback className="text-xl font-bold">LP</AvatarFallback>
            </Avatar>
            <div className="text-center">
              <p className="text-xs font-bold truncate max-w-[80px]">LyricPro</p>
              <p className="text-[9px] text-slate-400">132.4k XP</p>
            </div>
            <div className="bg-slate-400/20 w-full h-16 rounded-t-xl border-x border-t border-slate-400/30 flex items-center justify-center">
              <span className="text-2xl font-bold text-slate-400">2</span>
            </div>
          </motion.div>

          {/* #1 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-end space-y-3"
          >
            <div className="relative">
              <Crown className="absolute -top-6 left-1/2 -translate-x-1/2 text-yellow-500" size={24} />
              <Avatar className="h-20 w-20 border-4 border-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.3)] bg-blue-500">
                <AvatarFallback className="text-2xl font-bold">CH</AvatarFallback>
              </Avatar>
            </div>
            <div className="text-center">
              <p className="text-sm font-black truncate max-w-[100px]">Chidera</p>
              <p className="text-[10px] text-yellow-500 font-bold">145.2k XP</p>
            </div>
            <div className="bg-yellow-500/20 w-full h-24 rounded-t-xl border-x border-t border-yellow-500/30 flex items-center justify-center">
              <span className="text-4xl font-black text-yellow-500">1</span>
            </div>
          </motion.div>

          {/* #3 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center justify-end space-y-3 pb-2"
          >
            <Avatar className="h-14 w-14 border-2 border-amber-700 bg-green-500">
              <AvatarFallback className="text-lg font-bold">VC</AvatarFallback>
            </Avatar>
            <div className="text-center">
              <p className="text-xs font-bold truncate max-w-[80px]">VibeCheck</p>
              <p className="text-[9px] text-amber-700">128.9k XP</p>
            </div>
            <div className="bg-amber-700/20 w-full h-12 rounded-t-xl border-x border-t border-amber-700/30 flex items-center justify-center">
              <span className="text-xl font-bold text-amber-700">3</span>
            </div>
          </motion.div>
        </div>

        {/* List of other players */}
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
          <div className="p-3 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
             <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Rankings</p>
             <div className="flex gap-4">
               <span className="text-[9px] text-muted-foreground uppercase">Win Rate</span>
               <span className="text-[9px] text-muted-foreground uppercase">Total XP</span>
             </div>
          </div>
          <div className="divide-y divide-white/5">
            {LEADERBOARD_DATA.slice(3).map((player, idx) => (
              <motion.div 
                key={player.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="flex items-center justify-between p-3.5 hover:bg-white/[0.03] transition-colors"
              >
                <div className="flex items-center gap-4">
                  <span className="text-xs font-bold text-white/20 w-4">{idx + 4}</span>
                  <Avatar className={`h-8 w-8 ${player.color}`}>
                    <AvatarFallback className="text-[10px] font-bold text-white">{player.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold">{player.name}</p>
                      <Badge variant="outline" className="h-4 px-1.5 text-[8px] font-bold uppercase border-white/10 bg-white/5 text-muted-foreground">
                        LVL {player.level}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                       <span className="text-[9px] text-primary flex items-center gap-0.5">
                         <Star size={8} fill="currentColor" /> {player.badge}
                       </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-green-500 flex items-center gap-1">
                      <Flame size={10} /> {player.winRate}
                    </p>
                  </div>
                  <div className="text-right w-20">
                    <p className="text-xs font-bold">{player.xp.toLocaleString()}</p>
                    <p className="text-[8px] text-muted-foreground uppercase tracking-tighter">XP Points</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <footer className="text-center pt-4">
           <p className="text-[10px] text-muted-foreground">Leaderboard resets every Monday at 00:00 GMT</p>
        </footer>
      </div>
    </div>
  );
}
