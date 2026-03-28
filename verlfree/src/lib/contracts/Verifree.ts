import { createClient } from "genlayer-js";
import { studionet } from "genlayer-js/chains";
import { TransactionReceipt, UserProfile } from "../types/types";

class VeriFree {
    private contractAddress: `0x${string}`;
    private client: ReturnType<typeof createClient>;

    constructor(
        contractAddress: string,
        address?: string | null,
        studioUrl?: string
    ) {
        this.contractAddress = contractAddress as `0x${string}`;

        const config: any = {
            chain: studionet,
        };

        if (address) {
            config.account = address as `0x${string}`;
        }

        if (studioUrl) {
            config.endpoint = studioUrl;
        }

        this.client = createClient(config);
    }

    updateAccount(address: string): void {
        const config: any = {
            chain: studionet,
            account: address as `0x${string}`,
        };

        this.client = createClient(config);
    }

    /**
     * Get a particular user profile from the contract
     * @returns a user profile object with all relevant details
     */
    async CheckIfProfileExists(account_address: string): Promise<boolean> {
        try {
            const profile_exists: any = await this.client.readContract({
                address: this.contractAddress,
                functionName: "profile_exists",
                args: [account_address],
            });

            return profile_exists as boolean;

        } catch (error) {
            console.error("Error fetching user profile:", error);
            throw new Error("Failed to check if user profile exists");
        }
    }
    async getUserProfile(account_address: string): Promise<UserProfile> {
        try {
            const profile: any = await this.client.readContract({
                address: this.contractAddress,
                functionName: "fetch_profile",
                args: [account_address],
            });

            
            return profile as UserProfile;

        } catch (error) {
            console.error("Error fetching user profile:", error);
            throw new Error("Failed to fetch user profile");
        }
    }

    // Add more contract interaction methods as needed

    async createProfile(username: string, bio: string, role: "client" | "freelancer") {
        try {
            const txHash = await this.client.writeContract({
                address: this.contractAddress,
                functionName: "create_profile",
                args: [username, bio, role],
                value: BigInt(0), // No ETH sent with this transaction
            });

            const receipt = await this.client.waitForTransactionReceipt({
                hash: txHash,
                status: "ACCEPTED" as any,
                retries: 24,
                interval: 5000,
            });

            return receipt as TransactionReceipt;
        } catch (error) {
            console.error("Error creating profile:", error);
            throw new Error("Failed to create profile");
        }
    }
    async createJob(job_id: string, title: string, description: string, category: string, budget: string, deadline: string) {
        try {
            const txHash = await this.client.writeContract({
                address: this.contractAddress,
                functionName: "create_job",
                args: [job_id, title, description, category, budget, deadline],
                value: BigInt(0), // No ETH sent with this transaction
            });

            const receipt = await this.client.waitForTransactionReceipt({
                hash: txHash,
                status: "ACCEPTED" as any,
                retries: 24,
                interval: 5000,
            });

            return receipt as TransactionReceipt;
        } catch (error) {
            console.error("Error creating job:", error);
            throw new Error("Failed to create job");
        }
    }



}

export default VeriFree;