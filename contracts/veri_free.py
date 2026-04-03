# v0.1.0
# { "Depends": "py-genlayer:latest" }

from genlayer import *
from dataclasses import dataclass


@allow_storage
@dataclass
class UserProfile:
    username: str
    bio: str
    role: str
    reputation_score: str
    jobs_completed: str
    active_jobs: str
    total_earned: str
    total_spent: str
    success_rate: str


@allow_storage
@dataclass
class Job:
    job_id: str
    title: str
    description: str
    category: str
    client: str
    freelancer: str
    escrow_amount: str
    deadline: str
    is_public: bool
    status: str
    deliverable_url: str
    deliverable_note: str
    ai_verdict: str
    ai_reasoning: str
    ai_auto_assigned: bool
    ai_assignment_reason: str


@allow_storage
@dataclass
class Application:
    job_id: str
    applicant: str
    cover_note: str
    status: str
    ai_score: str
    ai_recommendation: str


@allow_storage
@dataclass
class Milestone:
    milestone_id: str
    job_id: str
    title: str
    status: str
    deliverable_url: str
    ai_verdict: str
    ai_reasoning: str


@allow_storage
@dataclass
class Dispute:
    job_id: str
    context_url: str
    explanation: str
    verdict: str
    reasoning: str


@allow_storage
class VeriFree(gl.Contract):
    # Core
    jobs: TreeMap[str, Job]
    user_profiles: TreeMap[Address, UserProfile]
    job_ids: DynArray[str]

    # Mock USDC balances
    mock_usdc_balances: TreeMap[Address, str]

    # Applications
    applications: TreeMap[str, Application]   # key = job_id + "|" + applicant
    application_ids: DynArray[str]

    # Milestones
    milestones: TreeMap[str, Milestone]       # milestone_id -> Milestone
    milestone_ids: DynArray[str]              # all milestone ids

    # Disputes
    disputes: TreeMap[str, Dispute]           # key = job_id

    def __init__(self):
        pass


    # ==================== HELPERS ====================

    def _application_key(self, job_id: str, applicant: str) -> str:
        return job_id + "|" + applicant

    def _get_balance(self, addr: Address) -> int:
        if addr not in self.mock_usdc_balances:
            return 0
        return int(self.mock_usdc_balances[addr])

    def _set_balance(self, addr: Address, amount: int) -> None:
        self.mock_usdc_balances[addr] = str(amount)

    # ==================== MOCK USDC ====================

    @gl.public.write
    def claim_mock_usdc_faucet(self) -> None:
        """
        Gives each wallet 1000 MockUSDC for demo/testing.
        """
        addr = gl.message.sender_address
        current = self._get_balance(addr)
        self._set_balance(addr, current + 1000)

    @gl.public.view
    def get_mock_usdc_balance(self, account_address: str) -> str:
        addr = Address(account_address)
        if addr not in self.mock_usdc_balances:
            return "0"
        return self.mock_usdc_balances[addr]

    # Optional helper if you want to manually top up users during testing
    @gl.public.write
    def admin_credit_mock_usdc(self, account_address: str, amount: str) -> None:
        addr = Address(account_address)
        current = self._get_balance(addr)
        self._set_balance(addr, current + int(amount))

    # ==================== PROFILE ====================

    @gl.public.write
    def create_profile(self, username: str, bio: str, role: str) -> None:
        assert role in ["client", "freelancer"], "Role must be client or freelancer"

        address = gl.message.sender_address

        self.user_profiles[address] = UserProfile(
            username=username,
            bio=bio,
            role=role,
            reputation_score="100",
            jobs_completed="0",
            active_jobs="0",
            total_earned="0",
            total_spent="0",
            success_rate="100",
        )

        # Give starter MockUSDC balance if user has none
        if address not in self.mock_usdc_balances:
            self.mock_usdc_balances[address] = "1000"

    @gl.public.view
    def fetch_profile(self, account_address: str) -> UserProfile:
        addr = Address(account_address)
        assert addr in self.user_profiles, "Profile not found"
        return self.user_profiles[addr]

    @gl.public.view
    def profile_exists(self, account_address: str) -> bool:
        addr = Address(account_address)
        return addr in self.user_profiles

    # ==================== JOBS ====================

    @gl.public.write
    def create_job(
        self,
        job_id: str,
        title: str,
        description: str,
        category: str,
        budget: str,
        deadline: str,
        is_public: bool,
        milestone_titles: list[str],
    ) -> None:
        assert job_id not in self.jobs, "Job ID already exists"

        client_address = gl.message.sender_address
        assert client_address in self.user_profiles, "Client profile not found"
        assert self.user_profiles[client_address].role == "client", "Only clients can post jobs"

        budget_int = int(budget)
        client_balance = self._get_balance(client_address)
        assert client_balance >= budget_int, "Insufficient MockUSDC balance"

        # Lock escrow by deducting from client balance
        self._set_balance(client_address, client_balance - budget_int)

        self.jobs[job_id] = Job(
            job_id=job_id,
            title=title,
            description=description,
            category=category,
            client=client_address.as_hex,
            freelancer="",
            escrow_amount=budget,
            deadline=deadline,
            is_public=is_public,
            status="active",
            deliverable_url="",
            deliverable_note="",
            ai_verdict="",
            ai_reasoning="",
            ai_auto_assigned=False,
            ai_assignment_reason="",
        )

        self.job_ids.append(job_id)

        for i in range(len(milestone_titles)):
            milestone_id = job_id + "_ms_" + str(i)

            self.milestones[milestone_id] = Milestone(
                milestone_id=milestone_id,
                job_id=job_id,
                title=milestone_titles[i],
                status="pending",
                deliverable_url="",
                ai_verdict="",
                ai_reasoning="",
            )

            self.milestone_ids.append(milestone_id)

        current_spent = int(self.user_profiles[client_address].total_spent)
        self.user_profiles[client_address].total_spent = str(current_spent + budget_int)

    @gl.public.view
    def fetch_jobs(self) -> list[Job]:
        result = []
        for job_id in self.job_ids:
            result.append(self.jobs[job_id])
        return result

    @gl.public.view
    def fetch_job_by_id(self, job_id: str) -> Job:
        assert job_id in self.jobs, "Job not found"
        return self.jobs[job_id]

    @gl.public.view
    def get_client_jobs(self, client_address: str) -> list[Job]:
        result = []
        for job_id in self.job_ids:
            if self.jobs[job_id].client.lower() == client_address:
                result.append(self.jobs[job_id])
        return result

    @gl.public.view
    def get_freelancer_jobs(self, freelancer_address: str) -> list[Job]:
        result = []
        for job_id in self.job_ids:
            if self.jobs[job_id].freelancer.lower() == freelancer_address:
                result.append(self.jobs[job_id])
        return result

    @gl.public.view
    def get_freelancer_applications(self, freelancer_address: str) -> list[Application]:
        result = []
        addr = freelancer_address.lower()   # normalize once

        for app_key in self.application_ids:
            app = self.applications[app_key]
            if app.applicant.lower() == addr:      # Use .applicant, not .freelancer
                result.append(app)

        return result

    # ==================== APPLICATIONS ====================

    @gl.public.write
    def apply_for_job(self, job_id: str, cover_note: str) -> None:
        assert job_id in self.jobs, "Job not found"

        job = self.jobs[job_id]
        assert job.is_public, "Job is not public"
        assert job.status == "active", "Job is not accepting applications"

        applicant = gl.message.sender_address.as_hex
        assert applicant != job.client, "Client cannot apply to own job"

        if Address(applicant) in self.user_profiles:
            assert self.user_profiles[Address(applicant)].role == "freelancer", "Only freelancers can apply"

        app_key = self._application_key(job_id, applicant)
        assert app_key not in self.applications, "Already applied"

        self.applications[app_key] = Application(
            job_id=job_id,
            applicant=applicant,
            cover_note=cover_note,
            status="pending",
            ai_score="0",
            ai_recommendation="",
        )

        self.application_ids.append(app_key)

    @gl.public.view
    def get_applications(self, job_id: str) -> list[Application]:
        result = []
        for app_id in self.application_ids:
            app = self.applications[app_id]
            if app.job_id == job_id:
                result.append(app)
        return result

    @gl.public.write
    def reject_applicant(self, job_id: str, applicant_address: str) -> None:
        assert job_id in self.jobs, "Job not found"
        assert self.jobs[job_id].client == gl.message.sender_address.as_hex, "Not the client"

        app_key = self._application_key(job_id, applicant_address)
        assert app_key in self.applications, "Applicant not found"

        self.applications[app_key].status = "rejected"

    @gl.public.write
    def select_freelancer(self, job_id: str, freelancer_address: str) -> None:
        assert job_id in self.jobs, "Job not found"

        job = self.jobs[job_id]
        assert job.client == gl.message.sender_address.as_hex, "Not the client"
        assert job.status == "active", "Job is not active"

        selected_key = self._application_key(job_id, freelancer_address)
        assert selected_key in self.applications, "Applicant not found"

        self.jobs[job_id].freelancer = freelancer_address
        self.jobs[job_id].status = "in_progress"
        self.applications[selected_key].status = "selected"

        for app_id in self.application_ids:
            app = self.applications[app_id]
            if app.job_id == job_id and app.applicant != freelancer_address:
                self.applications[app_id].status = "rejected"

        freelancer_addr = Address(freelancer_address)
        if freelancer_addr in self.user_profiles:
            current_active = int(self.user_profiles[freelancer_addr].active_jobs)
            self.user_profiles[freelancer_addr].active_jobs = str(current_active + 1)

    # ==================== AI SHORTLIST ====================

    @gl.public.write
    def ai_shortlist_applicants(self, job_id: str) -> str:
        assert job_id in self.jobs, "Job not found"

        job = self.jobs[job_id]
        assert job.client == gl.message.sender_address.as_hex, "Not the client"

        milestone_summary = ""
        milestone_count = 0

        for milestone_id in self.milestone_ids:
            milestone = self.milestones[milestone_id]
            if milestone.job_id == job_id:
                milestone_summary += "Requirement: " + milestone.title + "\n"
                milestone_count += 1

        assert milestone_count > 0, "No milestones found for this job"

        applicant_summaries = ""
        found_any = False

        for app_id in self.application_ids:
            app = self.applications[app_id]
            if app.job_id == job_id:
                found_any = True
                addr = app.applicant

                profile_data = ""
                if Address(addr) in self.user_profiles:
                    profile = self.user_profiles[Address(addr)]
                    profile_data = (
                        "Reputation Score: " + profile.reputation_score + "\n" +
                        "Jobs Completed: " + profile.jobs_completed + "\n" +
                        "Success Rate: " + profile.success_rate + "%\n"
                    )

                applicant_summaries += (
                    "Applicant: " + addr + "\n" +
                    "Cover Note: " + app.cover_note + "\n" +
                    profile_data +
                    "---\n"
                )

        assert found_any, "No applications yet"

        prompt = f"""
You are evaluating freelancer applications for a freelance job.

JOB TITLE:
{job.title}

JOB DESCRIPTION:
{job.description}

JOB CATEGORY:
{job.category}

JOB REQUIREMENTS / MILESTONES:
{milestone_summary}

APPLICANTS:
{applicant_summaries}

Your task:
Rank applicants from most to least suitable.

Base your ranking on:
1. How well their cover note matches the job description
2. How well they appear able to satisfy the milestone requirements
3. Reputation score
4. Jobs completed
5. Success rate

Return ONLY in this exact format:

RANK: [number]
ADDRESS: [wallet address]
SCORE: [0-100]
REASON: [one sentence]
---
"""

        def nondet():
            return gl.nondet.exec_prompt(prompt)

        result = gl.eq_principle.prompt_comparative(
            nondet,
            principle="Applicants should be ranked by strongest overall fit based on milestone relevance, job description fit, cover note quality, reputation score, completed jobs, and success rate."
        )

        lines = result.split("\n")
        current_address = ""

        for line in lines:
            line = line.strip()

            if line.startswith("ADDRESS:"):
                current_address = line.replace("ADDRESS:", "").strip()

            elif line.startswith("SCORE:") and current_address != "":
                score = line.replace("SCORE:", "").strip()
                app_key = self._application_key(job_id, current_address)

                if app_key in self.applications:
                    self.applications[app_key].ai_score = score
                    self.applications[app_key].status = "shortlisted"

            elif line.startswith("REASON:") and current_address != "":
                reason = line.replace("REASON:", "").strip()
                app_key = self._application_key(job_id, current_address)

                if app_key in self.applications:
                    self.applications[app_key].ai_recommendation = reason

        return result

    # ==================== MILESTONES ====================

    @gl.public.view
    def get_job_milestones(self, job_id: str) -> list[Milestone]:
        result = []
        for milestone_id in self.milestone_ids:
            milestone = self.milestones[milestone_id]
            if milestone.job_id == job_id:
                result.append(milestone)
        return result

    # ==================== DELIVERABLE ====================

    @gl.public.write
    def submit_deliverable(self, job_id: str, proof_url: str, note: str) -> None:
        assert job_id in self.jobs, "Job not found"

        job = self.jobs[job_id]
        assert job.freelancer == gl.message.sender_address.as_hex, "Not the assigned freelancer"
        assert job.status in ["active", "in_progress"], "Job is not active"

        self.jobs[job_id].deliverable_url = proof_url
        self.jobs[job_id].deliverable_note = note
        self.jobs[job_id].status = "pending_review"

    # ==================== AI VERIFICATION ====================

    @gl.public.write
    def verify_and_pay(self, job_id: str) -> str:
        assert job_id in self.jobs, "Job not found"

        job = self.jobs[job_id]
        assert job.status == "pending_review", "Job is not pending review"
        assert job.deliverable_url != "", "No deliverable submitted"
        assert job.freelancer != "", "No freelancer assigned"
        assert job.client == gl.message.sender_address.as_hex, "Only client can verify and pay"

        milestone_summary = ""
        milestone_count = 0

        for milestone_id in self.milestone_ids:
            milestone = self.milestones[milestone_id]
            if milestone.job_id == job_id:
                milestone_summary += (
                    "Milestone ID: " + milestone.milestone_id + "\n" +
                    "Checklist Item: " + milestone.title + "\n" +
                    "---\n"
                )
                milestone_count += 1

        assert milestone_count > 0, "No milestones found for this job"

        proof_url = job.deliverable_url

        def nondet():
            import re

            def clean_url(url: str) -> str:
                url = url.strip().replace("\\", "")
                url = url.split(" ")[0].strip()
                url = url.split("\n")[0].strip()
                return url

            def safe_decode(resp) -> str:
                try:
                    return resp.body.decode("utf-8", errors="ignore")
                except:
                    return ""

            def truncate(text: str, limit: int = 12000) -> str:
                if len(text) <= limit:
                    return text
                return text[:limit]

            def classify_url(url: str) -> str:
                u = url.lower()
                if "docs.google.com/document" in u:
                    return "google_doc"
                if "raw.githubusercontent.com" in u:
                    return "github_raw"
                if "github.com" in u:
                    return "github"
                if "x.com/" in u or "twitter.com/" in u:
                    return "x_post"
                return "generic"

            def extract_google_doc(url: str) -> str:
                text = ""

                # Try direct export as text
                m = re.search(r"/document/d/([^/]+)", url)
                if m:
                    doc_id = m.group(1)
                    export_txt = "https://docs.google.com/document/d/" + doc_id + "/export?format=txt"
                    try:
                        r = gl.nondet.web.get(export_txt)
                        body = safe_decode(r)
                        if len(body.strip()) > 80:
                            return body
                    except:
                        pass

                    # fallback normal view
                    view_url = "https://docs.google.com/document/d/" + doc_id + "/view"
                    try:
                        r2 = gl.nondet.web.get(view_url)
                        body2 = safe_decode(r2)
                        if len(body2.strip()) > 80:
                            text += body2 + "\n"
                    except:
                        pass

                    # render fallback
                    try:
                        rendered = gl.nondet.web.render(view_url)
                        rendered_text = str(rendered)
                        if len(rendered_text.strip()) > 80:
                            text += "\n[RENDERED]\n" + rendered_text
                    except:
                        pass

                return text

            def extract_github(url: str) -> str:
                text = ""

                # If github blob URL, convert to raw
                if "github.com" in url and "/blob/" in url:
                    raw_url = url.replace("github.com/", "raw.githubusercontent.com/").replace("/blob/", "/")
                    try:
                        r = gl.nondet.web.get(raw_url)
                        body = safe_decode(r)
                        if len(body.strip()) > 40:
                            return body
                    except:
                        pass

                # If raw already
                try:
                    r2 = gl.nondet.web.get(url)
                    body2 = safe_decode(r2)
                    if len(body2.strip()) > 40:
                        return body2
                except:
                    pass

                # fallback render
                try:
                    rendered = gl.nondet.web.render(url)
                    rendered_text = str(rendered)
                    if len(rendered_text.strip()) > 40:
                        text += rendered_text
                except:
                    pass

                return text

            def extract_x_post(url: str) -> str:
                text = ""
                try:
                    rendered = gl.nondet.web.render(url)
                    rendered_text = str(rendered)
                    if len(rendered_text.strip()) > 40:
                        return rendered_text
                except:
                    pass

                try:
                    r = gl.nondet.web.get(url)
                    body = safe_decode(r)
                    if len(body.strip()) > 40:
                        text += body
                except:
                    pass

                return text

            def extract_generic(url: str) -> str:
                text = ""
                try:
                    r = gl.nondet.web.get(url)
                    body = safe_decode(r)
                    if len(body.strip()) > 80:
                        text += body
                except:
                    pass

                try:
                    rendered = gl.nondet.web.render(url)
                    rendered_text = str(rendered)
                    if len(rendered_text.strip()) > 80:
                        text += "\n[RENDERED]\n" + rendered_text
                except:
                    pass

                return text

            url = clean_url(proof_url)
            url_type = classify_url(url)

            head_status = "unknown"
            head_content_type = "unknown"
            head_ok = False

            try:
                h = gl.nondet.web.head(url)
                head_status = str(getattr(h, "status", "unknown"))
                head_content_type = str(getattr(h, "headers", {}))
                if "200" in head_status or "301" in head_status or "302" in head_status:
                    head_ok = True
            except:
                pass

            deliverable_content = ""
            if url_type == "google_doc":
                deliverable_content = extract_google_doc(url)
            elif url_type == "github_raw" or url_type == "github":
                deliverable_content = extract_github(url)
            elif url_type == "x_post":
                deliverable_content = extract_x_post(url)
            else:
                deliverable_content = extract_generic(url)

            deliverable_content = truncate(deliverable_content, 12000)

            evidence_quality = "low"
            if head_ok and len(deliverable_content.strip()) > 500:
                evidence_quality = "high"
            elif head_ok and len(deliverable_content.strip()) > 120:
                evidence_quality = "medium"

            prompt = f"""
    You are a strict but fair freelance job evaluator.

    JOB TITLE:
    {job.title}

    JOB CATEGORY:
    {job.category}

    JOB DESCRIPTION:
    {job.description}

    ACCEPTANCE CHECKLIST:
    {milestone_summary}

    FREELANCER NOTE:
    {job.deliverable_note}

    DELIVERABLE URL:
    {url}

    URL TYPE:
    {url_type}

    HEAD STATUS:
    {head_status}

    HEAD METADATA:
    {head_content_type}

    EVIDENCE_QUALITY:
    {evidence_quality}

    EXTRACTED DELIVERABLE CONTENT:
    {deliverable_content}

    Important evaluation rules:
    1. A deliverable can be a document, article, Google Doc, GitHub file, GitHub repo page, X/Twitter post, landing page, deployed app, portfolio page, or general website.
    2. If the content is accessible and clearly supports the required milestone(s), count it as verifiable.
    3. If the job requires a WEBSITE / APP, evaluate visible evidence of:
    - whether the site/app exists,
    - whether it appears functional,
    - whether the requested feature(s) are present,
    - whether there is evidence relevant to UX / content / structure.
    4. Only evaluate "performance" claims (e.g. loads under 2 seconds, SEO score, Lighthouse, mobile responsiveness) if there is direct evidence for them in the page content or freelancer note. Do NOT assume performance metrics without evidence.
    5. If the URL is accessible but content is too thin to fully prove completion, score conservatively.
    6. If even ONE important checklist item is not satisfied, final VERDICT must be NO.

    Return ONLY in this exact format:

    DELIVERABLE_TYPE: [document / github / x_post / website / app / generic]
    EVIDENCE_QUALITY: [low / medium / high]
    VERDICT: YES or NO
    SCORE: [0-100]
    REASONING: [2-4 sentences]
    MILESTONE_CHECK:
    - [milestone_id] | [checklist item] | YES or NO | [short reason]
    """

            return gl.nondet.exec_prompt(prompt)

        result = gl.eq_principle.prompt_comparative(
            nondet,
            principle="The final verdict must only be YES if the deliverable clearly satisfies all checklist items. Accessible and relevant web evidence should count, but unsupported assumptions must not."
        )

        verdict_passed = "VERDICT: YES" in result.upper()

        self.jobs[job_id].ai_verdict = "passed" if verdict_passed else "failed"
        self.jobs[job_id].ai_reasoning = result

        lines = result.split("\n")
        for line in lines:
            line = line.strip()
            if line.startswith("- "):
                cleaned = line[2:]
                parts = cleaned.split("|")
                if len(parts) >= 3:
                    ms_id = parts[0].strip()
                    verdict = parts[2].strip().upper()

                    if ms_id in self.milestones:
                        self.milestones[ms_id].status = "completed" if verdict == "YES" else "rejected"
                        self.milestones[ms_id].ai_verdict = "passed" if verdict == "YES" else "failed"
                        self.milestones[ms_id].ai_reasoning = cleaned

        freelancer_addr = Address(job.freelancer)
        escrow_amount = int(job.escrow_amount)

        if verdict_passed:
            current_balance = self._get_balance(freelancer_addr)
            self._set_balance(freelancer_addr, current_balance + escrow_amount)

            self.jobs[job_id].status = "completed"

            if freelancer_addr in self.user_profiles:
                current_completed = int(self.user_profiles[freelancer_addr].jobs_completed)
                current_active = int(self.user_profiles[freelancer_addr].active_jobs)
                current_earned = int(self.user_profiles[freelancer_addr].total_earned)

                self.user_profiles[freelancer_addr].jobs_completed = str(current_completed + 1)
                self.user_profiles[freelancer_addr].active_jobs = str(max(0, current_active - 1))
                self.user_profiles[freelancer_addr].total_earned = str(current_earned + escrow_amount)

        else:
            self.jobs[job_id].status = "revision_requested"

        return result

    # ==================== DISPUTES ====================

    
  
    @gl.public.write
    def raise_dispute(self, job_id: str, context_url: str, explanation: str) -> str:
        assert job_id in self.jobs, "Job not found"
        job = self.jobs[job_id]
        assert job.freelancer == gl.message.sender_address.as_hex, "Not the freelancer"
        assert job.status == "revision_requested", "Can only dispute revision requests"

        milestone_summary = ""
        milestone_count = 0

        for milestone_id in self.milestone_ids:
            milestone = self.milestones[milestone_id]
            if milestone.job_id == job_id:
                milestone_summary += (
                    "Milestone ID: " + milestone.milestone_id + "\n" +
                    "Milestone Title: " + milestone.title + "\n" +
                    "Current Status: " + milestone.status + "\n" +
                    "Previous AI Verdict: " + milestone.ai_verdict + "\n" +
                    "Previous AI Reasoning: " + milestone.ai_reasoning + "\n" +
                    "---\n"
                )
                milestone_count += 1

        assert milestone_count > 0, "No milestones found for this job"

        deliverable_url = job.deliverable_url
        previous_reasoning = job.ai_reasoning

        def nondet():
            import re

            def clean_url(url: str) -> str:
                url = url.strip().replace("\\", "")
                url = url.split(" ")[0].strip()
                url = url.split("\n")[0].strip()
                return url

            def safe_decode(resp) -> str:
                try:
                    return resp.body.decode("utf-8", errors="ignore")
                except:
                    return ""

            def classify_url(url: str) -> str:
                u = url.lower()
                if "docs.google.com/document" in u:
                    return "google_doc"
                if "raw.githubusercontent.com" in u:
                    return "github_raw"
                if "github.com" in u:
                    return "github"
                if "x.com/" in u or "twitter.com/" in u:
                    return "x_post"
                return "generic"

            def truncate(text: str, limit: int = 10000) -> str:
                return text[:limit] if len(text) > limit else text

            def extract(url: str) -> str:
                url_type = classify_url(url)
                text = ""

                if url_type == "google_doc":
                    m = re.search(r"/document/d/([^/]+)", url)
                    if m:
                        doc_id = m.group(1)
                        export_txt = "https://docs.google.com/document/d/" + doc_id + "/export?format=txt"
                        try:
                            r = gl.nondet.web.get(export_txt)
                            body = safe_decode(r)
                            if len(body.strip()) > 80:
                                return body
                        except:
                            pass

                if url_type == "github" and "/blob/" in url:
                    raw_url = url.replace("github.com/", "raw.githubusercontent.com/").replace("/blob/", "/")
                    try:
                        r2 = gl.nondet.web.get(raw_url)
                        body2 = safe_decode(r2)
                        if len(body2.strip()) > 40:
                            return body2
                    except:
                        pass

                try:
                    r3 = gl.nondet.web.get(url)
                    body3 = safe_decode(r3)
                    if len(body3.strip()) > 40:
                        text += body3
                except:
                    pass

                try:
                    rendered = gl.nondet.web.render(url)
                    text += "\n[RENDERED]\n" + str(rendered)
                except:
                    pass

                return text

            original_url = clean_url(deliverable_url)
            context_url_clean = clean_url(context_url)

            original_content = extract(original_url)
            additional_context = extract(context_url_clean)

            original_content = truncate(original_content, 9000)
            additional_context = truncate(additional_context, 9000)

            prompt = f"""
    A freelancer is disputing a failed freelance job verification.

    JOB TITLE:
    {job.title}

    JOB DESCRIPTION:
    {job.description}

    MILESTONES TO VERIFY:
    {milestone_summary}

    ORIGINAL DELIVERABLE URL:
    {original_url}

    ORIGINAL DELIVERABLE CONTENT:
    {original_content}

    FREELANCER EXPLANATION:
    {explanation}

    ADDITIONAL EVIDENCE URL:
    {context_url_clean}

    ADDITIONAL EVIDENCE CONTENT:
    {additional_context}

    PREVIOUS AI REASONING:
    {previous_reasoning}

    Rules:
    1. Re-evaluate from scratch using BOTH the original deliverable and the new evidence.
    2. Accept Google Docs, GitHub raw files, GitHub repo pages, X posts, websites, deployed apps, and general web pages as valid evidence if they are accessible and relevant.
    3. If the task involves a website/app, verify visible evidence of requested features.
    4. Only accept performance claims (speed, SEO, responsiveness, etc.) if there is actual evidence.
    5. Final verdict can only be YES if ALL important milestones are satisfied.

    Return ONLY in this exact format:

    VERDICT: YES or NO
    REASONING: [3 sentences explaining your final decision]
    MILESTONE_CHECK:
    - [milestone_id] | [milestone title] | YES or NO | [short reason]
    """
            return gl.nondet.exec_prompt(prompt)

        result = gl.eq_principle.prompt_comparative(
            nondet,
            principle="The verdict must only be YES if the total evidence clearly shows ALL milestones were completed. Accessible and relevant web evidence should count."
        )

        dispute_passed = "VERDICT: YES" in result.upper()

        self.disputes[job_id] = Dispute(
            job_id=job_id,
            context_url=context_url,
            explanation=explanation,
            verdict="upheld" if dispute_passed else "rejected",
            reasoning=result,
        )

        freelancer_addr = Address(job.freelancer)
        escrow_amount = int(job.escrow_amount)

        if dispute_passed:
            current_balance = self._get_balance(freelancer_addr)
            self._set_balance(freelancer_addr, current_balance + escrow_amount)

            self.jobs[job_id].status = "completed"

            if freelancer_addr in self.user_profiles:
                current_completed = int(self.user_profiles[freelancer_addr].jobs_completed)
                current_active = int(self.user_profiles[freelancer_addr].active_jobs)
                current_earned = int(self.user_profiles[freelancer_addr].total_earned)

                self.user_profiles[freelancer_addr].jobs_completed = str(current_completed + 1)
                self.user_profiles[freelancer_addr].active_jobs = str(max(0, current_active - 1))
                self.user_profiles[freelancer_addr].total_earned = str(current_earned + escrow_amount)

            lines = result.split("\n")
            for line in lines:
                line = line.strip()
                if line.startswith("- "):
                    cleaned = line[2:]
                    parts = cleaned.split("|")
                    if len(parts) >= 3:
                        ms_id = parts[0].strip()
                        verdict = parts[2].strip().upper()

                        if ms_id in self.milestones:
                            self.milestones[ms_id].status = "completed" if verdict == "YES" else "rejected"
                            self.milestones[ms_id].ai_verdict = "passed" if verdict == "YES" else "failed"
                            self.milestones[ms_id].ai_reasoning = cleaned

        else:
            self.jobs[job_id].status = "dispute_closed"

        return result






























