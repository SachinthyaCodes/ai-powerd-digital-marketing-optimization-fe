import { NextRequest, NextResponse } from 'next/server';

// Allow up to 300s — poster generation (Gemini + Stability AI + Playwright/HarfBuzz) can take 60-120s
export const maxDuration = 300;
export const dynamic = 'force-dynamic';

const CONTENT_BACKEND_URL = (
  // Server-only var takes priority (set in .env.local as CONTENT_API_BACKEND_URL)
  // Falls back to the HF Space URL — never uses NEXT_PUBLIC_ vars (those are client-side)
  process.env.CONTENT_API_BACKEND_URL ||
  'https://gimhanijayasuriya-content-generator-api.hf.space'
).replace(/\/$/, '');

async function proxyRequest(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> | { path: string[] } }
) {
  try {
    // Support both sync (Next 14) and async (Next 15) params
    const resolved = await Promise.resolve(params);
    const pathSegments = resolved.path ?? [];

    // Build target URL preserving full path and query string
    const reqUrl = new URL(req.url);
    const target = `${CONTENT_BACKEND_URL}/${pathSegments.join('/')}${reqUrl.search}`;

    const headers = new Headers();
    for (const key of ['content-type', 'authorization', 'accept']) {
      const val = req.headers.get(key);
      if (val) headers.set(key, val);
    }

    const controller = new AbortController();
    // 280s hard timeout (slightly under maxDuration=300)
    const timer = setTimeout(() => controller.abort(), 280_000);

    const init: RequestInit = { method: req.method, headers, signal: controller.signal };
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      init.body = await req.arrayBuffer();
    }

    let upstream: Response;
    try {
      upstream = await fetch(target, init);
    } finally {
      clearTimeout(timer);
    }

    const respHeaders = new Headers();
    upstream.headers.forEach((v, k) => {
      if (!['transfer-encoding', 'content-encoding', 'connection'].includes(k.toLowerCase())) {
        respHeaders.set(k, v);
      }
    });

    return new NextResponse(upstream.body, {
      status: upstream.status,
      statusText: upstream.statusText,
      headers: respHeaders,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: 'Proxy error', detail: message, backend: CONTENT_BACKEND_URL },
      { status: 502 }
    );
  }
}

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const PATCH = proxyRequest;
export const DELETE = proxyRequest;
export const OPTIONS = proxyRequest;
