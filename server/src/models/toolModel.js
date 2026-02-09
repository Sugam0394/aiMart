import mongoose from "mongoose";
import { deriveUseCasesFromTool } from "../moment/useCase.services.js";

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
  required: true,
},


    // =========================
    // 2️⃣ Moment / Discovery Layer (MOST IMPORTANT)
    // =========================
    primaryCategory: {
      type: String, // study | content | business
      required: true,
      index: true,
    },

    categories: {
      type: [String], // multiple allowed
      index: true,
    },

   intentTags: {
  type: [String],
  required: true,
  validate: [(val) => val.length > 0, "At least one intent tag is required"],
  index: true,
},

// =========================
// 🔥 Use-Case Mapping Layer (HOME DISCOVERY)
// =========================
useCases: {
  type: [String], 
  index: true,
  required: true,
  // example: ["grow-business", "design-faster"]
},



    outputTypes: {
      type: [String], // notes, image, video, pdf
      index: true,
    },

   
  
    // =========================
    // 3️⃣ Tool Nature / Usage
    // =========================
    toolType: {
      type: String, // ai | utility | service
      required: true,
      index: true,
    },

    usageMode: {
      type: String, // online | api | download
      default: "online",
    },

    pricingType: {
      type: String, // free | freemium | paid
      default: "free",
      index: true,
    },
    // Add these inside toolSchema
slug: {
  type: String,
  unique: true,
  lowercase: true,
  trim: true,
  index: true // SEO and Fast lookup
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

    // 🔹 Growth Flags (Founder controlled)
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
     required: true, // MUST be toolOwner (controller enforce karega)
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

// =========================
// 🔹 Pre-save Hook → Auto-populate useCases
// =========================
toolSchema.pre("save", function() {
  this.useCases = deriveUseCasesFromTool({
    intentTags: this.intentTags,
    primaryCategory: this.primaryCategory,
    categories: this.categories,
    outputTypes: this.outputTypes
  });
 
});

 
// =========================
// Indexes for fast queries
// =========================
toolSchema.index({ primaryCategory: 1, intentTags: 1 });
toolSchema.index({ isFeatured: 1, status: 1 });
toolSchema.index({ isPopular: 1, toolType: 1 });
// Index for SEO and clean search
toolSchema.index({ name: 'text', tagline: 'text', description: 'text' });

const Tool = mongoose.model("Tool", toolSchema, 'tools');
export default Tool;
