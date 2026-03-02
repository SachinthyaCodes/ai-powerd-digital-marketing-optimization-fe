import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/chatbot
 *
 * Proxy to the Smart Assistant backend RAG engine.
 *
 * - If the request carries a Bearer token  → forwards to /api/admin/chat
 *   (tenant is resolved automatically from the JWT on the backend).
 * - If no token is provided               → returns 401.
 *
 * Backend URL is configured via the server-side env var BACKEND_URL
 * (defaults to http://localhost:8000 for local development).
 */

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, context } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'message is required' }, { status: 400 });
    }

    // Forward the Authorization header if present (admin / user JWT)
    const authHeader = request.headers.get('authorization');

    if (!authHeader) {
      return NextResponse.json(
        { error: 'Unauthorized. Please log in to use the Smart Assistant.' },
        { status: 401 }
      );
    }

    // Proxy to backend /api/admin/chat
    const backendRes = await fetch(`${BACKEND_URL}/api/admin/chat`, {
      method:  'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': authHeader,
      },
      body: JSON.stringify({ message, context: context || [] }),
    });

    const data = await backendRes.json();

    if (!backendRes.ok) {
      return NextResponse.json(
        { error: data.message || 'Backend error' },
        { status: backendRes.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Chatbot proxy error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Proxy error' },
      { status: 500 }
    );
  }
}

/** GET /api/chatbot — health check */
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'smart-assistant-proxy',
    backend: BACKEND_URL,
    timestamp: new Date().toISOString(),
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, context } = body;

    // Validate request
    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // TODO: Replace with your actual AI service integration
    // Example integrations:
    // - OpenAI GPT-4
    // - Anthropic Claude
    // - Google Gemini
    // - Custom backend API

    // Example with OpenAI (uncomment and configure):
    /*
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a helpful marketing strategy assistant. Provide clear, actionable advice."
        },
        ...context,
        {
          role: "user",
          content: message
        }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const response = completion.choices[0].message.content;
    */

    // Mock response for development
    const mockResponses = [
      "Great question! For effective marketing strategies, I recommend starting with a thorough audience analysis. Understanding your target demographic is crucial for crafting messages that resonate.",
      "Based on current trends, I suggest focusing on content marketing and SEO. These channels provide long-term value and help build brand authority in your industry.",
      "Social media engagement is key! I can help you develop a content calendar and posting strategy that aligns with your business goals. Which platforms are you currently using?",
      "To improve conversion rates, consider implementing A/B testing on your landing pages. Small changes can make a significant impact on performance.",
      "Email marketing remains one of the highest ROI channels. Let me help you segment your audience and create personalized campaigns that drive results.",
    ];

    const response = mockResponses[Math.floor(Math.random() * mockResponses.length)];

    return NextResponse.json({
      response,
      timestamp: new Date().toISOString(),
      metadata: {
        model: 'development-mock',
        confidence: 0.95,
      }
    });

  } catch (error) {
    console.error('Chatbot API error:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/chatbot
 * 
 * Health check endpoint
 */
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'chatbot',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
}
