"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { GENRES, Genre } from "@/lib/game-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Check, Flame, Globe, Shield, Sparkles, Timer, Trophy } from "lucide-react";

export default function HostRoomPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const username = searchParams.get("u") || "Player";

  const [selectedGenre, setSelectedGenre] = useState<Genre>(GENRES[0]);
  const [roomName, setRoomName] = useState(`${username}'s Arena`);
  const [rounds, setRounds] = useState(5);
  const [timer, setTimer] = useState(30);
  const [isPublic, setIsPublic] = useState(true);
  const [isStreetMode, setIsStreetMode] = useState(false);

  const generateRoomCode = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    router.push(`/lobby/${code}?u=${username}&host=true&genre=${selectedGenre.id}`);
  };

  return (
    <div className="min-h-screen bg-[#080808] p-6 lg:p-8 font-body">
      <div className="max-w-5xl mx-auto space-y-8">
        <header className="flex justify-between items-center">
          <div className="space-y-1">
            <h1 className="text-3xl font-headline font-bold text-white">Create Room</h1>
            <p className="text-sm text-muted-foreground">Customize your music battleground</p>
          </div>
          <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={() => router.back()}>
            Cancel
          </Button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Form */}
          <div className="lg:col-span-2 space-y-8">
            <section className="space-y-3">
              <Label className="text-sm font-semibold text-white">Select Genre</Label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {GENRES.map((genre) => (
                  <motion.div
                    key={genre.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedGenre(genre)}
                    className={`relative cursor-pointer p-3 rounded-xl border transition-all duration-300 flex flex-col items-center justify-center gap-1.5 aspect-square text-center ${
                      selectedGenre.id === genre.id
                        ? "bg-white/10 border-white"
                        : "bg-white/5 border-transparent hover:bg-white/10"
                    }`}
                    style={{ borderColor: selectedGenre.id === genre.id ? genre.color : 'transparent' }}
                  >
                    <span className="text-3xl">{genre.icon}</span>
                    <span className="font-bold text-sm text-white">{genre.name}</span>
                    <span className="text-[9px] uppercase tracking-tighter text-muted-foreground">{genre.vibe}</span>
                    {selectedGenre.id === genre.id && (
                      <div className="absolute top-1.5 right-1.5 bg-white rounded-full p-0.5 text-black">
                        <Check size={10} />
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label className="text-sm text-white">Room Name</Label>
                <Input 
                  value={roomName} 
                  onChange={(e) => setRoomName(e.target.value)}
                  className="bg-white/5 border-white/10 h-10 text-sm" 
                />
              </div>
              
              <div className="space-y-3">
                <Label className="text-sm text-white">Rounds</Label>
                <div className="flex gap-2">
                  {[3, 5, 10].map((r) => (
                    <Button
                      key={r}
                      size="sm"
                      variant={rounds === r ? "default" : "outline"}
                      className={`flex-1 ${rounds === r ? "bg-primary" : "border-white/10"}`}
                      onClick={() => setRounds(r)}
                    >
                      {r}
                    </Button>
                  ))}
                </div>
              </div>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label className="text-sm text-white">Timer per Round</Label>
                <div className="flex gap-2">
                  {[15, 30, 45].map((t) => (
                    <Button
                      key={t}
                      size="sm"
                      variant={timer === t ? "default" : "outline"}
                      className={`flex-1 ${timer === t ? "bg-primary" : "border-white/10"}`}
                      onClick={() => setTimer(t)}
                    >
                      {t}s
                    </Button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col justify-end space-y-3">
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                  <div className="space-y-0.5">
                    <Label className="text-xs text-white flex items-center gap-1.5">
                      <Shield size={14} className="text-primary" /> Street Mode
                    </Label>
                    <p className="text-[10px] text-muted-foreground">Accept pidgin & slang</p>
                  </div>
                  <Switch className="scale-75" checked={isStreetMode} onCheckedChange={setIsStreetMode} />
                </div>
              </div>
            </section>

            <section className="flex gap-4">
              <div className="flex-1 flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                <div className="space-y-0.5">
                  <Label className="text-xs text-white">Room Visibility</Label>
                  <p className="text-[10px] text-muted-foreground">{isPublic ? "Anyone can join" : "Invite only"}</p>
                </div>
                <div className="flex gap-1.5">
                   <Button size="xs" variant={isPublic ? "default" : "outline"} className="h-7 px-3 text-[10px]" onClick={() => setIsPublic(true)}>Public</Button>
                   <Button size="xs" variant={!isPublic ? "default" : "outline"} className="h-7 px-3 text-[10px]" onClick={() => setIsPublic(false)}>Private</Button>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column: Preview Card */}
          <div className="space-y-6">
            <Label className="text-sm font-semibold text-white">Preview</Label>
            <Card className="bg-white/5 border-white/10 overflow-hidden rounded-2xl shadow-xl">
              <div 
                className="h-24 w-full relative"
                style={{ backgroundColor: selectedGenre.color + '20' }}
              >
                <div className="absolute inset-0 flex items-center justify-center text-4xl opacity-30">
                  {selectedGenre.icon}
                </div>
                <div className="absolute bottom-3 left-3">
                  <Badge variant="secondary" className="bg-white/10 text-white backdrop-blur-md text-[10px]">
                    {selectedGenre.name}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-4 space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-white truncate">{roomName}</h3>
                  <p className="text-muted-foreground text-[10px]">Hosted by {username}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Timer size={12} /> {timer}s
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Trophy size={12} /> {rounds} Rounds
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Globe size={12} /> {isPublic ? "Public" : "Private"}
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Flame size={12} /> {isStreetMode ? "Street" : "Standard"}
                  </div>
                </div>

                <Button 
                  onClick={generateRoomCode}
                  className="w-full h-11 bg-primary hover:bg-primary/90 text-sm font-bold rounded-xl shadow-lg"
                >
                  Create Arena
                </Button>
              </CardContent>
            </Card>

            <div className="p-3 bg-primary/5 border border-primary/20 rounded-xl space-y-1">
              <p className="text-[10px] text-primary font-bold flex items-center gap-1">
                <Sparkles size={10} /> PRO TIP
              </p>
              <p className="text-[10px] text-muted-foreground leading-tight">
                Rooms with "Street Mode" attract 40% more players from the local scene. 🤙
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
