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

export interface JobApplication {
    job_id: string,
    applicant: string,
    cover_note: string,
    status: string,
    ai_score: string,
    ai_recommendation: string,
    isAIRecommended: boolean
}

export interface Job {
    job_id: string
    title: string
    description: string
    category: string
    client: string
    freelancer: string
    escrow_amount: string
    deadline: string
    is_public: boolean
    status: "active" | "in_progress" | "completed" | "pending" | "pending_review" | "revision_requested";
    deliverable_url: string
    deliverable_note: string
    ai_verdict: string
    ai_reasoning: string;
    ai_auto_assigned: boolean
    ai_assignment_reason: string
}

export interface JobMilestone {
    milestone_id: string;
    job_id: string;
    title: string;
    status: "pending" | "approved" | "rejected";
    deliverable_url: string;
    ai_verdict: string;
    ai_reasoning: string
}


export interface TransactionReceipt {
    status: string;
    hash: string;
    blockNumber?: number;
    [key: string]: any;
}