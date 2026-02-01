
import { useCaseMap } from "../moment/useCaseMap.js";



// section - 3: Derive Use Cases From Tool
export const deriveUseCasesFromTool = ({
  intentTags = [],
  primaryCategory = "",
  categories = [],
  outputTypes = []
}) => {
  const signals = [
    ...intentTags,
    primaryCategory,
    ...categories,
    ...outputTypes
  ]
    .filter(Boolean)
    .map(item => item.toLowerCase());

  const matchedUseCases = new Set();

  for (const [useCase, keywords] of Object.entries(useCaseMap)) {
    const hasMatch = signals.some(signal =>
      keywords.includes(signal)
    );

    if (hasMatch) {
      matchedUseCases.add(useCase);
    }
  }

  return Array.from(matchedUseCases);
};