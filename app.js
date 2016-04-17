var WxAgent = require('./modules/wx_agent.js');
rimraf      = require('rimraf'),
wxAgent     = new WxAgent(),
//替换url参数：
url = 'https://mp.weixin.qq.com/mp/getmasssendmsg?__biz=MzAxMzMxNDIyOA==&uin=MTkxMzM3MDgw&key=b28b03434249256b28706571a99c4c421c17303d0b52ed0d3cea3c2ac34bd70d4343a56276e0d803c8f8ab461528735d&devicetype=iPhone+OS9.3.1&version=16030f11&lang=zh_CN&nettype=WIFI&fontScale=100&pass_ticket=S7xjrKj245X5LZMJnoLeAUPYGAqQ2%2B5XrgmFia%2BaUuI%3D#wechat_webview_type=1http://mp.weixin.qq.com/mp/getmasssendmsg?__biz=MzAxMzMxNDIyOA==#wechat_webview_type=1&wechat_redirect';

rimraf('./out/*', function(err){
	if ( err )
		console.log('清空输出目录失败...');
	else {
		console.log('清空输出目录完成...');
		wxAgent.init(url);
	}
});