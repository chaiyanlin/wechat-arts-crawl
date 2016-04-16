var request = require("request"),
	fs      = require("fs"),
	WxImgCapturer = require('./wx_img_capturer.js');


WxAgent = function(){};

WxAgent.prototype = {
	queryUrl: null,

	hasNextPage: true,

	fromMsgId: null,

	totalPage: 0,

	init: function(url) {
		this.queryUrl = url.split('#').shift();
		this.queryUrl += '&f=json';
		console.log('设置queryUrl为：' + this.queryUrl);
		this.getMsgList();
	},

	getMsgList: function() {
		var me = this;
		var fromMsgId = me.fromMsgId || '';
		if ( !me.hasNextPage ) {
			return;
		}
		var opts = {
			url: me.queryUrl + '&frommsgid=' + fromMsgId,
			method: "GET",
			followRedirect: true
		};

		console.log('请求获取公众号列表: ' + opts.url);

		request(opts, function(error, response, body){
			var data = JSON.parse(body);
			if ( data.ret != 0 ) {
				throw data.errmsg;
			}
			me.hasNextPage = (data.is_continue == 1);
			var generalMsgList = JSON.parse(data.general_msg_list).list;
			for (var i = 0; i < generalMsgList.length; i++) {
				me.msgPaser(generalMsgList[i]);
				if ( i + 1 === generalMsgList.length ) {
					me.fromMsgId = generalMsgList[i].comm_msg_info.id;
				}
			}
			me.totalPage ++;
			me.getMsgList();
		});
	},


	msgPaser: function(msg) {
		var me = this;
		if ( !msg.hasOwnProperty('app_msg_ext_info') || !isNaN(msg.app_msg_ext_info.title) )
			return;
		console.log('获得文章：' + msg.app_msg_ext_info.title);
		var title = me.strReplaceAll(['/', '\\', ':', '*', '?', '"', '<', '>', '|'], '-', msg.app_msg_ext_info.title);
		title += '(id=' + msg.comm_msg_info.id + ')';
		fs.mkdirSync('./out/' + title);//创建文章目录
		var wxImgCapturer = new WxImgCapturer();
		wxImgCapturer.start(msg.app_msg_ext_info, './out/' + title, title);
	},


	/**
	 * [strReplaceAll]
	 * @param  {array} search
	 * @param  {string} replacement
	 * @param  {string} str
	 * @return {string}
	 */
	strReplaceAll: function (search, replacement, str) {
		for (var i = 0; i < search.length; i++) {
			str = str.split(search[i]).join(replacement);
		}
		return str;
	}
};
module.exports = WxAgent;