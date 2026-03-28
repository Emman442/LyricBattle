export interface UserProfile {
    username: string;
    bio: string;
    role: "freelancer" | "client";
    reputation_score: string;
    jobs_completed: string;
    active_jobs: string;
    total_earned: string;
    total_spent: string;
    success_rate: string;
    joined_at: string;
}

export interface Job {
    id: string;
    title: string;
    description: string;
    budget: string;
    status: "open" | "in_progress" | "completed";
    client_id: string;
    freelancer_id?: string;
    created_at: string;
    updated_at: string;
}


export interface TransactionReceipt {
  status: string;
  hash: string;
  blockNumber?: number;
  [key: string]: any;
}