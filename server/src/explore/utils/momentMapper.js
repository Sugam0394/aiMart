 // utils/momentMapper.js




export function momentMapper({ intent, useCase, userHistory = [] }) {
  const context = {
    intent,
    useCase,
    timestamp: new Date(),
    priority: "NORMAL",
    recommendationStyle: "STANDARD",
    userSegment: "explorer"
  };

  // Urgency detection
  const urgentKeywords = ["urgent", "quick", "fast", "now", "asap", "exam", "deadline"];
  const isUrgent = urgentKeywords.some(kw => 
    intent?.toLowerCase().includes(kw) || 
    useCase?.toLowerCase().includes(kw)
  );

  if (isUrgent) {
    context.priority = "HIGH";
    context.recommendationStyle = "FAST";
  }

  // Professional vs Student detection
  const professionalKeywords = ["business", "marketing", "enterprise", "sales"];
  const studentKeywords = ["study", "learn", "exam", "homework", "school"];

  if (professionalKeywords.some(kw => intent?.toLowerCase().includes(kw))) {
    context.userSegment = "professional";
    context.recommendationStyle = "PREMIUM_FIRST";
  } else if (studentKeywords.some(kw => intent?.toLowerCase().includes(kw))) {
    context.userSegment = "student";
    context.recommendationStyle = "FREE_FIRST";
  }

  // Returning user detection
  if (userHistory && userHistory.length > 0) {
    context.isReturningUser = true;
    context.previousIntents = userHistory.map(h => h.intent);
  }

  // Time-based context
  const hour = new Date().getHours();
  if (hour >= 9 && hour <= 17) {
    context.timeContext = "work-hours";
  } else if (hour >= 22 || hour <= 6) {
    context.timeContext = "late-night";
  }

  return context;
} 

 
