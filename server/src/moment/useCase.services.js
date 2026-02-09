import { useCaseMap } from "../moment/useCaseMap.js";

export const deriveUseCasesFromTool = ({
  intentTags = [],
  primaryCategory = "",
  categories = [],
  outputTypes = []
}) => {
  // Saare signals ko ek array mein daalo aur lowercase karo
  const signals = [
    ...intentTags,
    primaryCategory,
    ...categories,
    ...outputTypes
  ]
    .filter(Boolean)
    .map(item => item.toLowerCase());

  const matchedUseCases = new Set();

  for (const [useCaseKey, keywords] of Object.entries(useCaseMap)) {
    // AI Power: Yeh check karta hai ki kya signal mein keyword hai ya keyword mein signal
    const hasMatch = signals.some(signal =>
      keywords.some(kw => signal.includes(kw) || kw.includes(signal))
    );

    if (hasMatch) {
      matchedUseCases.add(useCaseKey);
    }
  }

  return Array.from(matchedUseCases);
}; 