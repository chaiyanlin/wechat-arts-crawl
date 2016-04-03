var WxPublicAgent = require('./modules/wx_public_agent.js');
var rimraf        = require('rimraf');


//clean old output file...
rimraf('./out', function(err){
	if ( err )
		console.log('Failed to remove out directory...');
	else
		console.log('Out directory has been removed...');
});

var wxPublicAgent = new WxPublicAgent();
wxPublicAgent.init('oIWsFt86MuAacbPGA3TM1glwaTp4', '1kKFQtkEe3_Yv-pgzi5MX7eQsMCInrGzglWwVQO_oRUWEuK5qDkewAxj4xJR3I9m');
wxPublicAgent.queryArtsInfo();