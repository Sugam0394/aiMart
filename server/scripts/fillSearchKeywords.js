 import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import Tool from "../src/models/toolModel.js";
import { DB_NAME } from "../src/constant.js"; // Aapka constant file

 const keywordMap = {
  // Existing & Expanded
  "writing":    ["best ai for writing", "ai writing assistant", "ai content creation", "ai copywriting tool", "essay writer ai", "blog generator"],
  "email":      ["best ai for email", "cold email ai", "email writing assistant", "ai newsletter tool", "outreach automation"],
  "design":     ["ai design tool", "logo maker ai", "banner generator", "ai graphic design", "ui design ai", "ux assistant"],
  "video":      ["ai video editor", "video creation ai", "youtube ai tool", "ai reels maker", "text to video ai", "ai avatars"],
  "seo":        ["best seo tool", "ai for seo", "keyword research ai", "ai content seo", "serp optimizer", "backlink ai"],
  "coding":     ["ai coding assistant", "ai code generator", "github copilot alternative", "developer ai tool", "ai refactoring", "debug ai"],
  "image":      ["ai image generator", "text to image ai", "ai art generator", "ai photo tool", "image upscaler ai", "ai headshots"],
  "automation": ["ai automation tool", "workflow automation", "no code ai", "zapier alternative", "ai agents", "task automation"],
  "research":   ["ai research tool", "ai summarizer", "ai notes", "study with ai", "academic ai", "pdf analyzer"],
  "social":     ["ai social media tool", "instagram ai", "linkedin ai", "social media content ai", "caption generator"],
  "chatbot":    ["ai chatbot builder", "customer support ai", "ai assistant", "chatgpt alternative", "custom gpt"],

  // 🆕 New Categories for 129 Tools
  "audio":      ["ai voice generator", "text to speech ai", "ai music maker", "voice cloning ai", "podcast ai editor", "audio enhancement"],
  "productivity":["ai task manager", "meeting summarizer ai", "ai calendar", "transcription ai", "ai workspace", "notion ai alternative"],
  "marketing":  ["ai marketing tool", "ad creative ai", "conversion rate ai", "branding ai", "market intelligence ai"],
  "legal":      ["ai legal assistant", "contract analysis ai", "legal research tool", "compliance ai", "ai lawyer assistant"],
  "finance":    ["ai for finance", "crypto ai tool", "stock analysis ai", "expense tracker ai", "budgeting ai"],
  "3d":         ["ai 3d generator", "3d modeling ai", "text to 3d", "game asset generator ai", "ar vr ai"],
  "teaching":   ["ai for teachers", "lesson plan generator", "quiz maker ai", "grading assistant ai", "educational ai"],
  "sales":      ["ai sales tool", "lead generation ai", "crm automation", "sales deck ai", "personalized outreach"],
  "utility":    ["background remover ai", "qr code ai", "file converter ai", "web scraper ai", "form builder ai"]
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