var request = require("request");
var jar = request.jar();
var cookie = request.cookie("SNUID=912AA0CCB9BC972DD6009A2EB9B80C4F; ABTEST=6|1459701268|v1; IPLOC=CN4403; SUID=299218742624930A0000000057014614");
var url = "http://weixin.sogou.com/gzhjs?openid=oIWsFt2nfuvCeWKPNKZl-d7-fTmU&ext=NIh7jNwwaRnXo4hRzfHZScMu1j-B7zQIv9wdrslDP3oPPHIqLQN--Qgokp7vpqvk&page=5";

//jar.setCookie(cookie, url);

request({
  url: url,
  method: "GET",
  followRedirect: true,
  maxRedirects: 10,
  jar: jar
}, function(error, response, body) {
  	console.log(body);
  	console.log(jar.getCookieString(url));
});

//ABTEST=8|1459701523|v1; SNUID=5AE16B0772765CE54DBE0D7173E3F652; IPLOC=CN4403; SUID=299218742624930A0000000057014713