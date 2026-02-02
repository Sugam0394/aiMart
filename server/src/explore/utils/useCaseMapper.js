 
// usecase.mapper.js

const INTENT_USECASES = {
  STUDY: [
    "summarize-notes",
    "exam-prep",
    "homework-help",
    "concept-explainer",
  ],
  CREATE: [
    "write-content",
    "design-faster",
    "video-generation",
  ],
  BUSINESS: [
    "grow-business",
    "marketing-copy",
    "analytics",
  ],
  CODE: [
    "code-generation",
    "debugging",
    "learning-programming",
  ],
  GENERAL: [
    "explore-tools",
  ],
};

export async function useCaseMap(intent) {
  return INTENT_USECASES[intent] || INTENT_USECASES.GENERAL;
}
