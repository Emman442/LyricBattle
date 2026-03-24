
"use client";

import Navbar from "@/components/layout/Navbar";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, Star, TrendingUp, Medal } from "lucide-react";

const mockLeaders = [
  { id: 1, name: "cryptodev.eth", earnings: "45,200 GEN", jobs: 124, rating: 4.9, avatar: "seed1" },
  { id: 2, name: "pixel_master", earnings: "38,500 GEN", jobs: 89, rating: 5.0, avatar: "seed2" },
  { id: 3, name: "writer_pro", earnings: "22,100 GEN", jobs: 156, rating: 4.8, avatar: "seed3" },
  { id: 4, name: "solidity_guru", earnings: "19,800 GEN", jobs: 42, rating: 4.9, avatar: "seed4" },
  { id: 5, name: "design_queen", earnings: "15,400 GEN", jobs: 67, rating: 4.7, avatar: "seed5" },
];

export default function LeaderboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-32 pb-20">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 border-primary/50 text-primary px-4 py-1">
            Global Rankings
          </Badge>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Elite <span className="gradient-text">Freelancers</span></h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            The top performers on VeriFree, ranked by total earnings and verified delivery success rate.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {mockLeaders.slice(0, 3).map((leader, i) => (
            <motion.div
              key={leader.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className={`relative overflow-hidden border-2 ${i === 0 ? 'border-primary' : 'border-border'}`}>
                {i === 0 && (
                  <div className="absolute top-0 right-0 p-4">
                    <Trophy className="w-8 h-8 text-primary" />
                  </div>
                )}
                <CardContent className="pt-10 pb-8 text-center">
                  <Avatar className="w-24 h-24 mx-auto mb-6 border-4 border-background shadow-xl">
                    <AvatarImage src={`https://picsum.photos/seed/${leader.avatar}/200/200`} />
                    <AvatarFallback>{leader.name[0]}</AvatarFallback>
                  </Avatar>
                  <h3 className="text-xl font-bold mb-1">{leader.name}</h3>
                  <p className="text-primary font-black text-2xl mb-4">{leader.earnings}</p>
                  <div className="flex justify-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Medal className="w-4 h-4" />
                      {leader.jobs} Jobs
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      {leader.rating}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Rising Stars
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="border-b border-border bg-muted/30">
                  <tr className="text-xs uppercase tracking-widest font-bold text-muted-foreground">
                    <th className="px-6 py-4">Rank</th>
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4 text-right">Total Earned</th>
                    <th className="px-6 py-4 text-right">Success Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {mockLeaders.map((leader, i) => (
                    <tr key={leader.id} className="hover:bg-accent/30 transition-colors">
                      <td className="px-6 py-4 font-bold text-muted-foreground">#{i + 1}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={`https://picsum.photos/seed/${leader.avatar}/100/100`} />
                            <AvatarFallback>{leader.name[0]}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{leader.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-primary">{leader.earnings}</td>
                      <td className="px-6 py-4 text-right">
                        <Badge variant="secondary" className="bg-green-500/10 text-green-500 border-none">
                          {leader.rating * 20}% Success
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