# # v0.1.0
# # { "Depends": "py-genlayer:latest" }

# from genlayer import *
# from dataclasses import dataclass


# @allow_storage
# @dataclass
# class UserProfile:
#     username: str
#     bio: str
#     role: str
#     reputation_score: str
#     jobs_completed: str
#     active_jobs: str
#     total_earned: str
#     total_spent: str
#     success_rate: str


# @allow_storage
# @dataclass
# class Job:
#     job_id: str
#     title: str
#     description: str
#     category: str
#     client: str
#     freelancer: str
#     escrow_amount: str
#     deadline: str
#     is_public: bool
#     status: str
#     deliverable_url: str
#     deliverable_note: str
#     ai_verdict: str
#     ai_reasoning: str
#     ai_auto_assigned: bool
#     ai_assignment_reason: str


# @allow_storage
# @dataclass
# class Application:
#     job_id: str
#     applicant: str
#     cover_note: str
#     status: str
#     ai_score: str
#     ai_recommendation: str


# @allow_storage
# @dataclass
# class Milestone:
#     milestone_id: str
#     job_id: str
#     title: str
#     status: str
#     deliverable_url: str
#     ai_verdict: str
#     ai_reasoning: str


# @allow_storage
# @dataclass
# class Dispute:
#     job_id: str
#     context_url: str
#     explanation: str
#     verdict: str
#     reasoning: str


