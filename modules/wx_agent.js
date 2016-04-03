var request    = require("request"),
fs             = require("fs"),
qs             = require("querystring"),
parseString    = require("xml2js").parseString,
wxRetValParser = require('./wx_retval_parser.js');


var WxAgent = function() {};

WxAgent.prototype = {
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
	 * 公众号文章api接口地址
	 * @type {String}
	 */
	api: 'http://weixin.sogou.com/gzhjs',

	/**
	 * 微信公众号所有文章总数
	 * 总文章数：totalItems
	 * 总页数：totalPages（每页固定10篇文章）
	 * @type {Object}
	 */
	wxPublicArtsInfo: {totalItems: undefined, totalPages: undefined},

	/**
	 * cookie
	 * @type {string}
	 */
	cookie: undefined,


	currentPage: 1,

	currentArt: 1,

	queryArtsListTimer: null,

	queryArtContentTimer: null,

	wxRetValParser: null,


	init: function(openid, ext) {
		var me            = this;
		me.openid         = openid;
		me.ext            = ext;
		me.wxRetValParser = new wxRetValParser();
		me.wxRetValParser.init();
		me.queryArtsInfo();
	},


	queryArtsInfo: function() {
		var me = this;
		var jar = request.jar();
		var url = me.api + '?' + qs.stringify({openid: me.openid, ext: me.ext});
		var options = {
			url: url,
		    method: "GET",
		    followRedirect: true,
		    maxRedirects: 10,
		    jar: jar
		};

		request(options, function(error, response, body){
			var data = JSON.parse(body);
			me.wxPublicArtsInfo.totalItems = data.totalItems;
			me.wxPublicArtsInfo.totalPages = data.totalPages;
			console.log('获得公众号文章总数：');
			console.log(me.wxPublicArtsInfo);
			console.log('获得cookie：');
			me.cookie = jar.getCookieString(url);
			console.log(me.cookie);
			me.queryArtsListTimer = setTimeout(function(){
				me.queryArtsList();
			}, 3000);
		});
	},

	queryArtsList: function() {
		var me = this;
		if ( me.currentPage > me.wxPublicArtsInfo.totalPages ) {
			clearTimeout(me.queryArtsListLoopTimer);
			me.queryArtsListTimer = null;
			console.log('请求列表任务完成');
			me.wxRetValParser.createUrlsFile();
			me.queryArtContent();
			return;
		}
		var url = null;
		var jar = request.jar();
		var options = {
			url: null,
		    method: "GET",
		    followRedirect: true,
		    maxRedirects: 10,
		    jar: null
		};
		console.log('开始请求文章列表...第' + me.currentPage + '页...');
		options.url = me.api + '?' + qs.stringify({openid: me.openid, ext: me.ext, page: me.currentPage});
		options.jar = jar.setCookie(me.cookie, options.url);
		request(options, function(error, response, body){
			me.cookie = jar.getCookieString(options.url);
			me.wxRetValParser.parserArtsList(body);
			me.currentPage++;
			me.queryArtsListTimer = setTimeout(function(){
				me.queryArtsList();
			}, 3000);
		});
	},

	queryArtContent: function() {
		var me = this;
		if ( me.currentArt > me.wxRetValParser.urlList.length ) {
			clearTimeout(me.queryArtContentTimer);
			me.queryArtContentTimer = null;
			console.log('脚本结束！');
			return;
		}
		var url = null;
		var jar = request.jar();
		var options = {
			url: null,
		    method: "GET",
		    followRedirect: true,
		    maxRedirects: 10,
		    jar: null
		};
		console.log('请求文章内容...(' + me.wxRetValParser.urlList[me.currentArt].title + ')');
		console.log('文章链接：' + me.wxRetValParser.urlList[me.currentArt].url);
		options.url = me.wxRetValParser.urlList[me.currentArt].url;
		options.jar = jar.setCookie(me.cookie, options.url);
		request(options, function(error, response, body){
			me.cookie = jar.getCookieString(options.url);
			me.createWxPublicHtmlFile(me.wxRetValParser.urlList[me.currentArt], body);
			me.currentArt++;
			me.queryArtContentTimer = setTimeout(function(){
				me.queryArtContent();
			}, 3000);
		});
	},


	createWxPublicHtmlFile: function(art, html) {
		fs.appendFile( art.folder + '/' + art.title + '.html', html, (err) => {
		  if (err) 
		  	throw err;
		  console.log('创建：' + art.folder + '/' + art.title + '.html');
		});
	}

};
module.exports = WxAgent;