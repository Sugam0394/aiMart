 import { nanoid } from 'nanoid';
import mongoose from 'mongoose';
import ExploreSession from '../exploreModel/exploreModel.js';
import Tool from '../../models/toolModel.js';

import { mapIntent } from '../utils/IntentMapper.js';
import { useCaseMap } from '../utils/useCaseMapper.js';
import { momentMapper } from '../utils/momentMapper.js';

export const ExploreService = {
  
  async createSession(userId) {
    try {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error("Invalid User ID format");
      }

      const session = await ExploreSession.create({
        sessionId: nanoid(12),
        userId: userId,
        currentStep: "INTENT",
      });

      return {
        sessionId: session.sessionId,
        currentStep: session.currentStep,
      };
    } catch (error) {
      console.error("Error in createSession:", error.message);
      throw error;
    }
  },

  async processStep(sessionId, currentStep, payload = {}) {
    try {
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

          // Convert slug → human readable
  const humanReadableUseCase = payload.useCase.replace(/-/g, ' ');
  const humanReadableIntent = session.selectedIntent
    ? session.selectedIntent.replace(/-/g, ' ')
    : '';

        console.log("--- SEARCH DEBUG ---");
  console.log("Intent from session:", humanReadableIntent);
  console.log("UseCase:", humanReadableUseCase);

    // Sabse chota word nikal lo matching ke liye (e.g. "summarize-notes" -> "summarize")
  const firstWord = payload.useCase.split('-')[0];

  responsePayload = await Tool.find({
    status: "live",
    // Dono mein se koi ek bhi match hua toh chalega
    $or: [
      { useCases: { $regex: firstWord, $options: 'i' } },
      { intentTags: { $regex: session.selectedIntent, $options: 'i' } }
    ]
  })
  .limit(10)
  .lean();

  console.log("DATABASE MATCHES FOUND (FLEXIBLE):", responsePayload.length);
  break;

      case "TOOLS":
          // Frontend se toolIds: ["id1"] format mein aana chahiye
          session.selectedTools = Array.isArray(payload.toolIds) ? payload.toolIds : [];
          session.currentStep = "CONFIDENCE";
          nextStep = "CONFIDENCE";
          
          responsePayload = {
             selectedCount: session.selectedTools.length
          };
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
    } catch (error) {
      console.error(`Error in processStep [${currentStep}]:`, error.message);
      throw error;
    }
  },

  async completeSession(sessionId) {
    try {
      const updatedSession = await ExploreSession.findOneAndUpdate(
        { sessionId },
        { $set: { currentStep: "COMPLETED", completedAt: new Date() } },
        { new: true }
      );
      if (!updatedSession) throw new Error("Session not found to complete");
      return updatedSession;
    } catch (error) {
      console.error("Error in completeSession:", error.message);
      throw error;
    }
  },
};