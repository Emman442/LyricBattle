
"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Hash } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function JoinRoomPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const username = searchParams.get("u") || "Guest";
  const [roomCode, setRoomCode] = useState("");

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomCode.trim()) {
      router.push(`/lobby/${roomCode.toUpperCase()}?u=${username}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#080808] flex flex-col items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm space-y-8"
      >
        <header className="space-y-2 text-center">
          <Button asChild variant="ghost" size="sm" className="mb-4 text-muted-foreground">
            <Link href={`/play?u=${username}`}>
              <ArrowLeft size={16} className="mr-2" /> Back
            </Link>
          </Button>
          <h1 className="text-3xl font-headline font-bold text-white">Enter Room Code</h1>
          <p className="text-sm text-muted-foreground">Ask the host for the 6-character code</p>
        </header>

        <form onSubmit={handleJoin} className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="code" className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
              Room ID
            </Label>
            <div className="relative">
              <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={18} />
              <Input
                id="code"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.slice(0, 6))}
                placeholder="E.G. AB12XY"
                className="h-14 bg-white/5 border-white/10 pl-12 text-2xl font-headline font-black tracking-[0.2em] uppercase focus:border-primary"
              />
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={roomCode.length < 4}
            className="w-full h-12 bg-primary hover:bg-primary/90 text-sm font-bold rounded-xl shadow-lg"
          >
            Join Battle
          </Button>
        </form>

        <div className="text-center">
          <p className="text-[10px] text-muted-foreground">
            By joining, you agree to battle with honor. 🎤
          </p>
        </div>
      </motion.div>
    </div>
  );
}
