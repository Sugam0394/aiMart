 

const intentAliasMap = {
  // Content & Writing
  "writing":          ["writing", "content", "copywriting", "blog", "article", "essay"],
  "content":          ["content", "writing", "blog", "copywriting", "social media post", "creative writing"],
  "email":            ["email", "cold outreach", "newsletter", "inbox", "cold email", "sales outreach"],
  "marketing":        ["marketing", "ads", "copywriting", "growth", "campaign", "social media marketing"],
  
  // Visuals & Design
  "design":           ["design", "logo", "banner", "thumbnail", "graphic design", "visuals", "ui ux"],
  "logo":             ["logo", "brand identity", "icon", "branding", "logo maker"],
  "image":            ["image", "photo", "picture", "ai art", "image generator", "midjourney", "stable diffusion"],
  "video":            ["video", "youtube", "reels", "shorts", "video editing", "animation", "avatar"],
  
  // Tech & Development
  "coding":           ["code", "developer", "programming", "debug", "github", "script", "software"],
  "automation":       ["automate", "workflow", "zapier", "n8n", "no-code", "auto", "integration"],
  "seo":              ["seo", "keyword research", "backlink", "search ranking", "traffic", "optimization"],
  
  // Productivity & Business
  "research":         ["research", "summarize", "notes", "study", "reading", "pdf ai", "analysis"],
  "chatbot":          ["chatbot", "ai assistant", "bot", "customer support ai", "chatgpt"],
  "presentation":     ["presentation", "slides", "pitch deck", "powerpoint", "canva"],
  "social media":     ["social media", "instagram", "twitter", "linkedin", "scheduling", "post generator"],
  "audio":            ["audio", "voice", "text to speech", "podcast", "music", "cloning"]
};

 
export const expandSearchTerms = (term) => {
  if (!term) return [];
  
  const lower = term.toLowerCase().trim();
  const expandedSet = new Set([lower]); // Original term hamesha rahega

  // Map check karega ki user ne jo likha hai wo kisi key mein hai ya nahi
  for (const [key, aliases] of Object.entries(intentAliasMap)) {
    if (lower.includes(key)) {
      aliases.forEach(alias => expandedSet.add(alias));
    }
  }

  return [...expandedSet];
};