# # ==================== CONTRACT ====================

# @allow_storage
# class VeriFree(gl.Contract):
#     # Core
#     jobs: TreeMap[str, Job]
#     user_profiles: TreeMap[Address, UserProfile]
#     job_ids: DynArray[str]

#     # Applications
#     applications: TreeMap[str, Application]   # key = job_id + "|" + applicant
#     application_ids: DynArray[str]

#     # Milestones
#     milestones: TreeMap[str, Milestone]       # milestone_id -> Milestone
#     milestone_ids: DynArray[str]              # all milestone ids

#     # Disputes
#     disputes: TreeMap[str, Dispute]           # key = job_id

#     def __init__(self):
#         pass

#     # ==================== HELPERS ====================

#     def _application_key(self, job_id: str, applicant: str) -> str:
#         return job_id + "|" + applicant

#     # ==================== FAUCET ====================


#     @gl.public.write.payable
#     def send(self, recipient: str) -> None:
#         v = gl.message.value
#         if v == u256(0):
#             raise gl.vm.UserError("send some value")
#         gl.get_contract_at(Address(recipient)).emit_transfer(value=v) 
   
#     # ==================== PROFILE ====================



#     @gl.public.write
#     def create_profile(self, username: str, bio: str, role: str) -> None:
#         assert role in ["client", "freelancer"], "Role must be client or freelancer"

