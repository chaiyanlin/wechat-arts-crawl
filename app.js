var WxPublicAgent = require('./modules/wx_public_agent.js');
var WxAgent       = require('./modules/wx_agent.js');
var rimraf        = require('rimraf');


//clean old output file...
rimraf('./out/*', function(err){
	if ( err )
		console.log('Failed to remove out directory...');
	else
		console.log('Out directory has been removed...');
});

/*var wxPublicAgent = new WxPublicAgent();
wxPublicAgent.init('oIWsFt2nfuvCeWKPNKZl-d7-fTmU', '1kKFQtkEe38YkiZ8CrsiwV3_ilcT4skeVRGimv7rhjH2DWasTyeIHqcU-Ue5KLov');
wxPublicAgent.queryArtsInfo();*/

var wxAgent = new WxAgent();
wxAgent.init('oIWsFt6wKycLIjP6GFDY9Otv_BAY', 'NIh7jNwwaRn3ePYKabeugkPlYsL0cylDtqAb-xm36PKKTGFtaUW5-6bA55_eXzrg');