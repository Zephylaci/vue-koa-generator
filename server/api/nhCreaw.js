var cheerio = require('cheerio');
var nhHttp = require('https');
var hUrl = require('url');
var stringTool = require('./../../tool/s16.js');

var nhURL = 'https://nhentai.net/g/';
var nhHost = 'https://nhentai.net';
//var nhImgURL = 'https://i.nhentai.net/galleries/';


var bResults = [];
var mainObj={
    contrl:async (ctx,next)=>{
        ctx.body={
            code:200
        }
        // 每次请求先清空公用参数，并结束上一次调用
        nhResolve.common={
            result:[],
            state:{},
            urlArr:[]
        }
        nhResolve.end();

        var urlArr= ctx.request.body.upArr.map((d)=>{
          return stringTool.hexCharCodeToStr(d)
        })
        
        await nhResolve.start(urlArr);
        ctx.body.content =JSON.stringify(nhResolve.common.result);

    }
}


var nhResolve={
  common:{
    result:[],
    state:{},
    urlArr:[]
  },
  start: (urlArr)=>{
    var state =new Promise((resolve,reject)=>{
      nhResolve.end = resolve
    });
    console.log('Start');
    nhResolve.common.state=state;
    nhResolve.common.urlArr=urlArr
    for(var i =0 ;i<urlArr.length;i++){
        var url = urlArr[i];
        nhResolve.getHtml(url);
    }
    return state;
  },
  getHtml:(url)=>{
    nhHttp.get(url, function(res) {
        var html = '';
        res.on('data', function(data) {
            html += data;
        });
        
        res.on('end', function() {
          console.log('读取结束');
            var option={
                html:html,
                url:url
            }
          nhResolve.handle(option);
        });
    }).on('error',(e)=>{
      console.error('error:'+e.message);
    });
  },
  handle:(option)=>{
      var html = option.html;
      console.log('处理开始');

    //返回结果
    var result={
        coverImg:"coverImg",
        tittle1: "tittle1",
        //tittle2: "tittle2",
        pages: "pages",
        imgID: "nhImgID"
      };
    $ = cheerio.load(html, {
      decodeEntities: false
    });
    result.tittle1 = $('#info h2').html();
    if (!result.tittle1) {
        console.log('标题读取失败');
        tittle1='标题读取失败';
        result.errUrl=option.url;
    }
    //result.tittle2 = $('#info h1').html();
    result.pages = $('#thumbnail-container .thumb-container').length;
    //获取本子BaseURL
    var baseURL = $('#cover a img').attr('data-src');
    result.coverImg = baseURL;

    if (baseURL) {
        var path=hUrl.parse(baseURL).path;
        var s = path.slice(11);
        result.imgID=s.slice(0,s.indexOf('/'));

    } else {
        console.log('图片Id读取失败');
        result.imgID='图片Id读取失败'
        result.errUrl=option.url
    }

    if(result.errUrl){
        console.log('有url读取失败')
        nhResolve.common.result.push(result);
        nhResolve.end();
    }else{
        console.log('单个处理结束');
        nhResolve.common.result.push(result);
        if(nhResolve.common.result.length===nhResolve.common.urlArr.length){
            console.log('整体处理结束');
            nhResolve.end();
    
        }
    }


  },
  end:()=>{

  }
}

// //对本子页html解析
// function nhResolve(html) {
//     $ = cheerio.load(html, {
//         decodeEntities: false
//     });
//     //获取信息
//     var tittle1 = $('#info h1').html();
//     if (tittle1 === null) {
//         return null;
//     }
//     var tittle2 = $('#info h2').html();
//     var pages = $('#thumbnail-container .thumb-container').length;
//     //获取本子BaseURL
//     var baseURL = $($('#thumbnail-container .thumb-container img')[0]).attr('data-src');
//     //console.log(baseURL);
//     var searchRes = nhReg.exec(baseURL);
//     var nhImgID = 0;
//     if (searchRes !== null) {
//         nhImgID = searchRes[0].replace(/\//g, '');
//     } else {
//         return null;
//     }

//     //返回结果
//     var bResult = {
//         tittle1: tittle1,
//         tittle2: tittle2,
//         pages: pages,
//         imgID: nhImgID
//     };
//     return bResult;
// }

//批量解析递归函数
function nhResolveBatchUnit(hrefs,i,callback){
    //所有都解析完了就执行回调
    if(i >= hrefs.length){
        if (callback && typeof(callback) === "function") {
            callback();
        }
        return;
    }
    nhHttp.get(hrefs[i], function(res) {
        var html = '';
        res.on('data', function(data) {
            html += data;
        });
        res.on('end', function() {
            //console.log(hrefs[i]);
            var tempResult = nhResolve(html);
            for(var j=0;j<10 && tempResult === null;j++){
                tempResult = nhResolve(html);
            }
            if(tempResult === null){
                nhResolveBatchUnit(hrefs,i,callback);
            }else{
                //储存解析结果
                bResults.push(tempResult);
                //递归继续解析
                nhResolveBatchUnit(hrefs,i+1,callback);
            }
        });
    });
}

//批量解析
function nhResolveBatch(html,callback){
    $ = cheerio.load(html, {
        decodeEntities: false
    });
    var hrefs = [];
    var as = $('.cover');
    for(var i=0;i<as.length;i++){
        hrefs.push(nhHost + $(as[i]).attr('href'));
    }
    nhResolveBatchUnit(hrefs,0,function(){
        if (callback && typeof(callback) === "function") {
            callback();
        }
    });
}

//单次解析
function single(gid,callback) {
    //获取网页内容
    nhHttp.get(nhURL + gid + '/', function(res) {
        var html = '';
        res.on('data', function(data) {
            html += data;
        });
        //将解析结果传给回调函数
        res.on('end', function() {
            if (callback && typeof(callback) === "function") {
                callback(nhResolve(html));
            }
        });
    });
};

//批量解析
function multi(weburl,callback) {
    //获取网页内容
    nhHttp.get(weburl, function(res) {
        var html = '';
        res.on('data', function(data) {
            html += data;
        });
        //将解析结果传给回调函数
        res.on('end', function() {
            if (callback && typeof(callback) === "function") {
                nhResolveBatch(html,function(){
                    callback(bResults);
                });
            }
        });
    });
};


module.exports=mainObj;