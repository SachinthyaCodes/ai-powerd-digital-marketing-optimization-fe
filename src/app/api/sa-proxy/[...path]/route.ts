import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.SA_BACKEND_URL || 'http://4.145.88.11:8000';

async function proxyRequest(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const target = `${BACKEND_URL}/${path.join('/')}`;
  const url = new URL(target);
  // Forward query params
  req.nextUrl.searchParams.forEach((v, k) => url.searchParams.set(k, v));

  const headers = new Headers();
  // Forward relevant headers
  for (const key of ['content-type', 'authorization', 'accept']) {
    const val = req.headers.get(key);
    if (val) headers.set(key, val);
  }

  const init: RequestInit = {
    method: req.method,
    headers,
  };

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    init.body = await req.arrayBuffer();
  }

  const upstream = await fetch(url.toString(), init);

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
}

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const PATCH = proxyRequest;
export const DELETE = proxyRequest;
export const OPTIONS = proxyRequest;
