 import dotenv from "dotenv";
 
dotenv.config();
 
 
 import mongoose from "mongoose";
 import Tool from "../models/toolModel.js";
import { deriveUseCasesFromTool } from "./useCase.services.js";

const migrateUseCases = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);

    const tools = await Tool.find({});

    for (const tool of tools) {
      tool.useCases = deriveUseCasesFromTool({
        intentTags: tool.intentTags,
        primaryCategory: tool.primaryCategory,
        categories: tool.categories,
        outputTypes: tool.outputTypes,
      });

      await tool.save();
    }

    console.log("✅ UseCases migrated successfully");
    process.exit(0);

  } catch (err) {
    console.error("❌ Migration failed", err);
    process.exit(1);
  }
};

migrateUseCases();

