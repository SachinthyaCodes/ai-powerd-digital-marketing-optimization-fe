import { NextRequest, NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  console.error('[extract] GEMINI_API_KEY is not set in .env.local');
}
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

export async function POST(req: NextRequest) {
  if (!GEMINI_API_KEY || GEMINI_API_KEY === 'YOUR_NEW_GEMINI_API_KEY_HERE') {
    return NextResponse.json(
      { success: false, error: 'Gemini API key is not configured. Set GEMINI_API_KEY in .env.local' },
      { status: 503 }
    );
  }

  try {
    const formData = await req.formData();
    const imageFile = formData.get('image') as File | null;

    if (!imageFile) {
      return NextResponse.json({ success: false, error: 'No image file uploaded' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(imageFile.type)) {
      return NextResponse.json({ success: false, error: 'Only JPEG, PNG, WEBP or GIF images are allowed' }, { status: 400 });
    }

    // Convert file to base64
    const arrayBuffer = await imageFile.arrayBuffer();
    const base64Image = Buffer.from(arrayBuffer).toString('base64');

    const requestBody = {
      contents: [
        {
          parts: [
            {
              text:
                'You are an expert OCR assistant. Carefully extract ALL visible text from this image exactly as it appears. ' +
                'The text may be in Sinhala, English, or a mix of both languages. ' +
                'Rules:\n' +
                '1. Extract every word, number, symbol, and punctuation visible in the image.\n' +
                '2. Preserve the original reading order (left to right, top to bottom).\n' +
                '3. Return the extracted text as a single coherent paragraph.\n' +
                '4. Do NOT add commentary, explanations, or formatting — only the raw extracted text.\n' +
                '5. If absolutely no text is visible in the image, return exactly: "No text detected."\n',
            },
            {
              inline_data: {
                mime_type: imageFile.type,
                data: base64Image,
              },
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.0,
        maxOutputTokens: 2048,
      },
    };

    const geminiRes = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    if (!geminiRes.ok) {
      const errBody = await geminiRes.json().catch(() => ({}));
      const errMsg = (errBody as { error?: { message?: string } })?.error?.message || `Gemini API error: ${geminiRes.status}`;
      return NextResponse.json({ success: false, error: errMsg }, { status: 502 });
    }

    const data = await geminiRes.json() as {
      candidates?: { content?: { parts?: { text?: string }[] } }[];
    };

    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

    const extractedText = rawText
      .replace(/\r?\n+/g, ' ')
      .replace(/\s{2,}/g, ' ')
      .trim() || 'No text detected.';

    return NextResponse.json({ success: true, text: extractedText });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Extraction failed';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
