 import mongoose from "mongoose";
import dotenv from "dotenv";
 import Tool from '../models/toolModel.js'
 import dummyTools from "./dummyTools.js";

dotenv.config();

const CREATOR_ID = "6967aa937e680a498184e195";

mongoose
  .connect(process.env.MONGODB_URL)
  .then(async () => {
    console.log("✅ MongoDB connected");

    await Tool.deleteMany();
    console.log("🧹 Old tools removed");

    const toolsWithCreator = dummyTools.map(tool => ({
      ...tool,
      createdBy: new mongoose.Types.ObjectId(CREATOR_ID)
    }));

    await Tool.insertMany(toolsWithCreator);
    console.log("🚀 Dummy tools inserted");

    console.log(
      toolsWithCreator.map(t => t.createdBy.toString())
    );

    process.exit();
  })
  .catch((err) => {
    console.error("❌ Error:", err);
    process.exit(1);
  });


