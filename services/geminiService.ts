
import { GoogleGenAI, Type } from "@google/genai";

export const geminiService = {
  getSmartAdvice: async (taskTitle: string, deadline: string) => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `I have a task titled "${taskTitle}" due on ${deadline}. Give me 3 short, actionable sub-steps to complete it effectively. Format as a simple list.`,
      });
      return response.text || "Start early and break it down into smaller pieces!";
    } catch (e) {
      return "Focus on the priority and manage your time wisely.";
    }
  },

  recommendTasks: async (currentTasksCount: number) => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `I currently have ${currentTasksCount} tasks pending. Suggest 3 highly productive tasks I could add to my list to improve my professional or personal growth. Provide only the titles, separated by newlines.`,
      });
      return response.text?.split('\n').filter(t => t.trim().length > 0).slice(0, 3) || [];
    } catch (e) {
      return ["Morning meditation", "Review weekly goals", "Organize workspace"];
    }
  }
};
