 // moment.mapper.js

export function momentMapper({ intent, useCase }) {
  const context = {};

  context.intent = intent;
  context.useCase = useCase;

  // basic heuristics (V1)
  if (intent === "STUDY" && useCase === "exam-prep") {
    context.priority = "HIGH";
    context.recommendationStyle = "FAST";
  } else {
    context.priority = "NORMAL";
    context.recommendationStyle = "STANDARD";
  }

  return context;
}

 
