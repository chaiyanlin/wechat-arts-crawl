var request = require("request"),
	fs      = require("fs"),
	path    = require('path'),
	qs      = require("querystring"),
	cheerio = require('cheerio');


WxAgent = function(){};

WxAgent.prototype = {
	queryUrl: null,

	hasNextPage: true,

	fromMsgId: null,

	totalPage: 0,

	init: function(url) {
		this.queryUrl = url.split('#').shift();
		this.queryUrl += '&f=json';
		console.log(this.queryUrl);
		this.getMsgList();
	},

	getMsgList: function() {
		var me = this;
		var fromMsgId = me.fromMsgId || '';
		if ( !me.hasNextPage ) {
			console.log('总页数：' + me.totalPage);
			return;
		}
		var opts = {
			url: me.queryUrl + '&frommsgid=' + fromMsgId,
			method: "GET",
			followRedirect: true
		};

		console.log('request url: ' + opts.url);

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
		var opts = {
					  url: msg.app_msg_ext_info.content_url,
					  method: "GET",
					  followRedirect: true
				   };
		request(opts, function(error, response, body){
			fs.mkdirSync('./out/' + title);
			fs.appendFile( './out/' + title + '/' + title + '.html', body, (err) => {
			  if (err) 
			  	console.log(err);
			});
			var $ = cheerio.load(body);
			$('img').each(function(i,e){
				me.downloadImg($(this).data('src'), './out/' + title);
				me.downloadImg($(this).attr('src'), './out/' + title);
			});
		});
	},


	downloadImg: function(url, dir) {
		if ( !url || new RegExp("base64").test(url) )
			return;
		var me = this;
		console.log('download img from url: ' + url);
		var ext = path.extname(url) || '.png';
		var timeStamp = + new Date();
		request(url, function(error, response, body){
			if (error) {
				console.log(error.code);
				console.log('下载图片失败：' + url);
				fs.appendFile('./out/' + 'error.log', url + '=>' + dir + '\r\n', (err)=>{
					if (err) 
						console.log(err);
				});
			}
		}).pipe(fs.createWriteStream(dir + '/' + timeStamp + ext));
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