#         address = gl.message.sender_address

#         self.user_profiles[address] = UserProfile(
#             username=username,
#             bio=bio,
#             role=role,
#             reputation_score="100",
#             jobs_completed="0",
#             active_jobs="0",
#             total_earned="0",
#             total_spent="0",
#             success_rate="100",
#         )

#     @gl.public.view
#     def fetch_profile(self, account_address: str) -> UserProfile:
#         addr = Address(account_address)
#         return self.user_profiles[addr]

#     @gl.public.view
#     def profile_exists(self, account_address: str) -> bool:
#         addr = Address(account_address)
#         return addr in self.user_profiles

#     # ==================== JOBS ====================

#     @gl.public.write
#     def create_job(
#         self,
#         job_id: str,
#         title: str,
#         description: str,
#         category: str,
#         budget: str,
#         deadline: str,
#         is_public: bool,
#         milestone_titles: list[str],
#     ) -> None:
#         # assert job_id not in self.jobs, "Job ID already exists"

#         client_address = gl.message.sender_address
#         assert client_address in self.user_profiles, "Client profile not found"
#         assert self.user_profiles[client_address].role == "client", "Only clients can post jobs"

#         self.jobs[job_id] = Job(
#             job_id=job_id,
#             title=title,
#             description=description,
#             category=category,
#             client=client_address.as_hex,
#             freelancer="",
#             escrow_amount=budget,  # using passed budget for now
#             deadline=deadline,
#             is_public=is_public,
#             status="active",
#             deliverable_url="",
#             deliverable_note="",
#             ai_verdict="",
#             ai_reasoning="",
#             ai_auto_assigned=False,
#             ai_assignment_reason="",
#         )

