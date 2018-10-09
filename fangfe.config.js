module.exports = {
  "projectName": "DraggableDemo",
  "projectType": "vue",//项目类型
  "styleType": "less",//Css编译类型
  "author": "yangshenglan",
  "email": "yangshenglan@58ganji.com",
  //webpack相关配置
  "webpackConfig": {
    "entryPages": "src/pages/*", //可把*改成指定目录
    "port": "8080",
    "devtool": "source-map",//SourceMap
    "enableCommon": true,//开启提取公共代码
    //开启dll功能
    "enableDll": false,
    "dllArr": ['vue','vue-lazyload'],//开启Dll时，被打包到dll
    "cssModule": false,//开启CSSMoudule
    "proxy": false,//是否使用代理
    "minimize": true,//开启代码压缩
  }
}