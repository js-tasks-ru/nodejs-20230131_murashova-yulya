const url = require('url');
const http = require('http');
const path = require('path');

const server = new http.Server();
const fs = require('node:fs');

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'GET':
        
        var pathParse = path.parse(pathname);
        if (pathParse.dir !== '') 
        {
            res.statusCode = 400;
            res.end('Вложенные папки не поддерживаются');
            return;
        }
        
        if (!fs.existsSync(filepath)) {
            res.statusCode = 404;
            res.end('Файл не найден');
            return;
        }
        
        res.statusCode = 200;
        const stream = fs.createReadStream(filepath);

        stream.on('data', chunk => {
           res.write(chunk);
        });
        
        stream.on('end', () => {
            res.end();
        });
        
        stream.on('error', function(err){
            
            res.statusCode = 500;
            res.end();
        });
        
        break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
