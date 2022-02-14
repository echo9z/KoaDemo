const path = require('path');
const fs = require('fs');
module.exports = (options) => {
  /**实现思路，当应用程序启动时候，读取指定目录下的 js 文件，以文件名作为属性名，挂载在实例 app 上，然后把文件中的接口函数，扩展到文件对象上。
   * options 中参入两个对象参数，一个app实例，一个rule:{}包含了controller模块路径和service模块路径
   */
  let {app, rules = []} = options; //通过结构出参数对象中app 和 rule，如果rule没有传入对象默认为空

  //如果参数缺少实例 app，则抛出错误
  if(!app){
    throw new Error('the app params is necessary!');
  }
  //将app实例的属性，提取到一个数组中
  const appKeys = Object.keys(app);
  //遍历 rule对象
  rules.forEach( item => {
    const {folder,name} = item;//通过数组结构出folder

    // 如果 app 实例中已经存在了传入过来的属性名，则抛出错误
    if(appKeys.includes(name)){
      throw new Error(`the name of ${name} already exists!`);//抛出app实例存在name属性
    }
    let content = {}; //存放着文件下对应方法对象，比如controller
    //读取指定目录下dir的所有文件并遍历
    fs.readdirSync(folder).forEach( filename => { //进行循环遍历目录，['a.js','b.js','c.js'].forEach()
      //取出文件的后缀
      let extname = path.extname(filename);
      //文件是js类型
      if(extname === '.js'){
        //将文件名中去掉后缀，得到文件名作为content的属性，比如遍历出 home.js,去掉后缀得到home
        let name = path.basename(filename,extname);  //path.basename('aaa.txt', '.txt'); => aaa
        //content['home'] = 同时 home属性赋值为 require加载home.js的函数
        content[name] = require(path.join(folder, filename));
      }
    });
    //app[controller]，将controller文件夹作为app的属性名
    app[name] = content;  //app[controller] = {home: require('__dirname, '../controller'+'home.js'}
  });
}

/* miRule({
  app,
  rules: [
    {
      folder: path.join(__dirname, '../controller'),
      name: 'controller'
    },
    {
      folder: path.join(__dirname, '../service'),
      name: 'service'
    }
  ]
}) */