import axios from 'axios';

const INVOKE_URL = "https://integrate.api.nvidia.com/v1/chat/completions";
const STREAM = false;

// Helper function to get API key from multiple sources
const getApiKey = (): string => {
  // First check environment variable (Vite)
  const envKey = import.meta.env.VITE_NVIDIA_API_KEY;
  if (envKey) return envKey;
  
  // Then check sessionStorage (set from Settings)
  const sessionKey = sessionStorage.getItem('nvidia_api_key');
  if (sessionKey) return sessionKey;
  
  // Finally check localStorage (persisted from Settings)
  const localKey = localStorage.getItem('nvidia_api_key');
  return localKey || '';
};

const getHeaders = () => ({
  "Authorization": `Bearer ${getApiKey()}`,
  "Accept": "application/json"
});

export const nvidiaService = {
  getSmartAdvice: async (taskTitle: string, deadline: string) => {
    const apiKey = getApiKey();
    if (!apiKey) {
      return "⚠️ Please configure your NVIDIA API Key in Settings to get AI advice.";
    }

    try {
      const response = await axios.post(INVOKE_URL, {
        model: "qwen/qwen3.5-397b-a17b",
        messages: [{
          role: "user",
          content: `I have a task titled "${taskTitle}" due on ${deadline}. Give me 3 short, actionable sub-steps to complete it effectively. Format as a simple numbered list. Keep it concise.`
        }],
        max_tokens: 512,
        temperature: 0.60,
        top_p: 0.95,
        top_k: 20,
        stream: STREAM,
        chat_template_kwargs: { enable_thinking: false }
      }, {
        headers: getHeaders(),
        responseType: 'json'
      });

      const content = response.data?.choices?.[0]?.message?.content;
      return content || "Start early and break it down into smaller pieces!";
    } catch (error: any) {
      console.error('NVIDIA API Error:', error.response?.data || error.message);
      return "Focus on the priority and manage your time wisely.";
    }
  },

  recommendTasks: async (currentTasksCount: number) => {
    const apiKey = getApiKey();
    if (!apiKey) {
      return ["⚠️ Configure your NVIDIA API Key in Settings"];
    }

    try {
      const response = await axios.post(INVOKE_URL, {
        model: "qwen/qwen3.5-397b-a17b",
        messages: [{
          role: "user",
          content: `I currently have ${currentTasksCount} tasks pending. Suggest exactly 3 highly productive tasks I could add to improve my professional or personal growth. Provide ONLY the task titles, one per line, no numbering or bullets.`
        }],
        max_tokens: 256,
        temperature: 0.60,
        top_p: 0.95,
        top_k: 20,
        stream: STREAM,
        chat_template_kwargs: { enable_thinking: false }
      }, {
        headers: getHeaders(),
        responseType: 'json'
      });

      const content = response.data?.choices?.[0]?.message?.content;
      return content?.split('\n').filter((t: string) => t.trim().length > 0).slice(0, 3) || [];
    } catch (error: any) {
      console.error('NVIDIA API Error:', error.response?.data || error.message);
      return ["Morning meditation", "Review weekly goals", "Organize workspace"];
    }
  }
};

// Mantener compatibilidad con código existente
export const geminiService = nvidiaService;

