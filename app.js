var WxAgent = require('./modules/wx_agent.js'),
	rimraf  = require('rimraf'),
	fs      = require("fs"),
	wxAgent = new WxAgent(),
//替换url参数：
url = 'https://mp.weixin.qq.com/mp/getmasssendmsg?__biz=MzAxMzMxNDIyOA==&uin=MTkxMzM3MDgw&key=b28b03434249256b217f29f4b5ae7bc0109fdc77e4806118048b24dacb13d566d9ef115eae0c33b6a79de7d48051cc58&devicetype=iPhone+OS9.3.1&version=16030f11&lang=zh_CN&nettype=WIFI&fontScale=100&pass_ticket=S7xjrKj245X5LZMJnoLeAUPYGAqQ2%2B5XrgmFia%2BaUuI%3D#wechat_webview_type=1http://mp.weixin.qq.com/mp/getmasssendmsg?__biz=MzAxMzMxNDIyOA==#wechat_webview_type=1&wechat_redirect';

rimraf( __dirname + '/out', function(err){
	if ( err )
		console.log('清空输出目录失败...');
	else {
		fs.mkdirSync( __dirname + '/out/');
		console.log('清空输出目录完成...');
		wxAgent.init(url);
	}
});