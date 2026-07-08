import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function modernizeContent(content: string) {
  const prompt = `
    Analyze this WordPress HTML content and return a JSON object with:
    {
      "hero_title": "A catchy short title",
      "summary": "A 2 sentence summary",
      "tags": ["tag1", "tag2"]
    }
    Content: ${content}
  `;
  
  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    // Clean the markdown code blocks if Gemini returns them
    const jsonString = text.replace(/```json|```/g, "");
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("AI Sync Error:", error);
    return null;
  }
}
