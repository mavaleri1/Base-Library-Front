export default async function handler(request) {
  const url = new URL(request.url);
  const path = url.pathname;
  
  let targetUrl;
  if (path.startsWith('/api/v1/')) {
    targetUrl = `http://147.93.144.61:8002${path}`;
  } else {
    targetUrl = `http://147.93.144.61:8001/api${path}`;
  }
  
  try {
    const response = await fetch(targetUrl, {
      method: request.method,
      headers: {
        ...Object.fromEntries(request.headers.entries()),
        host: undefined,
      },
      body: request.method !== 'GET' && request.method !== 'HEAD' ? await request.text() : undefined,
    });
    
    const data = await response.text();
    
    return new Response(data, {
      status: response.status,
      headers: {
        'Content-Type': response.headers.get('content-type') || 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return new Response(JSON.stringify({ error: 'Proxy error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
