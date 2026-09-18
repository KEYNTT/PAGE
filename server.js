const http = require('http');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const DEFAULT_PORT = parseInt(process.env.PORT || '3000', 10);

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.rsc': 'text/x-component; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ico': 'image/x-icon',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8'
};

const server = http.createServer((req, res) => {
  let reqPath = decodeURI(req.url.split('?')[0]);
  let filePath = path.join(__dirname, reqPath);

  // Check directory
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    if (!reqPath.endsWith('/') && reqPath !== '') {
      res.writeHead(301, { Location: reqPath + '/' });
      return res.end();
    }
    filePath = path.join(filePath, 'index.html');
  }

  if (!fs.existsSync(filePath) && fs.existsSync(filePath + '.html')) {
    filePath = filePath + '.html';
  }

  if (!fs.existsSync(filePath)) {
    const dirIndex = path.join(__dirname, reqPath, 'index.html');
    if (fs.existsSync(dirIndex)) {
      filePath = dirIndex;
    }
  }

  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    return res.end('404 Not Found');
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME[ext] || 'application/octet-stream';

  const headers = {
    'Content-Type': contentType,
    'Access-Control-Allow-Origin': '*'
  };

  if (reqPath.startsWith('/_next/static/')) {
    headers['Cache-Control'] = 'public, max-age=31536000, immutable';
  } else {
    headers['Cache-Control'] = 'no-cache, must-revalidate';
  }

  // Gzip compression for text/code
  const acceptEncoding = req.headers['accept-encoding'] || '';
  const isCompressible = /text|javascript|json|component|xml|svg/.test(contentType);

  if (isCompressible && acceptEncoding.includes('gzip')) {
    headers['Content-Encoding'] = 'gzip';
    res.writeHead(200, headers);
    const raw = fs.createReadStream(filePath);
    raw.pipe(zlib.createGzip()).pipe(res);
  } else {
    res.writeHead(200, headers);
    fs.createReadStream(filePath).pipe(res);
  }
});

function startServer(port) {
  server.listen(port, () => {
    console.log(`\n======================================================`);
    console.log(`  INSTANTE — Servidor Web de Alto Rendimiento`);
    console.log(`  Listo en: http://localhost:${port}`);
    console.log(`======================================================\n`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Puerto ${port} ocupado. Intentando en ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error('Error al iniciar el servidor:', err);
    }
  });
}

startServer(DEFAULT_PORT);
