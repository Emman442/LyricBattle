"use client";

import { useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, MessageCircle, Play, QrCode, Send, Users, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Player {
  id: string;
  name: string;
  ready: boolean;
  color: string;
}

export default function LobbyPage() {
  const { roomId } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  
  const username = searchParams.get("u") || "Guest";
  const isHost = searchParams.get("host") === "true";
  const genreId = searchParams.get("genre") || "pop";

  const [players, setPlayers] = useState<Player[]>([
    { id: "1", name: username, ready: false, color: "bg-pink-500" },
    { id: "2", name: "Chidera", ready: true, color: "bg-blue-500" },
    { id: "3", name: "LyricPro", ready: false, color: "bg-orange-500" },
  ]);

  const [messages, setMessages] = useState([
    { id: "1", user: "Chidera", text: "Ready to dominate! 🎤", time: "12:00" },
    { id: "2", user: "LyricPro", text: "Drill music? Let's goooo", time: "12:01" },
  ]);
  const [chatInput, setChatInput] = useState("");

  const copyCode = () => {
    navigator.clipboard.writeText(roomId as string);
    toast({ title: "Copied!", description: "Room code copied to clipboard." });
  };

  const toggleReady = () => {
    setPlayers(players.map(p => p.name === username ? { ...p, ready: !p.ready } : p));
  };

  const startGame = () => {
    router.push(`/game/${roomId}?u=${username}&genre=${genreId}`);
  };

  const sendMessage = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!chatInput.trim()) return;
    setMessages([...messages, { id: Date.now().toString(), user: username, text: chatInput, time: "Now" }]);
    setChatInput("");
  };

  const readyCount = players.filter(p => p.ready).length;

  return (
    <div className="flex h-screen bg-[#080808] overflow-hidden">
      {/* Left Column: Lobby Info & Players */}
      <div className="flex-1 flex flex-col p-6 lg:p-8 space-y-6 overflow-y-auto">
        <header className="flex justify-between items-start">
          <div className="space-y-1.5">
            <h1 className="text-3xl font-headline font-bold text-white tracking-tighter">
              Lobby <span className="text-primary">#{roomId}</span>
            </h1>
            <div className="flex gap-1.5">
              <Badge variant="outline" className="border-primary/50 text-primary uppercase text-[10px] px-2 h-5">
                {genreId}
              </Badge>
              <Badge variant="outline" className="bg-white/5 border-white/10 text-white text-[10px] px-2 h-5">
                5 Rounds
              </Badge>
              <Badge variant="outline" className="bg-white/5 border-white/10 text-white text-[10px] px-2 h-5">
                30s
              </Badge>
            </div>
          </div>
          
          <div className="bg-white/5 border border-white/10 p-3 rounded-xl flex flex-col items-center gap-1">
            <span className="text-[9px] text-muted-foreground uppercase tracking-widest">Code</span>
            <div className="flex items-center gap-2">
              <span className="text-xl font-headline font-bold text-white">{roomId}</span>
              <Button size="icon" variant="ghost" className="h-6 w-6 text-muted-foreground hover:text-white" onClick={copyCode}>
                <Copy size={12} />
              </Button>
            </div>
          </div>
        </header>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Users size={16} className="text-primary" />
              Players ({players.length}/10)
            </h2>
            <p className="text-[10px] text-muted-foreground">
              {readyCount >= 2 ? "Ready to start!" : `Need ${2 - readyCount} more`}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <AnimatePresence>
              {players.map((player) => (
                <motion.div
                  key={player.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white/5 border border-white/10 p-3 rounded-lg flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2.5">
                    <Avatar className={`h-8 w-8 ${player.color} border border-white/10`}>
                      <AvatarFallback className="text-white text-xs font-bold">{player.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-white text-xs font-medium">{player.name} {player.name === username && "★"}</span>
                      <span className={`text-[9px] uppercase font-bold ${player.ready ? "text-green-500" : "text-yellow-500"}`}>
                        {player.ready ? "Ready" : "Waiting"}
                      </span>
                    </div>
                  </div>
                  {isHost && player.name !== username && (
                    <Button size="icon" variant="ghost" className="opacity-0 group-hover:opacity-100 h-6 w-6 text-destructive">
                      <X size={12} />
                    </Button>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        <div className="mt-auto pt-4 flex gap-3">
          <Button 
            onClick={toggleReady}
            variant={players.find(p => p.name === username)?.ready ? "outline" : "default"}
            className={`flex-1 h-12 text-base font-bold rounded-xl ${
              players.find(p => p.name === username)?.ready ? "border-white/20 text-white" : "bg-white text-black hover:bg-white/90"
            }`}
          >
            {players.find(p => p.name === username)?.ready ? "I'm Not Ready" : "I'm Ready!"}
          </Button>

          {isHost && (
            <Button 
              disabled={readyCount < 2}
              onClick={startGame}
              className="flex-1 h-12 text-base font-bold bg-primary hover:bg-primary/90 rounded-xl shadow-lg"
            >
              <Play className="mr-2 h-4 w-4" /> Start
            </Button>
          )}
        </div>
      </div>

      {/* Right Column: Hype Chat */}
      <aside className="w-[300px] border-l border-white/10 bg-white/[0.02] flex flex-col">
        <div className="p-4 border-b border-white/10 flex items-center gap-2">
          <MessageCircle size={16} className="text-primary" />
          <h2 className="text-sm font-bold text-white">Hype Chat</h2>
        </div>

        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-primary">{msg.user}</span>
                  <span className="text-[9px] text-muted-foreground">{msg.time}</span>
                </div>
                <p className="text-xs text-white/90 bg-white/5 p-2 rounded-lg rounded-tl-none border border-white/5">
                  {msg.text}
                </p>
              </div>
            ))}
          </div>
        </ScrollArea>

        <form onSubmit={sendMessage} className="p-4 border-t border-white/10">
          <div className="relative">
            <Input 
              placeholder="Send message..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="bg-white/5 border-white/10 pr-10 h-10 text-xs rounded-lg"
            />
            <Button 
              type="submit"
              size="icon" 
              variant="ghost" 
              className="absolute right-1 top-1/2 -translate-y-1/2 text-primary hover:bg-primary/10 h-8 w-8"
            >
              <Send size={14} />
            </Button>
          </div>
        </form>
      </aside>
    </div>
  );
}
