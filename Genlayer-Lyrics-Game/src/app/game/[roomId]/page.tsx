"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Music, Send, Trophy } from "lucide-react";
import { aiLyricScoring } from "@/ai/flows/ai-lyric-scoring";
import { MOCK_LYRICS } from "@/lib/game-data";

export default function GamePlayPage() {
  const { roomId } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const username = searchParams.get("u") || "Guest";
  const genreId = searchParams.get("genre") || "pop";

  const [round, setRound] = useState(1);
  const [timeLeft, setTimeLeft] = useState(30);
  const [guess, setGuess] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [feedback, setFeedback] = useState("");

  const currentSong = MOCK_LYRICS.find(s => s.genre === genreId) || MOCK_LYRICS[0];
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (timeLeft > 0 && !revealed) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !revealed) {
      handleReveal();
    }
  }, [timeLeft, revealed]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (isSubmitted || !guess.trim()) return;
    setIsSubmitted(true);
    
    try {
      const result = await aiLyricScoring({
        correctLyricLine: currentSong.answer,
        playerGuess: guess,
        genre: genreId,
        isStreetModeActive: true
      });
      setScore(result.aiScore);
      setFeedback(result.feedback || "");
    } catch (err) {
      console.error(err);
      setScore(5.0);
    }
  };

  const handleReveal = () => {
    setRevealed(true);
    if (!isSubmitted) handleSubmit();
    
    setTimeout(() => {
        router.push(`/results/${roomId}?u=${username}&round=${round}`);
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-[#080808] flex flex-col font-body text-white p-6 lg:p-8">
      {/* Top Bar */}
      <header className="max-w-5xl mx-auto w-full flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="h-8 px-3 text-xs font-bold border-white/10 bg-white/5">
            Round {round}/5
          </Badge>
          <Badge variant="outline" className="h-8 px-3 text-xs font-bold border-primary/20 text-primary uppercase">
            {genreId}
          </Badge>
        </div>

        <div className="relative flex items-center justify-center">
          <div className={`w-14 h-14 rounded-full border-2 flex items-center justify-center text-lg font-headline font-bold ${
            timeLeft <= 10 ? "border-primary animate-pulse-timer text-primary" : "border-white/10 text-white"
          }`}>
            {timeLeft}
          </div>
          <svg className="absolute w-14 h-14 -rotate-90 pointer-events-none">
            <circle
              cx="28" cy="28" r="26"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray="163.3"
              strokeDashoffset={163.3 - (163.3 * timeLeft) / 30}
              className={`transition-all duration-1000 ${timeLeft <= 10 ? "text-primary" : "text-white/20"}`}
            />
          </svg>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-[8px] text-muted-foreground uppercase tracking-widest">XP Reward</p>
            <p className="text-sm font-bold text-white flex items-center gap-1 justify-end">
              <Trophy size={12} className="text-yellow-500" /> 1.2k
            </p>
          </div>
        </div>
      </header>

      {/* Main Gameplay Area */}
      <main className="max-w-3xl mx-auto w-full flex-1 flex flex-col items-center justify-center space-y-8">
        <AnimatePresence mode="wait">
          {!revealed ? (
            <motion.div 
              key="playing"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="w-full space-y-6 text-center"
            >
              <div className="space-y-1">
                <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em]">Now Playing</p>
                <h2 className="text-2xl lg:text-3xl font-headline font-bold tracking-tight">
                  {currentSong.title} — <span className="text-white/40">{currentSong.artist}</span>
                </h2>
              </div>

              <div className="bg-white/5 border border-white/10 p-8 lg:p-12 rounded-[1.5rem] relative overflow-hidden group shadow-xl">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-primary" />
                <p className="text-xl lg:text-2xl font-medium leading-relaxed">
                  "{currentSong.snippet}{" "}"
                  <span className="text-primary italic">
                    {guess ? guess : "________________"}
                  </span>
                </p>
                <div className="absolute top-2 right-2 opacity-5 group-hover:opacity-10 transition-opacity">
                   <Music size={80} />
                </div>
              </div>

              <form onSubmit={handleSubmit} className="w-full max-w-xl mx-auto space-y-3">
                 <div className="relative group">
                    <Input 
                      ref={inputRef}
                      autoFocus
                      disabled={isSubmitted}
                      placeholder="Next line..."
                      value={guess}
                      onChange={(e) => setGuess(e.target.value)}
                      className="h-14 bg-white/5 border border-white/10 rounded-xl text-lg px-6 text-center focus:border-primary focus:ring-0 transition-all placeholder:text-white/10"
                    />
                    <Button 
                      type="submit"
                      disabled={isSubmitted || !guess.trim()}
                      className={`absolute right-1.5 top-1.5 h-11 w-11 rounded-lg shadow-md transition-all ${
                        isSubmitted ? "bg-green-500" : "bg-primary"
                      }`}
                    >
                      {isSubmitted ? "✓" : <Send size={18} />}
                    </Button>
                 </div>
                 <div className="flex items-center justify-center gap-3">
                    <Badge variant="secondary" className="bg-white/10 text-white flex items-center gap-1 h-6 text-[9px]">
                       <Flame size={10} className="text-orange-500" /> Street Mode
                    </Badge>
                    <p className="text-[10px] text-muted-foreground">Pidgin/Slang accepted 🤙</p>
                 </div>
              </form>
            </motion.div>
          ) : (
            <motion.div 
              key="revealing"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full text-center space-y-8"
            >
               <h2 className="text-4xl lg:text-5xl font-headline font-bold text-primary">Reveal!</h2>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-3xl mx-auto">
                 <div className="bg-white/5 border border-green-500/30 p-5 rounded-2xl space-y-2">
                   <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Correct</p>
                   <p className="text-xl font-bold text-white leading-tight">"{currentSong.answer}"</p>
                 </div>

                 <div className={`bg-white/5 border p-5 rounded-2xl space-y-2 relative ${
                   (score || 0) >= 8 ? "border-primary/40" : "border-white/10"
                 }`}>
                   <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Your Guess</p>
                   <p className="text-xl font-bold text-white leading-tight">"{guess || "---"}"</p>
                   <div className="flex justify-center pt-2">
                     <Badge className="h-7 px-4 text-xs font-bold bg-primary text-white rounded-full">
                       AI: {score?.toFixed(1) || "0.0"}/10
                     </Badge>
                   </div>
                   {feedback && <p className="text-[10px] text-primary/80 font-medium italic mt-1 leading-tight">"{feedback}"</p>}
                 </div>
               </div>

               <div className="pt-4">
                  <p className="text-sm font-medium animate-pulse text-white/40">Next round in 5...</p>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Side Feed (Desktop) - Adjusted sizing */}
      <aside className="fixed right-6 top-1/2 -translate-y-1/2 w-48 space-y-3 hidden xl:block">
        <h3 className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest px-2">Live Status</h3>
        <div className="space-y-1.5">
          {["Chidera", "LyricPro", "Guest_99"].map((p) => (
            <div key={p} className="flex items-center justify-between p-2.5 bg-white/5 border border-white/10 rounded-lg">
               <span className="text-xs font-medium">{p}</span>
               {p === "Chidera" ? (
                 <span className="text-[8px] font-bold text-green-500 flex items-center gap-1">
                   DONE
                 </span>
               ) : (
                 <span className="text-[8px] font-bold text-white/20">TYPING</span>
               )}
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}
