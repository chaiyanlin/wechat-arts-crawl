var request = require("request"),
	fs      = /*require('graceful-fs'),*/require("fs"),
	qs      = require("querystring"),
	path    = require('path'),
	cheerio = require('cheerio');

var WxImgCapturer = function(){};

WxImgCapturer.prototype = {
	title: null,//文章标题

	imgDest: null,//图片下载存放地址

	appMsgExtInfo: null,//由WxAgent提供

	errorLogDir: './out/error.log',//图片获取错误日志路径

	imgUrlList: [],//储存即将被获取图片的url地址

	//开始获取图片任务
	start: function(appMsgExtInfo, imgDest, title){
		var me           = this;
		me.appMsgExtInfo = appMsgExtInfo;
		me.imgDest       = imgDest;
		me.title         = title;
		me.queryArticleHtml();
	},

	//获取文章html
	queryArticleHtml: function() {
		var me = this;
		console.log('尝试获取文章html：' + me.appMsgExtInfo.content_url);
		request.get(me.appMsgExtInfo.content_url, function(error, response, body){
			if ( error ) {
				console.log('获取文章html失败...');
				console.log(error);
				return;
			}
			console.log('获取文章html成功...');
			fs.appendFile(me.imgDest + '/' + me.title + '.html', body, (err) => {
				if (err) {
					console.log('写入文章html失败...');
			  		console.log(err);
				}
			});
			var $ = cheerio.load(body);

			//下载文章首图片
			me.downloadImg(me.appMsgExtInfo.cover, 'cover');
			//下载文章内图片
			$('img').each(function(i,e){
				//优先下载原图
				if ( $(this).attr('data-src') ) {
					me.downloadImg($(this).attr('data-src'));
				}
				else {
					me.downloadImg($(this).attr('src'));
				}
			});
		});
	},

	downloadImg: function(imgUrl, imgName) {
		var me = this;
		fs.appendFile(me.imgDest + '/imgList.log', imgUrl + '\r\n');
		if ( !me.imgUrlFilter(imgUrl) )
			return;
		console.log('尝试下载图片：' + imgUrl);
		imgName = imgName || + new Date();
		var ext = me.getImgExt(imgUrl);//图片后缀名

		request(imgUrl, function(error, response, body){
			if ( error ) {
				console.log(error.code);
				console.log('下载图片失败：' + imgUrl);
				fs.appendFile(me.imgDest + '/error.log', imgUrl + '\r\n', (err)=>{
					if (err) 
						console.log(err);
				});
			}
		}).pipe(fs.createWriteStream(me.imgDest + '/' + imgName + ext));
	},


	//去除不合法的img url
	imgUrlFilter: function(imgUrl) {
		//暂不支持base64图片抓取
		if ( !imgUrl || new RegExp("base64").test(imgUrl) )
			return false;
		return true;
	},


	//如果由于url问题获取不到图片后缀名，则返回.png
	getImgExt: function(imgUrl) {
		var ext = path.extname(imgUrl) || '.png';
		return ext;
	}
};
module.exports = WxImgCapturer;