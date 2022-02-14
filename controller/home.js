const HomeService = require('../service/home');
module.exports = {
    index : async (ctx, next) => { //首页的处理逻辑
        const index = await ctx.render('home/index',{title:'首页'});
        ctx.response.body = index;
        await next();
    },
    home : async (ctx, next) => { //home页的处理逻辑
        console.log(ctx.request.query)
        console.log(ctx.request.querystring) //?id=12&name=abc
        ctx.response.body = '<h1>HOME page</h1>'
        await next();
    },
    homeParams : async (ctx, next) => { //home动态参数功能
        console.log(ctx.params) // :id/:name /home/9/tom => {id:9,name:tom}
        ctx.response.body = `<h1>HOME page ${JSON.stringify(ctx.params)}</h1>`
        await next();
    },
    login : async (ctx, next)=>{ //返回login页面
        //app中注册koa-view 支持ejs进行渲染页面
        const login = await ctx.render('home/login',{title:'登录',content:''})
        ctx.response.body = login;
        await next();
    },
    register : async (ctx, next)=>{ //登录数据进行效验
        let user = ctx.request.body
        //通过调用service的register()的数据交互，返回data数据
        let res = await HomeService.register(user.name,user.password);
        let data;
        console.log(res);
        if(res.status === -1){
            data = await ctx.render('home/login', res.data)
        }else{
            res.data.title = "个人中心"
            data = await ctx.render('home/success', res.data)
        }
        ctx.response.body = data;
        await next();
    }
}