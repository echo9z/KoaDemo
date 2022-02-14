const router = require('koa-router')()
const HomeController = require('./controller/home');

module.exports = (app) => {
    router.get('/', HomeController.index);
    
    router.get('/home', HomeController.home)
    router.get('/home/:id/:name', HomeController.homeParams)
    
    router.get('/404', async(ctx, next) => { //404的响应，会进行分层
        ctx.send({name:'<h1>404 Not Found</h1>'}) //测试 ctx.send()中间件方法
        // ctx.response.body = '<h1>404 Not Found</h1>'
    })
    
    // 增加返回表单页面的路由
    router.get('/user/login',HomeController.login)
    // 增加响应表单请求的路由
    router.post('/user/register',HomeController.register)
    
    // add router middleware:
    app.use(router.routes())
        .use(router.allowedMethods())
}