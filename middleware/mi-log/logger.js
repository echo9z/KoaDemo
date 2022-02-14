const log4js = require('log4js');
const access = require('./access'); // 引入日志输出信息的封装文件
const levelMethods = ["trace", "debug", "info", "warn", "error", "fatal", "mark"];

//定义用户配置信息，以便后期debug维护
const baseInfo = {
    appLogLevel : 'debug',// 指定记录的日志级别
    dir : 'logs',  //指定日志存放的目录名
    env : 'dev', // 指定当前环境，当为开发环境时，在控制台也输出，方便调试
    projectName : 'projectTest',  // 项目名，记录在日志中的项目信息
    serverIP : '0.0.0.0' // 默认情况下服务器 ip 地址
}
/**
 * @param {appLogLevel,dir,env,projectName,serverIP} options 
 * @returns 
 */
module.exports = (options) =>{
    // console.log(options);
    const contextLogger = {}; //该对象封装logger[level]()方法
    const appenders = {};

    // const {appLogLevel, dir, env, projectName, address  } = baseInfo; //日志的基本信息局
    // const commonInfo = { projectName,address }; // 增加常量，用来存储公用的日志信息
    //通过结构继承baseInfo的属性
    const opts = Object.assign({}, baseInfo, options || {});//通过assign()将 baseInfo和 options对象进行覆盖
    const { appLogLevel, dir, env, projectName, serverIP  } = opts; //日志的基本信息局

    const commonInfo = { projectName,serverIP }; // 增加常量，用来存储公用的日志信息

    appenders.cheese = {
        type: 'dateFile',  // 日志类型 
        filename: `${dir}/responseTime`,  // 输出的文件名
        pattern: '-yyyy-MM-dd.log', // 文件名增加后缀
        alwaysIncludePattern: true   // 是否总是有后缀名 
    }
    if(env === 'dev' || env === 'development'){//判断baseInfo中的变量环境dev 或 development 认为是开发环境
        //改变日志信息输出位置为 控制台打印
        appenders.out = { type:'console' } //https://log4js-node.github.io/log4js-node/appenders.html
    }
    const config = {
        appenders,
        categories:{
            default : {
                appenders: Object.keys(appenders), //将对象中属性变为数组 比如对象obj{name:'tom',age:8} => ['name','age']    Object.values(obj) => ['tom','8']
                level: appLogLevel
            }
        }
    }
    log4js.configure(config); //配置
    
    //该日志中间件主要功能，计算比如 请求/目录所花费的时间
    return async (ctx,next) => { //当该中间件函数被注册调用加载下面代码
        const startTime = new Date();

        const logger = log4js.getLogger('cheese');
        //应用日志 将log4js中的各个等级的日志输出方法封装成ctx.log对象，对象中有mark至trace等级日志输出
        //通过循环为ctx中添加 ctx.log函数 比如 logger.info('输出的内容'）
        for (let i = 0; i < levelMethods.length; i++) {
            let level = levelMethods[i];
            contextLogger[level] = (message) => {
                logger[level](access(ctx,message,commonInfo));  // logger.info('输出消息');
            }
        }
        ctx.log = contextLogger; //使用 ctx.log.info('message') 进行日志输出
        
        await next(); //等待后面的中间件执行业务逻辑
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        logger.info(access(ctx,`响应时间：${responseTime/1000}s`,commonInfo));
        // throw new Error('err message') //测试./index.js中的异常捕获
    }
}