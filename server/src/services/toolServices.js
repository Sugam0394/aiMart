 import Tool from "../models/toolModel.js";
 import { resolveTrendingMoment } from "../moment/trendingToolsMoment.js";
 import { useCaseMap } from "../moment/useCaseMap.js";
 


 // section - 1: Get Trending Tools Service
 export const getTrendingToolsService = async ({ intent, category }) => {
  const { primaryCategories, intentTags } = resolveTrendingMoment({ intent, category });

  const query = { status: "live" };
  const matchConditions = [];

  // Filter logic
  if (primaryCategories?.length > 0) {
    matchConditions.push({ primaryCategory: { $in: primaryCategories } });
    matchConditions.push({ categories: { $elemMatch: { $in: primaryCategories } } });
  }

  if (intentTags?.length > 0) {
    matchConditions.push({ intentTags: { $elemMatch: { $in: intentTags } } });
  }

  // ✅ FIX: Agar filters hain toh $or lagao, varna default live tools dikhao
  if (matchConditions.length > 0) {
    query.$or = matchConditions;
  }

  let tools = await Tool.aggregate([
    { $match: query },
    {
      $addFields: {
        score: {
          $add: [
            { $cond: [{ $eq: ["$isFeatured", true] }, 10, 0] },
            { $cond: [{ $eq: ["$isPopular", true] }, 5, 0] },
            { $multiply: ["$avgRating", 2] }
          ]
        }
      }
    },
    { $sort: { score: -1, createdAt: -1 } },
    { $limit: 12 },
    {
      $project: {
        name: 1, tagline: 1, logo: 1, slug: 1, 
        primaryCategory: 1, pricingType: 1, avgRating: 1
      }
    }
  ]);

  // 🔥 FALLBACK LOGIC: Agar filters se 0 result aaye, toh overall trending uthao
  if (tools.length === 0) {
    tools = await Tool.find({ status: "live" })
      .sort({ isFeatured: -1, isPopular: -1, avgRating: -1 })
      .limit(8)
      .select("name tagline logo slug primaryCategory pricingType avgRating");
  }

  return tools;
};



 // section - 2: Search Tools Service
export const searchToolsService = async (term, category) => {
  let query = { status: 'live' };

  if (term) {
    const safeTerm = term.trim();
    
  
    query.$or = [
      { name: { $regex: safeTerm, $options: 'i' } },
      { tagline: { $regex: safeTerm, $options: 'i' } },
      { intentTags: { $elemMatch: { $regex: safeTerm, $options: 'i' } } } // Changed from $in to $regex for flexibility
    ];
  }

  if (category) {
    const safeCategory = category.trim().toLowerCase();
 
    query.$and = query.$and || [];
    query.$and.push({
      $or: [
        { primaryCategory: safeCategory },
        { categories: { $in: [safeCategory] } }
      ]
    });
  }

  const tools = await Tool.find(query)
    .select("name tagline logo slug primaryCategory pricingType avgRating")
    .sort({ avgRating: -1, createdAt: -1 })
    .limit(10) // Results thode badha diye
    .lean();

  return tools;
};


 


 // section - 3: Get Tools By Use-Case Service
 // services/toolService.js
 export const getToolsByUseCase = async (useCaseKey) => {

if (!useCaseKey) return [];

  const normalizedKey = useCaseKey.toLowerCase().trim();

  const tools = await Tool.find({
    status: "live",
    useCases: { $in: [normalizedKey] }
  })
    .select(
      "name tagline logo slug primaryCategory intentTags pricingType avgRating isPopular isFeatured"
    )
    .sort({
      isFeatured: -1,
      isPopular: -1,
      avgRating: -1,
      createdAt: -1
    })
    .limit(15)
    .lean();

  return tools;
};




 
 

