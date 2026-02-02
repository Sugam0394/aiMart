import mongoose from 'mongoose';

const exploreModelSchema = new mongoose.Schema({

// 1️⃣ Session tracking
  sessionId: {
    type: String,
    required: true,
    unique: true,
  },

   userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },

  // 2️⃣ Current flow
  currentStep: {
    type: String,
    enum: ["INTENT", "USE_CASE", "TOOLS", "CONFIDENCE", "COMPLETED"],
    default: "INTENT",
    index: true,
  },

  // 3️⃣ Selected options
  selectedIntent: {
    type: String,
    default: null,
    index: true,
  },
  selectedUseCase: {
    type: String,
    default: null,
  },
selectedTools: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tool",
    }
  ],

 
  // 4️⃣ Confidence / rating
  confidenceScore: {
    type: Number,
    min: 1,  // Validation add kar di
    max: 5,
    default: null,
  },

  // 5️⃣ Metadata
  startedAt: {
    type: Date,
    default: Date.now,
  },
  completedAt: {
    type: Date,
    default: null,
  },
 // 6️⃣ Future AI / analytics
  context: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },

}, {timestamps: true , strict: true});

// Virtual field to check if session is finished

exploreModelSchema.virtual('isCompleted').get(function() {
  return this.currentStep === 'COMPLETED';
});

const ExploreSession = mongoose.model("ExploreSession", exploreModelSchema);
export default ExploreSession;


