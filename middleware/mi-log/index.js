const logger = require('./logger');
module.exports = (options) =>{
    
    const loggerMiddle =  logger(options); //logger() 返回一个函数 logger.js中的一个异步函数

    return (ctx,next) =>{ //对日志中间件进行错误处理
        
        //loggerMiddle返回的是一个异步函数即Promise，通过Promise.catch()捕获reject异常的部分
        return loggerMiddle(ctx,next).catch((err) => { 
            // console.log(ctx.response.status );当处理到logger中发送异常，被catch捕获但 ctx.response.status=200，需要重新定义响应状态码
            if(ctx.response.status < 500){ //状态码小于 500 的错误统一按照 500 错误码处理
                ctx.response.status = 500
            }
            //调用 log 中间件打印堆栈信息并将错误抛出到最外层的全局错误监听进行处理。
            ctx.log.error(err.stack);
            ctx.state.logged = true; //同时在ctx下state命名空间属性添加logged
            ctx.throw(err);  //用来抛出一个包含.status 属性错误的，其默认值为 500, 如果logger中出现异常错误，这个抛出的异常通过app.on('error') 错误监听事件处理
            /**
             * ctx.throw([status], [msg], [properties])
             * ctx.throw(400, 'name required') 等效于:
                const err = new Error('name required');
                err.status = 400;
                err.expose = true;
                throw err;
             */
        })
    }
}