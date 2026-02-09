// utils/useCaseMapper.js
import Tool from '../../models/toolModel.js';

/**
 * Generates use cases dynamically from database
 */
export async function useCaseMap(intent) {
  try {
    console.log("🔍 Fetching use cases for intent:", intent);

    // Find all tools matching the intent
    const tools = await Tool.find({
      status: 'live',
      $or: [
        { primaryCategory: new RegExp(intent, 'i') },
        { intentTags: new RegExp(intent, 'i') }
      ]
    }).select('useCases intentTags').lean();

    console.log("📦 Tools found for intent:", tools.length);

    // Extract unique use cases
    const useCasesSet = new Set();
    
    tools.forEach(tool => {
      // Add use cases from tool
      if (tool.useCases && Array.isArray(tool.useCases)) {
        tool.useCases.forEach(uc => useCasesSet.add(uc));
      }
      
      // Add intent tags as potential use cases
      if (tool.intentTags && Array.isArray(tool.intentTags)) {
        tool.intentTags.forEach(tag => useCasesSet.add(tag));
      }
    });

    let useCases = Array.from(useCasesSet);

    console.log("📋 Unique use cases found:", useCases.length);

    // If no use cases found, provide generic ones
    if (useCases.length === 0) {
      console.log("⚠️ No use cases found, using fallback");
      useCases = [
        "general-productivity",
        "automation",
        "content-creation",
        "data-analysis",
        "design-tools",
        "coding-assistance"
      ];
    }

    // Limit to top 8 most relevant
    const result = useCases.slice(0, 8);
    
    console.log("✅ Returning use cases:", result);

    return result;

  } catch (error) {
    console.error("❌ Use case mapping error:", error);
    return ["explore-all-tools"];
  }
} 