#         self.job_ids.append(job_id)

#         for i in range(len(milestone_titles)):
#             milestone_id = job_id + "_ms_" + str(i)

#             self.milestones[milestone_id] = Milestone(
#                 milestone_id=milestone_id,
#                 job_id=job_id,
#                 title=milestone_titles[i],
#                 status="pending",
#                 deliverable_url="",
#                 ai_verdict="",
#                 ai_reasoning="",
#             )

#             self.milestone_ids.append(milestone_id)

#         current_spent = int(self.user_profiles[client_address].total_spent)
#         self.user_profiles[client_address].total_spent = str(current_spent + int(budget))



#     @gl.public.view
#     def fetch_jobs(self) -> list[Job]:
#         result = []
#         for job_id in self.job_ids:
#             result.append(self.jobs[job_id])
#         return result

#     @gl.public.view
#     def fetch_job_by_id(self, job_id: str) -> Job:
#         assert job_id in self.jobs, "Job not found"
#         return self.jobs[job_id]



#     @gl.public.view
#     def get_client_jobs(self, client_address: str) -> list[Job]:
#         result = []
#         for job_id in self.job_ids:
#             if self.jobs[job_id].client == client_address:
#                 result.append(self.jobs[job_id])
#         return result

#     @gl.public.view
#     def get_freelancer_jobs(self, freelancer_address: str) -> list[Job]:
#         result = []
#         for job_id in self.job_ids:
#             if self.jobs[job_id].freelancer == freelancer_address:
#                 result.append(self.jobs[job_id])
#         return result

