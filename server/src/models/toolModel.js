// models/toolModel.js
import mongoose from "mongoose";

const toolSchema = new mongoose.Schema(
  {
    // 🔹 Basic Info
    name: {
      type: String,
      required: true,
      trim: true,
    },

    tagline: {
      type: String,
      maxlength: 120,
    },

    description: {
      type: String,
      required: true
    },

    url: {
      type: String,
      required: true,
      match: [/^https?:\/\/.+/, "Please enter a valid URL"],
    },

    logo: {
      type: String,
      trim: true,
      default: "",
    },

    // =========================
    // 2️⃣ Moment / Discovery Layer
    // =========================
    primaryCategory: {
      type: String,
      required: true,
      index: true,
    },

    categories: {
      type: [String],
      index: true,
    },

    intentTags: {
      type: [String],
      required: true,
      validate: [(val) => val.length > 0, "At least one intent tag is required"],
      index: true,
    },
    searchKeywords: {
  type: [String],
  index: true,
  default: []
},

    // =========================
    // 🔥 Use-Case Mapping Layer (HOME DISCOVERY)
    // =========================
    useCases: {
      type: [String], 
      index: true,
      default: []
      // ✅ NO pre-save hook needed
      // Direct import from JSON or manual entry
    },

    outputTypes: {
      type: [String],
      index: true,
    },

    // =========================
    // 3️⃣ Tool Nature / Usage
    // =========================
    toolType: {
      type: String,
      required: true,
      index: true,
    },

    usageMode: {
      type: String,
      default: "online",
    },

    pricingType: {
      type: String,
      default: "free",
      index: true,
    },

    // SEO & Ratings
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },

    avgRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },

    totalReviews: {
      type: Number,
      default: 0
    },

    // 🔹 Moderation
    status: {
      type: String,
      enum: ["pending", "approved", "live", "rejected"],
      default: "pending",
      index: true,
    },

    // 🔹 Growth Flags
    isPopular: {
      type: Boolean,
      default: false,
      index: true,
    },

    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },

    featuredUntil: {
      type: Date,
      default: null,
    },

    // =========================
    // 6️⃣ ToolCart (Future-proof)
    // =========================
    isCartEligible: {
      type: Boolean,
      default: true,
    },

    moderation: {
      reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
      },
      reviewedAt: {
        type: Date,
        default: null,
      },
      note: {
        type: String,
        default: "",
      },
    },

    // 🔹 Ownership
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // 🔹 Single Review (Curated)
    review: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
      default: null,
    },
  },
  { timestamps: true }
);

 
toolSchema.index({ primaryCategory: 1, intentTags: 1 });
toolSchema.index({ isFeatured: 1, status: 1 });
toolSchema.index({ isPopular: 1, toolType: 1 });
toolSchema.index({ name: 'text', tagline: 'text', description: 'text' });
toolSchema.index({ useCases: 1, status: 1 }); 
toolSchema.index({ isFeatured: 1, isPopular: 1, createdAt: -1 }); 
toolSchema.index({ intentTags: 1, primaryCategory: 1, status: 1 });

const Tool = mongoose.model("Tool", toolSchema, 'tools');
export default Tool; 
 