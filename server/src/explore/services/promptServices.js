// server/src/explore/services/promptService.js

export const PromptService = {
  generateToolPrompts(role, task, tools) {
    if (!role || !task || !tools || tools.length === 0) return [];

    return tools.map(tool => {
      return {
        toolId: tool._id,
        toolName: tool.name,
        prompts: this.getTemplates(role, task, tool.name)
      };
    });
  },

  getTemplates(role, task, toolName) {
    // Role aur Task ke basis par smart prompts ka logic
    const basePrompts = [
      {
        title: "Quick Start",
        description: `Execute your ${task} instantly using ${toolName}.`,
        prompt: `I am a ${role} working on ${task}. Using ${toolName}, help me create a high-quality output for this. [Add specific details here]`
      },
      {
        title: "Advanced Workflow",
        description: `Maximize efficiency as a ${role}.`,
        prompt: `Act as an expert ${role}. I need to optimize my ${task} workflow. How can I use ${toolName}'s advanced features to get 10x better results?`
      }
    ];

    // Yahan hum future mein Role-specific templates add kar sakte hain
    return basePrompts;
  }
};