#     # ==================== APPLICATIONS ====================

#     @gl.public.write
#     def apply_for_job(self, job_id: str, cover_note: str) -> None:
#         assert job_id in self.jobs, "Job not found"

#         job = self.jobs[job_id]
#         assert job.is_public, "Job is not public"
#         assert job.status == "active", "Job is not accepting applications"

#         applicant = gl.message.sender_address.as_hex
#         assert applicant != job.client, "Client cannot apply to own job"

#         if Address(applicant) in self.user_profiles:
#             assert self.user_profiles[Address(applicant)].role == "freelancer", "Only freelancers can apply"

#         app_key = self._application_key(job_id, applicant)
#         assert app_key not in self.applications, "Already applied"

#         self.applications[app_key] = Application(
#             job_id=job_id,
#             applicant=applicant,
#             cover_note=cover_note,
#             status="pending",
#             ai_score="0",
#             ai_recommendation="",
#         )

#         self.application_ids.append(app_key)

#     @gl.public.view
#     def get_applications(self, job_id: str) -> list[Application]:
#         result = []
#         for app_id in self.application_ids:
#             app = self.applications[app_id]
#             if app.job_id == job_id:
#                 result.append(app)
#         return result

#     @gl.public.write
#     def reject_applicant(self, job_id: str, applicant_address: str) -> None:
#         assert job_id in self.jobs, "Job not found"
#         assert self.jobs[job_id].client == gl.message.sender_address.as_hex, "Not the client"

#         app_key = self._application_key(job_id, applicant_address)
#         assert app_key in self.applications, "Applicant not found"

#         self.applications[app_key].status = "rejected"

#     @gl.public.write
#     def select_freelancer(self, job_id: str, freelancer_address: str) -> None:
#         assert job_id in self.jobs, "Job not found"

#         job = self.jobs[job_id]
#         assert job.client == gl.message.sender_address.as_hex, "Not the client"
#         assert job.status == "active", "Job is not active"

#         selected_key = self._application_key(job_id, freelancer_address)
#         assert selected_key in self.applications, "Applicant not found"

#         self.jobs[job_id].freelancer = freelancer_address
#         self.jobs[job_id].status = "in_progress"
#         self.applications[selected_key].status = "selected"

#         for app_id in self.application_ids:
#             app = self.applications[app_id]
#             if app.job_id == job_id and app.applicant != freelancer_address:
#                 self.applications[app_id].status = "rejected"

#         freelancer_addr = Address(freelancer_address)
#         if freelancer_addr in self.user_profiles:
#             current_active = int(self.user_profiles[freelancer_addr].active_jobs)
#             self.user_profiles[freelancer_addr].active_jobs = str(current_active + 1)

#     # ==================== AI SHORTLIST ====================

#     @gl.public.write
#     def ai_shortlist_applicants(self, job_id: str) -> str:
#         assert job_id in self.jobs, "Job not found"

#         job = self.jobs[job_id]
#         assert job.client == gl.message.sender_address.as_hex, "Not the client"

#         milestone_summary = ""
#         milestone_count = 0

#         for milestone_id in self.milestone_ids:
#             milestone = self.milestones[milestone_id]
#             if milestone.job_id == job_id:
#                 milestone_summary += "Requirement: " + milestone.title + "\n"
#                 milestone_count += 1

#         assert milestone_count > 0, "No milestones found for this job"

#         applicant_summaries = ""
#         found_any = False

#         for app_id in self.application_ids:
#             app = self.applications[app_id]
#             if app.job_id == job_id:
#                 found_any = True
#                 addr = app.applicant

#                 profile_data = ""
#                 if Address(addr) in self.user_profiles:
#                     profile = self.user_profiles[Address(addr)]
#                     profile_data = (
#                         "Reputation Score: " + profile.reputation_score + "\n" +
#                         "Jobs Completed: " + profile.jobs_completed + "\n" +
#                         "Success Rate: " + profile.success_rate + "%\n"
#                     )

#                 applicant_summaries += (
#                     "Applicant: " + addr + "\n" +
#                     "Cover Note: " + app.cover_note + "\n" +
#                     profile_data +
#                     "---\n"
#                 )

#         assert found_any, "No applications yet"

#         prompt = f"""
# You are evaluating freelancer applications for a freelance job.

# JOB TITLE:
# {job.title}

# JOB DESCRIPTION:
# {job.description}

# JOB CATEGORY:
# {job.category}

# JOB REQUIREMENTS / MILESTONES:
# {milestone_summary}

# APPLICANTS:
# {applicant_summaries}

