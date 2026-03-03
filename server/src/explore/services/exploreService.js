 // services/exploreService.js (FINAL CLEAN VERSION)
import { nanoid } from 'nanoid';
import mongoose from 'mongoose';
import ExploreSession from '../exploreModel/exploreModel.js';
import Tool from '../../models/toolModel.js';
import { PromptService } from './promptServices.js';
import User from '../../models/userModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { groqServices } from './groqServices.js';

export const ExploreService = {
  // ==========================================
  // 1️⃣ CREATE SESSION (GUEST SUPPORT)
  // ==========================================
  async createSession(userId = null) {
    try {
      const sessionData = {
        sessionId: nanoid(12),
        currentStep: "ROLE",
      };

      if (userId && mongoose.Types.ObjectId.isValid(userId)) {
        sessionData.userId = new mongoose.Types.ObjectId(userId);
      }

      const session = await ExploreSession.create(sessionData);
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
  // 2️⃣ PROCESS STEP (ROLE -> TASK -> TOOLS -> RESULTS)
  // ==========================================
  async processStep(sessionId, currentStep, payload = {}) {
    try {
      const session = await ExploreSession.findOne({ sessionId });
      if (!session) throw new Error("Explore session not found");

      let responsePayload = null;
      let nextStep = "";

      switch (currentStep) {
        case "ROLE": {
          if (!payload.role) throw new Error("role is required");
          session.selectedRole = payload.role;
          session.currentStep = "TASK";
          nextStep = "TASK";

          // ✅ PERSISTENCE: Save role to user profile if logged in 
          if (session.userId) {
            await User.findByIdAndUpdate(session.userId, {
              preferredRole: payload.role
            });
          }




          const ROLE_TASKS = {
            founder: ["market-research", "pitch-deck", "content-writing", "logo-design", "cold-email", "seo", "automation"],
            marketer: ["ad-copy", "social-media-posts", "email-campaigns", "seo-content", "video-scripts", "landing-page"],
            creator: ["video-scripts", "youtube-thumbnails", "short-form-content", "podcast-editing", "caption-writing"],
            designer: ["ui-design", "logo-design", "social-media-graphics", "presentation-design", "illustration"],
            developer: ["code-generation", "debugging", "documentation", "api-testing", "deployment"],
            freelancer: ["proposal-writing", "client-emails", "invoicing", "portfolio-design", "contract-writing"],
            student: ["essay-writing", "research-summarization", "flashcard-creation", "math-solving", "note-taking"],
          };

          responsePayload = ROLE_TASKS[payload.role] || [];
          break;
        }

       {/*             case "TASK": {
          if (!payload.task) throw new Error("task is required");
          session.selectedIntent = payload.task;
          session.currentStep = "TOOLS";
          nextStep = "TOOLS";

          const taskWords = payload.task.split(/[-_\s]+/).filter(w => w.length > 2);
          const searchRegex = new RegExp(taskWords.join('|'), 'i');

          const baseQuery = {
            status: "live",
            $or: [
              { name: { $regex: searchRegex } },
              { tagline: { $regex: searchRegex } },
              { intentTags: { $in: taskWords.map(k => new RegExp(k, 'i')) } },
              { useCases: { $in: taskWords.map(k => new RegExp(k, 'i')) } }
            ]
          };

          const allTools = await Tool.find(baseQuery).lean();
          const scoredTools = allTools.map(tool => {
            let score = 0;
            if (tool.useCases?.some(uc => taskWords.some(kw => uc.includes(kw)))) score += 40;
            if (tool.isPopular) score += 15;
            if (tool.avgRating >= 4) score += 10;
            return { ...tool, relevanceScore: score };
          }).sort((a, b) => b.relevanceScore - a.relevanceScore);

          responsePayload = {
            role: session.selectedRole,
            task: payload.task,
            bestMatch: scoredTools.slice(0, 8),
            free: scoredTools.filter(t => t.pricingType === 'free').slice(0, 6)
          };
          break;
        }                                         */}

      case "TASK": {
          // ✅ AI UPGRADE: Replaced Regex search with Groq AI Ranking [cite: 142]
          if (!payload.task) throw new Error('task is required');
          session.selectedIntent = payload.task;
          session.currentStep = 'TOOLS';
          nextStep = 'TOOLS';

          // Step A: Database se live tools nikalo [cite: 148]
          const allTools = await Tool.find({ status: 'live' }).lean();

          console.log("🛠️ DB Debug: Found", allTools.length, "tools in database");

          // Step B: Groq AI se tools rank karwao (Expertise: No more regex limitation!) [cite: 150]
          const aiRankedTools = await groqServices.rankToolsForUser(
            session.selectedRole,
            payload.task,
            allTools
          );

          // Step C: AI results ko filter karke free tools alag karo [cite: 156]
          const freeTools = aiRankedTools.filter(t => t.pricingType === 'free');

          responsePayload = {
            role: session.selectedRole,
            task: payload.task,
            bestMatch: aiRankedTools.slice(0, 8), // AI ranked list [cite: 161]
            free: freeTools.slice(0, 6),          // AI ranked free list [cite: 162]
          };
          break;
        }

        case "TOOLS": {
          session.selectedTools = Array.isArray(payload.toolIds) ? payload.toolIds : [];
          session.currentStep = "RESULTS";
          nextStep = "RESULTS";
          
          responsePayload = {
            role: session.selectedRole,
            task: session.selectedIntent,
            selectedCount: session.selectedTools.length
          };
          break;
        }

        case "RESULTS": {
          // 1. Fetch full tool details
          const selectedToolsData = await Tool.find({ 
            _id: { $in: session.selectedTools } 
          }).lean();

          // 2. Generate prompts using our Engine
          const toolPrompts = await PromptService.generateToolPrompts(
            session.selectedRole, 
            session.selectedIntent, 
            selectedToolsData
          );

          session.currentStep = "COMPLETED";
          session.completedAt = new Date();
          nextStep = "COMPLETED";
          
          session.context = {
            ...session.context,
            prompts: toolPrompts,
            summary: `Stack of ${selectedToolsData.length} tools for ${session.selectedRole}`
          };

          responsePayload = {
            role: session.selectedRole,
            task: session.selectedIntent,
            tools: selectedToolsData,
            prompts: toolPrompts,
            completedAt: session.completedAt
          };
          break;
        }

        default:
          throw new Error(`Invalid step: ${currentStep}`);
      }

      await session.save();
      return { nextStep, payload: responsePayload };
    } catch (error) {
      console.error(`❌ Error in processStep [${currentStep}]:`, error.message);
      throw error;
    }
  },

  async completeSession(sessionId) {
    const session = await ExploreSession.findOne({ sessionId });
    if (!session) throw new Error("Explore session not found");
    session.currentStep = "COMPLETED";
    session.completedAt = new Date();
    await session.save();
    return { success: true, sessionId: session.sessionId };
  }
};