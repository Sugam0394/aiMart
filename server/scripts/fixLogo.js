import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import Tool from "../src/models/toolModel.js";
import { DB_NAME } from "../src/constant.js";

const fixLogos = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL , {
        dbName: DB_NAME
    });
    console.log("✅ Connected to MongoDB\n");

    const tools = await Tool.find({});
    console.log(`📊 Found ${tools.length} tools\n`);

    let fixed = 0;

    for (const tool of tools) {
      try {
        const domain = new URL(tool.url).hostname.replace('www.', '');
        
        // ✅ Google Favicons - Most reliable!
        const newLogo = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
        
        await Tool.updateOne(
          { _id: tool._id },
          { $set: { logo: newLogo } }
        );

        console.log(`✅ ${tool.name} → ${newLogo}`);
        fixed++;
        
      } catch (err) {
        console.log(`⚠️ ${tool.name} - Invalid URL: ${tool.url}`);
      }
    }

    console.log(`\n🎉 Fixed ${fixed}/${tools.length} logos!`);
    process.exit(0);

  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
};

fixLogos();