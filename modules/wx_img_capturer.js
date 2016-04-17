var request = require("request"),
	fs      = require("fs"),
	qs      = require("querystring"),
	path    = require('path'),
	cheerio = require('cheerio'),
	Download = require('download');

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
			new Download().get(me.appMsgExtInfo.cover)
						  .rename('cover.png')
						  .dest(me.imgDest)
						  .run(function(err, files){
						  		if ( !err )
						  			console.log('DOWNLOAD SUCCESS: ' + me.appMsgExtInfo.cover);
						  		else {
						  			console.log('FAIL TO DOWNLOAD: ' + me.appMsgExtInfo.cover);
						  			fs.appendFile(me.imgDest + '/error.log', me.appMsgExtInfo.cover + '\r\n');
						  		}
						  });

			//下载文章内图片
			me.imgUrlList = $('img').toArray();
			for (var i = 0; i < me.imgUrlList.length; i++) {
				if ( me.imgUrlList[i].attribs.hasOwnProperty('data-src') ) {
					var url1 = me.imgUrlList[i].attribs['data-src'];
					fs.appendFile(me.imgDest + '/imgList.log', url1 + '\r\n');
					new Download().get(url1)
								  .rename(+ new Date() + Math.floor((Math.random() * 1000) + 1) + me.getImgExt(me.imgUrlList[i].attribs))
								  .dest(me.imgDest)
								  .run(function(err, files){
								  		if ( !err )
								  			console.log('DOWNLOAD SUCCESS: ' + url1);
								  		else {
								  			console.log('FAIL TO DOWNLOAD: ' + url1);
								  			fs.appendFile(me.imgDest + '/error.log', url1 + '\r\n');
								  		}
								  });
				}
				if ( me.imgUrlList[i].attribs.hasOwnProperty('src') ) {
					var url2 = me.imgUrlList[i].attribs['src'];
					fs.appendFile(me.imgDest + '/imgList.log', url2 + '\r\n');
					new Download().get(url2)
								  .rename(+ new Date() + Math.floor((Math.random() * 1000) + 1) + me.getImgExt(me.imgUrlList[i].attribs))
								  .dest(me.imgDest)
								  .run(function(err, files){
								  		if ( !err )
								  			console.log('DOWNLOAD SUCCESS: ' + url2);
								  		else {
								  			console.log('FAIL TO DOWNLOAD: ' + url2);
								  			fs.appendFile(me.imgDest + '/error.log', url2 + '\r\n');
								  		}
								  });
				}
			}
		});
	},


	//如果由于url问题获取不到图片后缀名，则返回.png
	getImgExt: function(imgObj) {
		if ( imgObj.hasOwnProperty('data-type') )
			return '.' + imgObj['data-type'];
		var src = null;
		if ( imgObj.hasOwnProperty('data-src') )
			src = imgObj['data-src'];
		else if ( imgObj.hasOwnProperty('src') )
			src = imgObj.src;
		else
			src = imgObj;
		var ext = path.extname(src) || '.png';
		return ext;
	}
};
module.exports = WxImgCapturer;