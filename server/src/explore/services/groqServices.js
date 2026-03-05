 // server/src/explore/services/groqService.js
import Groq from 'groq-sdk';
 

 

export const groqServices = {
    /**
     * Ranks tools using Groq AI based on User Role and Task
     */
    async rankToolsForUser(role, task, tools) {
        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
        if (!tools || tools.length === 0) return [];

        // 🛠️ EXPERTISE TIP: Hum sirf top 25 tools bhej rahe hain prompt mein.
        // Kyunki 81 tools bhejte hi prompt bohot bada ho jata hai aur AI response beech mein cut jata hai (Unterminated String error).
        const candidateTools = tools.slice(0, 25); 

        const toolList = candidateTools.map(t => ({
            id: t._id.toString(),
            name: t.name,
            tagline: t.tagline || '',
        }));

        const prompt = `
        You are an expert AI Advisor.
        Context: A ${role} wants to achieve this task: "${task}".
        
        From the JSON list below, identify the TOP 5 tools that will help them most.
        TOOLS: ${JSON.stringify(toolList)}

        Response Requirement:
        Return ONLY a JSON object with a key "rankedTools" containing an array.
        Structure: {"rankedTools": [{"id": "tool_id", "reason": "1-sentence specific benefit"}]}
        
        Rules: 
        1. Priority: Relevance to task > Free tools.
        2. No markdown, no conversational text.`;

        try {
            const response = await groq.chat.completions.create({
                model: 'llama-3.1-8b-instant',
                messages: [{ role: 'user', content: prompt }],
                // ✅ Badha diya taaki JSON cut na ho
                max_tokens: 1024, 
                temperature: 0.2,
                // ✅ Force Groq to return valid JSON
                response_format: { type: "json_object" } 
            });

            const rawContent = response.choices[0]?.message?.content || '{}';
            const parsedData = JSON.parse(rawContent);
            
            // Extract the array (handle both potential response shapes)
            const rankedArray = parsedData.rankedTools || parsedData;

            if (!Array.isArray(rankedArray)) throw new Error("Invalid AI response format");

            // Match AI IDs back to full Database Tool Objects
            return rankedArray.map(r => {
                const tool = tools.find(t => t._id.toString() === r.id);
                if (tool) {
                    return { ...tool, aiReason: r.reason };
                }
                return null;
            }).filter(Boolean);

        } catch (err) {
            console.error('[GroqService] AI ranking failed:', err.message);
            
            // 🛡️ FALLBACK: Agar AI fail ho jaye, toh user ko khali screen na dikhe.
            // Pehle 8 tools return kar do default reason ke saath.
            return tools.slice(0, 8).map(t => ({
                ...t,
                aiReason: "Recommended based on your professional role and task requirements."
            }));
        }
    }
};