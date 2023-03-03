const url = require('url');
const http = require('http');
const path = require('path');
const LimitSizeStream = require('./LimitSizeStream');

const server = new http.Server();
const fs = require('node:fs');

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);
  
  switch (req.method) {
    case 'POST':

        res.statusCode = 201;

        var pathParse = path.parse(pathname);
        if (pathParse.dir !== '') 
        {
            res.statusCode = 400;
            res.end();
            return;
        }
        
        if (req.headers.hasOwnProperty('content-length') && req.headers['content-length'] === '0') 
        {
            res.statusCode = 409;
            res.end();
            return;
        }
        
        if (fs.existsSync(filepath)) 
        {
            res.statusCode = 409;
            
            req.on('data', (chunk) => {
            });

            req.on('end', () => {
                res.end();           
            });
            
            req.on('error', () => {
                res.end();           
            });
        }
        else 
        {
            var limitStream = new LimitSizeStream({limit: 1048576});
            var writeStream = fs.createWriteStream(filepath);
            limitStream.pipe(writeStream);
            
            req.on('data', (chunk) => {
                limitStream.write(chunk);
            });

            req.on('end', () => {
                limitStream.end();          
            });
            
            req.on('close', () => {
                if (!res.closed) res.end();          
            });
            
            limitStream.on('end', () => {
                if (!res.closed) res.end();          
            });
            
            limitStream.on('close', () => {
                writeStream.close();
            });
            
            req.on('error', (err) => {
                
                if (err.code === 'ECONNRESET')
                {
                    limitStream.end();
                    res.statusCode = 501;
                    deleteFile(filepath);
                }
    
                if (!res.closed) res.end();           
            });
            
            limitStream.on('error', (err) => {
                if (err.code === 'LIMIT_EXCEEDED')
                {
                    res.statusCode = 413;
                    deleteFile(filepath);
                }
                else res.statusCode = 501;
    
                limitStream.emit('close');
            });
            
            writeStream.on('error', (err) => {
                res.statusCode = 501;       
            });
        }
        
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

function deleteFile(filepath) 
{
    if (fs.existsSync(filepath))
    {
        fs.unlinkSync(filepath);
    }
}

module.exports = server;
