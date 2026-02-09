// services/exploreService.js (COMPLETE FILE)
import { nanoid } from 'nanoid';
import mongoose from 'mongoose';
import ExploreSession from '../exploreModel/exploreModel.js';
import Tool from '../../models/toolModel.js';

import { mapIntent } from '../utils/IntentMapper.js';
import { useCaseMap } from '../utils/useCaseMapper.js';
import { momentMapper } from '../utils/momentMapper.js';

export const ExploreService = {
  // ==========================================
  // 1️⃣ CREATE SESSION
  // ==========================================
  async createSession(userId) {
    try {
      if (!userId) {
        throw new Error("userId is required");
      }

      if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error("Invalid User ID format");
      }

      const userObjectId = new mongoose.Types.ObjectId(userId);

      const session = await ExploreSession.create({
        sessionId: nanoid(12),
        userId: userObjectId,
        currentStep: "INTENT",
      });

      console.log("✅ Session created:", session.sessionId);

      return { 
        sessionId: session.sessionId, 
        currentStep: session.currentStep 
      };
    } catch (error) {
      console.error("❌ Error in createSession:", error.message);
      throw error;
    }
  },

  // ==========================================
  // 2️⃣ PROCESS STEP
  // ==========================================
  async processStep(sessionId, currentStep, payload = {}) {
    try {
      const session = await ExploreSession.findOne({ sessionId });
      
      if (!session) {
        throw new Error("Explore session not found");
      }

      let responsePayload = null;
      let nextStep = "";

      switch (currentStep) {
        case "INTENT":
          try {
            if (!payload.intent) {
              throw new Error("Intent is required");
            }

            console.log("📍 Processing INTENT:", payload.intent);

            const normalizedIntent = await mapIntent(payload.intent);
            console.log("🔄 Normalized intent:", normalizedIntent);

            session.selectedIntent = normalizedIntent;
            session.currentStep = "USE_CASE";
            nextStep = "USE_CASE";

            responsePayload = await useCaseMap(normalizedIntent);
            console.log("✅ Use cases generated:", responsePayload.length);

          } catch (error) {
            console.error("❌ Error in INTENT step:", error);
            throw new Error("Failed to process intent: " + error.message);
          }
          break;

        case "USE_CASE":
          try {
            if (!payload.useCase) {
              throw new Error("useCase is required");
            }

            console.log("📍 Processing USE_CASE:", payload.useCase);

            session.selectedUseCase = payload.useCase;
            session.currentStep = "TOOLS";
            nextStep = "TOOLS";

            const useCaseWords = payload.useCase.split(/[-_\s]+/).filter(w => w.length > 2);
            const intentWords = (session.selectedIntent || '').split(/[-_\s]+/).filter(w => w.length > 2);
            const allKeywords = [...new Set([...useCaseWords, ...intentWords])];

            const searchRegex = new RegExp(allKeywords.join('|'), 'i');

            const baseQuery = {
              status: "live",
              $or: [
                { name: { $regex: searchRegex } },
                { tagline: { $regex: searchRegex } },
                { description: { $regex: searchRegex } },
                { primaryCategory: { $regex: searchRegex } },
                { intentTags: { $in: allKeywords.map(k => new RegExp(k, 'i')) } },
                { useCases: { $in: allKeywords.map(k => new RegExp(k, 'i')) } }
              ]
            };

            const allTools = await Tool.find(baseQuery).lean();
            console.log("📦 Tools found:", allTools.length);

            const scoredTools = allTools.map(tool => {
              let score = 0;

              if (tool.primaryCategory?.toLowerCase() === session.selectedIntent?.toLowerCase()) {
                score += 50;
              }

              if (tool.useCases?.some(uc => 
                allKeywords.some(kw => uc.toLowerCase().includes(kw.toLowerCase()))
              )) {
                score += 30;
              }

              if (tool.intentTags?.some(tag => 
                allKeywords.some(kw => tag.toLowerCase().includes(kw.toLowerCase()))
              )) {
                score += 20;
              }

              if (tool.isPopular) score += 15;
              if (tool.isFeatured) score += 10;
              if (tool.avgRating >= 4) score += 10;
              if (tool.pricingType === 'free') score += 5;

              return { ...tool, relevanceScore: score };
            });

            scoredTools.sort((a, b) => b.relevanceScore - a.relevanceScore);

            responsePayload = {
              bestMatch: scoredTools.slice(0, 10),
              trending: scoredTools
                .filter(t => t.isPopular || t.avgRating >= 4)
                .sort((a, b) => (b.views || 0) - (a.views || 0))
                .slice(0, 10),
              premium: scoredTools
                .filter(t => t.pricingType === 'paid' || t.pricingType === 'freemium')
                .filter(t => t.relevanceScore > 20)
                .slice(0, 10),
              free: scoredTools
                .filter(t => t.pricingType === 'free')
                .slice(0, 10),
              discovery: scoredTools
                .sort(() => 0.5 - Math.random())
                .slice(0, 8)
            };

            if (scoredTools.length < 5) {
              const fallbackTools = await Tool.find({ 
                status: "live",
                $or: [
                  { isPopular: true },
                  { isFeatured: true },
                  { avgRating: { $gte: 4 } }
                ]
              }).limit(15).lean();

              responsePayload.bestMatch = [...responsePayload.bestMatch, ...fallbackTools]
                .filter((tool, index, self) => 
                  index === self.findIndex(t => t._id.toString() === tool._id.toString())
                )
                .slice(0, 10);
            }

          } catch (error) {
            console.error("❌ Error in USE_CASE step:", error);
            throw new Error("Failed to process tools discovery: " + error.message);
          }
          break;

        case "TOOLS":
          try {
            console.log("📍 Processing TOOLS selection");

            session.selectedTools = Array.isArray(payload.toolIds) ? payload.toolIds : [];
            session.currentStep = "CONFIDENCE";
            nextStep = "CONFIDENCE";
            
            responsePayload = { 
              selectedCount: session.selectedTools.length,
              message: `${session.selectedTools.length} tools selected`
            };

          } catch (error) {
            console.error("❌ Error in TOOLS step:", error);
            throw new Error("Failed to save selected tools: " + error.message);
          }
          break;

        case "CONFIDENCE":
          try {
            console.log("📍 Processing CONFIDENCE rating");

            if (!payload.confidenceScore) {
              throw new Error("confidenceScore is required");
            }

            const score = parseInt(payload.confidenceScore);
            
            if (score < 1 || score > 5) {
              throw new Error("confidenceScore must be between 1 and 5");
            }

            session.confidenceScore = score;
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
              confidenceScore: session.confidenceScore,
              completedAt: session.completedAt,
              message: "Explore session completed successfully!"
            };

            console.log("✅ Session completed:", session.sessionId);

          } catch (error) {
            console.error("❌ Error in CONFIDENCE step:", error);
            throw new Error("Failed to complete session: " + error.message);
          }
          break;

        default:
          throw new Error(`Invalid explore step: ${currentStep}`);
      }

      await session.save();
      console.log("💾 Session saved. Next step:", nextStep);

      return { nextStep, payload: responsePayload };

    } catch (error) {
      console.error(`❌ Error in processStep [${currentStep}]:`, error.message);
      throw error;
    }
  },

  // ==========================================
  // 3️⃣ COMPLETE SESSION (NEW)
  // ==========================================
  async completeSession(sessionId) {
    try {
      console.log("🏁 Completing session:", sessionId);

      const session = await ExploreSession.findOne({ sessionId });

      if (!session) {
        throw new Error("Explore session not found");
      }

      if (session.currentStep === "COMPLETED") {
        console.log("ℹ️ Session already completed");
        return {
          sessionId: session.sessionId,
          message: "Session already completed",
          data: {
            intent: session.selectedIntent,
            useCase: session.selectedUseCase,
            tools: session.selectedTools,
            confidenceScore: session.confidenceScore,
            completedAt: session.completedAt,
            context: session.context,
          }
        };
      }

      session.currentStep = "COMPLETED";
      session.completedAt = new Date();

      if (!session.context || Object.keys(session.context).length === 0) {
        session.context = momentMapper({
          intent: session.selectedIntent,
          useCase: session.selectedUseCase,
        });
      }

      await session.save();

      console.log("✅ Session completed successfully");

      return {
        sessionId: session.sessionId,
        message: "Explore session completed successfully",
        data: {
          intent: session.selectedIntent,
          useCase: session.selectedUseCase,
          tools: session.selectedTools,
          confidenceScore: session.confidenceScore,
          completedAt: session.completedAt,
          context: session.context,
        }
      };

    } catch (error) {
      console.error("❌ Error in completeSession:", error.message);
      throw error;
    }
  }
}; 