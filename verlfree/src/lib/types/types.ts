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
    job_id: string;
    title: string;
    description: string;
    budget: string;
    status: "active" | "in_progress" | "completed" | "pending";
    freelancer: string;
    category: string;
    deadline: string;
    escrow_amount: string;
    client: string;

}

export interface JobApplication {
    job_id: string
    title: string
    description: string
    category: string
    client: string
    freelancer: string
    escrow_amount: string
    deadline: string
    is_public: boolean
    status: string
    deliverable_url: string
    deliverable_note: string
    ai_verdict: string
    ai_reasoning: string
    submitted_at: string
    completed_at: string
    created_at: string
    ai_auto_assigned: boolean
    ai_assignment_reason: string
}


export interface TransactionReceipt {
  status: string;
  hash: string;
  blockNumber?: number;
  [key: string]: any;
}