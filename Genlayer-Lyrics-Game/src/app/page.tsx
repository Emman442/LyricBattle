
"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Flame, Music, Play, Trophy, Users, Zap, Star, Globe } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#080808] text-white selection:bg-primary selection:text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[#080808]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center font-headline font-bold text-white">L</div>
            <span className="text-xl font-headline font-bold tracking-tight">LyricBattle</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-widest text-muted-foreground">
            <Link href="#how-it-works" className="hover:text-primary transition-colors">How it works</Link>
            <Link href="/leaderboard" className="hover:text-primary transition-colors">Leaderboard</Link>
            <Link href="#tournaments" className="hover:text-primary transition-colors">Tournaments</Link>
          </div>
          <Button asChild size="sm" className="bg-primary hover:bg-primary/90 font-bold px-6">
            <Link href="/play">Play Now</Link>
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full opacity-20 pointer-events-none">
          <div className="absolute top-20 right-0 w-96 h-96 bg-primary/40 blur-[120px] rounded-full" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/30 blur-[120px] rounded-full" />
        </div>

        <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="outline" className="h-8 px-4 text-[10px] font-bold uppercase tracking-widest border-primary/20 text-primary bg-primary/5 mb-6">
              <Zap size={12} className="mr-2 fill-primary" /> The Ultimate Lyric Showdown
            </Badge>
            <h1 className="text-5xl md:text-7xl font-headline font-black tracking-tighter leading-[0.9] mb-6">
              YOUR VOICE, <br />
              <span className="text-primary italic">THEIR WORDS,</span> <br />
              PURE GLORY.
            </h1>
            <p className="text-sm md:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
              The world's first AI-powered multiplayer lyric game. Battle friends in real-time, guess the bars, and let our AI judge your soul.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Button asChild size="lg" className="h-14 px-10 text-base font-bold bg-white text-black hover:bg-white/90 rounded-2xl shadow-2xl">
              <Link href="/play">
                <Play className="mr-2 fill-black" size={18} /> Start Battling
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-14 px-10 text-base font-bold border-white/10 bg-white/5 hover:bg-white/10 rounded-2xl">
              <Link href="/leaderboard">
                <Trophy className="mr-2 text-yellow-500" size={18} /> Hall of Fame
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Stats Ticker */}
      <div className="bg-white/5 border-y border-white/5 py-4 overflow-hidden whitespace-nowrap">
        <div className="flex gap-12 animate-marquee inline-block">
          {[1,2,3,4,5].map((i) => (
            <div key={i} className="flex items-center gap-12">
               <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/40">1.2M GUESSES JUDGED</span>
               <span className="text-primary">✦</span>
               <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/40">50K DAILY PLAYERS</span>
               <span className="text-primary">✦</span>
               <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/40">STREET MODE ACTIVE</span>
               <span className="text-primary">✦</span>
            </div>
          ))}
        </div>
      </div>

      {/* Features Grid */}
      <section id="how-it-works" className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl font-headline font-bold">How to Play</h2>
          <p className="text-sm text-muted-foreground">Three steps to lyrical immortality</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { 
              title: "Join the Arena", 
              desc: "Create a room or join a global battle. Pick your genre: Afrobeats, Hip-Hop, Pop, or Drill.",
              icon: <Users className="text-blue-500" size={32} />
            },
            { 
              title: "Fill the Gap", 
              desc: "Listen to the track. When the lyrics stop, you have 30 seconds to type the missing bar.",
              icon: <Music className="text-primary" size={32} />
            },
            { 
              title: "AI Judgement", 
              desc: "Our AI evaluates your accuracy, accounting for slang and vibe in 'Street Mode'.",
              icon: <Zap className="text-yellow-500" size={32} />
            }
          ].map((f, i) => (
            <div key={i} className="bg-white/5 border border-white/10 p-8 rounded-3xl hover:border-primary/50 transition-all group">
              <div className="mb-6 p-4 bg-white/5 w-fit rounded-2xl group-hover:scale-110 transition-transform">
                {f.icon}
              </div>
              <h3 className="text-xl font-bold mb-4">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Winners */}
      <section className="py-20 px-6 bg-primary/5">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 items-center">
          <div className="flex-1 space-y-6">
             <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20 uppercase text-[10px] font-bold tracking-widest px-4 h-7">Weekly Champions</Badge>
             <h2 className="text-4xl font-headline font-bold tracking-tight">Recent Legend: Chidera</h2>
             <p className="text-sm text-muted-foreground leading-relaxed">
               Winning 42 rounds in a row across the Afrobeats genre, Chidera currently sits at the top of the Global Leaderboard with a staggering 145k XP.
             </p>
             <div className="flex gap-4 pt-4">
                <div className="text-center">
                  <p className="text-2xl font-black text-white">78%</p>
                  <p className="text-[10px] uppercase font-bold text-muted-foreground">Win Rate</p>
                </div>
                <div className="w-px h-10 bg-white/10" />
                <div className="text-center">
                  <p className="text-2xl font-black text-white">10.0</p>
                  <p className="text-[10px] uppercase font-bold text-muted-foreground">Best Score</p>
                </div>
             </div>
             <Button asChild variant="link" className="text-primary p-0 h-auto font-bold text-sm">
                <Link href="/leaderboard">View Full Leaderboard <ArrowRight className="ml-2 w-4 h-4" /></Link>
             </Button>
          </div>
          <div className="flex-1 w-full max-w-md relative">
             <div className="absolute -inset-4 bg-primary/20 blur-3xl rounded-full" />
             <div className="relative bg-[#080808] border border-white/10 p-6 rounded-[2.5rem] shadow-2xl rotate-2">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center font-bold">CH</div>
                  <div>
                    <h4 className="font-bold text-sm">Chidera</h4>
                    <p className="text-[10px] text-muted-foreground uppercase">Afrobeats King</p>
                  </div>
                  <Badge className="ml-auto bg-primary text-[10px] font-bold">LEGEND</Badge>
                </div>
                <div className="space-y-3">
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-[95%]" />
                  </div>
                  <div className="flex justify-between text-[10px] font-bold text-muted-foreground">
                    <span>LYRIC ACCURACY</span>
                    <span className="text-white">95%</span>
                  </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Tournament Card Placeholder */}
      <section id="tournaments" className="py-20 px-6 max-w-7xl mx-auto">
        <div className="bg-gradient-to-br from-primary/20 to-secondary/20 border border-white/10 rounded-[3rem] p-12 text-center space-y-8 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-8 opacity-10">
              <Trophy size={200} />
           </div>
           <div className="relative z-10 space-y-4">
             <h3 className="text-4xl font-headline font-black">STREET BATTLE 2024</h3>
             <p className="text-sm text-white/70 max-w-md mx-auto italic">
               The first official tournament is coming this summer. Register now to be notified when the bracket opens.
             </p>
             <div className="pt-6">
                <Button className="bg-white text-black hover:bg-white/90 font-bold px-10 h-12 rounded-xl">Notify Me</Button>
             </div>
           </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-16 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-4 col-span-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-primary rounded flex items-center justify-center font-headline font-bold text-white text-[10px]">L</div>
              <span className="text-lg font-headline font-bold tracking-tight">LyricBattle</span>
            </div>
            <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">
              Real-time competitive lyric guessing game powered by advanced AI scoring. Join the community and test your musical knowledge.
            </p>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/40">Product</h4>
            <ul className="text-xs space-y-3 font-medium">
              <li><Link href="/play" className="hover:text-primary transition-colors">Play Now</Link></li>
              <li><Link href="/leaderboard" className="hover:text-primary transition-colors">Leaderboard</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Genres</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/40">Community</h4>
            <ul className="text-xs space-y-3 font-medium">
              <li><Link href="#" className="hover:text-primary transition-colors">Discord</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Twitter (X)</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Instagram</Link></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest">© 2024 LyricBattle. All rights reserved.</p>
          <div className="flex items-center gap-2">
             <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Powered by</span>
             <Badge variant="outline" className="border-primary/20 text-primary bg-primary/5 font-black text-[10px] px-3 h-6">GENLAYER</Badge>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Helper icons
function ArrowRight(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
  )
}
