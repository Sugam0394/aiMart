 // server/src/explore/services/promptService.js
import Groq from 'groq-sdk';
import dotenv from 'dotenv';
dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

if (!process.env.GROQ_API_KEY) {
    console.error("❌ CRITICAL: GROQ_API_KEY is missing in .env file!");
}

export const PromptService = {
  // ✅ Isse async banaya gaya hai taaki AI response ka wait kar sake
  async generateToolPrompts(role, task, tools) {
    if (!role || !task || !tools || tools.length === 0) return [];

    try {
      // Saare tools ke liye ek hi AI call mein prompts mangwana (Token Saving Strategy)
      const toolNames = tools.map(t => t.name).join(', ');
      
      const prompt = `
        You are a prompt engineering expert. 
        User Role: ${role}
        User Task: ${task}
        Tools: ${toolNames}

        For EACH tool, generate 2 highly specific prompts:
        1. "Quick Start": A simple prompt to get the task done.
        2. "Pro Expert": An advanced prompt using expert strategy.

        Return ONLY a JSON object where keys are tool names:
        {
          "ToolName": [
            { "title": "Quick Start", "description": "...", "prompt": "..." },
            { "title": "Pro Expert", "description": "...", "prompt": "..." }
          ]
        }
      `;

      const response = await groq.chat.completions.create({
        model: 'llama-3.1-8b-instant',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: "json_object" }, // Strict JSON mode
        temperature: 0.5,
      });

      const aiData = JSON.parse(response.choices[0].message.content);

      return tools.map(tool => ({
        toolId: tool._id,
        toolName: tool.name,
        prompts: aiData[tool.name] || this.getFallbackTemplates(role, task, tool.name)
      }));

    } catch (error) {
      console.error("❌ AI Prompt Gen Failed, using fallback:", error.message);
      // Agar AI fail ho jaye, toh purana hardcoded logic kaam aayega
      return tools.map(tool => ({
        toolId: tool._id,
        toolName: tool.name,
        prompts: this.getFallbackTemplates(role, task, tool.name)
      }));
    }
  },

  // ✅ Fallback method (Agar AI down ho toh yeh chalega)
  getFallbackTemplates(role, task, toolName) {
    return [
      {
        title: "Quick Start",
        description: `Execute your ${task} instantly using ${toolName}.`,
        prompt: `I am a ${role} working on ${task}. Using ${toolName}, help me create a high-quality output.`
      },
      {
        title: "Advanced Workflow",
        description: `Maximize efficiency as a ${role}.`,
        prompt: `Act as an expert ${role}. Optimize my ${task} workflow using ${toolName}.`
      }
    ];
  }
};