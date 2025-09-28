import { createMiddleware } from 'vercel-node-server';
import { createProxyMiddleware } from 'http-proxy-middleware';

// Crea un middleware de proxy
const proxy = createProxyMiddleware({
  target: process.env.BACKEND_URL || 'http://localhost:5000', // URL de tu backend
  changeOrigin: true,
  pathRewrite: {
    '^/api': '/', // Elimina el prefijo /api de la ruta
  },
  onError: (err, req, res) => {
    console.error('Proxy error:', err);
    res.status(500).json({ error: 'Error del servidor' });
  },
});

export default createMiddleware(async (req, res) => {
  // Configuración de CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  // Manejo de la solicitud OPTIONS (preflight)
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Pasa la solicitud al proxy
  return proxy(req, res);
});
