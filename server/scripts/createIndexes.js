// server/createIndexes.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Tool from '../src/models/toolModel.js';

dotenv.config();

const createIndexes = async () => {
  try {
    console.log("⏳ Connecting to DB...");
    await mongoose.connect(process.env.MONGODB_URL);
    
    console.log("🚀 Creating Optimized Indexes...");

    // 1. Home Page Sections (Trending, Featured, Popular)
    // Isse sorting super fast ho jayegi
    await Tool.collection.createIndex({ status: 1, isFeatured: -1, isPopular: -1, createdAt: -1 });

    // 2. Use-Case Discovery (Jo sabse slow tha)
    await Tool.collection.createIndex({ status: 1, useCases: 1 });

    // 3. Search & Text Search
    // Note: Model mein description bhi hai, script mein bhi add kar dete hain
    await Tool.collection.createIndex({ name: "text", tagline: "text", description: "text" });

    // 4. Category Filters
    await Tool.collection.createIndex({ status: 1, primaryCategory: 1 });

    console.log("✅ All High-Performance Indexes Created!");
    process.exit();
  } catch (err) {
    console.error("❌ Indexing Error:", err);
    process.exit(1);
  }
};

createIndexes(); 