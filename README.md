# wechat-arts-crawl 微信公众号爬虫脚本
A crawl program for collecting wechat arts based on NodeJs
根据指定的公众号url，自动获取该公众号所有历史文章。
此脚本将会按照公众号文章名建立文件夹，文件夹内将放置文章的html源文件和图片源文件。
此脚本基于node.js实现。

#配置说明
1. 安装node环境
2. git clone git@github.com:chaiyanlin/wechat-arts-crawl.git
3. cd wechat-arts-crawl && npm install

#使用说明
此爬虫脚本原先通过http://weixin.sogou.com/ 获取数据，但由于搜狗严格的cookie检查以及变态的访问频率限制，最终放弃走了这条路，而另行开辟道路。

###1.打开手机微信，关注你想要抓取的公众号，并且打开“历史消息”页面
![关注公众号][1]
![历史消息页面][2]
###2.进入“历史消息页面”后，将此页面分享到你的“印象笔记”或“有道笔记”，我们需要获得该页面的url，【但注意！千万不要通过转发，复制链接等方式获得，微信或将关键参数过滤掉！有兴趣的自己可以试一下，保存到印象笔记和直接复制url所最终获得的url有什么不同】

![获得url][3]

###3.此时去你的印象笔记或者有道笔记中，可以获得如下的url
```
https://mp.weixin.qq.com/mp/getmasssendmsg?__biz=MzAxMzMxNDIyOA==&uin=MTkxMzM3MDgw&key=b28b03434249256b99aa2677f019f6f2ae965ea649116c1ecc99b328960c6ad33ee988f2ad5e1c041940a38499000320&devicetype=iPhone+OS9.3.1&version=16030f11&lang=zh_CN&nettype=WIFI&fontScale=100&pass_ticket=TIbJ8GqYXw3D7QeX4tPPkWpg1pZYVuxLF7iwS2xU8IY%3D#wechat_webview_type=1http://mp.weixin.qq.com/mp/getmasssendmsg?__biz=MzAxMzMxNDIyOA==#wechat_webview_type=1&wechat_redirect
```
从笔记复制出来可直接粘贴到浏览器地址框中，就会发现外部也可访问微信公众号内容了，但如果时间太久，此url会报session过期

###4.最后将上一步获得url，拷贝进项目的app.js内：
```
...
wxAgent = new WxAgent(),
//替换url参数：
url = 'https://mp.weixin.qq.com/mp/getmasssendmsg?__biz=MzAxMzMxNDIyOA==&uin=MTkxMzM3MDgw&key=b28b03434249256b99aa2677f019f6f2ae965ea649116c1ecc99b328960c6ad33ee988f2ad5e1c041940a38499000320&devicetype=iPhone+OS9.3.1&version=16030f11&lang=zh_CN&nettype=WIFI&fontScale=100&pass_ticket=TIbJ8GqYXw3D7QeX4tPPkWpg1pZYVuxLF7iwS2xU8IY%3D#wechat_webview_type=1http://mp.weixin.qq.com/mp/getmasssendmsg?__biz=MzAxMzMxNDIyOA==#wechat_webview_type=1&wechat_redirect';

rimraf('./out/*', function(err){
...
```
命令行执行node app.js

###执行效果演示
![cmd output][4]
![out][5]

随后可关注out路径下的输出，如果图片下载出现错误，会在对应文件夹的error.log里面记录，现在该脚本还要不完善的地方，会在今后更新。


  [1]: http://a1.qpic.cn/psb?/V11nXmZd1imMs1/mjBiuVJe6wRRxQXAgSnLkz.XG0NBPzbMH1iU2oRoRBc!/b/dGYAAAAAAAAA&bo=gAJyBAAAAAADB9Y!&rf=viewer_4
  [2]: http://a2.qpic.cn/psb?/V11nXmZd1imMs1/CIWj0YJ67wbIjYzvTuo6OkSVLj4Aa4sMUT7JuyPg7xE!/b/dGEAAAAAAAAA&bo=gAJyBAAAAAADANE!&rf=viewer_4
  [3]: http://a1.qpic.cn/psb?/V11nXmZd1imMs1/DMg5j43sOBFnWNNeQkwIjdmoflSe.MasTvPZVY2YNNg!/b/dFwBAAAAAAAA&bo=gAJyBAAAAAADANE!&rf=viewer_4
  [4]: http://a2.qpic.cn/psb?/V11nXmZd1imMs1/ONOP3Dda9wQEOGco*2tIZdiVB5xfb*N0XO21pXu0rAo!/b/dOUAAAAAAAAA&bo=HASAAgAAAAADB7g!&rf=viewer_4
  [5]: http://a1.qpic.cn/psb?/V11nXmZd1imMs1/qUjEKmB.rMOVCe1rFjVsVonledcDzvr9xZvF3QVPrEA!/b/dOEAAAAAAAAA&bo=*gWAAgAAAAADAFw!&rf=viewer_4