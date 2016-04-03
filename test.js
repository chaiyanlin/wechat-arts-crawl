var xmldoc = require('xmldoc');
var parseString = require('xml2js').parseString;
var cheerio = require("cheerio");

/*var xmlstr = '<?xml version="1.0" encoding="gbk"?><DOCUMENT><docid></docid><item> <key><![CDATA[http://mp.weixin.qq.com/]]></key><tplid><![CDATA[555]]></tplid><classid>11002601</classid> <display> <docid>ab735a258a90e8e1-6bee54fcbd896b2a-ee43d6a0c2388b732a387f7d991d2372</docid> <tplid>550</tplid><title><![CDATA[无恶意的谋杀:2022年,一个试图用AI取代程序员的故事(...]]></title><url><![CDATA[/websearch/art.jsp?sg=CBf80b2xkgbZNYEk5KjWf-otJSTsNysKxp6qoBBvjSW6v7OO2yTgk1aIua_aX22rP6fiz5uh6SnoEByoLlJnFhqypxOleENJ81kCtPkLu31wdoakMVpvuFcA2Tk-cI7Z&url=p0OVDH8R4SHyUySb8E88hkJm8GF_McJfBfynRTbN8wjWW_QBlwpxf00D8__gtPdBff03lmbhxKxgDk22du_BUmQ3JxMQ3374TiThIIqIg_gWBbt-YHP7KTc17IeKwjARnHHJv9CQWVdYy-5x5In7jJFmExjqCxhpkyjFvwP6PuGcQ64lGQ2ZDMuqxplQrsbk]]></url><title1><![CDATA[无恶意的谋杀:2022年,一个试图用AI取代程序员的故事(3/4)]]></title1><imglink><![CDATA[http://mmbiz.qpic.cn/mmbiz/ctwVEjeYQ295SLetaGqhQY0TxuesdvxU6wiczARSPNaWYD2WOpDcOouXlNhGwr0QPviaFJklnFntVpEXINibrIGMQ/0?wx_fmt=jpeg]]></imglink><headimage><![CDATA[http://wx.qlogo.cn/mmhead/Q3auHgzwzM4FfJQ1q6ViapY5R0rA8sjtFBibYiarRXDyvicZcMOV00MjEA/0]]></headimage><sourcename><![CDATA[神秘的程序员们]]></sourcename><content168><![CDATA[这是一个分4期发完的短科幻连载第一期《代码的深渊》第二期《BetaCat的秘密》……这是我俩创作的第一个科幻短连载,希望大家喜欢.下期就是大结局啦,嗷嗷,我努力画,请大家努力帮我传播!给微信后台发关键字 betacat,返回四集连载的列表页面.BetaCat 已经学会了Gradient desc...]]></content168><site><![CDATA[http://mp.weixin.qq.com/s?__biz=MzAwNTA4NTM3Mg==&mid=402726630&idx=2&sn=b455d8a0739b997d1bb4c8414478679d&scene=24&srcid=0325lEhYaUZSV53GLixznKlY&from=singlemessage&isappinstalled=0#wechat_redirect]]></site><isV><![CDATA[0]]></isV><openid><![CDATA[oIWsFt2nfuvCeWKPNKZl-d7-fTmU]]></openid><ext><![CDATA[1kKFQtkEe38YkiZ8CrsiwV3_ilcT4skeVRGimv7rhjH2DWasTyeIHlbDlMPOPab-]]></ext><content><![CDATA[这是一个分4期发完的短科幻连载第一期《代码的深渊》第二期《BetaCat的秘密》……这是我俩创作的第一个科幻短连载,希望大家喜...]]></content><showurl><![CDATA[mp.weixin.qq.com]]></showurl><date><![CDATA[2016-3-29]]></date><pagesize><![CDATA[40k]]></pagesize> <lastModified>1459250284</lastModified><pagesize>41k</pagesize> </display></item></DOCUMENT>';
parseString(xmlstr, function(err, res){
	console.log(res.DOCUMENT.item[0].display[0].url);
});*/

var title = '无恶意的谋杀:2022年,一个试图用AI取代程序员的故事(3\4)';
function strReplaceAll (search, replacement, str) {
	for (var i = 0; i < search.length; i++) {
		str = str.split(search[i]).join(replacement);
	}
	return str;
}

console.log(strReplaceAll(['\\', ':'],'-', title));