"use client";

import Link from "next/link";
import { Shield, Bell, Menu, X, User } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import WalletConnect from "../genlayer/WalletConnect";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [connected, setConnected] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: "Job Verified", description: "Your submission for 'NFT Market' was approved.", time: "2m ago" },
    { id: 2, title: "New Job Posted", description: "A client posted a job matching your skills.", time: "1h ago" },
    { id: 3, title: "Payment Received", description: "450 GEN has been released to your wallet.", time: "3h ago" },
  ]);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "How it Works", href: "/#how-it-works" },
    { name: "For Freelancers", href: "/freelancers" },
    { name: "For Clients", href: "/clients" },
    { name: "Leaderboard", href: "/leaderboard" },
  ];

  if (!mounted) return null;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "glass-navbar py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <motion.div
            whileHover={{ rotate: 10 }}
            className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20"
          >
            <Shield className="w-5 h-5 text-primary-foreground" />
          </motion.div>
          <span className="text-xl font-bold tracking-tight text-foreground">
            VeriFree
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-primary transition-colors">
                <Bell className="w-5 h-5" />
                {notifications.length > 0 && (
                  <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full border-2 border-background"></span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end" sideOffset={8}>
              <div className="p-4 border-b border-border flex items-center justify-between">
                <h4 className="font-bold text-sm uppercase tracking-wider">Notifications</h4>
                <Badge variant="secondary" className="bg-primary/10 text-primary border-none text-[10px]">
                  {notifications.length} New
                </Badge>
              </div>
              <div className="max-h-[300px] overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((n) => (
                    <div key={n.id} className="p-4 border-b border-border last:border-0 hover:bg-accent/30 transition-colors cursor-default">
                      <p className="text-sm font-bold">{n.title}</p>
                      <p className="text-xs text-muted-foreground mb-1 leading-relaxed">{n.description}</p>
                      <p className="text-[10px] text-primary/70 font-medium">{n.time}</p>
                    </div>
                  ))
                ) : (
                  <div className="p-10 text-center text-muted-foreground">
                    <Bell className="w-8 h-8 mx-auto mb-3 opacity-20" />
                    <p className="text-sm">No new notifications</p>
                  </div>
                )}
              </div>
              {notifications.length > 0 && (
                <div className="p-2 text-center border-t border-border bg-muted/20">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full text-xs hover:text-primary font-bold" 
                    onClick={() => setNotifications([])}
                  >
                    Clear all notifications
                  </Button>
                </div>
              )}
            </PopoverContent>
          </Popover>

          {connected ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="p-0 h-auto rounded-full ring-2 ring-primary/20 hover:ring-primary/40 transition-all">
                  <Avatar className="w-8 h-8 border border-border">
                    <AvatarImage src="https://picsum.photos/seed/user/100/100" />
                    <AvatarFallback>VF</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-bold">My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href="/dashboard">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href="/leaderboard">Leaderboard</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setConnected(false)} className="text-destructive cursor-pointer">
                  Disconnect Wallet
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div
              onClick={() => setConnected(true)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-6 shadow-lg shadow-primary/20"
            >
              <WalletConnect/>
            </div>
          )}

          <button
            className="md:hidden text-foreground ml-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute top-full left-0 right-0 bg-card border-b border-border p-4 md:hidden overflow-hidden shadow-2xl"
          >
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-lg font-bold text-foreground py-3 px-4 hover:bg-primary/10 rounded-xl transition-colors"
                >
                  {link.name}
                </Link>
              ))}
              {!connected && (
                <Button className="w-full mt-4 h-12 text-lg font-bold" onClick={() => {
                  setConnected(true);
                  setMobileMenuOpen(false);
                }}>
                  Connect Wallet
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

function Badge({ children, variant, className }: { children: React.ReactNode, variant?: string, className?: string }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${className}`}>
      {children}
    </span>
  );
}
