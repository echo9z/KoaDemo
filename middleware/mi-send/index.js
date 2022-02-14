/**
 * 将ctx.response.body响应数据封装为发送json数据格式的方法
 * @returns {function}
 */
module.exports = () =>{
    //用于处理json的方法
    function render(json){
        this.set('Content-Type','application/json')
        this.body = JSON.stringify(json); //将对象格式为json字符串，通过ctx.body 进行发送
    }
    return async (ctx,next) => {
        //在上下文中配置一个send方式的方法
        ctx.send = render.bind(ctx); //调用render方法通过bind()函数改变this的指向ctx对象
        //调用ctx.log的error方法打印error日志，在应用中使用log4js输出日志，比如做了一个sql查询打印info日志中
        // ctx.log.error('this error')
        await next();
    }
}