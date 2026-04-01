"use client";

import { useState } from "react";
import { Shield, User, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Modal from "@/components/ui/modal";
import { useCreateProfile } from "@/hooks/useVerifree";
import { toast } from "sonner";

interface ProfileSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProfileCreated: () => void;
  address: string;
}

export default function ProfileSetupModal({
  isOpen,
  onClose,
  onProfileCreated,
  address,
}: ProfileSetupModalProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [role, setRole] = useState<"client" | "freelancer" | null>(null);
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const createProfileMutation = useCreateProfile();

const handleCreateProfile = async () => {
  if (!role || !username || !bio || !address) return;

  try {
    setIsCreating(true);

    await createProfileMutation.mutateAsync({
      username,
      bio,
      role,
    });

    onProfileCreated();
  } catch (err) {
    console.error(err);
    toast.error("Failed to create profile", {
      description: err instanceof Error ? err.message : "Something went wrong",
    });
  } finally {
    setIsCreating(false);
  }
};

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      showCloseButton={false}
      size="md"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-xl font-bold text-white">
            {step === 1 ? "Welcome to VeriFree" : "Set Up Your Profile"}
          </h2>
          <p className="text-sm text-muted-foreground">
            {step === 1
              ? "Choose how you want to use VeriFree"
              : "Tell us a bit about yourself"}
          </p>
        </div>

        {/* Step 1 — Role Selection */}
        {step === 1 && (
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setRole("client")}
              className={`p-4 rounded-xl border text-left transition-all ${
                role === "client"
                  ? "border-primary bg-primary/10"
                  : "border-white/10 bg-white/5 hover:border-white/20"
              }`}
            >
              <Briefcase className={`w-5 h-5 mb-2 ${role === "client" ? "text-primary" : "text-muted-foreground"}`} />
              <p className="font-bold text-sm text-white">Client</p>
              <p className="text-xs text-muted-foreground mt-1">
                Post jobs and hire verified freelancers
              </p>
            </button>

            <button
              onClick={() => setRole("freelancer")}
              className={`p-4 rounded-xl border text-left transition-all ${
                role === "freelancer"
                  ? "border-primary bg-primary/10"
                  : "border-white/10 bg-white/5 hover:border-white/20"
              }`}
            >
              <User className={`w-5 h-5 mb-2 ${role === "freelancer" ? "text-primary" : "text-muted-foreground"}`} />
              <p className="font-bold text-sm text-white">Freelancer</p>
              <p className="text-xs text-muted-foreground mt-1">
                Find work and get paid automatically
              </p>
            </button>
          </div>
        )}

        {/* Step 2 — Profile Details */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Username
              </label>
              <Input
                placeholder="e.g. emmanuel_dev"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-white/5 border-white/10"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Short Bio
              </label>
              <Textarea
                placeholder="Tell clients what you do..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="bg-white/5 border-white/10 resize-none"
                rows={3}
              />
            </div>
            <div className="p-3 rounded-lg bg-white/5 border border-white/10">
              <p className="text-xs text-muted-foreground">
                Registering as{" "}
                <span className="text-primary font-bold capitalize">{role}</span>{" "}
                with wallet{" "}
                <span className="font-mono">
                  {address?.slice(0, 6)}...{address?.slice(-4)}
                </span>
              </p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          {step === 2 && (
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setStep(1)}
              disabled={isCreating}
            >
              Back
            </Button>
          )}
          <Button
            className="flex-1"
            disabled={step === 1 ? !role : !username || !bio || isCreating}
            onClick={() => {
              if (step === 1) setStep(2);
              else handleCreateProfile();
            }}
          >
            {isCreating
              ? "Creating Profile..."
              : step === 1
              ? "Continue"
              : "Create Profile"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}