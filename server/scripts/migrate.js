import mongoose from "mongoose";
import dotenv from "dotenv";
import Tool from "../src/models/toolModel.js";
import { deriveUseCasesFromTool } from "../src/moment/useCase.services.js";


dotenv.config();

const migrate = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Connected for migration...");

    const tools = await Tool.find({});
    console.log(`Scanning ${tools.length} tools...`);

    for (const tool of tools) {
      const newUseCases = deriveUseCasesFromTool({
        intentTags: tool.intentTags,
        primaryCategory: tool.primaryCategory,
        categories: tool.categories,
        outputTypes: tool.outputTypes,
      });

      await Tool.findByIdAndUpdate(tool._id, { useCases: newUseCases });
    }

    console.log("✅ All tools updated with new UseCases!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Migration failed:", err);
    process.exit(1);
  }
};

migrate();