# Your task:
# Rank applicants from most to least suitable.

# Base your ranking on:
# 1. How well their cover note matches the job description
# 2. How well they appear able to satisfy the milestone requirements
# 3. Reputation score
# 4. Jobs completed
# 5. Success rate

# Return ONLY in this exact format:

# RANK: [number]
# ADDRESS: [wallet address]
# SCORE: [0-100]
# REASON: [one sentence]
# ---
# """

#         def nondet():
#             return gl.nondet.exec_prompt(prompt)

#         result = gl.eq_principle.prompt_comparative(
#             nondet,
#             principle="Applicants should be ranked by strongest overall fit based on milestone relevance, job description fit, cover note quality, reputation score, completed jobs, and success rate."
#         )

#         lines = result.split("\n")
#         current_address = ""

#         for line in lines:
#             line = line.strip()

#             if line.startswith("ADDRESS:"):
#                 current_address = line.replace("ADDRESS:", "").strip()

#             elif line.startswith("SCORE:") and current_address != "":
#                 score = line.replace("SCORE:", "").strip()
#                 app_key = self._application_key(job_id, current_address)

#                 if app_key in self.applications:
#                     self.applications[app_key].ai_score = score
#                     self.applications[app_key].status = "shortlisted"

#             elif line.startswith("REASON:") and current_address != "":
#                 reason = line.replace("REASON:", "").strip()
#                 app_key = self._application_key(job_id, current_address)

#                 if app_key in self.applications:
#                     self.applications[app_key].ai_recommendation = reason

#         return result

#     # ==================== MILESTONES ====================

#     # @gl.public.write
#     # def add_milestone(self, job_id: str, milestone_id: str, title: str) -> None:
#     #     assert job_id in self.jobs, "Job not found"
#     #     job = self.jobs[job_id]

#     #     assert job.client == gl.message.sender_address.as_hex, "Not the client"
#     #     assert job.status in ["active", "in_progress"], "Job must be active or in progress"
#     #     assert milestone_id not in self.milestones, "Milestone already exists"

#     #     self.milestones[milestone_id] = Milestone(
#     #         milestone_id=milestone_id,
#     #         job_id=job_id,
#     #         title=title,
#     #         status="pending",
#     #         deliverable_url="",
#     #         ai_verdict="",
#     #         ai_reasoning="",
#     #     )

#     #     self.milestone_ids.append(milestone_id)

#     @gl.public.view
#     def get_job_milestones(self, job_id: str) -> list[Milestone]:
#         result = []
#         for milestone_id in self.milestone_ids:
#             milestone = self.milestones[milestone_id]
#             if milestone.job_id == job_id:
#                 result.append(milestone)
#         return result

#     # ==================== DELIVERABLE ====================

#     @gl.public.write
#     def submit_deliverable(self, job_id: str, proof_url: str, note: str) -> None:
#         assert job_id in self.jobs, "Job not found"

#         job = self.jobs[job_id]
#         assert job.freelancer == gl.message.sender_address.as_hex, "Not the assigned freelancer"
#         assert job.status in ["active", "in_progress"], "Job is not active"

#         self.jobs[job_id].deliverable_url = proof_url
#         self.jobs[job_id].deliverable_note = note
#         self.jobs[job_id].status = "pending_review"

#     # ==================== AI VERIFICATION ====================

#     @gl.public.write
#     def verify_and_pay(self, job_id: str) -> str:
#         assert job_id in self.jobs, "Job not found"

#         job = self.jobs[job_id]
#         assert job.status == "pending_review", "Job is not pending review"
#         assert job.deliverable_url != "", "No deliverable submitted"
#         assert job.freelancer != "", "No freelancer assigned"
#         assert job.client == gl.message.sender_address.as_hex, "Only client can verify and pay"

#         milestone_summary = ""
#         milestone_count = 0

#         for milestone_id in self.milestone_ids:
#             milestone = self.milestones[milestone_id]
#             if milestone.job_id == job_id:
#                 milestone_summary += (
#                     "Milestone ID: " + milestone.milestone_id + "\n" +
#                     "Checklist Item: " + milestone.title + "\n" +
#                     "---\n"
#                 )
#                 milestone_count += 1

#         assert milestone_count > 0, "No milestones found for this job"

#         proof_url = job.deliverable_url

#         def nondet():
#             deliverable_content = gl.nondet.web.get(proof_url).body.decode("utf-8")

#             prompt = f"""
# You are a strict but fair freelance job evaluator.

# JOB TITLE:
# {job.title}

# JOB CATEGORY:
# {job.category}

# JOB DESCRIPTION:
# {job.description}

# ACCEPTANCE CHECKLIST:
# {milestone_summary}

# FREELANCER NOTE:
# {job.deliverable_note}

# DELIVERABLE CONTENT:
# {deliverable_content[:4000]}

# Your task:
# 1. Check whether the deliverable satisfies EVERY checklist item.
# 2. If even ONE important checklist item is not met, VERDICT must be NO.
# 3. Only return YES if the freelancer fully deserves payment.

# Return ONLY in this exact format:

# VERDICT: YES or NO
# SCORE: [0-100]
# REASONING: [2-4 sentences]
# MILESTONE_CHECK:
# - [milestone_id] | [checklist item] | YES or NO
# - [milestone_id] | [checklist item] | YES or NO
# """
#             return gl.nondet.exec_prompt(prompt)

#         result = gl.eq_principle.prompt_comparative(
#             nondet,
#             principle="The final verdict must only be YES if the deliverable clearly satisfies all checklist items. If any important checklist item is not met, verdict must be NO."
#         )

#         verdict_passed = "VERDICT: YES" in result.upper()

#         self.jobs[job_id].ai_verdict = "passed" if verdict_passed else "failed"
#         self.jobs[job_id].ai_reasoning = result

#         lines = result.split("\n")
#         for line in lines:
#             line = line.strip()
#             if line.startswith("- "):
#                 cleaned = line[2:]
#                 parts = cleaned.split("|")
#                 if len(parts) == 3:
#                     ms_id = parts[0].strip()
#                     verdict = parts[2].strip().upper()

#                     if ms_id in self.milestones:
#                         self.milestones[ms_id].status = "completed" if verdict == "YES" else "rejected"
#                         self.milestones[ms_id].ai_verdict = "passed" if verdict == "YES" else "failed"
#                         self.milestones[ms_id].ai_reasoning = "Verified during final payment review"

#         freelancer_addr = Address(job.freelancer)
#         escrow_amount = int(job.escrow_amount)

#         if verdict_passed:
#             gl.send(freelancer_addr, escrow_amount)
#             self.jobs[job_id].status = "completed"

