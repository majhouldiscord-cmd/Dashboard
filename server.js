const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 8080;
const baseDir = __dirname;

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.eot': 'application/vnd.ms-fontobject',
  '.ttf': 'font/ttf',
  '.webmanifest': 'application/manifest+json',
};

function getMimeType(filePath) {
  const extname = String(path.extname(filePath)).toLowerCase();
  return mimeTypes[extname] || 'application/octet-stream';
}

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url);
  let pathname = parsedUrl.pathname;
  
  // Fix pathname
  if (pathname.endsWith('/')) {
    pathname += 'index.html';
  } else if (!path.extname(pathname)) {
    // If it's a directory path (no extension), try adding /index.html
    const dirPath = path.join(baseDir, pathname);
    if (fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory()) {
      pathname = path.join(pathname, 'index.html');
    }
  }

  const filePath = path.join(baseDir, pathname);
  
  console.log('Request:', req.url, '→', filePath);

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        // File not found
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 Not Found</h1>', 'utf-8');
      } else {
        // Server error
        res.writeHead(500);
        res.end(`Server Error: ${error.code}`, 'utf-8');
      }
    } else {
      res.writeHead(200, { 'Content-Type': getMimeType(filePath) });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
