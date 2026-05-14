import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const BACKEND_URL = process.env.BACKEND_URL || 'http://127.0.0.1:5001';

console.log('Proxy initialized with BACKEND_URL:', BACKEND_URL);

async function proxyRequest(req: NextRequest) {
  const url = new URL(req.url);
  const path = url.pathname.replace(/^\/api/, '');
  
  // Diagnostic Route
  if (path === '/test-proxy') {
    return NextResponse.json({ 
      status: 'Proxy is alive ✅', 
      backendUrl: BACKEND_URL,
      timestamp: new Date().toISOString()
    });
  }

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

    // Robust body handling
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      const contentType = req.headers.get('content-type') || '';
      
      if (contentType.includes('multipart/form-data')) {
        // Forward multipart stream (required for uploads)
        fetchOptions.body = req.body;
        fetchOptions.duplex = 'half';
      } else {
        // For JSON and others, read as text first
        try {
          const body = await req.text();
          if (body) fetchOptions.body = body;
        } catch (e) {
          console.warn('Could not read request body:', e);
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
    console.error(`[Proxy Error] ${req.method} ${targetUrl}:`, error.message);
    
    // Distinguish between connection errors and execution errors
    const statusCode = error.name === 'AbortError' ? 504 : 500;
    const errorType = error.name === 'AbortError' ? 'Timeout' : 'Proxy Error';

    return NextResponse.json(
      { 
        error: errorType, 
        message: error.message,
        target: targetUrl.split('?')[0], // Don't log full URL with query params
        backendConfigured: BACKEND_URL !== 'http://127.0.0.1:5001'
      },
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
