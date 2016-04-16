var WxAgent = require('./modules/wx_agent.js');
rimraf      = require('rimraf'),
wxAgent     = new WxAgent(),
url         = 'https://mp.weixin.qq.com/mp/getmasssendmsg?__biz=MzAxMzMxNDIyOA==&uin=MTkxMzM3MDgw&key=b28b03434249256b99aa2677f019f6f2ae965ea649116c1ecc99b328960c6ad33ee988f2ad5e1c041940a38499000320&devicetype=iPhone+OS9.3.1&version=16030f11&lang=zh_CN&nettype=WIFI&fontScale=100&pass_ticket=TIbJ8GqYXw3D7QeX4tPPkWpg1pZYVuxLF7iwS2xU8IY%3D#wechat_webview_type=1http://mp.weixin.qq.com/mp/getmasssendmsg?__biz=MzAxMzMxNDIyOA==#wechat_webview_type=1&wechat_redirect';

rimraf('./out/*', function(err){
	if ( err )
		console.log('清空输出目录失败...');
	else {
		console.log('清空输出目录完成...');
		wxAgent.init(url);
	}
});