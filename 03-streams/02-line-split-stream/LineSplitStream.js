const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
    
  #body = [];
  constructor(options) {
    super(options);
  }

    _transform(chunk, encoding, callback) {

        var str = chunk.toString(this.encoding);
        var ar = str.split(os.EOL);
        
        if (ar.length > 1) 
        {
            for (var i = 0; i < ar.length - 1; i++)
            {
                this.#body.push(Buffer.from(ar[i], this.encoding));
                
                this.push(Buffer.concat(this.#body));
                this.#body = [];
            }
            this.#body.push(Buffer.from(ar[ar.length - 1], this.encoding));
        }
        else 
        {
            this.#body.push(chunk);
        }
        callback(null, null);
    }

    _flush(callback) {
        
        this.push(Buffer.concat(this.#body));        
        callback(null);
    }
}

module.exports = LineSplitStream;
