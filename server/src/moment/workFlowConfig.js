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
  marketer: {
    headline: "Viral campaigns banana hai?",
    subline: "Agency ke bina brand grow karo",
    timeSaved: "20 hrs/week",
    steps: [
      { stepNumber: 1, action: "Ad copy likhna", toolSlug: "copy-ai", timeSaved: "4 hrs", why: "10x copies in minutes", prompt: "Write 5 Facebook ad variations for [product] targeting [audience] in India. Focus on pain point: [problem]." },
      { stepNumber: 2, action: "Social media schedule karo", toolSlug: "buffer", timeSaved: "5 hrs", why: "Plan a whole week in one sitting", prompt: "Create a 7-day Instagram content calendar for [brand] in [niche]. Include captions and hashtags." },
      { stepNumber: 3, action: "SEO content banao", toolSlug: "surfer-seo", timeSaved: "6 hrs", why: "Rank on Google without an agency", prompt: "Write an SEO-optimized blog post for keyword '[keyword]'. Include H2s, meta description, and internal link suggestions." },
      { stepNumber: 4, action: "Email campaign design karo", toolSlug: "chatgpt", timeSaved: "3 hrs", why: "Personalized emails at scale", prompt: "Write a 3-email drip campaign for [product] targeting [segment]. Email 1: Welcome. Email 2: Value. Email 3: Offer." },
      { stepNumber: 5, action: "Analytics report banao", toolSlug: "chatgpt", timeSaved: "2 hrs", why: "Data insights in plain language", prompt: "Analyze this campaign data and tell me: what worked, what didn't, and 3 improvements for next month." },
    ]
  },
  freelancer: {
    headline: "Client income double karna hai?",
    subline: "Smart kaam karo, zyada kamao",
    timeSaved: "15 hrs/week",
    steps: [
      { stepNumber: 1, action: "Proposal likhna", toolSlug: "chatgpt", timeSaved: "3 hrs", why: "Win-rate 3x improve hota hai", prompt: "Write a professional project proposal for [client] for [service]. Budget: [amount]. Deliverables: [list]. Include timeline and why choose me section." },
      { stepNumber: 2, action: "Portfolio design karo", toolSlug: "canva", timeSaved: "5 hrs", why: "Professional portfolio in 1 hour", prompt: "Design a minimal portfolio layout for a freelance [designer/writer/developer]. Include: hero section, 3 case studies, testimonials, contact CTA." },
      { stepNumber: 3, action: "Client emails likhna", toolSlug: "chatgpt", timeSaved: "3 hrs", why: "Never miss a follow-up", prompt: "Write a polite follow-up email to [client name] about [project]. It has been [X] days since my last message. Keep it under 80 words." },
      { stepNumber: 4, action: "Invoice banao", toolSlug: "canva", timeSaved: "2 hrs", why: "Professional invoices in 5 minutes", prompt: "Create a clean invoice template for freelance services. Include: service name, hours, rate, total, payment terms, bank details." },
      { stepNumber: 5, action: "Contract draft karo", toolSlug: "chatgpt", timeSaved: "2 hrs", why: "Protect yourself legally", prompt: "Draft a simple freelance contract for [service type]. Include: scope, payment, revisions, IP ownership, and termination clause." },
    ]
  },
  creator: {
    headline: "Viral content banana hai?",
    subline: "Boring kaam AI pe chodo",
    timeSaved: "22 hrs/week",
    steps: [
      { stepNumber: 1, action: "Video script likhna", toolSlug: "chatgpt", timeSaved: "5 hrs", why: "Engaging scripts in 10 minutes", prompt: "Write a YouTube script for a [duration] video about [topic]. Include: hook, 3 main points, CTA. Target audience: [audience]. Style: [casual/educational]." },
      { stepNumber: 2, action: "Thumbnail design karo", toolSlug: "canva", timeSaved: "4 hrs", why: "High CTR thumbnails fast", prompt: "Design a YouTube thumbnail for video: '[title]'. Use bold text, contrasting colors, and a face reaction. Make it clickbait-worthy but honest." },
      { stepNumber: 3, action: "Captions aur hooks likhna", toolSlug: "copy-ai", timeSaved: "4 hrs", why: "Instagram reach 5x hoti hai with good hooks", prompt: "Write 5 Instagram caption variations for this post about [topic]. Include: hook, value, CTA, and 15 relevant hashtags." },
      { stepNumber: 4, action: "Short form content banao", toolSlug: "canva", timeSaved: "5 hrs", why: "Reels/Shorts in bulk", prompt: "Create 5 ideas for 30-second Reels about [topic]. For each: opening hook, main value point, and end CTA." },
      { stepNumber: 5, action: "Podcast notes likhna", toolSlug: "chatgpt", timeSaved: "4 hrs", why: "Show notes in minutes", prompt: "Write podcast show notes for an episode about [topic] with guest [name]. Include: summary, 5 key takeaways, and timestamps." },
    ]
  },
  teacher: {
    headline: "Better teacher banana hai?",
    subline: "Students ko AI se engage karo",
    timeSaved: "12 hrs/week",
    steps: [
      { stepNumber: 1, action: "Lesson plan banao", toolSlug: "chatgpt", timeSaved: "3 hrs", why: "Structured plans in minutes", prompt: "Create a detailed lesson plan for teaching [topic] to [grade/age] students. Duration: [X] minutes. Include: objective, activities, and assessment." },
      { stepNumber: 2, action: "Quiz aur assignment banao", toolSlug: "chatgpt", timeSaved: "4 hrs", why: "Varied question types instantly", prompt: "Create a 10-question quiz on [topic] for [grade] students. Include: 5 MCQs, 3 short answer, 2 application questions. Add answer key." },
      { stepNumber: 3, action: "Presentation design karo", toolSlug: "gamma-ai", timeSaved: "3 hrs", why: "Beautiful slides in one paragraph", prompt: "Create a classroom presentation on [topic] for [grade] students. 8 slides. Use simple language, visuals, and 1 interactive activity." },
      { stepNumber: 4, action: "Student feedback likhna", toolSlug: "chatgpt", timeSaved: "1 hr", why: "Personalized feedback at scale", prompt: "Write constructive feedback for a student who [specific observation]. Mention: 2 strengths, 1 improvement area, and an encouragement." },
      { stepNumber: 5, action: "Parent communication karo", toolSlug: "chatgpt", timeSaved: "1 hr", why: "Professional emails quickly", prompt: "Write a parent newsletter update for [month]. Include: class highlights, upcoming events, and 3 tips to support learning at home." },
    ]
  },

  // Note: Aap isi tarah Freelancer, Marketer, Teacher, aur Creator roles bhi add kar sakte hain as per the doc
};