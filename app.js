var WxAgent = require('./modules/wx_agent.js');
rimraf      = require('rimraf'),
async       = require("async"),
wxAgent     = new WxAgent(),
url         = 'https://mp.weixin.qq.com/mp/getmasssendmsg?__biz=MzAxMzMxNDIyOA==&uin=MTkxMzM3MDgw&key=b28b03434249256b8c95407e073d0f349f17a133a924b5c2c5ee9fe4e52160e704c5e1609c6e8b69200f999e74b65652&devicetype=iPhone+OS9.3.1&version=16030f11&lang=zh_CN&nettype=WIFI&fontScale=100&pass_ticket=YZFjgqYc8jUfecfG9pA%2BtYKsngmT5CoTmnNho1o7%2BfU%3D#wechat_webview_type=1http://mp.weixin.qq.com/mp/getmasssendmsg?__biz=MzAxMzMxNDIyOA==#wechat_webview_type=1&wechat_redirect';
/*async.waterfall([
	function(callback){//clean old output file...
		rimraf('./out/*', function(err){
			if ( err )
				console.log('Failed to remove out directory...');
			else {
				console.log('Out directory has been removed...');
				callback();
			}
		});
	},
	function(callback){//start jobs...
		wxAgent.init(url);
		callback();
	}
], function(err, data){
	console.log('program finished.');
});*/

rimraf('./out/*', function(err){
	if ( err )
		console.log('清空输出目录失败...');
	else {
		console.log('清空输出目录完成...');
		wxAgent.init(url);
	}
});