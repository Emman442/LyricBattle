export const parseAIVerification = (reasoning: string) => {
  if (!reasoning) return null;

  const result: any = {
    verdict: "unknown",
    score: 0,
    reasoning: "",
    milestoneChecks: [],
  };

  const lines = reasoning.split("\n").map(line => line.trim());

  for (const line of lines) {
    if (line.startsWith("VERDICT:")) {
      result.verdict = line.replace("VERDICT:", "").trim().toLowerCase();
    } else if (line.startsWith("SCORE:")) {
      result.score = parseInt(line.replace("SCORE:", "").trim()) || 0;
    } else if (line.startsWith("REASONING:")) {
      result.reasoning = line.replace("REASONING:", "").trim();
    } else if (line.startsWith("- ")) {
      // Parse milestone check: - milestone_id | item | YES/NO
      const parts = line.substring(2).split("|").map(p => p.trim());
      if (parts.length >= 3) {
        result.milestoneChecks.push({
          milestoneId: parts[0],
          item: parts[1],
          verdict: parts[2].toUpperCase(),
        });
      }
    }
  }

  return result;
};