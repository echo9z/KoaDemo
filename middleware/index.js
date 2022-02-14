//middleware/index.js用来集中调用所有的中间件
const path = require('path');
const bodyParser = require('koa-bodyparser')
const view = require('koa-views');
const staticFiles = require('koa-static');
const miSend = require('./mi-send/index'); //ctx.send() 消息响应中间件
const miLog = require('./mi-log/index'); //log4js中间件
const ip = require('ip');
const miHttpError = require('./mi-http-error/index'); //http-error 异常错误处理
const miRule = require('./mi-rule/index');

module.exports = (app) =>{
    //应用请求错误中间件
    app.use(miHttpError({ 
        env: app.env,
        //设置错误页面的目录
        errorPageFolder:'errorPage'
    }));
    // 注册log4js中间件
    app.use(miLog({
        appLogLevel : 'debug',// 指定记录的日志级别
        dir : 'logs',  //指定日志存放的目录名
        env: app.env,  // koa 提供的环境变量 指定当前环境，当为开发环境时，在控制台也输出，方便调试
        projectName : 'projectTest',  // 项目名，记录在日志中的项目信息
        serverIP : ip.address() // 默认情况下服务器 ip 地址
    }))
    app.use(staticFiles(path.join(__dirname,'../public')));
    //注册ejs模版引擎
    app.use(view(path.join(__dirname,'../view'),{
        map:{ //文件映射，view下的html文件通过ejs引擎进行渲染
            html:'ejs'
        },
        autoRender : false, //禁止使用 ctx.body 渲染的模板字符串直接返回客户端
    }));

    app.use(bodyParser()) //ctx.request.body
    app.use(miSend()) //注册miSend中间件，通过ctx.send(jsonObj);发送json数据
    
    //添加mi-rule中间，将controller中的home.js加载并挂载到app属性下
    //即app.controller.home调用home.js中函数，该中间件主要为app添加业务函数
    miRule({
        app,
        rules:[
            {
                folder: path.join(__dirname,'../controller'),
                name : 'controller'
            },
            {
                folder: path.join(__dirname,'../service'),
                name : 'service'
            }
        ]
    });

    //用于捕获httpError中间件中出现的异常错误
    app.on('error',(err,ctx) => {
        // response.headerSent检查是否已经发送了一个响应头。 用于查看客户端是否可能会收到错误通知。
        if(ctx && ctx.headerSent && ctx.status < 500){
            ctx.status = 500
        }
        if (ctx && ctx.log && ctx.log.error) {
            if (!ctx.state.logged) {
              ctx.log.error(err.stack)
            }
        }
    });
}