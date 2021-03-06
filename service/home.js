//service层主要用于处理数据层面的交互，比如调用 model 处理数据库，调用第三方接口
module.exports = {
    register : async (name,password)=>{
        let data;
        if( name === 'abc' && password === '123456' ){
            data = {
                status: 0,
                data: {
                  title: "个人中心",
                  content: "欢迎进入个人中心"
                }
            }
        }else{
            data = {
                status: -1,
                data: {
                  title: '登录失败',
                  content: "请输入正确的账号信息"
                }
            }
        }
        return data;
    }
}