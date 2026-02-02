import { nanoid } from 'nanoid';

import ExploreSession from '../exploreModel/exploreModel.js';

import Tool from '../../models/toolModel.js';

 

 import { mapIntent } from '../utils/IntentMapper.js';
 import { useCaseMap } from '../utils/useCaseMapper.js';
 import { momentMapper } from '../utils/momentMapper.js';


 export const ExploreService = {
  
  async createSession(userId) {
    // 12 characters ki ID create hogi
    const session = await ExploreSession.create({
      sessionId: nanoid(12),
      userId,
      currentStep: "INTENT",
    });

    return {
      sessionId: session.sessionId,
      currentStep: session.currentStep,
    };
  },

  async processStep(sessionId, currentStep, payload = {}) {
    // Pehle check karo session exist karta hai
    const session = await ExploreSession.findOne({ sessionId });
    if (!session) throw new Error("Explore session not found");

    let responsePayload = null;
    let nextStep = "";

    switch (currentStep) {
      case "INTENT":
        const normalizedIntent = mapIntent(payload.intent);
        session.selectedIntent = normalizedIntent;
        session.currentStep = "USE_CASE";
        
        nextStep = "USE_CASE";
        responsePayload = await useCaseMap(normalizedIntent);
        break;

      case "USE_CASE":
        session.selectedUseCase = payload.useCase;
        session.currentStep = "TOOLS";
        
        nextStep = "TOOLS";
        // Optimized Query
        responsePayload = await Tool.find({
          intentTags: session.selectedIntent,
          useCases: payload.useCase,
          status: "live",
        }).limit(20).lean(); // .lean() performance increase karta hai
        break;

      case "TOOLS":
        // Validation: Ensure toolIds is an array
        session.selectedTools = Array.isArray(payload.toolIds) ? payload.toolIds : [];
        session.currentStep = "CONFIDENCE";
        nextStep = "CONFIDENCE";
        break;

      case "CONFIDENCE":
        session.confidenceScore = payload.confidenceScore;
        session.currentStep = "COMPLETED";
        session.completedAt = new Date();
        session.context = momentMapper({
          intent: session.selectedIntent,
          useCase: session.selectedUseCase,
        });

        nextStep = "COMPLETED";
        responsePayload = {
          intent: session.selectedIntent,
          useCase: session.selectedUseCase,
          tools: session.selectedTools,
        };
        break;

      default:
        throw new Error("Invalid explore step");
    }

    await session.save();
    return { nextStep, payload: responsePayload };
  },

  async completeSession(sessionId) {
    return await ExploreSession.findOneAndUpdate(
      { sessionId },
      { 
        $set: { 
          currentStep: "COMPLETED", 
          completedAt: new Date() 
        } 
      },
      { new: true }
    );
  },
};