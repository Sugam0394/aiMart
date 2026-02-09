// utils/IntentMapper.js
import Tool from '../../models/toolModel.js';

/**
 * Dynamically maps user input to best matching intent from database
 */
export async function mapIntent(rawInput = "") {
  const input = rawInput.toLowerCase().trim();
  
  if (!input) {
    console.log("⚠️ Empty intent input, returning 'explore'");
    return "explore";
  }

  try {
    // Get all unique categories from live tools
    const categories = await Tool.distinct('primaryCategory', { status: 'live' });
    
    // Get popular intent tags
    const intentTags = await Tool.aggregate([
      { $match: { status: 'live' } },
      { $unwind: '$intentTags' },
      { $group: { _id: '$intentTags', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 20 }
    ]);

    console.log("📊 Available categories:", categories);
    console.log("📊 Top intent tags:", intentTags.map(t => t._id));

    // Smart matching with scoring
    let bestMatch = { intent: "explore", score: 0 };

    // Check against categories
    for (const category of categories) {
      const score = calculateMatchScore(input, category);
      if (score > bestMatch.score) {
        bestMatch = { intent: category, score };
      }
    }

    // Check against intent tags
    for (const tag of intentTags) {
      const score = calculateMatchScore(input, tag._id);
      if (score > bestMatch.score) {
        bestMatch = { intent: tag._id, score };
      }
    }

    console.log("🎯 Best match:", bestMatch.intent, "with score:", bestMatch.score);

    return bestMatch.intent;

  } catch (error) {
    console.error("❌ Intent mapping error:", error);
    return "explore";
  }
}

/**
 * Calculate fuzzy match score
 */
function calculateMatchScore(input, target) {
  const inputWords = input.split(/\s+/);
  const targetLower = target.toLowerCase();
  
  let score = 0;
  
  // Exact match
  if (input === targetLower) score += 10;
  
  // Contains match
  if (input.includes(targetLower) || targetLower.includes(input)) score += 5;
  
  // Word-level matching
  inputWords.forEach(word => {
    if (targetLower.includes(word) && word.length > 2) score += 2;
  });
  
  return score;
} 
