import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const BACKEND_URL = process.env.BACKEND_URL || 'http://127.0.0.1:5001';

async function proxyRequest(req: NextRequest) {
  // Extract the path after /api/
  const url = new URL(req.url);
  const path = url.pathname.replace(/^\/api/, '');
  const targetUrl = `${BACKEND_URL}/api${path}${url.search}`;

  // Forward headers (excluding host)
  const headers = new Headers();
  req.headers.forEach((value, key) => {
    if (key !== 'host') {
      headers.set(key, value);
    }
  });

  try {
    const fetchOptions: RequestInit & { duplex?: 'half' } = {
      method: req.method,
      headers,
    };

    // Robust body handling: forward body stream for all non-GET/HEAD requests
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      const contentType = req.headers.get('content-type');
      
      if (contentType && contentType.includes('multipart/form-data')) {
        // For multipart, we MUST NOT set the content-type manually, 
        // the browser/fetch will set it with the correct boundary.
        // But for proxying, we just forward the stream.
        fetchOptions.body = req.body;
        // IMPORTANT: undici/fetch with stream body requires duplex: 'half'
        fetchOptions.duplex = 'half';
        // IMPORTANT: We must NOT set the 'content-type' header manually here 
        // because the browser's boundary matches the req.body stream precisely.
        // However, our proxy already copied ALL headers at line 13.
        // This is correct as long as the req.body hasn't been consumed.
      } else if (contentType && contentType.includes('application/json')) {
        const body = await req.text();
        if (body && body.trim().length > 0) {
          fetchOptions.body = body;
        }
      }
    }

    // Add a reasonable timeout to prevent 502 hangs
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 15000); // 15s timeout
    fetchOptions.signal = controller.signal;

    const response = await fetch(targetUrl, fetchOptions);
    clearTimeout(id);

    // If 204 No Content, don't try to read body or send body back
    if (response.status === 204) {
      return new NextResponse(null, { status: 204 });
    }

    const responseBody = await response.text();
    
    return new NextResponse(responseBody, {
      status: response.status,
      statusText: response.statusText,
      headers: {
        'Content-Type': response.headers.get('Content-Type') || 'application/json',
      },
    });
  } catch (error: any) {
    console.error(`[Proxy Error] ${req.method} ${targetUrl}:`, error.name === 'AbortError' ? 'Timeout' : error.message);
    
    const statusCode = error.name === 'AbortError' ? 504 : 502;
    const errorMessage = error.name === 'AbortError' ? 'Backend Request Timeout' : 'Backend unavailable';

    return NextResponse.json(
      { error: errorMessage, details: error.message },
      { status: statusCode }
    );
  }
}

export async function GET(req: NextRequest) {
  return proxyRequest(req);
}

export async function POST(req: NextRequest) {
  return proxyRequest(req);
}

export async function PATCH(req: NextRequest) {
  return proxyRequest(req);
}

export async function PUT(req: NextRequest) {
  return proxyRequest(req);
}

export async function DELETE(req: NextRequest) {
  return proxyRequest(req);
}
