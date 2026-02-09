import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    tool: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tool",
      required: true,
      unique: true, // 🔥 ONLY ONE REVIEW PER TOOL
    },

    toolOwner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

   // review.model.js tweaks
rating: {
  utility: { type: Number, default: 0 },
  easeOfUse: { type: Number, default: 0 },
  valueForMoney: { type: Number, default: 0 },
  average: { type: Number, required: true } // Overall score
},

    comment: {
      type: String,
      maxlength: 500,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      index: true,
    },

    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // founder
      default: null,
    },

    approvedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

const Review = mongoose.model("Review", reviewSchema);
export default Review;
