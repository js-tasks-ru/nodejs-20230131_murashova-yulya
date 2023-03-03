const path = require('path');
const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

var subscribers = {};

router.get('/subscribe', async (ctx, next) => {

    var id = Math.random();
    
    const promise = new Promise((resolve) => {
        ctx.req.on('data', (message) => { 
            resolve(message);
        });
    });
    
    subscribers[id] = ctx.req;    

    let result = await promise;
    ctx.body = result;  
});

router.post('/publish', async (ctx, next) => {

    if (ctx.request.body.hasOwnProperty('message')) 
    {
        for (var id in subscribers) {
            var message = ctx.request.body.message; 
            subscribers[id].emit('data', ctx.request.body.message);        
        }
    }
  
    ctx.body = 'ok';
    return next();
});

function sendMessage(message) {
  const promise = new Promise((resolve) => {
        if(message !== ''){
          resolve(message);
        }
    });

  return promise;
}

app.use(router.routes());

module.exports = app;
