/*var WxPublicAgent = require('./modules/wx_public_agent.js');*/
var WxAgent       = require('./modules/wx_agent.js');
var rimraf        = require('rimraf');


//clean old output file...
rimraf('./out/*', function(err){
	if ( err )
		console.log('Failed to remove out directory...');
	else
		console.log('Out directory has been removed...');
});

wxAgent = new WxAgent();
wxAgent.init('https://mp.weixin.qq.com/mp/getmasssendmsg?__biz=MTg1MjI3MzY2MQ==&uin=MTkxMzM3MDgw&key=b28b03434249256b041b257267cecee36d92be7b88141f4994e37e8bc63dc1f141fd93ef27bbe60b9a85da50189d6bda&devicetype=iPhone+OS9.3.1&version=16030f11&lang=zh_CN&nettype=WIFI&fontScale=100&pass_ticket=YZFjgqYc8jUfecfG9pA%2BtYKsngmT5CoTmnNho1o7%2BfU%3D#wechat_webview_type=1http://mp.weixin.qq.com/mp/getmasssendmsg?__biz=MTg1MjI3MzY2MQ==#wechat_webview_type=1&wechat_redirect');