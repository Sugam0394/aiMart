 import Tool from "../models/toolModel.js";
 import { resolveTrendingMoment } from "../moment/trendingToolsMoment.js";
 import { expandSearchTerms } from "../moment/intentAliasMap.js";
 import { STACK_CONFIG } from "../moment/stackConfig.js";
 




 // section - 1: Get Trending Tools Service
export const getTrendingToolsService = async ({ intent, category }) => {
  if (!intent && !category) {
    console.log("⚡ Fast-track Trending Fetch (No Filters)");
    return await Tool.find({ status: "live" })
      .sort({ isFeatured: -1, isPopular: -1, avgRating: -1 })
      .limit(12)
      .select("name tagline logo slug primaryCategory pricingType avgRating")
      .lean(); // .lean() overhead kam karta hai
  }

  // --- Baki aapka purana logic niche start hoga (Jab filters honge tabhi aggregate chalega) ---
  
  const { primaryCategories, intentTags } = resolveTrendingMoment({ intent, category });

  const query = { status: "live" };
  const matchConditions = [];

  // Filter logic (Jaise aapka pehle tha...)
  if (primaryCategories?.length > 0) {
    matchConditions.push({ primaryCategory: { $in: primaryCategories } });
    matchConditions.push({ categories: { $elemMatch: { $in: primaryCategories } } });
  }

  if (intentTags?.length > 0) {
    matchConditions.push({ intentTags: { $elemMatch: { $in: intentTags } } });
  }

  if (matchConditions.length > 0) {
    query.$or = matchConditions;
  }

  // Heavy Aggregation Pipeline (Ab sirf filtered cases mein chalega)
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

  // Fallback Logic (Same as yours)
  if (tools.length === 0) {
    tools = await Tool.find({ status: "live" })
      .sort({ isFeatured: -1, isPopular: -1, avgRating: -1 })
      .limit(8)
      .select("name tagline logo slug primaryCategory pricingType avgRating");
  }

  return tools;
};



 

 

// 🚀 Upgraded Section - 2: Smart Intent-Based Search Service
export const searchToolsService = async (term, category) => {
  let query = { status: 'live' };

  if (term) {
     
    const expandedTerms = expandSearchTerms(term);

 
    const termConditions = expandedTerms.flatMap(t => [
      { name: { $regex: t, $options: 'i' } },
      { tagline: { $regex: t, $options: 'i' } },
      { intentTags: { $elemMatch: { $regex: t, $options: 'i' } } },
      { searchKeywords: { $elemMatch: { $regex: t, $options: 'i' } } }, 
      { useCases: { $elemMatch: { $regex: t, $options: 'i' } } },
      { primaryCategory: { $regex: t, $options: 'i' } }
    ]);

    query.$or = termConditions;
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
    .select("name tagline logo slug primaryCategory pricingType avgRating intentTags isFeatured isPopular")
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

 


 


 // section - 3: Get Tools By Use-Case Service
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


// section - 4: Get Stack By Role Service (New Feature for Founder, Marketer, Creator, Designer, Developer Stacks
export const getStackByRole = async (role) => {
  const config = STACK_CONFIG[role];
  if (!config) return null;

  // 1. Config se saare tool slugs ki array nikalo
  const slugs = config.tools.map(t => t.toolSlug);

  // 2. Database se sirf woh tools fetch karo jo config mein hain
  // Optimization: Sirf zaroori fields hi select kar rahe hain
  const toolsFromDB = await Tool.find({
    slug: { $in: slugs },
    status: 'live' // Sirf live tools dikhao
  })
  .select('name slug logo tagline primaryCategory pricingType avgRating')
  .lean();

  // 3. Fast lookup ke liye ek Map (object) banao
  const toolMap = {};
  toolsFromDB.forEach(t => { 
    toolMap[t.slug] = t; 
  });

  // 4. Config ke order ke hisaab se data assemble karo
  // Agar koi tool DB mein nahi milta, toh filter out ho jayega
  const stackTools = config.tools
    .map(item => ({
      category: item.category,
      emoji: item.emoji,
      label: item.label,
      tool: toolMap[item.toolSlug] || null
    }))
    .filter(item => item.tool !== null); 

  return {
    role,
    headline: config.headline,
    subline: config.subline,
    tools: stackTools,
    totalTools: stackTools.length,
  };
};




 
 

