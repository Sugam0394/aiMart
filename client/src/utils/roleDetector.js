export const detectRoleFromIntent = (intentText) => {
  const text = intentText.toLowerCase();

  const mapping = {
    founder: ["business", "startup", "founder", "launch", "company", "idea", "product", "entrepreneur", "dukan", "startup"],
    student: ["study", "exam", "college", "school", "lecture", "assignment", "research", "homework", "padhai"],
    freelancer: ["client", "freelance", "gig", "project", "writing", "design", "work from home", "upwork"],
    marketer: ["ads", "marketing", "social media", "growth", "brand", "seo", "instagram", "promotion"],
    teacher: ["teach", "lesson", "student", "class", "classroom", "course", "teaching", "school teacher"],
    creator: ["youtube", "video", "content", "reels", "shorts", "editing", "influencer", "vlog"]
  };

  // Har role ke keywords check karo
  for (const [role, keywords] of Object.entries(mapping)) {
    if (keywords.some(keyword => text.includes(keyword))) {
      return role;
    }
  }

  return "founder"; // Agar kuch samajh na aaye toh default role
};