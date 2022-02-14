/**
 * 用于打印客户端 发起http请求信息
 * @param {context} ctx 上下文对象
 * @param {string} message 定义消息
 * @param {object} commonInfo 公用的日志信息 对应logger中对象
 * @returns {string} 
 */
module.exports = (ctx, message,commonInfo) =>{
    //通过结构将 客户端request信息复制
    const { 
        method,  // 请求方法 get post或其他
        url,		  // 请求链接
        host,	  // 发送请求的客户端的host
        headers	  // 请求中的headers
    } = ctx.request; 
    //要输出的信息
    const client = {
        method,
        url,
        host,
        message,
        referer: headers['referer'],  // 请求的源地址
        userAgent: headers['user-agent']  // 客户端信息 设备及浏览器信息
    }
    return JSON.stringify(Object.assign(client, commonInfo||{}));
    // Object.assign(target,source) //将源对象，添加到目标对象中，如果目标对象属性与源对象属性重复，源对象的属性值覆盖目标对象属性值
    //Object.assign({id:12,age:'15'},{age:5,name:'tom'}) => 输出{id:12,age:5,name:'tom'}
}