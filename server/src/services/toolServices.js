 import Tool from "../models/toolModel.js";
 import { resolveTrendingMoment } from "../moment/trendingToolsMoment.js";
 import { useCaseMap } from "../moment/useCaseMap.js";
 


 // section - 1: Get Trending Tools Service
 export const getTrendingToolsService = async ({ intent, category }) => {
  const { primaryCategories , intentTags } =
    resolveTrendingMoment({ intent, category });

  // base query (always applied)
  const query = {
    status: "live",
  };

  if (primaryCategories?.length > 0) {
  query.$or = [
    { primaryCategory: { $in: primaryCategories } },
    { categories: { $in: primaryCategories } },
  ];
}

  // intent-based filtering (only if intent exists)
  if (intentTags && intentTags.length > 0) {
    query.intentTags = { $in: intentTags };
  }

  const tools = await Tool.find(query)
    .sort({
      isFeatured: -1,
      isPopular: -1,
      createdAt: -1,
    })
    .limit(6)
    .lean();

  return tools;
};

// section - 2: Search Tools Service
 export const searchToolsService = async (term, category) => {
  const query = {
    status: 'live',
  };

  const orConditions = [];

   if (term) {
    const safeTerm = term.toLowerCase();

    orConditions.push(
      { name: { $regex: safeTerm, $options: 'i' } },
      { intentTags: { $in: [safeTerm] } }
    );
  }


  if (category) {
    const safeCategory = category.toLowerCase();

    orConditions.push(
      { primaryCategory: safeCategory },
      { categories: { $in: [safeCategory] } }
    );
  }

  if (orConditions.length > 0) {
    query.$or = orConditions;
  }


  const tools = await Tool.find(query).lean();
  return tools;
};


 
 // section - 3: Get Tools By Use-Case Service
export const getToolsByUseCase = async (useCaseKey) => {
  // 1. Get keywords from the map based on the active key
  const keywords = useCaseMap[useCaseKey] || [];
  if (keywords.length === 0) return [];

  // 2. Create a regex pattern for broad matching (e.g., /coding|programming|dev/i)
  const keywordRegex = new RegExp(keywords.join('|'), 'i');

  const query = {
    status: "live",
    $or: [
      { useCases: { $in: [useCaseKey] } }, // Direct match if exists
      { primaryCategory: { $regex: keywordRegex } }, // Match primary category
      { intentTags: { $in: keywords.map(kw => new RegExp(kw, 'i')) } }, // Match any intent tags
      { name: { $regex: keywordRegex } }, // Match tool name for safety
      { categories: { $in: keywords.map(kw => new RegExp(kw, 'i')) } } // Match secondary categories
    ]
  };

  return await Tool.find(query)
    .select("name tagline logo intentTags primaryCategory pricingType slug isPopular isFeatured")
    .sort({ isFeatured: -1, isPopular: -1, createdAt: -1 })
    .limit(15) 
    .lean();
};



 
 

