interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

interface ChatResponse {
  content: string;
  timestamp: Date;
}

class ChatbotService {
  private apiEndpoint: string;

  constructor() {
    this.apiEndpoint = process.env.NEXT_PUBLIC_CHATBOT_API_URL || '/api/chatbot';
  }

  async sendMessage(message: string, conversationHistory: Message[], token?: string): Promise<ChatResponse> {
    try {
      // Prepare conversation context (last 10 exchanges to stay within context window)
      const context = conversationHistory.slice(-10).map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      // Token is passed from the auth context via useChatbot hook
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify({ message, context }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || err.message || `Request failed: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        content: data.response || data.content || data.message || '',
        timestamp: new Date(),
      };
    } catch (error) {
      console.error('Chatbot service error:', error);
      throw error;
    }
  }

  // Mock responses for development/testing
  private getMockResponse(message: string): ChatResponse {
    const mockResponses = [
      "That's a great question! For marketing strategies, I'd recommend focusing on understanding your target audience first. What industry are you in?",
      "Based on current trends, I suggest implementing a multi-channel approach. Would you like me to elaborate on specific channels?",
      "Content marketing is crucial for building brand awareness. Let me help you create a content strategy tailored to your business goals.",
      "Social media engagement can significantly boost your brand visibility. I can help you develop a posting schedule and content plan.",
      "To improve your marketing ROI, let's analyze your current campaigns and identify optimization opportunities.",
    ];

    // Simple mock: return a random response with a delay
    const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];

    return {
      content: randomResponse,
      timestamp: new Date(),
    };
  }

  async saveConversation(messages: Message[]): Promise<void> {
    try {
      const response = await fetch(`${this.apiEndpoint}/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages }),
      });

      if (!response.ok) {
        throw new Error('Failed to save conversation');
      }
    } catch (error) {
      console.error('Failed to save conversation:', error);
      throw error;
    }
  }

  async loadConversation(conversationId: string): Promise<Message[]> {
    try {
      const response = await fetch(`${this.apiEndpoint}/load/${conversationId}`);

      if (!response.ok) {
        throw new Error('Failed to load conversation');
      }

      const data = await response.json();
      return data.messages || [];
    } catch (error) {
      console.error('Failed to load conversation:', error);
      throw error;
    }
  }
}

export const chatbotService = new ChatbotService();
