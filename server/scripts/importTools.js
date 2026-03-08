// scripts/importData.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import Tool from "../src/models/toolModel.js";
import { DB_NAME } from "../src/constant.js";

dotenv.config();

const importData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      dbName: DB_NAME
    });

    console.log("✅ DB Connected Successfully...");

    // Read JSON file
    const tools = JSON.parse(
      fs.readFileSync("./scripts/toolsData.json", "utf-8")
    );

    if (!tools || tools.length === 0) {
      throw new Error("JSON file is empty or not found!");
    }

    const adminId = "695bc902b7845f99ecd1ad14";

    // ✅ SIMPLIFIED: Just map directly, useCases already in JSON
    const finalTools = tools.map(tool => ({
      ...tool,
      createdBy: adminId,
      status: "live",
      slug: tool.slug || tool.name
        .toLowerCase()
        .replace(/ /g, "-")
        .replace(/[^\w-]+/g, "")
    }));

    // Clear existing tools (optional - remove if you want to append)
    await Tool.deleteMany({});
    console.log("🗑️ Cleared existing tools");

    // Insert new tools
    await Tool.insertMany(finalTools);

    console.log(`🚀 Success: ${finalTools.length} tools imported to aiMart`);
    
    // ✅ Verify useCases
    const sample = await Tool.findOne({}).select('name useCases');
    console.log(`\n📋 Sample tool:`, sample);
    
    process.exit(0);

  } catch (error) {
    console.error("❌ Error during import:", error);
    process.exit(1);
  }
};

importData(); 
 