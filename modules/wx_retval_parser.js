var fs      = require("fs"),
parseString = require('xml2js').parseString;


var WxRetValParser = function() {};

WxRetValParser.prototype = {
	urlList: [],

	init: function() {
		if ( !fs.existsSync('./out') )
			fs.mkdirSync('./out');
	},

	parserArtsList: function(result) {
		var me = this;
		var data = JSON.parse(result);
		var urls = [];
		console.log('解析文章列表...');
		for (var i = 0; i < data.items.length; i++) {
			if ( !data.items[i] )
				continue;
			parseString(data.items[i], function(err, res){
				console.log('获得文章：' + res.DOCUMENT.item[0].display[0].title1[0]);
				var title = me.strReplaceAll(['/', '\\', ':', '*', '?', '"', '<', '>', '|'], '-', res.DOCUMENT.item[0].display[0].title1[0]);
				var content = JSON.stringify(res.DOCUMENT.item[0].display[0]);
				me.urlList.push({
					url: 'http://weixin.sogou.com' + res.DOCUMENT.item[0].display[0].url,
					folder: './out/' + title,
					title: title
				});
				fs.mkdirSync('./out/' + title);
				fs.appendFile( './out/' + title + '/' + title + '.json', content, (err) => {
				  if (err) 
				  	throw err;
				});
			});
		}
	},

	createUrlsFile: function() {
		var jsonStr = JSON.stringify(this.urlList);
		fs.appendFile( './out/urls.json', jsonStr, (err) => {
		  if (err) 
		  	throw err;
		});
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
module.exports = WxRetValParser;