#             if freelancer_addr in self.user_profiles:
#                 current_completed = int(self.user_profiles[freelancer_addr].jobs_completed)
#                 current_active = int(self.user_profiles[freelancer_addr].active_jobs)
#                 current_earned = int(self.user_profiles[freelancer_addr].total_earned)

#                 self.user_profiles[freelancer_addr].jobs_completed = str(current_completed + 1)
#                 self.user_profiles[freelancer_addr].active_jobs = str(max(0, current_active - 1))
#                 self.user_profiles[freelancer_addr].total_earned = str(current_earned + escrow_amount)

#         else:
#             self.jobs[job_id].status = "revision_requested"

#         return result

#     # ==================== MILESTONE VERIFICATION ====================

#     @gl.public.write
#     def verify_milestone(self, job_id: str, milestone_id: str, proof_url: str) -> str:
#         assert job_id in self.jobs, "Job not found"
#         assert milestone_id in self.milestones, "Milestone not found"

#         job = self.jobs[job_id]
#         milestone = self.milestones[milestone_id]

#         assert milestone.job_id == job_id, "Milestone does not belong to this job"
#         assert milestone.status == "pending", "Milestone already processed"

#         job_title = job.title
#         job_description = job.description
#         milestone_title = milestone.title

#         def nondet():
#             content = gl.nondet.web.get(proof_url).body.decode("utf-8")
#             prompt = f"""
# You are checking a single freelance job acceptance checklist item.

# JOB TITLE:
# {job_title}

# JOB DESCRIPTION:
# {job_description}

# CHECKLIST ITEM:
# {milestone_title}

# DELIVERABLE CONTENT:
# {content[:3000]}

# Return ONLY in this exact format:

# VERDICT: YES or NO
# REASONING: [2 sentences max]
# """
#             return gl.nondet.exec_prompt(prompt)

#         result = gl.eq_principle.prompt_comparative(
#             nondet,
#             principle="The verdict must correctly determine whether the submitted deliverable satisfies this specific acceptance checklist item."
#         )

#         passed = "VERDICT: YES" in result.upper()

#         self.milestones[milestone_id].ai_verdict = "passed" if passed else "failed"
#         self.milestones[milestone_id].ai_reasoning = result
#         self.milestones[milestone_id].status = "completed" if passed else "rejected"

#         return result

#     # ==================== DISPUTES ====================

#     @gl.public.write
#     def raise_dispute(self, job_id: str, context_url: str, explanation: str) -> str:
#         assert job_id in self.jobs, "Job not found"
#         job = self.jobs[job_id]
#         assert job.freelancer == gl.message.sender_address.as_hex, "Not the freelancer"
#         assert job.status == "revision_requested", "Can only dispute revision requests"

#         milestone_summary = ""
#         milestone_count = 0

#         for milestone_id in self.milestone_ids:
#             milestone = self.milestones[milestone_id]
#             if milestone.job_id == job_id:
#                 milestone_summary += (
#                     "Milestone ID: " + milestone.milestone_id + "\n" +
#                     "Milestone Title: " + milestone.title + "\n" +
#                     "Current Status: " + milestone.status + "\n" +
#                     "Previous AI Verdict: " + milestone.ai_verdict + "\n" +
#                     "Previous AI Reasoning: " + milestone.ai_reasoning + "\n" +
#                     "---\n"
#                 )
#                 milestone_count += 1

#         assert milestone_count > 0, "No milestones found for this job"

#         deliverable_url = job.deliverable_url
#         previous_reasoning = job.ai_reasoning
#         job_title = job.title
#         job_description = job.description

#         def nondet():
#             original_content = gl.nondet.web.get(deliverable_url).body.decode("utf-8")
#             additional_context = gl.nondet.web.get(context_url).body.decode("utf-8")

#             prompt = f"""
# A freelancer is disputing a failed job verification.

# Job Title: {job_title}
# Job Description: {job_description}

# MILESTONES TO VERIFY:
# {milestone_summary}

# ORIGINAL DELIVERABLE CONTENT:
# {original_content[:2000]}

# FREELANCER EXPLANATION:
# {explanation}

# ADDITIONAL EVIDENCE PROVIDED:
# {additional_context[:2000]}

# PREVIOUS AI REASONING:
# {previous_reasoning}

# Re-evaluate carefully. Check each milestone against the deliverable and additional evidence.
# Has the freelancer provided sufficient evidence that ALL milestones are completed?

# Return ONLY in this exact format:

# VERDICT: YES or NO
# REASONING: [3 sentences explaining your final decision]
# MILESTONE_CHECK:
# - [milestone_id] | [milestone title] | YES or NO
# - [milestone_id] | [milestone title] | YES or NO
# """
#             return gl.nondet.exec_prompt(prompt)

#         result = gl.eq_principle.prompt_comparative(
#             nondet,
#             principle="The verdict must only be YES if the additional evidence clearly shows ALL milestones were completed. If any milestone is still unmet, verdict must be NO."
#         )

#         dispute_passed = "VERDICT: YES" in result.upper()

#         self.disputes[job_id] = Dispute(
#             job_id=job_id,
#             context_url=context_url,
#             explanation=explanation,
#             verdict="upheld" if dispute_passed else "rejected",
#             reasoning=result,
#         )

#         freelancer_addr = Address(job.freelancer)
#         escrow_amount = int(job.escrow_amount)

#         if dispute_passed:
#             gl.send(freelancer_addr, escrow_amount)
#             self.jobs[job_id].status = "completed"

#             if freelancer_addr in self.user_profiles:
#                 current_completed = int(self.user_profiles[freelancer_addr].jobs_completed)
#                 current_active = int(self.user_profiles[freelancer_addr].active_jobs)
#                 current_earned = int(self.user_profiles[freelancer_addr].total_earned)

#                 self.user_profiles[freelancer_addr].jobs_completed = str(current_completed + 1)
#                 self.user_profiles[freelancer_addr].active_jobs = str(max(0, current_active - 1))
#                 self.user_profiles[freelancer_addr].total_earned = str(current_earned + escrow_amount)

#             lines = result.split("\n")
#             for line in lines:
#                 line = line.strip()
#                 if line.startswith("- "):
#                     cleaned = line[2:]
#                     parts = cleaned.split("|")
#                     if len(parts) == 3:
#                         ms_id = parts[0].strip()
#                         verdict = parts[2].strip().upper()

#                         if ms_id in self.milestones:
#                             self.milestones[ms_id].status = "completed" if verdict == "YES" else "rejected"
#                             self.milestones[ms_id].ai_verdict = "passed" if verdict == "YES" else "failed"
#                             self.milestones[ms_id].ai_reasoning = "Verified during dispute resolution"

#         else:
#             self.jobs[job_id].status = "dispute_closed"

#         return result