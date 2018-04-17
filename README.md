# vue-koa-generator

> 基于vue-cil的vue+koa 开发环境  
额外装了，less,axiox,cheerio   
基本结构和文件目录和vue-cil一致
做这个纯粹是方便自己  
不一样的地方：src重命名为client，存模板的文件夹重命名为views  
添加了一个server文件夹，只做了koa最基本的配置  
``` bash
# npm run server 
启动koa服务器 
```
纯前端部分和vue-cil一致  
后端需要通过npm run server开启  

之后的课题，通过webpack给后端设置热更新  
koa自身的完善，加入错误处理，和log之类的  

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
