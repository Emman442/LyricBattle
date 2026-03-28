"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import VeriFree from "../lib/contracts/Verifree"
import { getContractAddress, getStudioUrl } from "../components/genlayer/client";
import { useWallet } from "../components/genlayer/wallet";
// import { success, error, configError } from "../utils/toast";
import type { UserProfile} from "../lib/types/types";


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