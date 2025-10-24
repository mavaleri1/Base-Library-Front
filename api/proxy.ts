import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { method, url, headers, body } = req;
  
  let targetUrl: string;
  if (url?.startsWith('/api/v1/')) {
    targetUrl = `http://147.93.144.61:8002${url}`;
  } else {
    targetUrl = `http://147.93.144.61:8001${url}`;
  }
  
  try {
    const response = await fetch(targetUrl, {
      method,
      headers: {
        ...headers,
        host: undefined,
      },
      body: method !== 'GET' && method !== 'HEAD' ? JSON.stringify(body) : undefined,
    });
    
    const data = await response.text();
    
    res.status(response.status);
    res.setHeader('Content-Type', response.headers.get('content-type') || 'application/json');
    res.send(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Proxy error' });
  }
}
