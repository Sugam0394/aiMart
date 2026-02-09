import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import Tool from '../src/models/toolModel.js'; // 🚨 Path check kar lena sahi hai ya nahi

dotenv.config(); // Ye tumhari .env file se MONGO_URI uthayega

const importData = async () => {
  try {
    // 1. Database Connect karo
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("✅ DB Connected Successfully...");

    // 2. JSON File Read karo
    const tools = JSON.parse(fs.readFileSync('./scripts/toolsData.json', 'utf-8'));

    // 3. Data ko format karo (Admin ID add karo)
    const adminId = "695bc902b7845f99ecd1ad14"; // 🚨 Ye teri Admin ID hai jo tune pehle di thi
    const finalTools = tools.map(t => ({
      ...t,
      createdBy: adminId,
      status: "live",
      slug: t.slug || t.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
    }));

    // 4. Database mein insert karo
    await Tool.insertMany(finalTools);

    console.log(`🚀 Success: ${finalTools.length} tools imported to aiMart!`);
    process.exit();
  } catch (error) {
    console.error("❌ Error during import:", error.message);
    process.exit(1);
  }
};

importData();