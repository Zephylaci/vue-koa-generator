var cheerio = require('cheerio');
var nhHttp = require('https');

var mainObj={
  common:{
    state:null,
    html:''
  },
  start:(url)=>{
    var state = new Promise((resolve,reject)=>{
      mainObj.end=resolve;
    });
      console.log('link:'+url);
      nhHttp.get(url, function(res) {
          var html = '';
          res.on('data', function(data) {
              html += data;
          });
          //将解析结果传
          res.on('end', function() {
            console.log('读取结束');
            mainObj.common.html = html;
            mainObj.end();
          });
      }).on('error',(e)=>{
        console.error('error:'+e.message);
      });
      return state;
  },
  end:()=>{}
}



module.exports=mainObj