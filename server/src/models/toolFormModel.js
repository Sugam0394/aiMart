import mongoose from 'mongoose';

const toolOwnerRequestSchema = new mongoose.Schema({


     applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
      unique: true,
  
      // ek user ek hi baar apply kare
    },

    toolName: {
      type: String,
      required: true,
      trim: true,
    },

    website: {
      type: String,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },
      rejectedAt: {
     type: Date,
      default: null,
       },

       reapplyCount: {
  type: Number,
  default: 0
},



     proofLinks: [
      {
        type: String,
        trim: true,
      },
    ],

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

     reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // founder
      default: null,
    },

    reviewNote: {
      type: String,
      trim: true,
    },



}, {timestamps: true})

const  ToolOwnerRequest = mongoose.model("ToolOwnerRequest", toolOwnerRequestSchema)

export default ToolOwnerRequest