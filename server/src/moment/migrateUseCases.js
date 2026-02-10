// Update your migration script with detailed logs:

import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import Tool from "../models/toolModel.js";
import { deriveUseCasesFromTool } from "./useCase.services.js";

const migrateUseCases = async () => {
  try {
    console.log("🔌 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("✅ Connected to MongoDB");

    const tools = await Tool.find({});
    console.log(`📊 Found ${tools.length} tools in database`);

    if (tools.length === 0) {
      console.log("⚠️ No tools found! Check your database.");
      process.exit(0);
    }

    let successCount = 0;

    for (const tool of tools) {
      console.log(`\n🔧 Processing: ${tool.name}`);
      console.log(`   Old useCases: ${JSON.stringify(tool.useCases)}`);
      console.log(`   IntentTags: ${JSON.stringify(tool.intentTags)}`);
      console.log(`   Primary Category: ${tool.primaryCategory}`);

      const derivedUseCases = deriveUseCasesFromTool({
        intentTags: tool.intentTags,
        primaryCategory: tool.primaryCategory,
        categories: tool.categories,
        outputTypes: tool.outputTypes,
      });

      console.log(`   Derived useCases: ${JSON.stringify(derivedUseCases)}`);

      tool.useCases = derivedUseCases;
      await tool.save();
      
      console.log(`   ✅ Saved with useCases: ${JSON.stringify(tool.useCases)}`);
      successCount++;
    }

    console.log(`\n🎉 Migration Complete! Updated ${successCount}/${tools.length} tools.`);
    process.exit(0);

  } catch (err) {
    console.error("❌ Migration failed:", err);
    process.exit(1);
  }
};

migrateUseCases(); 

