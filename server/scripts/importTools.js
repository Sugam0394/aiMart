import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import Tool from "../src/models/toolModel.js";
import { DB_NAME } from "../src/constant.js";
import { deriveUseCasesFromTool } from "../src/moment/useCase.services.js";

dotenv.config();

const importData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      dbName: DB_NAME
    });

    console.log("✅ DB Connected Successfully...");

    const tools = JSON.parse(
      fs.readFileSync("./scripts/toolsData.json", "utf-8")
    );

    const adminId = "695bc902b7845f99ecd1ad14";

    const finalTools = tools.map(tool => {
      const useCases = deriveUseCasesFromTool({
        intentTags: tool.intentTags,
        primaryCategory: tool.primaryCategory,
        categories: tool.categories,
        outputTypes: tool.outputTypes
      });

      return {
        ...tool,
        createdBy: adminId,
        status: "live",
        slug:
          tool.slug ||
          tool.name
            .toLowerCase()
            .replace(/ /g, "-")
            .replace(/[^\w-]+/g, ""),
        useCases // 🔥 THIS WAS THE MISSING KEY
      };
    });

    await Tool.insertMany(finalTools);

    console.log(`🚀 Success: ${finalTools.length} tools imported to aiMart`);
    process.exit();
  } catch (error) {
    console.error("❌ Error during import:", error);
    process.exit(1);
  }
};

importData();
 