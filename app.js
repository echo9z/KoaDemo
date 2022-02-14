const Koa = require('koa')
const router = require('./router'); //路由处理模块
const app = new Koa()
const middleware = require('./middleware/index'); //集中调用所有的中间件模块

middleware(app);
router(app); //路由规则配置 
const appKeys = Object/* .keys(app)
console.dir(app);
console.log(appKeys); */
app.listen(8080, () => {
    console.log('server is running at http://localhost:8080')
})
