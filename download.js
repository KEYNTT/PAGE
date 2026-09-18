const https = require('https');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://pixbench.explorme.com';

const pages = [
  { url: '/', file: 'index.html' },
  { url: '/crop-image', file: 'crop-image/index.html' },
  { url: '/resize-image', file: 'resize-image/index.html' },
  { url: '/convert-to-webp', file: 'convert-to-webp/index.html' },
  { url: '/compress-image', file: 'compress-image/index.html' },
  { url: '/guides', file: 'guides/index.html' }
];

function fetchText(urlPath) {
  return new Promise((resolve) => {
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      }
    };
    https.get(BASE_URL + urlPath, options, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        let loc = res.headers.location;
        if (loc.startsWith('/')) return resolve(fetchText(loc));
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', (err) => {
      console.log(`Error al pedir ${urlPath}:`, err.message);
      resolve('');
    });
  });
}

function downloadBinary(assetPath) {
  return new Promise((resolve) => {
    const dest = path.join(process.cwd(), assetPath.replace(/^\//, ''));
    fs.mkdirSync(path.dirname(dest), { recursive: true });

    const file = fs.createWriteStream(dest);
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    };
    https.get(BASE_URL + assetPath, options, (res) => {
      if (res.statusCode !== 200) {
        fs.unlink(dest, () => {});
        return resolve(false);
      }
      res.pipe(file);
      file.on('finish', () => file.close(() => resolve(true)));
    }).on('error', () => {
      fs.unlink(dest, () => {});
      resolve(false);
    });
  });
}

async function run() {
  const assetSet = new Set();

  console.log('1. Descargando páginas HTML...');
  for (const p of pages) {
    console.log(` -> ${p.url}`);
    const html = await fetchText(p.url);
    if (!html) continue;

    const fullDest = path.join(process.cwd(), p.file);
    fs.mkdirSync(path.dirname(fullDest), { recursive: true });
    fs.writeFileSync(fullDest, html);

    // Extraer todos los assets del HTML
    const matches = [...html.matchAll(/(["'])(\/_next\/static\/[^"']+)\1/g)].map(m => m[2]);
    matches.forEach(m => assetSet.add(m));

    // Extraer chunks referenciados en los JSON RSC
    const rscMatches = [...html.matchAll(/static\/chunks\/[a-zA-Z0-9_\-\./]+\.js/g)].map(m => '/_next/' + m[0]);
    rscMatches.forEach(m => assetSet.add(m));
  }

  // Chunks esenciales identificados directamente de tus HTMLs
  assetSet.add('/_next/static/chunks/app/crop-image/page-d30be69d0955ccb3.js');
  assetSet.add('/_next/static/chunks/app/page-9133640c977724f6.js');
  assetSet.add('/_next/static/chunks/53-eb7d53df16984335.js');
  assetSet.add('/_next/static/chunks/419-dc7c9c68465dc7be.js');
  assetSet.add('/_next/static/chunks/158.48d86c593c50b4d1.js');
  assetSet.add('/_next/static/chunks/748.5fb43be9c151baa6.js');
  assetSet.add('/_next/static/chunks/635.25c87b4dc14fb96c.js');
  assetSet.add('/_next/static/chunks/726.f32565025bf98f10.js');

  console.log(`\n2. Verificando y descargando ${assetSet.size} recursos JS/CSS...`);
  for (const asset of assetSet) {
    const dest = path.join(process.cwd(), asset.replace(/^\//, ''));
    if (!fs.existsSync(dest)) {
      const ok = await downloadBinary(asset);
      if (ok) console.log(`[Descargado] ${asset}`);
    }
  }

  console.log('\n¡Descarga terminada con éxito!');
}

run();