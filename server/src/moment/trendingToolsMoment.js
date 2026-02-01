 // Trending Tools Section (1)
 
 export const resolveTrendingMoment = ({ intent, category }) => {
  let resolvedCategories = null;
  let resolvedIntent = null;

  if (category && category.trim().length > 0) {
    resolvedCategories = category
      .toLowerCase()
      .split(",")
      .map((c) => c.trim());
  }

  if (intent && intent.trim().length > 0) {
    resolvedIntent = intent
      .toLowerCase()
      .split(",")
      .map((i) => i.trim());
  }

  return {
    primaryCategories: resolvedCategories, // null OR array
    intentTags: resolvedIntent,     // null OR array
  };
};




