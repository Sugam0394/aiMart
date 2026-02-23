// Static mapping of roles to their specific AI steps
export const WORKFLOW_CONFIG = {
  founder: {
    headline: "Business launch karna hai?",
    subline: "1 hafte ka kaam → aaj ke 5 ghante",
    timeSaved: "23 hrs/week",
    steps: [
      { stepNumber: 1, action: "Market research karo", toolSlug: "perplexity-ai", timeSaved: "6 hrs", why: "Sourced answers in minutes instead of days of Googling", prompt: "Analyze the Indian market for [your product] — TAM, SAM, SOM with sources" },
      { stepNumber: 2, action: "Pitch deck banao", toolSlug: "gamma-ai", timeSaved: "8 hrs", why: "Gamma generates beautiful slides from one paragraph", prompt: "Create a 10-slide investor pitch for [product] targeting [audience] in [market]" },
      { stepNumber: 3, action: "Product copy likhna", toolSlug: "copy-ai", timeSaved: "3 hrs", why: "Landing page copy in 10 minutes instead of 3 hours", prompt: "Write a high-converting landing page for [product] — headline, 3 features, CTA" },
      { stepNumber: 4, action: "Logo aur visuals banao", toolSlug: "midjourney", timeSaved: "4 hrs", why: "Professional visuals without a designer", prompt: "Minimalist tech startup logo for [company], clean, modern, [color] palette" },
      { stepNumber: 5, action: "Outreach emails likhna", toolSlug: "smartwriter-ai", timeSaved: "2 hrs", why: "Personalized cold emails at scale", prompt: "Write a cold email to [investor/customer] about [product], keep it under 100 words" },
    ]
  },
  student: {
    headline: "Exams mein top karna hai?",
    subline: "Padhai smartly karo, hard nahi",
    timeSaved: "18 hrs/week",
    steps: [
      { stepNumber: 1, action: "Lecture notes summarize karo", toolSlug: "otter-ai", timeSaved: "4 hrs", why: "Auto-transcription + AI summary in real time", prompt: "Summarize these lecture notes into 10 key points with definitions" },
      { stepNumber: 2, action: "Research paper draft karo", toolSlug: "chatgpt", timeSaved: "8 hrs", why: "First draft in 20 min, then refine", prompt: "Write a research paper introduction on [topic] — include problem statement, thesis, scope" },
      { stepNumber: 3, action: "Flash cards banao", toolSlug: "quizlet", timeSaved: "2 hrs", why: "Instant spaced repetition cards from notes", prompt: "Convert these notes into 20 Q&A flashcards for exam revision" },
      { stepNumber: 4, action: "Doubts clear karo instantly", toolSlug: "wolfram-alpha", timeSaved: "2 hrs", why: "Step-by-step solutions for math/science", prompt: "Solve [equation] step by step and explain each step simply" },
      { stepNumber: 5, action: "Essay proofread karo", toolSlug: "grammarly", timeSaved: "2 hrs", why: "Grammar + clarity + plagiarism check in one", prompt: "Check this essay for grammar, clarity, and academic tone" },
    ]
  },
  // Note: Aap isi tarah Freelancer, Marketer, Teacher, aur Creator roles bhi add kar sakte hain as per the doc
};