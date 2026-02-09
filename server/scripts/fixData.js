import mongoose from "mongoose";
import dotenv from "dotenv";
import Tool from "../src/models/toolModel.js";
import { deriveUseCasesFromTool } from "../src/moment/useCase.services.js";

dotenv.config();

const fixDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Connected to DB...");

    const tools = await Tool.find({});
    console.log(`Found ${tools.length} tools. Updating useCases now...`);

    for (const tool of tools) {
      // Humein tool ke existing data se naye useCases nikalne hain
      const newUseCases = deriveUseCasesFromTool({
        intentTags: tool.intentTags || [],
        primaryCategory: tool.primaryCategory || "",
        categories: tool.categories || [],
        outputTypes: tool.outputTypes || []
      });

      console.log(`Tool: ${tool.name} -> New UseCases:`, newUseCases);

      // Database update
      await Tool.findByIdAndUpdate(tool._id, { 
        $set: { useCases: newUseCases } 
      });
    }

    console.log("✅ All tools updated successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Fix Script Failed:", err);
    process.exit(1);
  }
};

fixDatabase();