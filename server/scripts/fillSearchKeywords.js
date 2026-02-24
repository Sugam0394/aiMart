 import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import Tool from "../src/models/toolModel.js";
import { DB_NAME } from "../src/constant.js"; // Aapka constant file

const keywordMap = {
  "writing":    ["best ai for writing", "ai writing assistant", "ai content creation", "ai copywriting tool"],
  "email":      ["best ai for email", "cold email ai", "email writing assistant", "ai newsletter tool"],
  "design":     ["ai design tool", "logo maker ai", "banner generator", "ai graphic design"],
  "video":      ["ai video editor", "video creation ai", "youtube ai tool", "ai reels maker"],
  "seo":        ["best seo tool", "ai for seo", "keyword research ai", "ai content seo"],
  "coding":     ["ai coding assistant", "ai code generator", "github copilot alternative", "developer ai tool"],
  "image":      ["ai image generator", "text to image ai", "ai art generator", "ai photo tool"],
  "automation": ["ai automation tool", "workflow automation", "no code ai", "zapier alternative"],
  "research":   ["ai research tool", "ai summarizer", "ai notes", "study with ai"],
  "social":     ["ai social media tool", "instagram ai", "linkedin ai", "social media content ai"],
  "chatbot":    ["ai chatbot builder", "customer support ai", "ai assistant", "chatgpt alternative"],
};

const run = async () => {
  try {
    // Purana working connection logic
    await mongoose.connect(process.env.MONGODB_URL, {
        dbName: DB_NAME
    });
    console.log('✅ Connected to MongoDB Database:', DB_NAME);

    // Filter hata kar {} kiya taaki saare tools milein
    const tools = await Tool.find({}); 
    console.log(`🔍 Found ${tools.length} tools to update...\n`);

    if (tools.length === 0) {
        console.log("⚠️ Abhi bhi 0 tools mile. Ek baar MongoDB Compass mein collection name check karein.");
        process.exit(0);
    }

    for (const tool of tools) {
      const keywords = [];

      // tool ke intentTags ko scan karke keywords generate karna
      if (tool.intentTags && Array.isArray(tool.intentTags)) {
        tool.intentTags.forEach(tag => {
          const tagLower = tag.toLowerCase();
          for (const [key, phrases] of Object.entries(keywordMap)) {
            if (tagLower.includes(key)) {
              keywords.push(...phrases);
            }
          }
        });
      }

      const uniqueKeywords = [...new Set(keywords)];

      await Tool.updateOne(
        { _id: tool._id },
        { $set: { searchKeywords: uniqueKeywords } }
      );

      console.log(`✨ Updated: ${tool.name} (+${uniqueKeywords.length} keywords)`);
    }

    console.log('\n🏁 Migration Completed Successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Migration Failed:', err);
    process.exit(1);
  }
};

run();