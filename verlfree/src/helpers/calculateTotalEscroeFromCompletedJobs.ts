/**
 * Calculates the total escrow amount from an array of completed jobs
 * @param jobs - Array of job objects (completed jobs)
 * @returns Total sum of escrow_amount as a number
 */
export const calculateTotalEscrowFromCompletedJobs = (jobs: any[]): number => {
  if (!Array.isArray(jobs) || jobs.length === 0) {
    return 0;
  }

  return jobs.reduce((total, job) => {
    // Convert escrow_amount to number safely
    const amount = parseFloat(job.escrow_amount || "0");
    return total + (isNaN(amount) ? 0 : amount);
  }, 0);
};