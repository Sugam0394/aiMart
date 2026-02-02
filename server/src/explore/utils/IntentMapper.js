// intent.mapper.js

const INTENT_KEYWORDS = {
  STUDY: ["study", "learn", "exam", "notes", "homework", "revision"],
  CREATE: ["write", "content", "design", "video", "blog", "post"],
  BUSINESS: ["business", "startup", "marketing", "sales", "grow"],
  CODE: ["code", "programming", "developer", "javascript", "python"],
};

 // intent.mapper.js
export function mapIntent(rawIntent = "") {
  if (!rawIntent) return "GENERAL"; // Safety check
  
  const normalized = rawIntent.toLowerCase();

  for (const [intent, keywords] of Object.entries(INTENT_KEYWORDS)) {
    // Check for whole word match to avoid partial string bugs
    if (keywords.some((word) => normalized.includes(word))) {
      return intent;
    }
  }
  return "GENERAL";
}

// usecase.mapper.js
export async function useCaseMap(intent) {
  // Direct lookup is faster than a function call sometimes
  return INTENT_USECASES[intent] || INTENT_USECASES.GENERAL;
}
