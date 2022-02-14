const path = require('path');

//用于捕获koa中异常
module.exports = (option = {}) => { //option如果函数没有传入，默认是{}对象
    // 增加环境变量，用来传入到视图中data，方便调试
    const env = option.env || process.env.NODE_ENV || 'development';

    const folder = option.errorPageFolder;  // 400.html 404.html other.html 的存放位置
    // 指定默认的模版文件
    const templatePath = path.join(__dirname, './error.html');
    let fileName = 'other'; //默认未知页面
    return async (ctx,next) => {
        try {
            await next();
            //当客户端发起的请求处理的业务逻辑全部处理完毕时，比如发送 /请求, 洋葱模型最先执行中间件，最后返回next()函数
            //当发送的请求找不到资源 ctx.status为404 ctx.body数据响应为空
            if(ctx.response.status === 404 && !ctx.response.body ){ //用于koa中为设置响应状态。默认情况下，response.status 设置为 404
                //抛出404
                ctx.throw(404)
            }
        } catch (error) {
            // console.log('Message：',error);
            let status = parseInt(error.status)
            // 默认错误信息为 error 对象上携带的 message
            const message = error.message;
            const stack = error.stack;
            // 对 status 进行处理，指定错误页面文件名，对应发送异常status大于400以上的存在400 404 500进行页面输出
            if(status >= 400){
                switch(status){
                    case 400:
                    case 404:
                    case 500:
                        fileName = status;
                        break;
                    // 其它错误 指定渲染 other 文件
                    default:
                        fileName = 'other'
                }
            }else{ //其他异常是定义状态500
                status = 500;
                fileName = status;
            }
            //进过请求最终确定异常的响应码，如果是400就是400.html路径，404就是404.html路径，500就是500.html路径
            const filePath = folder ? path.join(folder,`${fileName}.html`) : templatePath; //如果没有设置errorPage路径使用默认的模版路径
            // console.log('test',filePath);  //test errorPage/404.html
            
            // 渲染对应错误类型的视图，并传入参数对象
            try {
                //下面进行error页面的渲染
                let errorPage  = await ctx.render(filePath,{
                    env, // 指定当前环境参数
                    status: e.status || e.message, // 如果错误信息中没有 status，就显示为 message
                    error: e.message, // 错误信息
                    stack // 错误的堆栈信息
                });
                //响应请求体
                ctx.status = status
                ctx.response.body = errorPage;
            } catch (err) {
                console.log(err);
                // 如果中间件存在错误异常，直接抛出信息，由其他中间件处理
                ctx.throw(500, `错误页渲染失败:${err.message}`); //交给 app.on('error') 错误监听事件，进行异常处理
            }
            
        }
    }
}