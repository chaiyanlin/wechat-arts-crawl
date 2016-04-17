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
			me.imgUrlList = $('img').toArray();
			for (var i = 0; i < me.imgUrlList.length; i++) {
				me.downloadImg(me.imgUrlList[i].attribs);
			}
		});
	},

	downloadImg: function(imgObj, imgName) {
		var me = this;
		//fs.appendFile(me.imgDest + '/imgList.log', imgObj + '\r\n');
		var imgUrl = me.imgUrlFilter(imgObj);
		if ( !imgUrl )
			return;
		imgName = imgName || + new Date();
		var ext = me.getImgExt(imgObj);//图片后缀名

		//记录下载图片log
		fs.appendFile(me.imgDest + '/imgList.log', imgUrl + '\r\n', (err)=>{
			if (err) 
				console.log(err);
		});

		var stream = fs.createWriteStream(me.imgDest + '/' + imgName + ext);
		request.get(imgUrl, function(error, response, body){
			console.log('下载图片：' + imgUrl + ' (' + response.statusCode + ')');
			 if ( error ) {
				console.log(error.code);
				console.log('ERROR:下载图片失败--->');
				console.log(imgObj);
				console.log('<---');
				fs.appendFile(me.imgDest + '/error.log', imgUrl + '\r\n');
			}
		}).pipe(stream).on('close', function(){
			stream.close();
			console.log('SUCCESS:下载图成功--->');
			console.log(imgObj);
			console.log('<---');
			fs.appendFile(me.imgDest + '/downloadList.log', imgUrl + '\r\n');
		});
	},


	//去除不合法的img url
	imgUrlFilter: function(imgObj) {
		if ( typeof(imgObj) === 'string' )
			return imgObj;
		//检测是否存在src或者data-src属性
		if ( !imgObj.hasOwnProperty('src') && !imgObj.hasOwnProperty('data-src') )
			return false;

		//检测src和data-src至少有一个不能为空
		var hasSrc = null,
			hasDataSrc = null;
		if ( imgObj.hasOwnProperty('src') )
			hasSrc = (imgObj.src !== '');
		if ( imgObj.hasOwnProperty('data-src') )
			hasDataSrc = (imgObj['data-src'] !== '');
		if ( !hasSrc && !hasDataSrc )
			return false;


		//暂不支持base64图片抓取
		if ( imgObj.hasOwnProperty('src') ) {
			if ( new RegExp("base64").test(imgObj.src) )
				return false;
		}

		if ( hasDataSrc )
			return imgObj['data-src'];
		else
			return imgObj['src'];
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