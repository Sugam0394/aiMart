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
    required: false, // 👈 CHANGE: Ab guest users bhi explore kar sakte hain
    index: true,
    default: null,
  },

  // 2️⃣ Current flow - UPDATED STEPS
  currentStep: {
    type: String,
    // 👈 CHANGE: Naya flow ROLE -> TASK -> TOOLS -> RESULTS
    enum: ["ROLE", "TASK", "TOOLS", "RESULTS", "COMPLETED"], 
    default: "ROLE",
    index: true,
  },

  // 3️⃣ Selected options
  // 👈 NEW: Role store karne ke liye field
  selectedRole: {
    type: String,
    default: null,
    index: true,
  },
  
  // selectedIntent ko hi hum "TASK" ke liye reuse karenge backend logic mein
  selectedIntent: {
    type: String,
    default: null,
    index: true,
  },

  // USE_CASE ab redundant ho jayega but purana data clean na ho isliye rehne de sakte ho
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

  // 4️⃣ Confidence / rating - REPLACE WITH RESULTS METADATA
  // CONFIDENCE step hat raha hai, but analytics ke liye score rehne de sakte ho ya remove kar do
  confidenceScore: {
    type: Number,
    min: 1,
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

}, { timestamps: true, strict: true });

// Virtual field to check if session is finished
exploreModelSchema.virtual('isCompleted').get(function() {
  return this.currentStep === 'COMPLETED';
});

const ExploreSession = mongoose.model("ExploreSession", exploreModelSchema);
export default ExploreSession;


