"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import VeriFree from "../lib/contracts/Verifree"
import { getContractAddress, getStudioUrl } from "../components/genlayer/client";
import { useWallet } from "../components/genlayer/wallet";
// import { success, error, configError } from "../utils/toast";
import type { UserProfile } from "../lib/types/types";
import {toast} from "sonner";


export function useVeriFreeContract(): VeriFree | null {
    const { address } = useWallet();
    const contractAddress = getContractAddress();
    const studioUrl = getStudioUrl();

    return useMemo(() => {
        if (!contractAddress || !studioUrl) {
            return null;
        }
        return new VeriFree(contractAddress, address, studioUrl);
    }, [contractAddress, address, studioUrl]);
}

export function useCheckIfProfileExists(account_address: string | null) {
    const contract = useVeriFreeContract();

    return useQuery<boolean, Error>({
        queryKey: ["profileExists", account_address],
        queryFn: async () => {
            if (!account_address) return false;
            if (!contract) throw new Error("Contract not initialized");

            return await contract.CheckIfProfileExists(account_address);
        },
        enabled: !!account_address && !!contract,
        retry: false,
    });
}

export function useUserProfile(account_address: string) {
    const contract = useVeriFreeContract();

    return useQuery<UserProfile, Error>({
        queryKey: ["userProfile", account_address],
        queryFn: () => {
            if (!contract) {
                throw new Error("Contract not initialized");
            }
            return contract.getUserProfile(account_address);
        },
    });
}


export function useCreateProfile() {
    const contract = useVeriFreeContract();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            username,
            bio,
            role,
        }: {
            username: string;
            bio: string;
            role: "client" | "freelancer";
        }) => {
            if (!contract) {
                throw new Error("Contract not initialized");
            }

            const receipt = await contract.createProfile(username, bio, role);
            console.log("Profile creation transaction receipt:", receipt);
            return receipt;
        },

        onSuccess: async (_, variables) => {
            // refresh any relevant reads after profile creation
            await queryClient.invalidateQueries({
                queryKey: ["profileExists"],
            });

            await queryClient.invalidateQueries({
                queryKey: ["profile"],
            });
        },
    });
}

export function useCreateJob() {
    const contract = useVeriFreeContract();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            job_id,
            title,
            description,
            category,
            budget,
            deadline,
            milestone_titles,
        }: {
            job_id: string;
            title: string;
            description: string;
            category: string;
            budget: string;
            deadline: string;
            milestone_titles: string[];
        }) => {
            if (!contract) {
                throw new Error("Contract not initialized");
            }

            const receipt = await contract.createJob(job_id, title, description, category, budget, deadline, milestone_titles);
            console.log("Job creation transaction receipt:", receipt);
            return receipt;
        },

        onSuccess: async (_, variables) => {
            await queryClient.invalidateQueries({
                queryKey: ["job_created"],
            });

            await queryClient.invalidateQueries({
                queryKey: ["jobs"],
            });
            toast.success("Your job has been posted and is now live!");
        },
        onError: async (error) => {
            console.error("Error creating job:", error);
            toast.error("Failed to create job. Please try again.");
        }
    });
}

export function useApplyToJob() {
    const contract = useVeriFreeContract();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            job_id,
            cover_note,
        }: {
            job_id: string;
            cover_note: string;
        }) => {
            if (!contract) {
                throw new Error("Contract not initialized");
            }
            return contract.ApplyForJob(job_id, cover_note);
        },

        onSuccess: async (_, variables) => {
            await queryClient.invalidateQueries({
                queryKey: ["job_applications"],
            });
        },
    });
}

export function useGetJobApplications(job_id: string) {
    const contract = useVeriFreeContract();

    return useQuery({
        queryKey: ["job_applications", job_id],
        queryFn: async () => {
            if (!contract) {
                throw new Error("Contract not initialized");
            }
            return contract.getJobApplications(job_id);
        },
        enabled: !!contract,
    });
}

export function useGetJobs() {
    const contract = useVeriFreeContract();

    return useQuery({
        queryKey: ["jobs"],
        queryFn: async () => {
            if (!contract) {
                throw new Error("Contract not initialized");
            }
            return contract.getAllJobs();
        },
        enabled: !!contract,
    });
}

export function getFreelancerJobs(freelancer_address: string) {
    const contract = useVeriFreeContract();

    return useQuery({
        queryKey: ["freelancer_jobs", freelancer_address],
        queryFn: async () => {
            if (!contract) {
                throw new Error("Contract not initialized");
            }
            return contract.getFreelancerJobs(freelancer_address);
        },
        enabled: !!contract && !!freelancer_address,
    });
}

export function getClientJobs(client_address: string) {
    const contract = useVeriFreeContract();

    return useQuery({
        queryKey: ["client_jobs", client_address],
        queryFn: async () => {
            if (!contract) {
                throw new Error("Contract not initialized");
            }
            return contract.getClientJobs(client_address);
        },
        enabled: !!contract && !!client_address,
    });
}

export function useSubmitDeliverable() {
    const contract = useVeriFreeContract();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            job_id,
            deliverable_url,
            deliverable_note,
        }: {
            job_id: string;
            deliverable_url: string;
            deliverable_note: string;
        }) => {
            if (!contract) {
                throw new Error("Contract not initialized");
            }
            return contract.submitDeliverable(job_id, deliverable_url, deliverable_note);
        },

        onSuccess: async (_, variables) => {
            await queryClient.invalidateQueries({
                queryKey: ["job_applications"],
            });
        },
    });
}

export function VerifyMilestone() {
    const contract = useVeriFreeContract();
    const queryClient = useQueryClient();


    return useMutation({
        mutationFn: async ({
            job_id,
            milestone_id,
            proof_url,

        }: {
            job_id: string;
            milestone_id: string;
            proof_url: string;

        }) => {
            if (!contract) {
                throw new Error("Contract not initialized");
            }
            return contract.verifyMilestone(job_id, milestone_id, proof_url);
        },

        onSuccess: async (_, variables) => {
            await queryClient.invalidateQueries({
                queryKey: ["job_applications"],
            });
        },
    });
}

export function useVerifyAndCompleteJob() {
    const contract = useVeriFreeContract();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            job_id,

        }: {
            job_id: string;

        }) => {
            if (!contract) {
                throw new Error("Contract not initialized");
            }
            return contract.verifyAndPay(job_id);
        },

        onSuccess: async (_, variables) => {
            await queryClient.invalidateQueries({
                queryKey: ["job_applications"],
            });
            await queryClient.invalidateQueries({
                queryKey: ["jobs"],
            });
        },
    });
}

export function useRaiseDispute() {
    const contract = useVeriFreeContract();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            job_id,
            context_url,
            explanation
        }: {
            job_id: string;
            context_url: string;
            explanation: string;
        }) => {
            if (!contract) {
                throw new Error("Contract not initialized");
            }
            return contract.raiseDispute(job_id, context_url, explanation);
        },

        onSuccess: async (_, variables) => {
            await queryClient.invalidateQueries({
                queryKey: ["job_applications"],
            });
        },
    });
}
