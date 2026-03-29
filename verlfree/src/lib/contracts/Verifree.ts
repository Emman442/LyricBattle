import { createClient } from "genlayer-js";
import { testnetBradbury } from "genlayer-js/chains";
import { Job, JobApplication, TransactionReceipt, UserProfile } from "../types/types";
import {parseEther} from "viem";

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
            chain: testnetBradbury,
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
            chain: testnetBradbury,
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

    async getJobApplications(job_id: string): Promise<JobApplication[]> {
        try {
            const applications: any = await this.client.readContract({
                address: this.contractAddress,
                functionName: "get_applications",
                args: [job_id],
            });
            return applications as JobApplication[];
        } catch (error) {
            console.error("Error fetching job applications:", error);
            throw new Error("Failed to fetch job applications");
        }
    }

    async getClientJobs(client_address: string): Promise<any[]> {
        try {
            const jobs: any = await this.client.readContract({
                address: this.contractAddress,
                functionName: "get_client_jobs",
                args: [client_address],
            });
            return jobs as any[];
        } catch (error) {
            console.error("Error fetching client jobs:", error);
            throw new Error("Failed to fetch client jobs");
        }
    }

    async getFreelancerJobs(freelancer_address: string): Promise<any[]> {
        try {
            const jobs: any = await this.client.readContract({
                address: this.contractAddress,
                functionName: "get_freelancer_jobs",
                args: [freelancer_address],
            });
            return jobs as any[];
        } catch (error) {
            console.error("Error fetching freelancer jobs:", error);
            throw new Error("Failed to fetch freelancer jobs");
        }
    }

    async getAllJobs(): Promise<Job[]> {
        try {
            const jobs: any = await this.client.readContract({
                address: this.contractAddress,
                functionName: "fetch_jobs",
            });
            return jobs as any[];
        } catch (error) {
            console.error("Error fetching all jobs:", error);
            throw new Error("Failed to fetch all jobs");
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
    async createJob(job_id: string, title: string, description: string, category: string, budget: string, deadline: string, milestone_titles: string[]) {
        try {
            const txHash = await this.client.writeContract({
                address: this.contractAddress,
                functionName: "create_job",
                args: [job_id, title, description, category, budget, deadline, milestone_titles],
                value: parseEther(budget),
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

    async ApplyForJob(job_id: string, cover_note: string) {
        try {
            const txHash = await this.client.writeContract({
                address: this.contractAddress,
                functionName: "apply_for_job",
                args: [job_id, cover_note],
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
            console.error("Error Applying for job:", error);
            throw new Error("Failed to apply for job");
        }
    }

    async rejectApplication(job_id: string, freelancer_address: string) {
        try {
            const txHash = await this.client.writeContract({
                address: this.contractAddress,
                functionName: "reject_applicant",
                args: [job_id, freelancer_address],
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
            console.error("Error rejecting application:", error);
            throw new Error("Failed to reject application");
        }
    }

    async selectApplication(job_id: string, freelancer_address: string) {
        try {
            const txHash = await this.client.writeContract({
                address: this.contractAddress,
                functionName: "select_freelancer",
                args: [job_id, freelancer_address],
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
            console.error("Error selecting application:", error);
            throw new Error("Failed to select application");
        }
    }

    async aiShortlist(job_id: string) {
        try {
            const txHash = await this.client.writeContract({
                address: this.contractAddress,
                functionName: "ai_shortlist_applicants",
                args: [job_id],
                value: BigInt(0), // No ETH sent with this transaction
            });

            const receipt = await this.client.waitForTransactionReceipt({
                hash: txHash,
                status: "ACCEPTED" as any,
                retries: 24,
                interval: 5000,
            });
        } catch (error) {
            console.error("Error AI shortlisting applicants:", error);
            throw new Error("Failed to AI shortlist applicants");
        }
    }

    async submitDeliverable(job_id: string, deliverable_url: string, deliverable_note: string) {
        try {
            const txHash = await this.client.writeContract({
                address: this.contractAddress,
                functionName: "submit_deliverable",
                args: [job_id, deliverable_url, deliverable_note],
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
            console.error("Error submitting deliverable:", error);
            throw new Error("Failed to submit deliverable");
        }
    }

    async verifyAndPay(job_id: string) {
        try {
            const txHash = await this.client.writeContract({
                address: this.contractAddress,
                functionName: "verify_and_pay",
                args: [job_id],
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
            console.error("Error verifying and paying:", error);
            throw new Error("Failed to verify and pay");
        }
    }

    async verifyMilestone(job_id: string, milestone_id: string, proof_url: string) {
        try {
            const txHash = await this.client.writeContract({
                address: this.contractAddress,
                functionName: "verify_milestone",
                args: [job_id, milestone_id, proof_url],
                value: BigInt(0), // No ETH sent with this transaction
            });

            const receipt = await this.client.waitForTransactionReceipt({
                hash: txHash,
                status: "ACCEPTED" as any,
                retries: 24,
                interval: 5000,
            });
        } catch (error) {
            console.error("Error verifying milestone:", error);
            throw new Error("Failed to verify milestone");
        }
    }

    async raiseDispute(job_id: string, context_url: string, explanation: string) {
        try {
            const txHash = await this.client.writeContract({
                address: this.contractAddress,
                functionName: "raise_dispute",
                args: [job_id, context_url, explanation],
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
            console.error("Error raising dispute:", error);
            throw new Error("Failed to raise dispute");
        }
    }

}

export default VeriFree;