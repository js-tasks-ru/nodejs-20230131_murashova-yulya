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
    case 'DELETE':
        
        res.statusCode = 200;

        var pathParse = path.parse(pathname);
        if (pathParse.dir !== '') 
        {
            res.statusCode = 400;
            res.end();
            return;
        }
        
        if (!fs.existsSync(filepath))
        {
            res.statusCode = 404;
            res.end();
            return;
        }
        
        if (fs.existsSync(filepath))
        {
            try {
                fs.unlinkSync(filepath);
            }
            catch(err)
            {
                res.statusCode = 500;
            }
        }
        
        res.end();

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
