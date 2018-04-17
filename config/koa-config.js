//配置文件 包括开发和测试
var development_env ={
    env: 'development', //环境名称
    port: 9002,         //服务端口号
    mongodb_url: '',    //数据库地址
    redis_url:'',       //redis地址
    redis_port: ''      //redis端口号
}
var test_env ={
    env: 'test', //环境名称
    port: 3001,         //服务端口号
    mongodb_url: '',    //数据库地址
    redis_url:'',       //redis地址
    redis_port: ''      //redis端口号
}

//根据不同的NODE_ENV，输出不同的配置对象，默认输出development的配置对象
module.exports = {
    development: development_env,
    test: test_env
}[process.env.NODE_ENV || 'development']