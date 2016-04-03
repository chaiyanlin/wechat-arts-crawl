var Crawler     = require("crawler"),
	fs          = require("fs"),
	parseString = require('xml2js').parseString;

/**
 * 微信公众号文章列表获取模块
 */
var WxPublicAgent = function(){};

WxPublicAgent.prototype = {
	/**
	 * 微信公众号openid
	 * @type {string}
	 */
	openid: undefined,

	/**
	 * 登录态需要字段
	 * @type {string}
	 */
	ext: undefined,

	/**
	 * API请求必要参数，固定值
	 * @type {String}
	 */
	cb: 'sogou.weixin.gzhcb',

	/**
	 * 公众号文章api接口地址
	 * @type {String}
	 */
	url: 'http://weixin.sogou.com/gzhjs',

	userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.110 Safari/537.36',

	/**
	 * 微信公众号所有文章总数
	 * 总文章数：totalItems
	 * 总页数：totalPages（每页固定10篇文章）
	 * @type {Object}
	 */
	wxPublicArtsInfo: {totalItems: undefined, totalPages: undefined},

	/**
	 * 当前请求页数
	 * @type {Number}
	 */
	currentPage: 1,

	/**
	 * 初始化
	 * @param  string openid
	 * @param  string ext
	 * @return void
	 */
	init: function(openid, ext) {
		var me = this;
		me.openid = openid;
		me.ext    = ext;

		me.cGetArtsInfo = new Crawler({
			forceUTF8: true,
			userAgent: me.userAgent,
		    callback : function (error, result, $) {
		    	var data = JSON.parse(result.body);
		    	me.wxPublicArtsInfo.totalItems = data.totalItems;
		    	me.wxPublicArtsInfo.totalPages = data.totalPages;
		    	console.log('获得公众号文章总数：');
		    	console.log(me.wxPublicArtsInfo);
		    },
		    onDrain: function() {
		    	console.log('开始获取文章列表...');
		    	me.queryArtsList();
		    }
		});

		me.cGetArtsList = new Crawler({
			forceUTF8: true,
			rateLimits: 3000,
			userAgent: me.userAgent,
		    callback : function (error, result, $) {
		    	var data = JSON.parse(result.body);
		    	console.log('获得文章列表：------------------------------------');
		    	if ( !fs.existsSync('./out') )
					fs.mkdirSync('./out');
				for (var i = 0; i < data.items.length; i++) {
					if ( !data.items[i] )
						continue;
					parseString(data.items[i], function(err, res){
						console.log('获得文章：' + res.DOCUMENT.item[0].display[0].title1[0]);
						var title = me.strReplaceAll(['/', '\\', ':', '*', '?', '"', '<', '>', '|'], '-', res.DOCUMENT.item[0].display[0].title1[0]);
						var content = JSON.stringify(res.DOCUMENT.item[0].display[0]);
						var artUrl = 'http://weixin.sogou.com' + res.DOCUMENT.item[0].display[0].url;
						fs.mkdirSync('./out/' + title);
						fs.appendFile( './out/' + title + '/' + title + '.json', content, (err) => {
						  if (err) 
						  	throw err;
						});
						me.queryArticle(artUrl);
					});
				}
		    },
		    onDrain: function() {
		    	console.log('获取列表任务完成');
		    }
		});

		//console.log(me.cGetArtsList);process.exit(1);


		me.cGetArticle = new Crawler({
			/*forceUTF8: true,*/
			userAgent: me.userAgent,
			rateLimits: 6000,
		    callback : function (error, result, $) {
		    	console.log(result.body);
		    },
		    onDrain: function() {
		    	console.log('文章抓取完成');
		    	process.exit(0);
		    }
		});
	},

	queryArtsInfo: function() {
		var me = this;
		me.cGetArtsInfo.queue(me.queryUrlParams(me.url, {openid: me.openid, ext: me.ext}));
	},

	queryArtsList: function() {
		var me = this,
			requestUrl = null;
		for (var page = 1; page <= me.wxPublicArtsInfo.totalPages; page++) {
			requestUrl = me.queryUrlParams(me.url, {openid: me.openid, ext: me.ext, page: page})
			console.log({openid: me.openid, ext: me.ext, page: page});
			console.log('request url: ' + requestUrl);
			me.cGetArtsList.queue(requestUrl)
		}
	},

	queryArticle: function(url) {
		console.log('请求文章正文：' + url);
		var me = this;
		me.cGetArticle.queue(url);
	},


	/**
	 * 生成url参数
	 * @param  {string} url
	 * @param  {object} params
	 * @return {string}
	 */
	queryUrlParams: function(url, params){
		var k = null,
			i = 0;
		for ( k in params ) {
			if ( i === 0 )
				url += '?' + k + '=' + params[k];
			else
				url += '&' + k + '=' + params[k];
			i++;
		}
		return url;
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
module.exports = WxPublicAgent;