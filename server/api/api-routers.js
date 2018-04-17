// 路由设置
var KoaRouter = require('koa-router')();
var nhCreaw = require('./nhCreaw.js');

KoaRouter.post('/getNhData',nhCreaw.contrl) //getNhData接受post调用


module.exports = KoaRouter;