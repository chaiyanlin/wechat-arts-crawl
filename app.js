var WxAgent = require('./modules/wx_agent.js');
rimraf      = require('rimraf'),
wxAgent     = new WxAgent(),
//替换url参数：
url = 'https://mp.weixin.qq.com/mp/getmasssendmsg?__biz=MzAxMzMxNDIyOA==&uin=MTkxMzM3MDgw&key=b28b03434249256b1faf4f4312fab1e9ce6859ea06a6d3544319d2d50c092b23e69e20da1fd861e3183f3adbba404c8a&devicetype=iPhone+OS9.3.1&version=16030f11&lang=zh_CN&nettype=WIFI&fontScale=100&pass_ticket=TIbJ8GqYXw3D7QeX4tPPkWpg1pZYVuxLF7iwS2xU8IY%3D#wechat_webview_type=1http://mp.weixin.qq.com/mp/getmasssendmsg?__biz=MzAxMzMxNDIyOA==#wechat_webview_type=1&wechat_redirect';

rimraf('./out/*', function(err){
	if ( err )
		console.log('清空输出目录失败...');
	else {
		console.log('清空输出目录完成...');
		wxAgent.init(url);
	}
});