const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
    
  #s = 0;
  limit = 5;
  encoding = 'utf-8';
    
  constructor(options) {
    super(options);
    
    if (typeof options === 'object')
    {
        this.limit = options.hasOwnProperty('limit') ? options.limit : this.limit;
        //this.encoding = options.hasOwnProperty('encoding') ? options.encoding : this.encoding;
    }
    
    this.on('error', err => { console.log(err.message); });
  }
  
  _transform(chunk, encoding, callback) {
      callback(this.#checkLimit(chunk), chunk);
  }
  
  #checkLimit(chunk) {
      this.#s += chunk.length;
      if (this.#s > this.limit) return new LimitExceededError;
  }
}

module.exports = LimitSizeStream;
