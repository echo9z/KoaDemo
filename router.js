const router = require('koa-router')()
// const HomeController = require('./controller/home');

module.exports = (app) => {
    router.get('/', app.controller.home.index);
    
    router.get('/home', app.controller.home.home)
    router.get('/home/:id/:name', app.controller.home.homeParams)
    
    router.get('/404', async(ctx, next) => { //404的响应，会进行分层
        ctx.send({name:'404 Not Found'}) //测试 ctx.send()中间件方法
        // ctx.response.body = '<h1>404 Not Found</h1>'
    })
    
    // 增加返回表单页面的路由
    router.get('/user/login',app.controller.home.login)
    // 增加响应表单请求的路由
    router.post('/user/register',app.controller.home.register)
    
    // add router middleware:
    app.use(router.routes())
        .use(router.allowedMethods())
}